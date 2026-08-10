import { invert3x3, apply3x3, solveLinearSystem, type Mat3 } from './matrix'

export interface Point {
  x: number
  y: number
}

/**
 * Homografie ze 4 bodových korespondencí (DLT). Homografie zvládá i
 * zrcadlení, takže funguje stejně pro levou i pravou ruku bez rozlišení
 * "handedness" — stačí, že orgány (zápěstí, klouby) korespondují správně.
 */
/**
 * Afinní transformace ze 3 bodových korespondencí, vrácená jako 3×3 matice
 * (poslední řádek 0,0,1), aby ji šlo použít stejně jako homografii.
 *
 * Proč afinní a ne homografie: homografie potřebuje 4 body, a čtvrtý
 * anatomicky stabilní a dostatečně vzdálený bod na dlani není. Kořen palce
 * (THUMB_CMC) leží blízko zápěstí a jeho poloha se navíc mění s odtažením
 * palce — krátká základna dělá soustavu špatně podmíněnou a výsledek se
 * zkosí. Trojice zápěstí + klouby ukazováku a malíku je dobře rozprostřená
 * a stabilní. Perspektivu afinní transformace nesrovná, ale při focení
 * zhruba zepředu je zbytková chyba řádově menší než to zkosení.
 *
 * Záporný determinant (zrcadlení) je v pořádku a žádoucí — levá i pravá
 * ruka se tím narovnají do téhož rámce, palec vždy na stejné straně.
 */
export function computeAffine(src: Point[], dst: Point[]): Mat3 {
  if (src.length !== 3 || dst.length !== 3) {
    throw new Error('Afinní transformace vyžaduje přesně 3 korespondence.')
  }

  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 3; i++) {
    A.push([src[i].x, src[i].y, 1, 0, 0, 0])
    b.push(dst[i].x)
    A.push([0, 0, 0, src[i].x, src[i].y, 1])
    b.push(dst[i].y)
  }

  const t = solveLinearSystem(A, b)
  return [t[0], t[1], t[2], t[3], t[4], t[5], 0, 0, 1]
}

export function computeHomography(src: Point[], dst: Point[]): Mat3 {
  if (src.length !== 4 || dst.length !== 4) {
    throw new Error('Homografie ze 4 bodů vyžaduje přesně 4 korespondence.')
  }

  const A: number[][] = []
  const b: number[] = []

  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i]
    const { x: u, y: v } = dst[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }

  const h = solveLinearSystem(A, b)
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1]
}

/**
 * Vykreslí zdrojový obrázek do normalizovaného rámce podle homografie.
 * Iteruje přes cílové pixely a bilineárně vzorkuje ze zdroje (inverzní
 * mapování) — bez děr, na rozdíl od dopředného mapování.
 */
export function warpImage(
  source: HTMLImageElement | HTMLCanvasElement,
  sourceWidth: number,
  sourceHeight: number,
  homography: Mat3,
  outWidth: number,
  outHeight: number,
): ImageData {
  const srcCanvas = document.createElement('canvas')
  srcCanvas.width = sourceWidth
  srcCanvas.height = sourceHeight
  const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true })
  if (!srcCtx) throw new Error('Canvas není podporován.')
  srcCtx.drawImage(source, 0, 0, sourceWidth, sourceHeight)
  const srcData = srcCtx.getImageData(0, 0, sourceWidth, sourceHeight)

  const inverse = invert3x3(homography)
  const out = new ImageData(outWidth, outHeight)

  for (let dy = 0; dy < outHeight; dy++) {
    for (let dx = 0; dx < outWidth; dx++) {
      const { x: sx, y: sy } = apply3x3(inverse, dx, dy)
      const outIndex = (dy * outWidth + dx) * 4

      if (sx < 0 || sy < 0 || sx >= sourceWidth - 1 || sy >= sourceHeight - 1) {
        continue // mimo zdroj necháme průhledné/černé
      }

      const x0 = Math.floor(sx)
      const y0 = Math.floor(sy)
      const fx = sx - x0
      const fy = sy - y0

      for (let c = 0; c < 4; c++) {
        const i00 = (y0 * sourceWidth + x0) * 4 + c
        const i10 = (y0 * sourceWidth + x0 + 1) * 4 + c
        const i01 = ((y0 + 1) * sourceWidth + x0) * 4 + c
        const i11 = ((y0 + 1) * sourceWidth + x0 + 1) * 4 + c
        const top = srcData.data[i00] * (1 - fx) + srcData.data[i10] * fx
        const bottom = srcData.data[i01] * (1 - fx) + srcData.data[i11] * fx
        out.data[outIndex + c] = Math.round(top * (1 - fy) + bottom * fy)
      }
    }
  }

  return out
}
