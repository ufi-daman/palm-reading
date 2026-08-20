import { z } from 'zod'

const LinneCharacteristicSchema = z.object({
  present: z.boolean().optional(),
  strength: z.enum(['weak', 'medium', 'strong']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  quality: z.enum(['clear', 'broken', 'chained', 'island']).optional(),
})

const MountCharacteristicSchema = z.object({
  size: z.enum(['small', 'medium', 'large']).optional(),
  strength: z.enum(['weak', 'normal', 'prominent']).optional(),
})

export const CharacteristicsSchema = z.object({
  handType: z.enum(['fire', 'air', 'earth', 'water', 'mixed']),
  palmLines: z.object({
    lifeLine: LinneCharacteristicSchema.optional(),
    heartLine: LinneCharacteristicSchema.optional(),
    headLine: LinneCharacteristicSchema.optional(),
    fateLine: LinneCharacteristicSchema.optional(),
    apolloLine: LinneCharacteristicSchema.optional(),
    mercuryLine: LinneCharacteristicSchema.optional(),
    intuitionLine: LinneCharacteristicSchema.optional(),
    venusLine: LinneCharacteristicSchema.optional(),
    marsLine: LinneCharacteristicSchema.optional(),
    saturnRing: LinneCharacteristicSchema.optional(),
    solomonRing: LinneCharacteristicSchema.optional(),
    viaLascivia: LinneCharacteristicSchema.optional(),
    travelLine: LinneCharacteristicSchema.optional(),
    relationshipLine: LinneCharacteristicSchema.optional(),
  }).optional(),
  mounts: z.object({
    venus: MountCharacteristicSchema.optional(),
    jupiter: MountCharacteristicSchema.optional(),
    saturn: MountCharacteristicSchema.optional(),
    apollo: MountCharacteristicSchema.optional(),
    mercury: MountCharacteristicSchema.optional(),
    luna: MountCharacteristicSchema.optional(),
    marsLower: MountCharacteristicSchema.optional(),
    marsUpper: MountCharacteristicSchema.optional(),
  }).optional(),
  additionalFeatures: z.object({
    fingerLengths: z.enum(['short', 'normal', 'long']).optional(),
    nails: z.enum(['normal', 'wide', 'narrow']).optional(),
    palmColor: z.enum(['pale', 'normal', 'ruddy']).optional(),
    skinTexture: z.enum(['fine', 'coarse']).optional(),
  }).optional(),
})

export type Characteristics = z.infer<typeof CharacteristicsSchema>

export function validateCharacteristics(input: unknown): Characteristics {
  return CharacteristicsSchema.parse(input)
}

export const AnalyzeRequestSchema = z.object({
  inputType: z.enum(['photo', 'text', 'interactive']),
  characteristics: CharacteristicsSchema,
  // Metadata o původu znaků — fotka samotná se na server neposílá, jen
  // počty pro statistiku úspěšnosti detekce (viz lib/db/stats.ts).
  detection: z
    .object({
      linesDetected: z.number().int().min(0).default(0),
      linesManual: z.number().int().min(0).default(0),
      usedAi: z.boolean().default(false),
      /**
       * Rozpad úspěšnosti po jednotlivých čarách: `{ lifeLine: { found, score } }`.
       * Jediná zpětná vazba, ze které jde ladit prahy na skutečných rukou
       * místo na dvou kalibračních fotkách — proto se sbírá. Obsahuje jen
       * skóre filtru, žádný obrys, žádný výřez, nic z obrázku.
       */
      detectionDetail: z.string().max(4000).optional(),
    })
    .optional(),
})

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>
