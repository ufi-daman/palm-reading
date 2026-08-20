import { describe, it, expect } from 'vitest'
import { MOUNTS } from '@/lib/content/mounts'
import { PALM_LINES } from '@/lib/content/lines'
import { HAND_TYPES } from '@/lib/content/hand-types'
import { CHIROGNOMY } from '@/lib/content/chirognomy'
import { INTERPRETATIONS } from '@/lib/content/interpretations'
import type { LineKey, MountKey, Meaning } from '@/lib/content/types'

/**
 * Integrita znalostní báze. Píšu je proto, že audit našel tři chyby,
 * které by tenhle soubor chytil hned: citaci odkazující na český nadpis
 * z UI místo na kapitolu pramenu, celou osu pahorků neviditelnou v UI a
 * `Meaning` objekty bez zdroje. Všechny tři vznikly ruční editací obsahu
 * a bez testu je nic nehlídalo.
 */

const ALL_LINE_KEYS: LineKey[] = [
  'lifeLine', 'heartLine', 'headLine', 'fateLine', 'apolloLine', 'mercuryLine',
  'intuitionLine', 'venusLine', 'marsLine', 'saturnRing', 'solomonRing',
  'viaLascivia', 'travelLine', 'relationshipLine',
]

const ALL_MOUNT_KEYS: MountKey[] = [
  'venus', 'jupiter', 'saturn', 'apollo', 'mercury', 'luna', 'marsLower', 'marsUpper',
]

/** Projde všechny `Meaning` v čarách i pahorcích a vrátí je s adresou pro hlášku. */
function everyMeaning(): Array<{ path: string; meaning: Meaning }> {
  const out: Array<{ path: string; meaning: Meaning }> = []
  for (const line of PALM_LINES) {
    for (const axis of ['strength', 'length', 'quality'] as const) {
      const group = line.characteristics[axis]
      if (!group) continue
      for (const [value, meaning] of Object.entries(group)) {
        out.push({ path: `lines.${line.key}.${axis}.${value}`, meaning })
      }
    }
  }
  for (const mount of MOUNTS) {
    for (const axis of ['size', 'strength'] as const) {
      for (const [value, meaning] of Object.entries(mount.meanings[axis])) {
        out.push({ path: `mounts.${mount.key}.${axis}.${value}`, meaning })
      }
    }
  }
  return out
}

describe('pokrytí klíčů', () => {
  it('každá čára ze schématu má položku v bázi', () => {
    const present = PALM_LINES.map((l) => l.key)
    expect(ALL_LINE_KEYS.filter((k) => !present.includes(k))).toEqual([])
  })

  it('každý pahorek ze schématu má položku v bázi', () => {
    const present = MOUNTS.map((m) => m.key)
    expect(ALL_MOUNT_KEYS.filter((k) => !present.includes(k))).toEqual([])
  })

  it('žádná čára ani pahorek se neopakuje', () => {
    expect(new Set(PALM_LINES.map((l) => l.key)).size).toBe(PALM_LINES.length)
    expect(new Set(MOUNTS.map((m) => m.key)).size).toBe(MOUNTS.length)
  })

  it('všech pět typů rukou existuje', () => {
    expect(HAND_TYPES.map((h) => h.name).sort()).toEqual([
      'air', 'earth', 'fire', 'mixed', 'water',
    ])
  })
})

describe('zdroje', () => {
  it('každý význam čáry a pahorku má neprázdný zdroj', () => {
    const bad = everyMeaning()
      .filter(({ meaning }) => !meaning.source || meaning.source.length === 0)
      .map(({ path }) => path)
    expect(bad).toEqual([])
  })

  it('zdroje mají vyplněné dílo, rok i lokátor', () => {
    const bad: string[] = []
    for (const { path, meaning } of everyMeaning()) {
      for (const source of meaning.source ?? []) {
        if (!source.work?.trim() || !source.locator?.trim() || !source.year) {
          bad.push(`${path} → ${JSON.stringify(source)}`)
        }
      }
    }
    expect(bad).toEqual([])
  })

  it('lokátory neodkazují na české nadpisy z UI', () => {
    // Přesně tahle chyba v bázi byla: source: [cheiro('Rozbor jednotlivých
    // znaků')] — český text z rozhraní vydávaný za kapitolu u Cheira.
    const czechOnly = /[ěščřžýáíéúůťďň]/i
    const bad: string[] = []
    for (const { path, meaning } of everyMeaning()) {
      for (const source of meaning.source ?? []) {
        if (czechOnly.test(source.locator)) bad.push(`${path} → "${source.locator}"`)
      }
    }
    expect(bad).toEqual([])
  })
})

describe('konzistence os', () => {
  it('čára nabízí délku a průběh jen tehdy, když pro ně má významy', () => {
    // Průvodce nabízí osy podle toho, co v bázi je (lineGroupsFor).
    // Prázdná osa by uživatele nechala vyplnit pole bez výkladu.
    for (const line of PALM_LINES) {
      for (const axis of ['length', 'quality'] as const) {
        const group = line.characteristics[axis]
        if (group) expect(Object.keys(group).length, `${line.key}.${axis}`).toBeGreaterThan(0)
      }
    }
  })

  it('pahorky mají obě osy vyplněné celé', () => {
    for (const mount of MOUNTS) {
      expect(Object.keys(mount.meanings.size).sort()).toEqual(['large', 'medium', 'small'])
      expect(Object.keys(mount.meanings.strength).sort()).toEqual(['normal', 'prominent', 'weak'])
    }
  })

  it('chirognomické osy nejsou prázdné', () => {
    for (const [axis, values] of Object.entries(CHIROGNOMY)) {
      expect(Object.keys(values).length, axis).toBeGreaterThan(0)
    }
  })
})

describe('kombinace', () => {
  it('existuje kombinace pro každý typ ruky bez nutnosti čáry či pahorku', () => {
    // Dokud tohle neplatilo, spadl výsledek při nulové detekci na
    // „nalezeno 0 kombinací" a obecnou guidance.
    for (const type of ['earth', 'fire', 'air', 'water', 'mixed'] as const) {
      const found = INTERPRETATIONS.some(
        (i) => i.criteria.handType === type && !i.criteria.lines && !i.criteria.mounts,
      )
      expect(found, `chybí základní kombinace pro ${type}`).toBe(true)
    }
  })

  it('kombinace odkazují jen na existující čáry a pahorky', () => {
    for (const item of INTERPRETATIONS) {
      for (const key of Object.keys(item.criteria.lines ?? {})) {
        expect(ALL_LINE_KEYS).toContain(key as LineKey)
      }
      for (const key of Object.keys(item.criteria.mounts ?? {})) {
        expect(ALL_MOUNT_KEYS).toContain(key as MountKey)
      }
    }
  })

  it('základní kombinace na typ ruky nepřebijí konkrétnější', () => {
    const base = INTERPRETATIONS.filter(
      (i) => i.criteria.handType && !i.criteria.lines && !i.criteria.mounts,
    )
    const specific = INTERPRETATIONS.filter((i) => i.criteria.lines || i.criteria.mounts)
    const maxBase = Math.max(...base.map((i) => 25 * i.confidence))
    const minSpecific = Math.min(
      ...specific.map((i) => {
        const lines = Math.min(Object.keys(i.criteria.lines ?? {}).length, 2) / 2 * 40
        const mounts = Math.min(Object.keys(i.criteria.mounts ?? {}).length, 2) / 2 * 25
        return ((i.criteria.handType ? 25 : 0) + lines + mounts) * i.confidence
      }),
    )
    expect(maxBase).toBeLessThan(minSpecific)
  })
})
