import type { MountKey } from '@/lib/content/types'
import { toGrayscale } from '../lines/enhance'
import { insidePalmCore, FRAME_SIZE } from '../lines/normalize'
import { LINE_ZONES, distanceToZone, ZONE_TOLERANCE } from '../lines/zones'
import { MOUNT_ZONES, pixelsInZone, type MountZone } from './zones'

/**
 * Rýhy dlaně (čára života/srdce/hlavy…) jsou hlubší a ostřejší reliéf než
 * mírné klenutí pahorku — v mapě M snadno převáží. `nearAnyLine` umožňuje
 * je ze skóre pahorků vyloučit, aby se otestovalo, jestli žebříček
 * pahorků jen nekopíruje polohu čar.
 */
function nearAnyLine(x: number, y: number): boolean {
  for (const zone of Object.values(LINE_ZONES)) {
    if (!zone) continue
    if (distanceToZone({ x, y }, zone) <= ZONE_TOLERANCE) return true
  }
  return false
}

export interface ReliefFrames {
  ambient: ImageData
  left: ImageData
  right: ImageData
  fingertip: ImageData
  wrist: ImageData
}

export interface ReliefMaps {
  width: number
  height: number
  horizontal: Float32Array
  vertical: Float32Array
  magnitude: Float32Array
  horizontalRatio: Float32Array
  verticalRatio: Float32Array
  magnitudeRatio: Float32Array
}

const TARGET_MEAN = 128
/** Guard proti dělení blízko nuly ve stínovaných záhybech kůže na tmavém sero snímku. */
const RATIO_EPS = 8

/**
 * Jas snímku, luma (ne green — jde o absolutní jas pod směrovým světlem,
 * ne o kontrast kresby jako u detekce čar), přeškálovaný tak, aby měl
 * uvnitř jádra dlaně průměr TARGET_MEAN. Srovná expozici mezi snímky bez
 * toho, aby tmavší sero snímek stahoval ostatní dolů.
 */
function normalizedLuma(image: ImageData): Float32Array {
  const luma = toGrayscale(image, 'luma')
  let sum = 0
  let count = 0
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (!insidePalmCore(x, y)) continue
      sum += luma[y * image.width + x]
      count++
    }
  }
  const meanCore = count > 0 ? sum / count : TARGET_MEAN
  const scale = TARGET_MEAN / meanCore
  const out = new Float32Array(luma.length)
  for (let i = 0; i < luma.length; i++) out[i] = luma[i] * scale
  return out
}

/**
 * Separabilní box blur (jeden vodorovný a jeden svislý průchod). Skutečný
 * reliéf pahorku je široký (desítky pixelů), zatímco drobná nepřesnost v
 * zarovnání mezi pěti snímky se nejvíc projeví přesně na hranách rýh
 * kůže — úzkých, jednopixelových útvarech. Rozostření tenhle vysoko-
 * frekvenční šum potlačí a nechá projít jen širokoplošný signál.
 */
function boxBlur(data: Float32Array, width: number, height: number, radius: number): Float32Array {
  const temp = new Float32Array(data.length)
  const out = new Float32Array(data.length)
  const size = radius * 2 + 1

  for (let y = 0; y < height; y++) {
    let sum = 0
    for (let x = -radius; x <= radius; x++) sum += data[y * width + Math.min(width - 1, Math.max(0, x))]
    for (let x = 0; x < width; x++) {
      temp[y * width + x] = sum / size
      const addX = Math.min(width - 1, x + radius + 1)
      const removeX = Math.max(0, x - radius)
      sum += data[y * width + addX] - data[y * width + removeX]
    }
  }

  for (let x = 0; x < width; x++) {
    let sum = 0
    for (let y = -radius; y <= radius; y++) sum += temp[Math.min(height - 1, Math.max(0, y)) * width + x]
    for (let y = 0; y < height; y++) {
      out[y * width + x] = sum / size
      const addY = Math.min(height - 1, y + radius + 1)
      const removeY = Math.max(0, y - radius)
      sum += temp[addY * width + x] - temp[removeY * width + x]
    }
  }

  return out
}

const RELIEF_BLUR_RADIUS = 12

/**
 * Fotometrický odhad reliéfu z 5 snímků téže dlaně pod různým směrovým
 * světlem. Lambertovské stínování: jas ≈ albedo × (normála · světlo).
 * Rozdíl dvou snímků s opačným směrem světla na stejném (zarovnaném)
 * pixelu vykrátí albedo a nechá signál úměrný sklonu povrchu.
 *
 * Poměrová varianta (Ratio) navíc dělí místním jasem ze sero snímku —
 * levný odhad místního albeda (znamínka, mozoly, barva kůže), který
 * škáluje samotný jasový rozdíl. Sero snímek je ale sám tmavší/šumnější,
 * takže tahle varianta může v tmavých místech šum zesílit — bere se
 * jako nezávislá druhá metrika pro kontrolu shody, ne jako jistější.
 */
