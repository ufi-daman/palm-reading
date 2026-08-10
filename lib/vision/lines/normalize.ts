import { computeAffine, warpImage, type Point } from './homography'

export const FRAME_SIZE = 512

// Indexy z 21bodového modelu MediaPipe Hand Landmarker.
const WRIST = 0
const INDEX_MCP = 5
const PINKY_MCP = 17

/**
 * Cílové pozice tří opěrných bodů v normalizovaném rámci. Poměr odpovídá
 * skutečné dlani: délka (zápěstí → linie kloubů) ku šířce (ukazovák →
 * malík) vychází ~1,04, což sedí na hodnoty naměřené na reálných fotkách
 * (palmRatio 1,02–1,03).
 *
 * Ukazovák vlevo, malík vpravo — palec tedy vždy na levé straně. Afinní
 * transformace levou ruku sama zrcadlí, takže obě ruce skončí ve stejném
 * rámci a zóny platí pro obě.
 */
const CANONICAL: Record<'wrist' | 'index' | 'pinky', Point> = {
  wrist: { x: 256, y: 460 },
  index: { x: 110, y: 150 },
  pinky: { x: 400, y: 165 },
}

/**
 * Obrys dlaně v normalizovaném rámci. Všechno mimo něj se před detekcí
 * vymaskuje — bez toho filtr detekuje letokruhy podlahy v pozadí a ohyby
 * na prstech jako čáry na dlani (ověřeno na reálných fotkách: bez masky
 * skončilo 15–17 % plochy označených jako „rýha").
 *
 * Palec je vlevo, proto polygon vlevo vydouvá přes thenar (val palce),
 * kolem kterého obíhá čára života.
 */
export const PALM_MASK: Point[] = [
  { x: 115, y: 180 },
  { x: 400, y: 195 },
  { x: 425, y: 310 },
  { x: 380, y: 440 },
  { x: 250, y: 470 },
  { x: 130, y: 440 },
  { x: 72, y: 330 },
  { x: 80, y: 230 },
]

/**
 * Maska zmenšená ke svému těžišti. Hranice mezi dlaní a vyplněným okolím
 * je sama o sobě hrana a hřebenový filtr ji detekuje jako dlouhou „čáru"
 * kopírující obrys — na reálné fotce z ní vznikla komponenta o 1355
 * pixelech, největší v celém snímku. Odezva se proto mimo tuhle zmenšenou
 * masku zahazuje (viz `insidePalmCore`).
 */
const CORE_SHRINK = 0.93

function centroid(poly: Point[]): Point {
  const sx = poly.reduce((s, p) => s + p.x, 0)
  const sy = poly.reduce((s, p) => s + p.y, 0)
  return { x: sx / poly.length, y: sy / poly.length }
}

const MASK_CENTER = centroid(PALM_MASK)

const PALM_CORE: Point[] = PALM_MASK.map((p) => ({
  x: MASK_CENTER.x + (p.x - MASK_CENTER.x) * CORE_SHRINK,
  y: MASK_CENTER.y + (p.y - MASK_CENTER.y) * CORE_SHRINK,
}))

/** Ray casting — je bod uvnitř polygonu? */
function insidePolygon(x: number, y: number, poly: Point[]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x
    const yi = poly[i].y
    const xj = poly[j].x
    const yj = poly[j].y
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

/**
 * Vyplní okolí dlaně konstantní barvou. Konstantní oblast má nulovou druhou
 * derivaci, takže hřebenový filtr na ní nenajde nic — čistší než nulování,
 * které by vytvořilo ostrou hranu a ta by se jako „čára" detekovala.
 */
function applyMask(image: ImageData): ImageData {
  const { width, height, data } = image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (insidePolygon(x, y, PALM_MASK)) continue
      const i = (y * width + x) * 4
      data[i] = 235
      data[i + 1] = 235
      data[i + 2] = 235
      data[i + 3] = 255
    }
  }
  return image
}

/**
 * Leží bod v jádru dlaně, dost daleko od okraje masky? Detekce se omezuje
 * jen sem, aby se obrys masky nezpracoval jako čára.
 */
export function insidePalmCore(x: number, y: number): boolean {
  return insidePolygon(x, y, PALM_CORE)
}

/**
 * Narovná dlaň do rámce FRAME_SIZE×FRAME_SIZE podle tří bodů ruky a
 * vymaskuje vše mimo dlaň. Vrací null, když body nedávají smysl
 * (degenerovaný trojúhelník).
 */
export function normalizePalm(
  image: HTMLImageElement,
  landmarks: Point[],
): ImageData | null {
  const src = [landmarks[WRIST], landmarks[INDEX_MCP], landmarks[PINKY_MCP]]
  const dst = [CANONICAL.wrist, CANONICAL.index, CANONICAL.pinky]

  // Normalizované souřadnice MediaPipe (0–1) → pixely zdrojového obrázku.
  const srcPixels = src.map((p) => ({
    x: p.x * image.naturalWidth,
    y: p.y * image.naturalHeight,
  }))

  try {
    const transform = computeAffine(srcPixels, dst)
    const warped = warpImage(
      image,
      image.naturalWidth,
      image.naturalHeight,
      transform,
      FRAME_SIZE,
      FRAME_SIZE,
    )
    return applyMask(warped)
  } catch {
    return null
  }
}
