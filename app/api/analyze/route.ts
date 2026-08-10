import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { ZodError } from 'zod'
import { analyze } from '@/lib/analysis/palmReader'
import { AnalyzeRequestSchema } from '@/lib/validators/characteristics'
import { recordAnalysisStat } from '@/lib/db/stats'

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Tělo požadavku není platný JSON.', code: 'INVALID_JSON' },
      { status: 400 },
    )
  }

  let parsed
  try {
    parsed = AnalyzeRequestSchema.parse(payload)
  } catch (error) {
    if (error instanceof ZodError) {
      const missingHandType = error.issues.some((issue) =>
        issue.path.join('.').includes('handType'),
      )
      return NextResponse.json(
        {
          error: missingHandType
            ? 'Prosím vyberte typ ruky.'
            : 'Zadané údaje nejsou platné.',
          code: 'VALIDATION_ERROR',
          issues: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      )
    }
    throw error
  }

  try {
    const outcome = await analyze(parsed.characteristics)

    // Statistika je jen doplňková a nesmí zpomalit ani shodit odpověď.
    void recordAnalysisStat({
      inputType: parsed.inputType,
      characteristics: parsed.characteristics,
      confidence: outcome.confidence,
      detection: parsed.detection,
    })

    return NextResponse.json({
      analysisId: randomUUID(),
      inputType: parsed.inputType,
      ...outcome,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Analýza selhala:', error)
    return NextResponse.json(
      { error: 'Chyba při analýze. Zkuste to prosím později.', code: 'ANALYSIS_ERROR' },
      { status: 500 },
    )
  }
}
