import { Type, type Schema } from '@google/genai'

/**
 * Zrcadlo CharacteristicsSchema (lib/validators/characteristics.ts) v
 * dialektu, který Gemini na Vertex AI čeká pro `responseSchema` — vlastní
 * podmnožina OpenAPI (`Type.OBJECT`/`Type.STRING`/…, `nullable`), ne JSON
 * Schema a ne zod. Tvar je jinak stejný jako u zod v3 verze; výsledek se po
 * převodu (viz visionConvert.ts) ověří ještě tou zod schématou, než se
 * použije dál v aplikaci.
 */
function lineCharacteristicSchema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      present: { type: Type.BOOLEAN },
      strength: { type: Type.STRING, enum: ['weak', 'medium', 'strong'], nullable: true },
      length: { type: Type.STRING, enum: ['short', 'medium', 'long'], nullable: true },
      quality: {
        type: Type.STRING,
        enum: ['clear', 'broken', 'chained', 'island'],
        nullable: true,
      },
    },
    required: ['present', 'strength', 'length', 'quality'],
  }
}

function mountCharacteristicSchema(): Schema {
  return {
    type: Type.OBJECT,
    properties: {
      size: { type: Type.STRING, enum: ['small', 'medium', 'large'], nullable: true },
      strength: { type: Type.STRING, enum: ['weak', 'normal', 'prominent'], nullable: true },
    },
    required: ['size', 'strength'],
  }
}

const LINE_KEYS = [
  'lifeLine',
  'heartLine',
  'headLine',
  'fateLine',
  'apolloLine',
  'mercuryLine',
  'intuitionLine',
  'venusLine',
  'marsLine',
  'saturnRing',
  'solomonRing',
  'viaLascivia',
  'travelLine',
  'relationshipLine',
] as const

const MOUNT_KEYS = [
  'venus',
  'jupiter',
  'saturn',
  'apollo',
  'mercury',
  'luna',
  'marsLower',
  'marsUpper',
] as const

export const VISION_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    handType: { type: Type.STRING, enum: ['fire', 'air', 'earth', 'water', 'mixed'] },
    palmLines: {
      type: Type.OBJECT,
      properties: Object.fromEntries(
        LINE_KEYS.map((key) => [
          key,
          { ...lineCharacteristicSchema(), nullable: true } as Schema,
        ]),
      ),
      required: [...LINE_KEYS],
    },
    mounts: {
      type: Type.OBJECT,
      properties: Object.fromEntries(
        MOUNT_KEYS.map((key) => [
          key,
          { ...mountCharacteristicSchema(), nullable: true } as Schema,
        ]),
      ),
      required: [...MOUNT_KEYS],
    },
    additionalFeatures: {
      type: Type.OBJECT,
      properties: {
        fingerLengths: {
          type: Type.STRING,
          enum: ['short', 'normal', 'long'],
          nullable: true,
        },
        nails: { type: Type.STRING, enum: ['normal', 'wide', 'narrow'], nullable: true },
        palmColor: { type: Type.STRING, enum: ['pale', 'normal', 'ruddy'], nullable: true },
        skinTexture: { type: Type.STRING, enum: ['fine', 'coarse'], nullable: true },
      },
      required: ['fingerLengths', 'nails', 'palmColor', 'skinTexture'],
    },
  },
  required: ['handType', 'palmLines', 'mounts', 'additionalFeatures'],
}

export type VisionLineCharacteristic = {
  present: boolean
  strength: 'weak' | 'medium' | 'strong' | null
  length: 'short' | 'medium' | 'long' | null
  quality: 'clear' | 'broken' | 'chained' | 'island' | null
}

export type VisionMountCharacteristic = {
  size: 'small' | 'medium' | 'large' | null
  strength: 'weak' | 'normal' | 'prominent' | null
}

export interface VisionCharacteristics {
  handType: 'fire' | 'air' | 'earth' | 'water' | 'mixed'
  palmLines: Record<(typeof LINE_KEYS)[number], VisionLineCharacteristic | null>
  mounts: Record<(typeof MOUNT_KEYS)[number], VisionMountCharacteristic | null>
  additionalFeatures: {
    fingerLengths: 'short' | 'normal' | 'long' | null
    nails: 'normal' | 'wide' | 'narrow' | null
    palmColor: 'pale' | 'normal' | 'ruddy' | null
    skinTexture: 'fine' | 'coarse' | null
  }
}
