import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { VisionCharacteristicsSchema } from '@/lib/vision/visionSchema'
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

Pro každou z 8 čar (lifeLine, heartLine, headLine, fateLine, apolloLine,
mercuryLine, intuitionLine, venusLine): pokud ji na fotce jasně vidíš, vyplň
present:true a strength/length/quality. Pokud ji nevidíš zřetelně, nebo si
nejsi jistý, nastav present:false a ostatní pole na null — NEHÁDEJ. Radši
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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI rozbor není na tomto nasazení k dispozici.', code: 'AI_DISABLED' },
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
          'AI rozbor potřebuje kromě API klíče i databázi (DATABASE_URL) — bez ní nejde vynutit denní strop volání, takže zůstává vypnutý.',
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

  const client = new Anthropic({ apiKey })

  let response
  try {
    response = await client.messages.parse({
      model: 'claude-sonnet-5',
      max_tokens: 2048,
      output_config: {
        format: zodOutputFormat(VisionCharacteristicsSchema),
        effort: 'low',
      },
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp',
                data,
              },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    })
  } catch {
    return NextResponse.json(
      { error: 'AI rozbor se nepodařilo dokončit. Zkuste to prosím znovu.', code: 'AI_ERROR' },
      { status: 502 },
    )
  }

  // Musí se zkontrolovat PŘED čtením obsahu — odmítnutí nemá parsed_output.
  if (response.stop_reason === 'refusal') {
    return NextResponse.json(
      { error: 'AI fotku odmítla vyhodnotit.', code: 'AI_REFUSAL' },
      { status: 422 },
    )
  }

  if (!response.parsed_output) {
    return NextResponse.json(
      { error: 'AI rozbor nevrátil použitelný výsledek.', code: 'AI_EMPTY' },
      { status: 502 },
    )
  }

  try {
    const characteristics = CharacteristicsSchema.parse(
      visionResultToCharacteristics(response.parsed_output),
    )
    return NextResponse.json({ characteristics })
  } catch {
    return NextResponse.json(
      { error: 'AI rozbor vrátil neplatná data.', code: 'AI_INVALID' },
      { status: 502 },
    )
  }
}