export function computeReliefMaps(frames: ReliefFrames): ReliefMaps {
  const { width, height } = frames.ambient
  const ambient = normalizedLuma(frames.ambient)
  const left = normalizedLuma(frames.left)
  const right = normalizedLuma(frames.right)
  const fingertip = normalizedLuma(frames.fingertip)
  const wrist = normalizedLuma(frames.wrist)

  const count = width * height
  const rawGh = new Float32Array(count)
  const rawGv = new Float32Array(count)
  const rawRh = new Float32Array(count)
  const rawRv = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const gh = left[i] - right[i]
    const gv = fingertip[i] - wrist[i]
    rawGh[i] = gh
    rawGv[i] = gv

    const denom = ambient[i] + RATIO_EPS
    rawRh[i] = gh / denom
    rawRv[i] = gv / denom
  }

  const horizontal = boxBlur(rawGh, width, height, RELIEF_BLUR_RADIUS)
  const vertical = boxBlur(rawGv, width, height, RELIEF_BLUR_RADIUS)
  const horizontalRatio = boxBlur(rawRh, width, height, RELIEF_BLUR_RADIUS)
  const verticalRatio = boxBlur(rawRv, width, height, RELIEF_BLUR_RADIUS)

  const magnitude = new Float32Array(count)
  const magnitudeRatio = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    magnitude[i] = Math.sqrt(horizontal[i] * horizontal[i] + vertical[i] * vertical[i])
    magnitudeRatio[i] = Math.sqrt(horizontalRatio[i] * horizontalRatio[i] + verticalRatio[i] * verticalRatio[i])
  }

  return { width, height, horizontal, vertical, magnitude, horizontalRatio, verticalRatio, magnitudeRatio }
}

export interface MountScore {
  mount: MountKey
  zone: MountZone
  pixelCount: number
  meanMagnitude: number
  stdMagnitude: number
  meanMagnitudeRatio: number
  /** Průměr M přes jádro dlaně mimo všechny zóny — referenční šum. */
  backgroundMean: number
  backgroundMeanRatio: number
  /** meanMagnitude − backgroundMean. Řadit podle tohohle, ne podle syrového
   *  průměru — vykrátí to plošný gradient/vinětaci, kterou by jinak
   *  všechny pahorky zvedly stejně a schovaly by se v ní rozdíly mezi nimi. */
  excess: number
  excessRatio: number
}

function mean(values: number[]): number {
  return values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 0
}

function std(values: number[], avg: number): number {
  if (values.length === 0) return 0
  const variance = values.reduce((s, v) => s + (v - avg) * (v - avg), 0) / values.length
  return Math.sqrt(variance)
}

/** Seřazeno sestupně podle `excess`. */
export function scoreMounts(
  maps: ReliefMaps,
  zones: Record<MountKey, MountZone> = MOUNT_ZONES,
  excludeLines = false,
): MountScore[] {
  const mountKeys = Object.keys(zones) as MountKey[]
  const zonePixelsByMount = new Map<MountKey, Array<{ x: number; y: number }>>()
  const inAnyZone = new Uint8Array(maps.width * maps.height)

  for (const mount of mountKeys) {
    let pixels = pixelsInZone(zones[mount])
    if (excludeLines) pixels = pixels.filter((p) => !nearAnyLine(p.x, p.y))
    zonePixelsByMount.set(mount, pixels)
    for (const p of pixels) inAnyZone[p.y * maps.width + p.x] = 1
  }

  const backgroundValues: number[] = []
  const backgroundValuesRatio: number[] = []
  for (let y = 0; y < maps.height; y++) {
    for (let x = 0; x < maps.width; x++) {
      if (!insidePalmCore(x, y)) continue
      const i = y * maps.width + x
      if (inAnyZone[i]) continue
      if (excludeLines && nearAnyLine(x, y)) continue
      backgroundValues.push(maps.magnitude[i])
      backgroundValuesRatio.push(maps.magnitudeRatio[i])
    }
  }
  const backgroundMean = mean(backgroundValues)
  const backgroundMeanRatio = mean(backgroundValuesRatio)

  const scores: MountScore[] = mountKeys.map((mount) => {
    const pixels = zonePixelsByMount.get(mount)!
    const values = pixels.map((p) => maps.magnitude[p.y * maps.width + p.x])
    const valuesRatio = pixels.map((p) => maps.magnitudeRatio[p.y * maps.width + p.x])
    const meanMagnitude = mean(values)
    const meanMagnitudeRatio = mean(valuesRatio)
    return {
      mount,
      zone: zones[mount],
      pixelCount: pixels.length,
      meanMagnitude,
      stdMagnitude: std(values, meanMagnitude),
      meanMagnitudeRatio,
      backgroundMean,
      backgroundMeanRatio,
      excess: meanMagnitude - backgroundMean,
      excessRatio: meanMagnitudeRatio - backgroundMeanRatio,
    }
  })

  scores.sort((a, b) => b.excess - a.excess)
  return scores
}

/** Barevná teplotní mapa pro vizuální kontrolu. signed: modrá↔bílá↔červená (Gh/Gv). Bez signed: bílá→červená (M/Mr). */
export function magnitudeToHeatmap(
  map: Float32Array,
  width: number,
  height: number,
  opts?: { signed?: boolean },
): ImageData {
  const out = new ImageData(width, height)
  let maxAbs = 1e-6
  for (let i = 0; i < map.length; i++) {
    const abs = Math.abs(map[i])
    if (abs > maxAbs) maxAbs = abs
  }

  for (let i = 0; i < map.length; i++) {
    const v = map[i] / maxAbs // -1..1 (signed) nebo 0..1 (unsigned, záporné hodnoty neočekávané)
    let r: number
    let g: number
    let b: number
    if (opts?.signed) {
      if (v >= 0) {
        r = 255
        g = Math.round(255 * (1 - v))
        b = Math.round(255 * (1 - v))
      } else {
        r = Math.round(255 * (1 + v))
        g = Math.round(255 * (1 + v))
        b = 255
      }
    } else {
      const t = Math.max(0, Math.min(1, v))
      r = 255
      g = Math.round(255 * (1 - t))
      b = Math.round(255 * (1 - t))
    }
    const o = i * 4
    out.data[o] = r
    out.data[o + 1] = g
    out.data[o + 2] = b
    out.data[o + 3] = 255
  }
  return out
}

export { FRAME_SIZE }
