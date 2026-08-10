/**
 * Rychlé kontroly kvality snímku přímo z pixelů canvasu — běží na malém
 * zmenšeném náhledu (viz SAMPLE_SIZE), takže i na slabším mobilu stíhají
 * na každý snímek videa.
 */

const SAMPLE_SIZE = 200

function toGrayscale(imageData: ImageData): Float32Array {
  const { data, width, height } = imageData
  const gray = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b
  }
  return gray
}

/**
 * Rozptyl Laplaciánu — standardní odhad ostrosti. Rozmazaný snímek má
 * nízký rozptyl (hrany jsou "rozmyté"), ostrý snímek vysoký.
 */
function laplacianVariance(gray: Float32Array, width: number, height: number): number {
  const lap = new Float32Array(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const value =
        4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - width] - gray[i + width]
      lap[i] = value
    }
  }
  let mean = 0
  for (let i = 0; i < lap.length; i++) mean += lap[i]
  mean /= lap.length
  let variance = 0
  for (let i = 0; i < lap.length; i++) variance += (lap[i] - mean) ** 2
  return variance / lap.length
}

/** Podíl pixelů blízko černé nebo bílé — vysoký podíl značí špatnou expozici. */
function clippingRatio(gray: Float32Array): { underexposed: number; overexposed: number } {
  let dark = 0
  let bright = 0
  for (let i = 0; i < gray.length; i++) {
    if (gray[i] < 15) dark++
    else if (gray[i] > 240) bright++
  }
  return { underexposed: dark / gray.length, overexposed: bright / gray.length }
}

export interface QualityCheck {
  sharpness: number
  underexposed: number
  overexposed: number
  isSharp: boolean
  isWellExposed: boolean
  ok: boolean
}

const SHARPNESS_THRESHOLD = 80
const CLIPPING_THRESHOLD = 0.35

export function checkImageQuality(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
): QualityCheck | null {
  const canvas = document.createElement('canvas')
  const scale = SAMPLE_SIZE / Math.max(sourceWidth, sourceHeight)
  canvas.width = Math.max(1, Math.round(sourceWidth * scale))
  canvas.height = Math.max(1, Math.round(sourceHeight * scale))
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null

  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const gray = toGrayscale(imageData)

  const sharpness = laplacianVariance(gray, canvas.width, canvas.height)
  const { underexposed, overexposed } = clippingRatio(gray)

  const isSharp = sharpness >= SHARPNESS_THRESHOLD
  const isWellExposed = underexposed < CLIPPING_THRESHOLD && overexposed < CLIPPING_THRESHOLD

  return {
    sharpness,
    underexposed,
    overexposed,
    isSharp,
    isWellExposed,
    ok: isSharp && isWellExposed,
  }
}
