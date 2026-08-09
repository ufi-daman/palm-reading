import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/db/client'
import { analyze } from '@/lib/analysis/palmReader'
import { AnalyzeRequestSchema } from '@/lib/validators/characteristics'

export const dynamic = 'force-dynamic'

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

    const analysis = await prisma.analysis.create({
      data: {
        inputType: parsed.inputType,
        imageUrl: parsed.imageUrl ?? null,
        characteristics: JSON.stringify(parsed.characteristics),
        result: outcome.personality,
        confidence: outcome.confidence,
        alternatives: JSON.stringify(outcome.alternatives),
      },
    })

    return NextResponse.json({
      analysisId: analysis.id,
      inputType: parsed.inputType,
      ...outcome,
      createdAt: analysis.createdAt,
    })
  } catch (error) {
    console.error('Analýza selhala:', error)
    return NextResponse.json(
      { error: 'Chyba při analýze. Zkuste to prosím později.', code: 'ANALYSIS_ERROR' },
      { status: 500 },
    )
  }
}
