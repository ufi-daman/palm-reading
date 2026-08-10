/**
 * Vícemeřítkový Frangiho hřebenový (vesselness) filtr. Čáry na dlani jsou
 * tmavší rýhy na světlejší kůži — obraz se proto před filtrem invertuje,
 * aby se rýhy chovaly jako "světlé hřebeny" v obvyklé formulaci filtru.
 *
 * Malá měřítka (σ ≈ 1) chytí tenké vedlejší čáry, velká (σ ≈ 5) hlavní
 * čáry; kombinace přes maximum napříč měřítky pokrývá obojí najednou.
 */

function gaussianKernel1D(sigma: number): Float32Array {
  const radius = Math.max(1, Math.ceil(sigma * 3))
  const size = radius * 2 + 1
  const kernel = new Float32Array(size)
  let sum = 0
  for (let i = 0; i < size; i++) {
    const x = i - radius
    const value = Math.exp(-(x * x) / (2 * sigma * sigma))
    kernel[i] = value
    sum += value
  }
  for (let i = 0; i < size; i++) kernel[i] /= sum
  return kernel
}

function convolveSeparable(gray: Float32Array, width: number, height: number, kernel: Float32Array): Float32Array {
  const radius = (kernel.length - 1) / 2
  const temp = new Float32Array(width * height)
  const out = new Float32Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) {
        const sx = Math.min(width - 1, Math.max(0, x + k))
        sum += gray[y * width + sx] * kernel[k + radius]
      }
      temp[y * width + x] = sum
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      for (let k = -radius; k <= radius; k++) {
        const sy = Math.min(height - 1, Math.max(0, y + k))
        sum += temp[sy * width + x] * kernel[k + radius]
      }
      out[y * width + x] = sum
    }
  }

  return out
}

function hessian(
  smoothed: Float32Array,
  width: number,
  height: number,
  sigma: number,
): { ixx: Float32Array; ixy: Float32Array; iyy: Float32Array } {
  const ixx = new Float32Array(width * height)
  const ixy = new Float32Array(width * height)
  const iyy = new Float32Array(width * height)
  const scaleNorm = sigma * sigma // normalizace přes měřítka (Lindeberg)

  const at = (x: number, y: number) =>
    smoothed[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      ixx[i] = (at(x - 1, y) - 2 * at(x, y) + at(x + 1, y)) * scaleNorm
      iyy[i] = (at(x, y - 1) - 2 * at(x, y) + at(x, y + 1)) * scaleNorm
      ixy[i] =
        ((at(x + 1, y + 1) - at(x + 1, y - 1) - at(x - 1, y + 1) + at(x - 1, y - 1)) / 4) * scaleNorm
    }
  }

  return { ixx, ixy, iyy }
}

const BETA = 0.5 // citlivost na tvar (čára vs. skvrna)
const C = 15 // citlivost na celkový kontrast

function frangiAtScale(gray: Float32Array, width: number, height: number, sigma: number): Float32Array {
  const kernel = gaussianKernel1D(sigma)
  const smoothed = convolveSeparable(gray, width, height, kernel)
  const { ixx, ixy, iyy } = hessian(smoothed, width, height, sigma)

  const response = new Float32Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const trace = ixx[i] + iyy[i]
    const det = ((ixx[i] - iyy[i]) / 2) ** 2 + ixy[i] ** 2
    const discriminant = Math.sqrt(Math.max(0, det))
    let l1 = trace / 2 + discriminant
    let l2 = trace / 2 - discriminant
    if (Math.abs(l1) > Math.abs(l2)) [l1, l2] = [l2, l1] // |λ1| <= |λ2|

    if (l2 >= 0) {
      response[i] = 0 // hledáme jen tmavé rýhy (po inverzi: světlé hřebeny → λ2 < 0)
      continue
    }

    const rb = l1 / l2
    const s = Math.sqrt(l1 * l1 + l2 * l2)
    response[i] = Math.exp(-(rb * rb) / (2 * BETA * BETA)) * (1 - Math.exp(-(s * s) / (2 * C * C)))
  }

  return response
}

export const RIDGE_SCALES = [1, 1.8, 2.6, 3.6, 5]

/** Vrací max. odezvu přes všechna měřítka pro každý pixel, normalizovanou na [0,1]. */
export function multiScaleFrangi(gray: Float32Array, width: number, height: number): Float32Array {
  const inverted = new Float32Array(width * height)
  for (let i = 0; i < gray.length; i++) inverted[i] = 255 - gray[i]

  const combined = new Float32Array(width * height)
  for (const sigma of RIDGE_SCALES) {
    const response = frangiAtScale(inverted, width, height, sigma)
    for (let i = 0; i < combined.length; i++) {
      if (response[i] > combined[i]) combined[i] = response[i]
    }
  }

  let max = 0
  for (let i = 0; i < combined.length; i++) if (combined[i] > max) max = combined[i]
  if (max > 0) for (let i = 0; i < combined.length; i++) combined[i] /= max

  return combined
}
