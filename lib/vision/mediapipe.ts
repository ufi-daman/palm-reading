'use client'

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

let landmarkerPromise: Promise<HandLandmarker> | null = null

/**
 * WASM i model se načítají z /public, ne z Google CDN — fotka do detekce
 * jde jen do prohlížeče, žádná síťová vrstva při analýze nic neposílá.
 */
function loadHandLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks('/mediapipe').then((fileset) =>
      HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: '/models/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numHands: 1,
      }),
    )
  }
  return landmarkerPromise
}

export interface Point {
  x: number
  y: number
}

/**
 * Detekuje 21 bodů ruky na obrázku. Vrací null, pokud ruka nebyla
 * nalezena vůbec — volající se v tom případě vrátí k ručnímu průvodci.
 */
export async function detectHandLandmarks(image: HTMLImageElement): Promise<Point[] | null> {
  const landmarker = await loadHandLandmarker()
  const result = landmarker.detect(image)
  const landmarks = result.landmarks[0]
  if (!landmarks || landmarks.length < 21) return null
  return landmarks.map((point) => ({ x: point.x, y: point.y }))
}

/**
 * Stáhne a připraví model dopředu. Naváděné focení ho potřebuje už při
 * otevření kamery, ne až po stisku spouště — nejde o žádné data navíc,
 * jen o posun těch stejných 18 MB do doby, kdy si uživatel rovná ruku.
 */
export function preloadHandLandmarker(): Promise<unknown> {
  return loadHandLandmarker()
}

let frameBusy = false

/**
 * Body ruky z živého náhledu. Model je držený v režimu IMAGE (stejná
 * instance jako pro hotový snímek) — bez časové stopy mezi snímky je
 * odhad o něco méně stabilní, ale pro kontrolu polohy při ~4 snímcích za
 * sekundu to stačí a odpadá druhá instance modelu v paměti.
 *
 * Vrací `undefined`, když je předchozí snímek ještě rozpracovaný —
 * volající pak nechá poslední známý výsledek být.
 */
export async function detectHandLandmarksInFrame(
  video: HTMLVideoElement,
): Promise<Point[] | null | undefined> {
  if (frameBusy) return undefined
  if (video.videoWidth === 0 || video.readyState < 2) return undefined
  frameBusy = true
  try {
    const landmarker = await loadHandLandmarker()
    const result = landmarker.detect(video)
    const landmarks = result.landmarks[0]
    if (!landmarks || landmarks.length < 21) return null
    return landmarks.map((point) => ({ x: point.x, y: point.y }))
  } catch {
    return null
  } finally {
    frameBusy = false
  }
}
