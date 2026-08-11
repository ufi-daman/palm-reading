/** Odstíny šedi, CLAHE (dlaždicová ekvalizace s ořezem) a bilaterální filtr. */

/**
 * Jak z barevného snímku udělat jednokanálový vstup pro hřebenový filtr.
 *
 * **Výchozí je `green`, ne standardní luminance — rozhodlo měření.**
 * Kůže pohlcuje modrou nejsilněji a červené světlo se v ní rozptyluje
 * nejhlouběji; zelený kanál proto nese nejvíc povrchového detailu.
 * Relativní vysokofrekvenční kontrast R/G/B vyšel 0,080 / 0,120 / 0,119
 * na jedné reálné fotce a 0,047 / 0,074 / 0,072 na druhé.
 *
 * Skóre detekovaných čar na týchž dvou fotkách (luma → green):
 *
 * | čára | palm-01 | palm-02 |
 * |---|---|---|
 * | život | 0,836 → 0,842 | 0,847 → 0,832 |
 * | srdce | 0,687 → 0,726 | 0,817 → 0,816 |
 * | osud | 0,673 → 0,593 | — |
 * | hlava | 0,476 → **0,732** | — |
 * | Apollo | 0,494 → 0,386 | 0,498 → **0,815** |
 * | průměr | 0,633 → 0,656 | 0,721 → 0,821 |
 *
 * Počet nalezených čar zůstal stejný; zlepšení je soustředěné do slabých
 * čar u prahu, což je přesně tam, kde rozhoduje mezi „nalezeno" a „nic".
 *
 * **Co bylo zkoušeno a zamítnuto:** odečíst od jasu barevnou složku
 * `log R − log B` (krev a melanin pohlcují modrou silněji než červenou),
 * s koeficientem z regrese na témž snímku. Ztratilo to dvě čáry z pěti
 * na palm-01 a jednu ze tří na palm-02 — kód se proto nepřenáší, jen
 * záznam, že se to měřilo.
 */
export type GrayscaleMode = 'luma' | 'green'

export function toGrayscale(
  imageData: ImageData,
  mode: GrayscaleMode = 'green',
): Float32Array {
  const { data, width, height } = imageData
  const count = width * height
  const gray = new Float32Array(count)

  if (mode === 'green') {
    for (let i = 0; i < count; i++) gray[i] = data[i * 4 + 1]
    return gray
  }

  for (let i = 0; i < count; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
  }
  return gray
}

const TILE_SIZE = 64
const CLIP_LIMIT = 3.0

function equalizeTileHistogram(gray: Float32Array, width: number, x0: number, y0: number, w: number, h: number): Uint8Array {
  const histogram = new Float32Array(256)
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      histogram[Math.round(gray[y * width + x])]++
    }
  }

  const total = w * h
  const clip = (CLIP_LIMIT * total) / 256
  let overflow = 0
  for (let i = 0; i < 256; i++) {
    if (histogram[i] > clip) {
      overflow += histogram[i] - clip
      histogram[i] = clip
    }
  }
  const redistribute = overflow / 256
  for (let i = 0; i < 256; i++) histogram[i] += redistribute

  const cdf = new Uint8Array(256)
  let cumulative = 0
  for (let i = 0; i < 256; i++) {
    cumulative += histogram[i]
    cdf[i] = Math.round((cumulative / total) * 255)
  }
  return cdf
}

/**
 * Zjednodušená CLAHE: histogram ekvalizovaný po dlaždicích s ořezem
 * (potlačuje přehnané zesílení šumu), mapování mezi dlaždicemi bilineárně
 * interpolované, aby na okrajích dlaždic nevznikaly viditelné hrany.
 */
export function claheApprox(gray: Float32Array, width: number, height: number): Float32Array {
  const tilesX = Math.ceil(width / TILE_SIZE)
  const tilesY = Math.ceil(height / TILE_SIZE)
  const mappings: Uint8Array[][] = []

  for (let ty = 0; ty < tilesY; ty++) {
    mappings.push([])
    for (let tx = 0; tx < tilesX; tx++) {
      const x0 = tx * TILE_SIZE
      const y0 = ty * TILE_SIZE
      const w = Math.min(TILE_SIZE, width - x0)
      const h = Math.min(TILE_SIZE, height - y0)
      mappings[ty].push(equalizeTileHistogram(gray, width, x0, y0, w, h))
    }
  }

  const out = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    const tyF = y / TILE_SIZE - 0.5
    const ty0 = Math.max(0, Math.min(tilesY - 1, Math.floor(tyF)))
    const ty1 = Math.max(0, Math.min(tilesY - 1, ty0 + 1))
    const fy = Math.max(0, Math.min(1, tyF - ty0))

    for (let x = 0; x < width; x++) {
      const txF = x / TILE_SIZE - 0.5
      const tx0 = Math.max(0, Math.min(tilesX - 1, Math.floor(txF)))
      const tx1 = Math.max(0, Math.min(tilesX - 1, tx0 + 1))
      const fx = Math.max(0, Math.min(1, txF - tx0))

      const value = Math.round(gray[y * width + x])
      const v00 = mappings[ty0][tx0][value]
      const v10 = mappings[ty0][tx1][value]
      const v01 = mappings[ty1][tx0][value]
      const v11 = mappings[ty1][tx1][value]
      const top = v00 * (1 - fx) + v10 * fx
      const bottom = v01 * (1 - fx) + v11 * fx
      out[y * width + x] = top * (1 - fy) + bottom * fy
    }
  }

  return out
}

const BILATERAL_RADIUS = 2
const SIGMA_SPATIAL = 2.0
const SIGMA_RANGE = 25.0

/** Bilaterální filtr — vyhladí šum, ale drží hrany (čáry) ostré. */
export function bilateralFilter(gray: Float32Array, width: number, height: number): Float32Array {
  const out = new Float32Array(width * height)
  const spatialWeights: number[][] = []
  for (let dy = -BILATERAL_RADIUS; dy <= BILATERAL_RADIUS; dy++) {
    const row: number[] = []
    for (let dx = -BILATERAL_RADIUS; dx <= BILATERAL_RADIUS; dx++) {
      row.push(Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA_SPATIAL * SIGMA_SPATIAL)))
    }
    spatialWeights.push(row)
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const center = gray[y * width + x]
      let sum = 0
      let weightSum = 0
      for (let dy = -BILATERAL_RADIUS; dy <= BILATERAL_RADIUS; dy++) {
        const ny = y + dy
        if (ny < 0 || ny >= height) continue
        for (let dx = -BILATERAL_RADIUS; dx <= BILATERAL_RADIUS; dx++) {
          const nx = x + dx
          if (nx < 0 || nx >= width) continue
          const neighbor = gray[ny * width + nx]
          const rangeWeight = Math.exp(-((neighbor - center) ** 2) / (2 * SIGMA_RANGE * SIGMA_RANGE))
          const weight = spatialWeights[dy + BILATERAL_RADIUS][dx + BILATERAL_RADIUS] * rangeWeight
          sum += neighbor * weight
          weightSum += weight
        }
      }
      out[y * width + x] = weightSum > 0 ? sum / weightSum : center
    }
  }

  return out
}
