import type { LineKey } from '@/lib/content/types'
import { normalizePalm, FRAME_SIZE } from './normalize'
import { toGrayscale, claheApprox, bilateralFilter } from './enhance'
import { multiScaleFrangi } from './ridges'
import { otsuThreshold, threshold, zhangSuenThin, connectedComponents } from './skeleton'
import { assignLinesToZones, type DetectedLine } from './assign'
import type { Point } from '../mediapipe'

export interface LineDetectionResult {
  lines: Partial<Record<LineKey, DetectedLine>>
  /** Kolik znaků detekce vůbec našla nad prahem — jde do statistiky. */
  detectedCount: number
}

/**
 * Celý řetězec detekce čar nad jedním snímkem: normalizace homografií →
 * vylepšení kontrastu → vícemeřítkový hřebenový filtr → práh → ztenčení →
 * spojené komponenty → přiřazení do anatomických zón.
 *
 * Vrací null, pokud se dlaň nepodařilo normalizovat (degenerované body).
 * Jakékoliv selhání dílčího kroku propaguje jako výjimku — volající
 * (lib/vision index) to zachytí a vrátí uživatele k ručnímu doplnění,
 * detekce se nikdy nesmí tvářit jistě, když selhala.
 */
export function detectLines(image: HTMLImageElement, landmarks: Point[]): LineDetectionResult | null {
  const normalized = normalizePalm(image, landmarks)
  if (!normalized) return null

  const gray = toGrayscale(normalized)
  const enhanced = claheApprox(gray, FRAME_SIZE, FRAME_SIZE)
  const smoothed = bilateralFilter(enhanced, FRAME_SIZE, FRAME_SIZE)

  const response = multiScaleFrangi(smoothed, FRAME_SIZE, FRAME_SIZE)
  const cutoff = otsuThreshold(response)
  const binary = threshold(response, cutoff)
  const skeleton = zhangSuenThin(binary, FRAME_SIZE, FRAME_SIZE)
  const components = connectedComponents(skeleton, FRAME_SIZE, FRAME_SIZE)

  const lines = assignLinesToZones(components, response, FRAME_SIZE)

  return { lines, detectedCount: Object.keys(lines).length }
}
