import type { VisionCharacteristics } from './visionSchema'

/**
 * Structured output vrací "null" pro nepřítomné znaky (strict JSON schema
 * nepodporuje volitelná pole), CharacteristicsSchema (zod v3) čeká
 * "undefined". Převod mezi oběma tvary, než se výsledek ověří tou druhou
 * schématem.
 */
export function visionResultToCharacteristics(input: VisionCharacteristics) {
  function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue
      out[key] = value
    }
    return out
  }

  const palmLines: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input.palmLines)) {
    if (value) palmLines[key] = clean(value)
  }

  const mounts: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input.mounts)) {
    if (value) mounts[key] = clean(value)
  }

  return {
    handType: input.handType,
    palmLines,
    mounts,
    additionalFeatures: clean(input.additionalFeatures),
  }
}
