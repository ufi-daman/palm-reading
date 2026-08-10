import type { Characteristics } from '@/lib/validators/characteristics'
import type {
  HandTypeContent,
  InterpretationContent,
  LineKey,
  Meaning,
  MountContent,
  MountKey,
  PalmLineContent,
} from '@/lib/content/types'
import {
  getHandTypes,
  getInterpretations,
  getMounts,
  getPalmLines,
} from '@/lib/content'

/** Váhy jednotlivých rovin podle schváleného návrhu. */
const WEIGHTS = {
  lines: 40,
  handType: 25,
  mounts: 25,
  additional: 10,
} as const

const MAX_MATCH_SCORE = WEIGHTS.lines + WEIGHTS.handType + WEIGHTS.mounts

export interface Highlight {
  category: 'handType' | 'line' | 'mount' | 'additional'
  label: string
  detail: string
  meaning: string
  personality: string
}

export interface AnalysisOutcome {
  personality: string
  strengths: string[]
  challenges: string[]
  guidance: string
  confidence: number
  highlights: Highlight[]
  matchedCombinations: number
  alternatives: { personality: string; confidence: number }[]
}

const ADDITIONAL_LABELS: Record<string, Record<string, string>> = {
  fingerLengths: {
    short: 'Krátké prsty — rychlý úsudek a tah na celek, detail vás nezdržuje.',
    normal: 'Přiměřeně dlouhé prsty — rovnováha mezi celkem a detailem.',
    long: 'Dlouhé prsty — smysl pro detail a záliba v důkladnosti.',
  },
  nails: {
    normal: 'Pravidelné nehty — vyrovnaná povaha bez výrazných výkyvů.',
    wide: 'Široké nehty — otevřenost a přímé jednání.',
    narrow: 'Úzké nehty — zdrženlivost a citlivost na okolí.',
  },
  palmColor: {
    pale: 'Bledá dlaň — nižší úroveň energie, potřeba šetřit silami.',
    normal: 'Přirozeně prokrvená dlaň — vyrovnaná vitalita.',
    ruddy: 'Zčervenalá dlaň — vysoká energie a rychlé reakce.',
  },
  skinTexture: {
    fine: 'Jemná kůže — vyšší citlivost a vnímavost k prostředí.',
    coarse: 'Hrubší kůže — odolnost a praktické založení.',
  },
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

/**
 * Interpretace je použitelná jen tehdy, když sedí *všechna* její kritéria.
 * Kritérium odkazující na znak, který uživatel nezadal, ji vyřazuje.
 */
function isApplicable(
  interpretation: InterpretationContent,
  input: Characteristics,
): boolean {
  const { criteria } = interpretation

  if (criteria.handType && criteria.handType !== input.handType) return false

  for (const [key, expected] of Object.entries(criteria.lines ?? {})) {
    const actual = input.palmLines?.[key as LineKey]
    if (!actual || actual.strength !== expected) return false
  }

  for (const [key, expected] of Object.entries(criteria.mounts ?? {})) {
    const actual = input.mounts?.[key as MountKey]
    if (!actual || actual.size !== expected) return false
  }

  return true
}

/** Skóre odměňuje konkrétnost — kombinace pokrývající víc rovin váží víc. */
function scoreInterpretation(interpretation: InterpretationContent): number {
  const { criteria } = interpretation
  const lineCount = Object.keys(criteria.lines ?? {}).length
  const mountCount = Object.keys(criteria.mounts ?? {}).length

  let score = 0
  if (criteria.handType) score += WEIGHTS.handType
  score += (Math.min(lineCount, 2) / 2) * WEIGHTS.lines
  score += (Math.min(mountCount, 2) / 2) * WEIGHTS.mounts

  return score * interpretation.confidence
}

/** Podíl vstupu, který uživatel skutečně vyplnil — vstupuje do jistoty výsledku. */
function inputCoverage(input: Characteristics): number {
  const lineCount = Object.values(input.palmLines ?? {}).filter(Boolean).length
  const mountCount = Object.values(input.mounts ?? {}).filter(Boolean).length
  const additionalCount = Object.values(input.additionalFeatures ?? {}).filter(
    Boolean,
  ).length

  const covered =
    WEIGHTS.handType +
    WEIGHTS.lines * Math.min(lineCount / 4, 1) +
    WEIGHTS.mounts * Math.min(mountCount / 4, 1) +
    WEIGHTS.additional * Math.min(additionalCount / 4, 1)

  return covered / 100
}

/**
 * Skládá popis z jednotlivých znaků. Díky tomu dá smysluplné čtení i vstup,
 * pro který v databázi neexistuje žádná hotová kombinace.
 */
function buildHighlights(
  input: Characteristics,
  lines: PalmLineContent[],
  mounts: MountContent[],
  handType: HandTypeContent | undefined,
): Highlight[] {
  const highlights: Highlight[] = []

  if (handType) {
    highlights.push({
      category: 'handType',
      label: handType.nameCs,
      detail: `Živel ${handType.element}`,
      meaning: handType.description,
      personality: handType.personality,
    })
  }

  for (const [key, value] of Object.entries(input.palmLines ?? {})) {
    if (!value) continue
    const line = lines.find((item) => item.key === key)
    if (!line) continue

    if (value.present === false) {
      const absent = line.characteristics.absent
      if (absent) {
        highlights.push({
          category: 'line',
          label: line.nameCs,
          detail: 'nezřetelná',
          meaning: absent.meaning,
          personality: absent.personality,
        })
      }
      continue
    }

    const axes: [string, string | undefined][] = [
      ['strength', value.strength],
      ['length', value.length],
      ['quality', value.quality],
    ]

    for (const [axis, selected] of axes) {
      if (!selected) continue
      // Osy mají různé sady klíčů, proto je pro vyhledání sjednocujeme na mapu.
      const group = line.characteristics[
        axis as 'strength' | 'length' | 'quality'
      ] as Record<string, Meaning | undefined> | undefined
      const meaning = group?.[selected]
      if (!meaning) continue
      highlights.push({
        category: 'line',
        label: line.nameCs,
        detail: selected,
        meaning: meaning.meaning,
        personality: meaning.personality,
      })
    }
  }

  for (const [key, value] of Object.entries(input.mounts ?? {})) {
    if (!value) continue
    const mount = mounts.find((item) => item.key === key)
    if (!mount) continue

    const axes: [string, string | undefined][] = [
      ['size', value.size],
      ['strength', value.strength],
    ]

    for (const [axis, selected] of axes) {
      if (!selected) continue
      const group = mount.meanings[axis as 'size' | 'strength'] as
        | Record<string, Meaning | undefined>
        | undefined
      const meaning = group?.[selected]
      if (!meaning) continue
      highlights.push({
        category: 'mount',
        label: mount.nameCs,
        detail: selected,
        meaning: meaning.meaning,
        personality: meaning.personality,
      })
    }
  }

  for (const [key, value] of Object.entries(input.additionalFeatures ?? {})) {
    if (!value) continue
    const text = ADDITIONAL_LABELS[key]?.[value]
    if (!text) continue
    highlights.push({
      category: 'additional',
      label: 'Doplňující znak',
      detail: value,
      meaning: text,
      personality: text,
    })
  }

  return highlights
}

export async function analyze(
  input: Characteristics,
): Promise<AnalysisOutcome> {
  // Znalostní báze je synchronní typovaný kód (lib/content), await zde
  // zůstává kvůli signatuře funkce — volající ji používá jako async.
  const lines = getPalmLines()
  const mounts = getMounts()
  const handTypes = getHandTypes()
  const interpretations = getInterpretations()

  const handType = handTypes.find((type) => type.name === input.handType)

  const ranked = interpretations
    .filter((interpretation) => isApplicable(interpretation, input))
    .map((interpretation) => ({
      interpretation,
      score: scoreInterpretation(interpretation),
    }))
    .sort((a, b) => b.score - a.score)

  const top = ranked.slice(0, 3)
  const highlights = buildHighlights(input, lines, mounts, handType)

  // Osobnost: nejdřív typ ruky, pak konkrétní kombinace, nakonec dopočet ze znaků.
  const personalityParts: string[] = []
  if (handType) personalityParts.push(handType.personality)
  personalityParts.push(...top.map((item) => item.interpretation.personality))

  if (top.length === 0) {
    personalityParts.push(
      ...highlights
        .filter((item) => item.category !== 'handType')
        .slice(0, 4)
        .map((item) => item.personality),
    )
  }

  const strengths = unique([
    ...top.flatMap((item) => item.interpretation.strengths),
    ...(handType?.strengths ?? []),
  ]).slice(0, 6)

  const challenges = unique([
    ...top.flatMap((item) => item.interpretation.challenges),
    ...(handType?.challenges ?? []),
  ]).slice(0, 5)

  const guidance =
    top[0]?.interpretation.guidance ??
    (handType
      ? `Vaše silné stránky vycházejí z povahy typu ${handType.nameCs}. Zaměřte se na to, co vám jde přirozeně, a vědomě doplňujte oblasti, které máte slabší.`
      : 'Doplňte více znaků dlaně — čtení pak bude podstatně konkrétnější.')

  const coverage = inputCoverage(input)
  const matchQuality = top[0] ? top[0].score / MAX_MATCH_SCORE : 0
  const confidence = Math.min(
    0.97,
    Math.max(0.15, 0.15 + 0.55 * coverage + 0.3 * matchQuality),
  )

  return {
    personality: unique(personalityParts).join(' '),
    strengths,
    challenges,
    guidance,
    confidence: Number(confidence.toFixed(2)),
    highlights,
    matchedCombinations: ranked.length,
    alternatives: ranked.slice(3, 6).map((item) => ({
      personality: item.interpretation.personality,
      confidence: Number((item.score / MAX_MATCH_SCORE).toFixed(2)),
    })),
  }
}
