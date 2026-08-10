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
