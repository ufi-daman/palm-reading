import { PALM_LINES } from './lines'
import { MOUNTS } from './mounts'
import { HAND_TYPES } from './hand-types'
import { INTERPRETATIONS } from './interpretations'
import type { HandTypeContent, MountContent, PalmLineContent } from './types'

/**
 * Znalostní báze je typovaný kód v gitu, ne databáze — je verzovaná,
 * dohledatelná v diffech a nepotřebuje infrastrukturu. Tyto funkce jsou
 * přímou náhradou za dřívější lib/db/queries.ts, jen bez DB dotazu a
 * bez JSON parsování (data jsou už typované objekty).
 */

export function getPalmLines(): PalmLineContent[] {
  return PALM_LINES
}

export function getPalmLine(key: string): PalmLineContent | null {
  return PALM_LINES.find((line) => line.key === key) ?? null
}

export function getMounts(): MountContent[] {
  return MOUNTS
}

export function getMount(key: string): MountContent | null {
  return MOUNTS.find((mount) => mount.key === key) ?? null
}

export function getHandTypes(): HandTypeContent[] {
  return HAND_TYPES
}

export function getHandType(name: string): HandTypeContent | null {
  return HAND_TYPES.find((type) => type.name === name) ?? null
}

export function getInterpretations() {
  return INTERPRETATIONS
}

export { PALM_LINES, MOUNTS, HAND_TYPES, INTERPRETATIONS }
