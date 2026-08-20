import { describe, it, expect } from 'vitest'
import { analyze } from '@/lib/analysis/palmReader'

/**
 * Výklad při chudém vstupu. Fotka běžně vrátí jen typ ruky a pár čar —
 * a přesně na tom stavu se dřív ukázalo, že báze nemá jedinou kombinaci
 * splnitelnou bez čáry či pahorku. Tyhle testy hlídají dno.
 */

describe('výklad jen z typu ruky', () => {
  for (const handType of ['earth', 'fire', 'air', 'water', 'mixed'] as const) {
    it(`${handType}: dá souvislé čtení i bez jediné detekované čáry`, async () => {
      const result = await analyze({ handType })

      expect(result.matchedCombinations).toBeGreaterThan(0)
      expect(result.confidence).toBeGreaterThan(0.3)
      expect(result.personality.length).toBeGreaterThan(120)
      expect(result.strengths.length).toBeGreaterThan(0)
      expect(result.challenges.length).toBeGreaterThan(0)
      expect(result.guidance.length).toBeGreaterThan(40)
    })
  }

  it('guidance je konkrétní, ne obecná náhradní věta', async () => {
    const result = await analyze({ handType: 'water' })
    expect(result.guidance).not.toContain('Doplňte více znaků dlaně')
    expect(result.guidance).not.toContain('Vaše silné stránky vycházejí z povahy typu')
  })
})

describe('víc znaků = vyšší jistota', () => {
  it('jistota roste s počtem vyplněných znaků', async () => {
    const bare = await analyze({ handType: 'earth' })
    const some = await analyze({
      handType: 'earth',
      palmLines: {
        lifeLine: { present: true, strength: 'strong' },
        headLine: { present: true, strength: 'strong' },
      },
    })
    const rich = await analyze({
      handType: 'earth',
      palmLines: {
        lifeLine: { present: true, strength: 'strong' },
        headLine: { present: true, strength: 'strong' },
        heartLine: { present: true, strength: 'strong' },
        fateLine: { present: true, strength: 'strong' },
      },
      mounts: {
        jupiter: { size: 'large' },
        venus: { size: 'large' },
        saturn: { size: 'large' },
        luna: { size: 'large' },
      },
      additionalFeatures: { fingerLengths: 'long', nails: 'wide' },
    })

    expect(some.confidence).toBeGreaterThan(bare.confidence)
    expect(rich.confidence).toBeGreaterThan(some.confidence)
    expect(rich.confidence).toBeLessThanOrEqual(0.97)
  })
})

describe('chirognomie se dostane do výsledku', () => {
  it('vyplněné doplňkové znaky se objeví mezi highlighty', async () => {
    const result = await analyze({
      handType: 'air',
      additionalFeatures: {
        fingerLengths: 'long',
        nails: 'wide',
        palmColor: 'pale',
        skinTexture: 'fine',
      },
    })
    const additional = result.highlights.filter((h) => h.category === 'additional')
    expect(additional.length).toBe(4)
    for (const highlight of additional) {
      expect(highlight.meaning.length).toBeGreaterThan(0)
      expect(highlight.label).not.toBe('Doplňující znak')
    }
  })
})

describe('kombinace čar a pahorků', () => {
  it('Jupiter + čára hlavy dá vlastní výklad, ne jen součet znaků', async () => {
    const result = await analyze({
      handType: 'air',
      palmLines: { headLine: { present: true, strength: 'strong' } },
      mounts: { jupiter: { size: 'large' } },
    })
    expect(result.matchedCombinations).toBeGreaterThan(1)
  })
})

describe('odolnost', () => {
  it('nezadané znaky nespadnou a nevymyslí si výklad', async () => {
    const result = await analyze({ handType: 'earth', palmLines: {}, mounts: {} })
    expect(result.highlights.every((h) => h.meaning.length > 0)).toBe(true)
    expect(result.confidence).toBeLessThan(0.6)
  })

  it('čára označená jako chybějící se čte jako chybějící, ne jako slabá', async () => {
    const result = await analyze({
      handType: 'earth',
      palmLines: { fateLine: { present: false } },
    })
    const fate = result.highlights.find((h) => h.detail === 'nezřetelná')
    expect(fate).toBeDefined()
  })
})
