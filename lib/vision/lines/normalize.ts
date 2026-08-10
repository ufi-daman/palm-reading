import { computeHomography, warpImage, type Point } from './homography'

export const FRAME_SIZE = 512

// Indexy z 21bodového modelu MediaPipe Hand Landmarker.
const WRIST = 0
const THUMB_CMC = 1
const INDEX_MCP = 5
const PINKY_MCP = 17

/**
 * Cílový čtyřúhelník v normalizovaném rámci — palec vlevo, malík vpravo,
 * zápěstí dole. Homografie funguje stejně pro obě ruce (viz homography.ts),
 * tenhle rámec proto stačí definovat jednou.
 *
 * Souřadnice jsou odhad z běžných proporcí ruky, ne změřená kalibrace —
 * bez skutečných fotek dlaní (test/fixtures/palms/) je nelze doladit.
 */
const CANONICAL: Record<'wrist' | 'thumb' | 'index' | 'pinky', Point> = {
  wrist: { x: 256, y: 460 },
  thumb: { x: 100, y: 300 },
  index: { x: 210, y: 140 },
  pinky: { x: 370, y: 190 },
}

/**
 * Normalizuje dlaň do rámce FRAME_SIZE×FRAME_SIZE podle 4 bodů ruky.
 * Vrací null, pokud vstupní body nedávají smysl (degenerovaný čtyřúhelník).
 */
export function normalizePalm(
  image: HTMLImageElement,
  landmarks: Point[],
): ImageData | null {
  const src = [landmarks[WRIST], landmarks[INDEX_MCP], landmarks[PINKY_MCP], landmarks[THUMB_CMC]]
  const dst = [CANONICAL.wrist, CANONICAL.index, CANONICAL.pinky, CANONICAL.thumb]

  // Normalizované souřadnice MediaPipe (0–1) → pixely zdrojového obrázku.
  const srcPixels = src.map((p) => ({ x: p.x * image.naturalWidth, y: p.y * image.naturalHeight }))

  try {
    const homography = computeHomography(srcPixels, dst)
    return warpImage(image, image.naturalWidth, image.naturalHeight, homography, FRAME_SIZE, FRAME_SIZE)
  } catch {
    return null
  }
}
