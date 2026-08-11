/**
 * Zrcadlo CharacteristicsSchema (lib/validators/characteristics.ts) v
 * zod/v4 — SDK helper zodOutputFormat vyžaduje schéma z zod/v4, projekt
 * ale jinde používá klasické zod v3 (jiná verze, jiná třída ZodType, jedno
 * s druhým není zaměnitelné). Tohle schéma se používá jen pro structured
 * output z Claude; výsledek se pak validuje ještě přes CharacteristicsSchema
 * (zod v3), než se použije dál v aplikaci.
 */
import { z } from 'zod/v4'

const lineCharacteristic = z.object({
  present: z.boolean(),
  strength: z.enum(['weak', 'medium', 'strong']).nullable(),
  length: z.enum(['short', 'medium', 'long']).nullable(),
  quality: z.enum(['clear', 'broken', 'chained', 'island']).nullable(),
})

const mountCharacteristic = z.object({
  size: z.enum(['small', 'medium', 'large']).nullable(),
  strength: z.enum(['weak', 'normal', 'prominent']).nullable(),
})

export const VisionCharacteristicsSchema = z.object({
  handType: z.enum(['fire', 'air', 'earth', 'water', 'mixed']),
  palmLines: z.object({
    lifeLine: lineCharacteristic.nullable(),
    heartLine: lineCharacteristic.nullable(),
    headLine: lineCharacteristic.nullable(),
    fateLine: lineCharacteristic.nullable(),
    apolloLine: lineCharacteristic.nullable(),
    mercuryLine: lineCharacteristic.nullable(),
    intuitionLine: lineCharacteristic.nullable(),
    venusLine: lineCharacteristic.nullable(),
    marsLine: lineCharacteristic.nullable(),
    saturnRing: lineCharacteristic.nullable(),
    solomonRing: lineCharacteristic.nullable(),
    viaLascivia: lineCharacteristic.nullable(),
    travelLine: lineCharacteristic.nullable(),
    relationshipLine: lineCharacteristic.nullable(),
  }),
  mounts: z.object({
    venus: mountCharacteristic.nullable(),
    jupiter: mountCharacteristic.nullable(),
    saturn: mountCharacteristic.nullable(),
    apollo: mountCharacteristic.nullable(),
    mercury: mountCharacteristic.nullable(),
    luna: mountCharacteristic.nullable(),
    marsLower: mountCharacteristic.nullable(),
    marsUpper: mountCharacteristic.nullable(),
  }),
  additionalFeatures: z.object({
    fingerLengths: z.enum(['short', 'normal', 'long']).nullable(),
    nails: z.enum(['normal', 'wide', 'narrow']).nullable(),
    palmColor: z.enum(['pale', 'normal', 'ruddy']).nullable(),
    skinTexture: z.enum(['fine', 'coarse']).nullable(),
  }),
})

export type VisionCharacteristics = z.infer<typeof VisionCharacteristicsSchema>
