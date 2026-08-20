import { prisma } from './client'
import type { Characteristics } from '@/lib/validators/characteristics'

interface RecordStatInput {
  inputType: 'photo' | 'text' | 'interactive'
  characteristics: Characteristics
  confidence: number
  detection?: {
    linesDetected: number
    linesManual: number
    usedAi: boolean
    /** Už serializovaný rozpad z klienta, viz AnalyzeRequestSchema. */
    detectionDetail?: string
  }
  /** Podrobnosti detekce pro ladění prahů, např. {"lifeLine": {"found": true, "score": 0.8}} */
  detectionDetail?: Record<string, unknown>
}

/**
 * Zapíše provozní statistiku. Statistika je čistě doplňková — bez
 * DATABASE_URL, nebo když zápis selže, se tiše přeskočí a čtení z dlaně
 * proběhne normálně. Nikdy nesmí request kvůli statistice spadnout.
 */
export async function recordAnalysisStat(input: RecordStatInput): Promise<void> {
  if (!prisma) return

  try {
    await prisma.analysisStat.create({
      data: {
        inputType: input.inputType,
        handType: input.characteristics.handType,
        linesDetected: input.detection?.linesDetected ?? 0,
        linesManual: input.detection?.linesManual ?? 0,
        usedAi: input.detection?.usedAi ?? false,
        confidence: input.confidence,
        // Klient posílá rozpad už jako řetězec; volání ze serveru může
        // předat objekt. Přednost má to, co dorazilo s requestem.
        detectionDetail:
          input.detection?.detectionDetail ??
          (input.detectionDetail ? JSON.stringify(input.detectionDetail) : null),
      },
    })
  } catch (error) {
    console.error('Zápis statistiky selhal (nekritické):', error)
  }
}
