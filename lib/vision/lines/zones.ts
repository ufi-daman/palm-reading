import type { LineKey } from '@/lib/content/types'

export interface ZonePoint {
  x: number
  y: number
}

/**
 * Přibližná osa každé čáry v normalizovaném rámci 512×512 (viz normalize.ts
 * pro souřadnou soustavu: palec vlevo ~(100,300), ukazovák nahoře vlevo
 * ~(210,140), malík nahoře vpravo ~(370,190), zápěstí dole ~(256,460)).
 *
 * Jde o anatomický odhad z popisů v plánu, ne o změřenou kalibraci — bez
 * skutečných fotek dlaní (test/fixtures/palms/) nejde doladit na reálná
 * data. Pixel v okolí této osy (viz ZONE_TOLERANCE) se čáře přiřadí.
 */
export const LINE_ZONES: Record<LineKey, ZonePoint[]> = {
  lifeLine: [
    { x: 180, y: 200 },
    { x: 145, y: 280 },
    { x: 120, y: 360 },
    { x: 140, y: 430 },
  ],
  heartLine: [
    { x: 360, y: 150 },
    { x: 280, y: 140 },
    { x: 200, y: 150 },
    { x: 160, y: 165 },
  ],
  headLine: [
    { x: 150, y: 240 },
    { x: 230, y: 255 },
    { x: 310, y: 260 },
    { x: 370, y: 250 },
  ],
  fateLine: [
    { x: 270, y: 440 },
    { x: 275, y: 320 },
    { x: 280, y: 220 },
    { x: 285, y: 150 },
  ],
  apolloLine: [
    { x: 330, y: 400 },
    { x: 325, y: 300 },
    { x: 320, y: 220 },
    { x: 315, y: 160 },
  ],
  mercuryLine: [
    { x: 390, y: 430 },
    { x: 380, y: 340 },
    { x: 375, y: 260 },
    { x: 370, y: 195 },
  ],
  intuitionLine: [
    { x: 410, y: 380 },
    { x: 420, y: 320 },
    { x: 410, y: 260 },
    { x: 390, y: 220 },
  ],
  venusLine: [
    { x: 200, y: 120 },
    { x: 260, y: 105 },
    { x: 320, y: 115 },
    { x: 360, y: 135 },
  ],
}

export const ZONE_TOLERANCE = 45 // px — jak daleko od osy ještě pixel patří do zóny

function distancePointToSegment(p: ZonePoint, a: ZonePoint, b: ZonePoint): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSq = dx * dx + dy * dy
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)

  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq
  t = Math.max(0, Math.min(1, t))
  const projX = a.x + t * dx
  const projY = a.y + t * dy
  return Math.hypot(p.x - projX, p.y - projY)
}

export function distanceToZone(point: ZonePoint, zone: ZonePoint[]): number {
  let min = Infinity
  for (let i = 0; i < zone.length - 1; i++) {
    const d = distancePointToSegment(point, zone[i], zone[i + 1])
    if (d < min) min = d
  }
  return min
}

export function zonePathLength(zone: ZonePoint[]): number {
  let length = 0
  for (let i = 0; i < zone.length - 1; i++) {
    length += Math.hypot(zone[i + 1].x - zone[i].x, zone[i + 1].y - zone[i].y)
  }
  return length
}
