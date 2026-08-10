/** Minimální maticová algebra pro homografii — jen to, co potřebuje 3×3. */

export type Mat3 = number[] // řádkově, 9 čísel

export function invert3x3(m: Mat3): Mat3 {
  const [a, b, c, d, e, f, g, h, i] = m
  const A = e * i - f * h
  const B = -(d * i - f * g)
  const C = d * h - e * g
  const D = -(b * i - c * h)
  const E = a * i - c * g
  const F = -(a * h - b * g)
  const G = b * f - c * e
  const H = -(a * f - c * d)
  const I = a * e - b * d

  const det = a * A + b * B + c * C
  if (Math.abs(det) < 1e-12) throw new Error('Matice je singulární.')
  const invDet = 1 / det

  return [
    A * invDet, D * invDet, G * invDet,
    B * invDet, E * invDet, H * invDet,
    C * invDet, F * invDet, I * invDet,
  ]
}

export function apply3x3(m: Mat3, x: number, y: number): { x: number; y: number } {
  const w = m[6] * x + m[7] * y + m[8]
  return {
    x: (m[0] * x + m[1] * y + m[2]) / w,
    y: (m[3] * x + m[4] * y + m[5]) / w,
  }
}

/**
 * Řeší soustavu lineárních rovnic Ax = b Gaussovou eliminací s částečným
 * pivotováním. Pro naše použití (8×8, homografie ze 4 bodů) stačí.
 */
export function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length
  const M = A.map((row, i) => [...row, b[i]])

  for (let col = 0; col < n; col++) {
    let pivotRow = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivotRow][col])) pivotRow = row
    }
    ;[M[col], M[pivotRow]] = [M[pivotRow], M[col]]

    if (Math.abs(M[col][col]) < 1e-12) throw new Error('Soustava nemá jednoznačné řešení.')

    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const factor = M[row][col] / M[col][col]
      for (let k = col; k <= n; k++) {
        M[row][k] -= factor * M[col][k]
      }
    }
  }

  return M.map((row, i) => row[n] / row[i])
}
