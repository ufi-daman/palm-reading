import type { LineKey, LineLength, LineQuality, LineStrength } from '@/lib/content/types'
import type { Component } from './skeleton'
import { distanceToZone, zonePathLength, LINE_ZONES, ZONE_TOLERANCE } from './zones'

export interface DetectedLine {
  length: LineLength
  strength: LineStrength
  /** Jen "clear" / "broken" — "chained" a "island" bychom bez kalibrace jen hádali. */
  quality: LineQuality
  score: number
}

/** Pod tímto skóre se znak vůbec nereportuje — žádné spekulativní výstupy. */
export const CONFIDENCE_THRESHOLD = 0.35
const MIN_MATCH_FRACTION = 0.6

function componentMatchesZone(component: Component, zoneKey: LineKey): number {
  const zone = LINE_ZONES[zoneKey]
  if (!zone) return 0
  let withinTolerance = 0
  for (const pixel of component.pixels) {
    if (distanceToZone(pixel, zone) <= ZONE_TOLERANCE) withinTolerance++
  }
  return withinTolerance / component.pixels.length
}

function averageResponse(component: Component, response: Float32Array, width: number): number {
  let sum = 0
  for (const pixel of component.pixels) sum += response[pixel.y * width + pixel.x]
  return sum / component.pixels.length
}

function binLength(coverage: number): LineLength {
  if (coverage < 0.35) return 'short'
  if (coverage < 0.7) return 'medium'
  return 'long'
}

function binStrength(avgResponse: number): LineStrength {
  if (avgResponse < 0.35) return 'weak'
  if (avgResponse < 0.65) return 'medium'
  return 'strong'
}

/**
 * Přiřadí spojené komponenty kostry k anatomickým zónám a spočítá měření.
 * Komponenta, která do žádné zóny nesedí aspoň z MIN_MATCH_FRACTION, se
 * nepřiřadí vůbec — nejde o šum jedné čáry, ale o cizí strukturu (vráska,
 * okraj dlaně) a nemá smysl ji vydávat za znak.
 */
export function assignLinesToZones(
  components: Component[],
  response: Float32Array,
  width: number,
): Partial<Record<LineKey, DetectedLine>> {
  const zoneKeys = Object.keys(LINE_ZONES) as LineKey[]
  const byZone = new Map<LineKey, Component[]>()

  for (const component of components) {
    let bestZone: LineKey | null = null
    let bestFraction = 0

    for (const zoneKey of zoneKeys) {
      const fraction = componentMatchesZone(component, zoneKey)
      if (fraction > bestFraction) {
        bestFraction = fraction
        bestZone = zoneKey
      }
    }

    if (bestZone && bestFraction >= MIN_MATCH_FRACTION) {
      const list = byZone.get(bestZone) ?? []
      list.push(component)
      byZone.set(bestZone, list)
    }
  }

  const result: Partial<Record<LineKey, DetectedLine>> = {}

  for (const [zoneKey, zoneComponents] of Array.from(byZone.entries())) {
    const zone = LINE_ZONES[zoneKey]
    if (!zone) continue
    const totalPixels = zoneComponents.reduce((sum, c) => sum + c.pixels.length, 0)
    const pathLength = zonePathLength(zone)
    const coverage = Math.min(1, totalPixels / pathLength)

    let responseSum = 0
    for (const component of zoneComponents) {
      responseSum += averageResponse(component, response, width) * component.pixels.length
    }
    const avgResponse = responseSum / totalPixels

    const score = coverage * 0.6 + avgResponse * 0.4
    if (score < CONFIDENCE_THRESHOLD) continue

    result[zoneKey] = {
      length: binLength(coverage),
      strength: binStrength(avgResponse),
      quality: zoneComponents.length > 1 ? 'broken' : 'clear',
      score,
    }
  }

  return result
}
