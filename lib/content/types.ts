/**
 * Typy znalostní báze. Sloupce v SQLite jsou String s JSON obsahem
 * (SQLite nemá Json ani String[]), tyto typy popisují jejich rozbalený tvar.
 */

export type LineStrength = 'weak' | 'medium' | 'strong'
export type LineLength = 'short' | 'medium' | 'long'
export type LineQuality = 'clear' | 'broken' | 'chained' | 'island'

export type MountSize = 'small' | 'medium' | 'large'
export type MountStrength = 'weak' | 'normal' | 'prominent'

export type HandTypeName = 'fire' | 'air' | 'earth' | 'water' | 'mixed'

export type LineKey =
  | 'lifeLine'
  | 'heartLine'
  | 'headLine'
  | 'fateLine'
  | 'apolloLine'
  | 'mercuryLine'
  | 'intuitionLine'
  | 'venusLine'

export type MountKey =
  | 'venus'
  | 'jupiter'
  | 'saturn'
  | 'apollo'
  | 'mercury'
  | 'luna'
  | 'marsLower'
  | 'marsUpper'

/** Odkaz na pramen, ze kterého tvrzení vychází. */
export interface Source {
  work: string
  year: number
  /** Kapitola nebo oddíl, kde se tvrzení nachází — ne číslo strany (OCR/HTML zdroje ho nedávají spolehlivě). */
  locator: string
}

/**
 * Jeden význam: co daný znak znamená a co říká o osobnosti, se zdrojem.
 * Když se prameny rozcházejí, `meaning`/`personality` to řeknou výslovně
 * (např. "Podle Cheira X, Benham ale tentýž rys čte jako Y") a `source`
 * uvede všechny prameny, které se k tvrzení vyjadřují — ne jen ten, se
 * kterým souhlasím.
 */
export interface Meaning {
  meaning: string
  personality: string
  source: Source[]
}

/**
 * "Čára chybí" není tvrzení konkrétního pramene, ale schématem vyžadovaný
 * fallback — zdroj je proto nepovinný (u některých čar ho Cheiro výslovně
 * řeší, u jiných jde o rozumné doplnění mezery ve schématu).
 */
export interface AbsentMeaning {
  meaning: string
  personality: string
  source?: Source[]
}

/**
 * Významy čáry po jednotlivých osách. Osy odpovídají polím ve
 * `CharacteristicsSchema`, takže vstup od uživatele lze mapovat přímo.
 */
export interface LineCharacteristics {
  strength: Record<LineStrength, Meaning>
  length: Record<LineLength, Meaning>
  quality: Record<LineQuality, Meaning>
  absent: AbsentMeaning
}

export interface MountMeanings {
  size: Record<MountSize, Meaning>
  strength: Record<MountStrength, Meaning>
}

export interface PalmLineContent {
  key: LineKey
  nameCs: string
  nameEn: string
  type: 'major' | 'minor'
  description: string
  anatomy: string
  characteristics: LineCharacteristics
}

export interface MountContent {
  key: MountKey
  nameCs: string
  nameEn: string
  location: string
  description: string
  meanings: MountMeanings
}

export interface HandTypeContent {
  name: HandTypeName
  nameCs: string
  element: string
  description: string
  personality: string
  characteristics: string[]
  strengths: string[]
  challenges: string[]
}

/** Kritéria kombinace. Uvedené klíče musí všechny sedět, aby byla použitelná. */
export interface InterpretationCriteria {
  handType?: HandTypeName
  lines?: Partial<Record<LineKey, LineStrength>>
  mounts?: Partial<Record<MountKey, MountSize>>
}

export interface InterpretationContent {
  criteria: InterpretationCriteria
  personality: string
  strengths: string[]
  challenges: string[]
  guidance: string
  school: 'classical' | 'modern'
  source?: string
  confidence: number
  tags: string[]
}
