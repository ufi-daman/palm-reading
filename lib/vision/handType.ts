import type { HandTypeName } from '@/lib/content/types'
import type { Point } from './mediapipe'

// Indexy z 21bodového modelu MediaPipe Hand Landmarker.
const WRIST = 0
const INDEX_MCP = 5
const MIDDLE_MCP = 9
const MIDDLE_TIP = 12
const PINKY_MCP = 17

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export interface HandGeometry {
  handType: HandTypeName
  palmRatio: number
  fingerRatio: number
}

/**
 * Typ ruky jen z geometrie bodů — poměr délky a šířky dlaně, poměr délky
 * prstu k dlani. Hraniční hodnoty (blízko prahu na obou osách) mapují na
 * "smíšená", ne na vynucený odhad jedné ze čtyř kategorií.
 */
export function classifyHandType(landmarks: Point[]): HandGeometry {
  const palmLength = distance(landmarks[WRIST], landmarks[MIDDLE_MCP])
  const palmWidth = distance(landmarks[INDEX_MCP], landmarks[PINKY_MCP])
  const fingerLength = distance(landmarks[MIDDLE_MCP], landmarks[MIDDLE_TIP])

  const palmRatio = palmLength / palmWidth
  const fingerRatio = fingerLength / palmLength

  const SQUARE_MAX = 1.15
  const SQUARE_BAND = 0.08
  const LONG_FINGERS_MIN = 0.85
  const FINGER_BAND = 0.05

  const nearPalmBoundary = Math.abs(palmRatio - SQUARE_MAX) < SQUARE_BAND
  const nearFingerBoundary = Math.abs(fingerRatio - LONG_FINGERS_MIN) < FINGER_BAND

  let handType: HandTypeName
  if (nearPalmBoundary || nearFingerBoundary) {
    handType = 'mixed'
  } else {
    const square = palmRatio <= SQUARE_MAX
    const longFingers = fingerRatio >= LONG_FINGERS_MIN
    if (square && !longFingers) handType = 'earth'
    else if (!square && !longFingers) handType = 'fire'
    else if (square && longFingers) handType = 'air'
    else handType = 'water'
  }

  return { handType, palmRatio, fingerRatio }
}
