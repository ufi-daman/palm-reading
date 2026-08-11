import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { GoogleGenAI, FinishReason } from '@google/genai'
import { VISION_RESPONSE_SCHEMA, type VisionCharacteristics } from '@/lib/vision/visionSchema'
import { visionResultToCharacteristics } from '@/lib/vision/visionConvert'
import { CharacteristicsSchema } from '@/lib/validators/characteristics'
import { tryReserveAiCall } from '@/lib/db/aiCap'

export const maxDuration = 60

const RequestSchema = z.object({
  // Data URL vzniklá v prohlížeči (viz GuidedCapture) — "data:image/jpeg;base64,...".
  image: z.string().min(100),
  // Bez explicitního souhlasu se fotka na server vůbec neposílá (biometrický
  // údaj dle čl. 9 GDPR) — endpoint to i tak vynucuje jako druhou pojistku.
  consent: z.literal(true),
})

const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/

const PROMPT = `Podívej se na fotografii dlaně a popiš, co je na ní VIDĚT — žádné dohady.

Pro typ ruky (handType) vyber jednu z: fire, air, earth, water, mixed — podle
poměru délky dlaně k šířce a délky prstů.

Pro každou z 14 čar (lifeLine, heartLine, headLine, fateLine, apolloLine,
mercuryLine, intuitionLine, venusLine, marsLine, saturnRing, solomonRing,
viaLascivia, travelLine, relationshipLine): pokud ji na fotce jasně vidíš,
vyplň present:true a strength/length/quality. Pokud ji nevidíš zřetelně, nebo
si nejsi jistý, nastav present:false a ostatní pole na null — NEHÁDEJ. Radši
méně nalezených čar s jistotou než víc s dohadem.

Pro pahorky (mounts) platí stejné pravidlo „nehádej", ale navaž ho na to,
co je na snímku vidět. Nejdřív posuď osvětlení: jde světlo ze strany a vrhají
vyvýšeniny na dlani stín? Pokud ano, vyhodnoť ty pahorky, u kterých rozeznáš
světlý bok a stín na protilehlé straně. Pokud je dlaň nasvícená rovnoměrně
a stíny nikde nejsou, nech všechny pahorky null — z takového snímku se
vyvýšenina od jinak zbarveného místa odlišit nedá.

Barva ani zarudnutí samy o sobě pahorek neurčují.

additionalFeatures vyplň jen tam, kde je to z fotky jasně čitelné (délka
prstů, tvar nehtů, barva kůže, struktura kůže).`

/** Post-generation zastavení, která znamenají, že výsledek nepoužívat. */
const BLOCKING_FINISH_REASONS = new Set<FinishReason>([
  FinishReason.SAFETY,
  FinishReason.RECITATION,
  FinishReason.BLOCKLIST,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.SPII,
  FinishReason.LANGUAGE,
  FinishReason.OTHER,
])

