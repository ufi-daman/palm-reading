import type { Point } from './mediapipe'

export interface LightingCheck {
  /** 0 = rovnoměrné osvětlení, 1 = jedna strana černá, druhá přepálená. */
  asymmetry: number
  /** Asymetrie nad prahem — dost výrazná na to, aby AI mohla hodnotit pahorky. */
  directional: boolean
}

/**
 * Práh není ověřený proti skutečné boční fotce — žádnou k dispozici nemáme
 * (viz Fáze 10 D, kalibrační snímky nikdy nedorazily). Ověřený je jen
 * opačný směr: obě fotky v test/fixtures/palms/ (rovnoměrné osvětlení)
 * musí vyjít pod tímhle prahem. Skutečnou citlivost na boční světlo ověří
 * až uživatel na svém zařízení.
 */
const DIRECTIONAL_THRESHOLD = 0.22
const SAMPLE = 48

/**
 * Odhad, jestli je dlaň v živém náhledu nasvícená zřetelně z jedné strany
 * — poměr průměrného jasu levé a pravé poloviny oblasti ruky. Řeší jen
 * míru asymetrie, ne směr; slouží k živé zpětné vazbě při focení pro
 * pahorky (viz GuidedCapture.tsx), náhradou za dřívější statický text,
 * který se proti snímku vůbec neověřoval.
 */
export function checkLighting(
  video: HTMLVideoElement,
  landmarks: Point[],
): LightingCheck | null {
  const width = video.videoWidth
  const height = video.videoHeight
  if (!width || !height) return null

  const xs = landmarks.map((p) => p.x * width)
  const ys = landmarks.map((p) => p.y * height)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const boxWidth = maxX - minX
  const boxHeight = maxY - minY
  if (boxWidth < 4 || boxHeight < 4) return null

  const canvas = document.createElement('canvas')
  canvas.width = SAMPLE
  canvas.height = SAMPLE
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return null
  ctx.drawImage(video, minX, minY, boxWidth, boxHeight, 0, 0, SAMPLE, SAMPLE)
  const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE)

  let leftSum = 0
  let leftCount = 0
  let rightSum = 0
  let rightCount = 0
  for (let y = 0; y < SAMPLE; y++) {
    for (let x = 0; x < SAMPLE; x++) {
      const i = (y * SAMPLE + x) * 4
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (x < SAMPLE / 2) {
        leftSum += luma
        leftCount++
      } else {
        rightSum += luma
        rightCount++
      }
    }
  }
  const left = leftSum / leftCount
  const right = rightSum / rightCount
  const asymmetry = Math.abs(left - right) / Math.max(1, (left + right) / 2)

  return { asymmetry, directional: asymmetry >= DIRECTIONAL_THRESHOLD }
}
