/** Práh (Otsu), ztenčení (Zhang–Suen) a spojené komponenty nad odezvou hřebenového filtru. */

/** Otsuova metoda — práh, který nejlépe odděluje pozadí od hřebenů podle histogramu odezvy. */
export function otsuThreshold(response: Float32Array, bins = 256): number {
  const histogram = new Float32Array(bins)
  for (let i = 0; i < response.length; i++) {
    const bin = Math.min(bins - 1, Math.floor(response[i] * bins))
    histogram[bin]++
  }

  const total = response.length
  let sumAll = 0
  for (let i = 0; i < bins; i++) sumAll += i * histogram[i]

  let sumBackground = 0
  let weightBackground = 0
  let best = 0
  let bestVariance = 0

  for (let t = 0; t < bins; t++) {
    weightBackground += histogram[t]
    if (weightBackground === 0) continue
    const weightForeground = total - weightBackground
    if (weightForeground === 0) break

    sumBackground += t * histogram[t]
    const meanBackground = sumBackground / weightBackground
    const meanForeground = (sumAll - sumBackground) / weightForeground

    const variance = weightBackground * weightForeground * (meanBackground - meanForeground) ** 2
    if (variance > bestVariance) {
      bestVariance = variance
      best = t
    }
  }

  return best / bins
}

export function threshold(response: Float32Array, cutoff: number): Uint8Array {
  const out = new Uint8Array(response.length)
  for (let i = 0; i < response.length; i++) out[i] = response[i] >= cutoff ? 1 : 0
  return out
}

/**
 * Zhang–Suenovo ztenčení — iterativně odstraňuje okrajové pixely binárního
 * obrazu, dokud nezůstane kostra o šířce jednoho pixelu.
 */
export function zhangSuenThin(binary: Uint8Array, width: number, height: number): Uint8Array {
  const img = new Uint8Array(binary)
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= width || y >= height ? 0 : img[y * width + x])

  let changed = true
  while (changed) {
    changed = false

    for (const step of [0, 1]) {
      const toRemove: number[] = []

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          if (!at(x, y)) continue

          const p2 = at(x, y - 1)
          const p3 = at(x + 1, y - 1)
          const p4 = at(x + 1, y)
          const p5 = at(x + 1, y + 1)
          const p6 = at(x, y + 1)
          const p7 = at(x - 1, y + 1)
          const p8 = at(x - 1, y)
          const p9 = at(x - 1, y - 1)

          const neighbors = [p2, p3, p4, p5, p6, p7, p8, p9]
          const B = neighbors.reduce((a, b) => a + b, 0)
          if (B < 2 || B > 6) continue

          let A = 0
          for (let k = 0; k < 8; k++) {
            if (neighbors[k] === 0 && neighbors[(k + 1) % 8] === 1) A++
          }
          if (A !== 1) continue

          if (step === 0) {
            if (p2 * p4 * p6 !== 0) continue
            if (p4 * p6 * p8 !== 0) continue
          } else {
            if (p2 * p4 * p8 !== 0) continue
            if (p2 * p6 * p8 !== 0) continue
          }

          toRemove.push(y * width + x)
        }
      }

      if (toRemove.length > 0) {
        changed = true
        for (const index of toRemove) img[index] = 0
      }
    }
  }

  return img
}

export interface Component {
  pixels: { x: number; y: number }[]
}

/**
 * Kratší útvary se zahazují. Hlavní čáry mají v rámci 512×512 přes 150
 * pixelů, vedlejší přes 50. Původní hodnota 6 propouštěla každý úlomek
 * kožní vrásky — na reálné fotce jich vzniklo přes sto a zóny se pak
 * plnily šumem.
 */
const MIN_COMPONENT_SIZE = 40

/** 8-souvislé komponenty kostry, s odfiltrováním drobného šumu. */
export function connectedComponents(skeleton: Uint8Array, width: number, height: number): Component[] {
  const visited = new Uint8Array(skeleton.length)
  const components: Component[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (!skeleton[start] || visited[start]) continue

      const pixels: { x: number; y: number }[] = []
      const stack = [{ x, y }]
      visited[start] = 1

      while (stack.length > 0) {
        const point = stack.pop()!
        pixels.push(point)

        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = point.x + dx
            const ny = point.y + dy
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
            const index = ny * width + nx
            if (skeleton[index] && !visited[index]) {
              visited[index] = 1
              stack.push({ x: nx, y: ny })
            }
          }
        }
      }

      if (pixels.length >= MIN_COMPONENT_SIZE) components.push({ pixels })
    }
  }

  return components
}