export async function POST(request: Request) {
  let parsed: z.infer<typeof RequestSchema>
  try {
    const body = await request.json()
    parsed = RequestSchema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Chybí souhlas nebo je fotka neplatná.', code: 'VALIDATION_ERROR' },
        { status: 400 },
      )
    }
    return NextResponse.json({ error: 'Neplatný požadavek.', code: 'BAD_REQUEST' }, { status: 400 })
  }

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const project = process.env.GOOGLE_CLOUD_PROJECT
  const location = process.env.GOOGLE_CLOUD_LOCATION
  const model = process.env.VISION_MODEL
  if (!serviceAccountJson || !project || !location || !model) {
    return NextResponse.json(
      {
        error:
          'AI rozbor není na tomto nasazení nastavený — chybí GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION nebo VISION_MODEL.',
        code: 'AI_DISABLED',
      },
      { status: 503 },
    )
  }

  let credentials: Record<string, unknown>
  try {
    credentials = JSON.parse(serviceAccountJson)
  } catch (error) {
    console.error('[api/vision] GOOGLE_SERVICE_ACCOUNT_JSON parse selhal:', error)
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_JSON neobsahuje platný JSON.', code: 'AI_DISABLED' },
      { status: 503 },
    )
  }

  const match = parsed.image.match(DATA_URL_PATTERN)
  if (!match) {
    return NextResponse.json(
      { error: 'Podporované formáty jsou JPG, PNG a WebP.', code: 'VALIDATION_ERROR' },
      { status: 400 },
    )
  }
  const [, mediaType, data] = match

  const reserved = await tryReserveAiCall()
  if (reserved === 'no-database') {
    return NextResponse.json(
      {
        error:
          'AI rozbor potřebuje kromě přístupových údajů i databázi (DATABASE_URL) — bez ní nejde vynutit denní strop volání, takže zůstává vypnutý.',
        code: 'AI_NO_DATABASE',
      },
      { status: 503 },
    )
  }
  if (reserved === 'cap-reached') {
    return NextResponse.json(
      { error: 'AI rozbor je pro dnešek vyčerpaný. Zkuste to prosím zítra, nebo pokračujte ručně.', code: 'DAILY_CAP' },
      { status: 429 },
    )
  }

  const client = new GoogleGenAI({
    enterprise: true,
    project,
    location,
    googleAuthOptions: { credentials },
  })

  let response
  try {
    response = await client.models.generateContent({
      model,
      contents: [
        { inlineData: { data, mimeType: mediaType } },
        { text: PROMPT },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: VISION_RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 },
        maxOutputTokens: 4096,
      },
    })
  } catch (error) {
    console.error('[api/vision] generateContent selhal:', error)
    return NextResponse.json(
      { error: 'AI rozbor se nepodařilo dokončit. Zkuste to prosím znovu.', code: 'AI_ERROR' },
      { status: 502 },
    )
  }

  // Odmítnutí ještě před vznikem odpovědi — candidates je prázdné/chybí.
  if (response.promptFeedback?.blockReason) {
    return NextResponse.json(
      { error: 'AI fotku odmítla vyhodnotit.', code: 'AI_REFUSAL' },
      { status: 422 },
    )
  }

  const candidate = response.candidates?.[0]
  if (!candidate) {
    return NextResponse.json(
      { error: 'AI rozbor nevrátil žádný výsledek.', code: 'AI_EMPTY' },
      { status: 502 },
    )
  }

  // Odmítnutí/oříznutí po zahájení generování.
  if (candidate.finishReason && BLOCKING_FINISH_REASONS.has(candidate.finishReason)) {
    return NextResponse.json(
      { error: 'AI fotku odmítla vyhodnotit.', code: 'AI_REFUSAL' },
      { status: 422 },
    )
  }
  if (candidate.finishReason === FinishReason.MAX_TOKENS) {
    return NextResponse.json(
      { error: 'AI rozbor byl useknutý kvůli limitu délky odpovědi.', code: 'AI_EMPTY' },
      { status: 502 },
    )
  }

  const text = response.text
  if (!text) {
    return NextResponse.json(
      { error: 'AI rozbor nevrátil použitelný výsledek.', code: 'AI_EMPTY' },
      { status: 502 },
    )
  }

  let visionResult: VisionCharacteristics
  try {
    visionResult = JSON.parse(text)
  } catch (error) {
    console.error('[api/vision] JSON.parse(text) selhal:', error, text)
    return NextResponse.json(
      { error: 'AI rozbor vrátil neplatná data.', code: 'AI_INVALID' },
      { status: 502 },
    )
  }

  try {
    const characteristics = CharacteristicsSchema.parse(
      visionResultToCharacteristics(visionResult),
    )
    return NextResponse.json({ characteristics })
  } catch (error) {
    console.error('[api/vision] CharacteristicsSchema.parse selhal:', error)
    return NextResponse.json(
      { error: 'AI rozbor vrátil neplatná data.', code: 'AI_INVALID' },
      { status: 502 },
    )
  }
}
