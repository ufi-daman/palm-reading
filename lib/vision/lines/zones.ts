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
/**
 * Souřadnice odvozené z reálných snímků, ne z popisu. Dlaň v rámci sahá
 * zhruba x 75–425, y 205–465; palec je vlevo, prsty nahoře, zápěstí dole.
 * Oblouk čáry života odpovídá průběhu naměřenému na kalibračních fotkách,
 * zbytek je poloha podle anatomie přepočtená na tento rozsah.
 *
 * Původní hodnoty byly odhad z textových popisů a zóny čar srdce a Venuše
 * kvůli tomu ležely úplně mimo dlaň — nemohly nikdy sednout.
 */
/**
 * Záměrně `Partial`: zóny má jen těch osm čar, pro které jsou souřadnice
 * odvozené z reálných snímků. Šest vedlejších znaků doplněných z Cheira
 * (čára Marsu, Saturnův a Šalomounův prsten, Via Lascivia, cestovní a
 * vztahové čáry) zóny nemá a detekce je proto nehledá — dokud je nezměřím,
 * byl by to odhad, a odhadnuté zóny se tu už jednou vymstily: čáry srdce
 * a Venuše ležely mimo dlaň a nemohly sednout nikdy.
 *
 * Uživatel je zatím vyplní ručně v panelu oprav, případně je dodá AI rozbor.
 */
export const LINE_ZONES: Partial<Record<LineKey, ZonePoint[]>> = {
  // Obíhá val palce; průběh naměřený na kalibračních snímcích.
  lifeLine: [
    { x: 145, y: 225 },
    { x: 185, y: 285 },
    { x: 215, y: 345 },
    { x: 218, y: 405 },
    { x: 198, y: 442 },
  ],
  // Nejvyšší z vodorovných, od hrany pod malíkem k ukazováku.
  heartLine: [
    { x: 402, y: 258 },
    { x: 330, y: 240 },
    { x: 252, y: 238 },
    { x: 178, y: 254 },
  ],
  // Střední vodorovná, začíná u palcové hrany společně s čárou života.
  headLine: [
    { x: 140, y: 268 },
    { x: 228, y: 298 },
    { x: 318, y: 310 },
    { x: 390, y: 302 },
  ],
  // Svislá středem dlaně k prostředníku.
  fateLine: [
    { x: 245, y: 448 },
    { x: 250, y: 368 },
    { x: 255, y: 295 },
    { x: 258, y: 232 },
  ],
  // Svislá pod prsteníkem (mezi prostředníkem a malíkem).
  apolloLine: [
    { x: 330, y: 425 },
    { x: 326, y: 350 },
    { x: 322, y: 285 },
    { x: 320, y: 238 },
  ],
  // Od oblasti Luny (dolní vnější část) k pahorku Merkura pod malíkem.
  mercuryLine: [
    { x: 380, y: 432 },
    { x: 380, y: 362 },
    { x: 385, y: 300 },
    { x: 390, y: 252 },
  ],
  // Oblouk při vnější hraně dlaně.
  intuitionLine: [
    { x: 400, y: 395 },
    { x: 416, y: 335 },
    { x: 410, y: 282 },
    { x: 392, y: 248 },
  ],
  // Oblouk nad čárou srdce, mezi ukazovákem a malíkem.
  venusLine: [
    { x: 205, y: 232 },
    { x: 262, y: 218 },
    { x: 330, y: 220 },
    { x: 378, y: 236 },
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
