import { prisma } from './client'
import type {
  HandTypeContent,
  InterpretationContent,
  LineCharacteristics,
  MountContent,
  MountMeanings,
  PalmLineContent,
} from '@/lib/content/types'

/**
 * SQLite nemá typy Json ani String[], takže složené sloupce jsou uložené jako
 * JSON řetězce. Tyhle funkce jsou jediné místo, kde se rozbalují — API routy
 * ani UI už s řetězci nepracují.
 */

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export async function getPalmLines(): Promise<PalmLineContent[]> {
  const rows = await prisma.palmLine.findMany({ orderBy: { type: 'asc' } })
  return rows.map((row) => ({
    key: row.key as PalmLineContent['key'],
    nameCs: row.nameCs,
    nameEn: row.nameEn,
    type: row.type as PalmLineContent['type'],
    description: row.description,
    anatomy: row.anatomy,
    characteristics: parseJson<LineCharacteristics>(
      row.characteristics,
      {} as LineCharacteristics,
    ),
  }))
}

export async function getPalmLine(key: string): Promise<PalmLineContent | null> {
  const lines = await getPalmLines()
  return lines.find((line) => line.key === key) ?? null
}

export async function getMounts(): Promise<MountContent[]> {
  const rows = await prisma.mount.findMany({ orderBy: { nameCs: 'asc' } })
  return rows.map((row) => ({
    key: row.key as MountContent['key'],
    nameCs: row.nameCs,
    nameEn: row.nameEn,
    location: row.location,
    description: row.description,
    meanings: parseJson<MountMeanings>(row.meanings, {} as MountMeanings),
  }))
}

export async function getMount(key: string): Promise<MountContent | null> {
  const mounts = await getMounts()
  return mounts.find((mount) => mount.key === key) ?? null
}

export async function getHandTypes(): Promise<HandTypeContent[]> {
  const rows = await prisma.handType.findMany({ orderBy: { nameCs: 'asc' } })
  return rows.map((row) => ({
    name: row.name as HandTypeContent['name'],
    nameCs: row.nameCs,
    element: row.element,
    description: row.description,
    personality: row.personality,
    characteristics: parseJson<string[]>(row.characteristics, []),
    strengths: parseJson<string[]>(row.strengths, []),
    challenges: parseJson<string[]>(row.challenges, []),
  }))
}

export async function getHandType(name: string): Promise<HandTypeContent | null> {
  const types = await getHandTypes()
  return types.find((type) => type.name === name) ?? null
}

export async function getInterpretations(): Promise<InterpretationContent[]> {
  const rows = await prisma.interpretation.findMany()
  return rows.map((row) => ({
    criteria: parseJson<InterpretationContent['criteria']>(row.criteria, {}),
    personality: row.personality,
    strengths: parseJson<string[]>(row.strengths, []),
    challenges: parseJson<string[]>(row.challenges, []),
    guidance: row.guidance,
    school: row.school as InterpretationContent['school'],
    source: row.source ?? undefined,
    confidence: row.confidence,
    tags: parseJson<string[]>(row.tags, []),
  }))
}
