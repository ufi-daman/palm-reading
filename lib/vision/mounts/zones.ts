import type { MountKey } from '@/lib/content/types'
import { insidePalmCore } from '../lines/normalize'

export interface MountZone {
  x: number
  y: number
  radius: number
}

/**
 * Střed a poloměr každého pahorku v normalizovaném rámci 512×512 (viz
 * normalize.ts). Na rozdíl od LINE_ZONES (změřené na kalibračních fotkách)
 * jde o první odhad z anatomického popisu v lib/content/mounts.ts a z
 * polohy už změřených LINE_ZONES (patky prstů, oblouk čáry života) —
 * nekalibrované na reálný snímek. Ověřit vizuálně proti zarovnané fotce
 * (viz scripts/mounts-relief) a poopravit, než se čísla berou vážně —
 * odhadnuté zóny se u čar jednou ukázaly úplně mimo dlaň, tahle chyba se
 * nemá opakovat mlčky.
 */
export const MOUNT_ZONES: Record<MountKey, MountZone> = {
  jupiter: { x: 150, y: 230, radius: 45 },
  saturn: { x: 253, y: 222, radius: 45 },
  apollo: { x: 325, y: 228, radius: 45 },
  mercury: { x: 390, y: 248, radius: 40 },
  venus: { x: 128, y: 320, radius: 60 },
  luna: { x: 370, y: 400, radius: 65 },
  marsLower: { x: 155, y: 245, radius: 35 },
  marsUpper: { x: 395, y: 285, radius: 35 },
}

/** Je bod uvnitř kruhové zóny pahorku? */
export function insideMountZone(x: number, y: number, zone: MountZone): boolean {
  const dx = x - zone.x
  const dy = y - zone.y
  return dx * dx + dy * dy <= zone.radius * zone.radius
}

/**
 * Pixely zóny oříznuté na jádro dlaně (insidePalmCore) — mimo něj je jen
 * šedá výplň masky, ne skutečná kůže.
 */
export function pixelsInZone(zone: MountZone): Array<{ x: number; y: number }> {
  const pixels: Array<{ x: number; y: number }> = []
  const minX = Math.max(0, Math.floor(zone.x - zone.radius))
  const maxX = Math.ceil(zone.x + zone.radius)
  const minY = Math.max(0, Math.floor(zone.y - zone.radius))
  const maxY = Math.ceil(zone.y + zone.radius)
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (insideMountZone(x, y, zone) && insidePalmCore(x, y)) pixels.push({ x, y })
    }
  }
  return pixels
}
