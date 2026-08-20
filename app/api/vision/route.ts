import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { GoogleGenAI, FinishReason } from '@google/genai'
import { VISION_RESPONSE_SCHEMA, type VisionCharacteristics } from '@/lib/vision/visionSchema'
import { visionResultToCharacteristics } from '@/lib/vision/visionConvert'
import { CharacteristicsSchema } from '@/lib/validators/characteristics'
import { tryReserveAiCall, releaseAiCall } from '@/lib/db/aiCap'

export const maxDuration = 60

const RequestSchema = z.object({
  // Data URL vzniklá v prohlížeči (viz GuidedCapture) — "data:image/jpeg;base64,...".
  image: z.string().min(100),
  // Narovnaný výřez dlaně z normalizePalm() (viz PhotoFirstFlow) — nepovinný,
  // chybí když se nenašly landmarky. Jde k AI jako druhý, čitelnější obrázek.
  normalizedImage: z.string().min(100).optional(),
  // Bez explicitního souhlasu se fotka na server vůbec neposílá (biometrický
  // údaj dle čl. 9 GDPR) — endpoint to i tak vynucuje jako druhou pojistku.
  consent: z.literal(true),
})

const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/

const PROMPT = `Podívej se na fotografii dlaně a popiš, co je na ní VIDĚT — žádné dohady.

Může přijít i druhý obrázek: narovnaný a oříznutý výřez samotné dlaně,
vzniklý automaticky z první fotky. Slouží jako bližší, rovný pohled na
detail — použij ho jako doplněk k první fotce, ne místo ní.

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

  // Nepovinný druhý obrázek — když je neplatný, jen se zahodí, hlavní fotka
  // sama o sobě stačí (viz PROMPT), takže kvůli tomu žádost nepadá.
  let normalizedImagePart: { inlineData: { data: string; mimeType: string } } | undefined
  if (parsed.normalizedImage) {
    const normalizedMatch = parsed.normalizedImage.match(DATA_URL_PATTERN)
    if (normalizedMatch) {
      const [, normalizedMediaType, normalizedData] = normalizedMatch
      normalizedImagePart = { inlineData: { data: normalizedData, mimeType: normalizedMediaType } }
    }
  }

  const { result: reserved, reservationId } = await tryReserveAiCall()
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
  if (reserved === 'db-error') {
    return NextResponse.json(
      {
        error:
          'Nepodařilo se ověřit denní strop volání (databáze neodpovídá), takže AI rozbor teď nespustíme. Zkuste to prosím za chvíli.',
        code: 'AI_NO_DATABASE',
      },
      { status: 503 },
    )
  }

  /**
   * Rezervace se odečetla ještě před voláním modelu — kdyby se odsud dál
   * cokoliv nepovedlo, musí se vrátit. Bez toho spálila série chyb celý
   * denní strop, aniž by uživatel dostal jediný výsledek.
   */
  async function failWith(
    body: { error: string; code: string },
    status: number,
  ) {
    await releaseAiCall(reservationId)
    return NextResponse.json(body, { status })
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
        ...(normalizedImagePart ? [normalizedImagePart] : []),
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
    return failWith(
      { error: 'AI rozbor se nepodařilo dokončit. Zkuste to prosím znovu.', code: 'AI_ERROR' },
      502,
    )
  }

  // Odmítnutí ještě před vznikem odpovědi — candidates je prázdné/chybí.
  if (response.promptFeedback?.blockReason) {
    return failWith({ error: 'AI fotku odmítla vyhodnotit.', code: 'AI_REFUSAL' }, 422)
  }

  const candidate = response.candidates?.[0]
  if (!candidate) {
    return failWith({ error: 'AI rozbor nevrátil žádný výsledek.', code: 'AI_EMPTY' }, 502)
  }

  // Odmítnutí/oříznutí po zahájení generování.
  if (candidate.finishReason && BLOCKING_FINISH_REASONS.has(candidate.finishReason)) {
    return failWith({ error: 'AI fotku odmítla vyhodnotit.', code: 'AI_REFUSAL' }, 422)
  }
  if (candidate.finishReason === FinishReason.MAX_TOKENS) {
    return failWith(
      { error: 'AI rozbor byl useknutý kvůli limitu délky odpovědi.', code: 'AI_EMPTY' },
      502,
    )
  }

  const text = response.text
  if (!text) {
    return failWith({ error: 'AI rozbor nevrátil použitelný výsledek.', code: 'AI_EMPTY' }, 502)
  }

  let visionResult: VisionCharacteristics
  try {
    visionResult = JSON.parse(text)
  } catch (error) {
    console.error('[api/vision] JSON.parse(text) selhal:', error, text)
    return failWith({ error: 'AI rozbor vrátil neplatná data.', code: 'AI_INVALID' }, 502)
  }

  try {
    const characteristics = CharacteristicsSchema.parse(
      visionResultToCharacteristics(visionResult),
    )
    return NextResponse.json({ characteristics })
  } catch (error) {
    console.error('[api/vision] CharacteristicsSchema.parse selhal:', error)
    return failWith({ error: 'AI rozbor vrátil neplatná data.', code: 'AI_INVALID' }, 502)
  }
}
