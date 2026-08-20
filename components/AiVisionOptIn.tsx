'use client'

import { useState } from 'react'
import type { Characteristics } from '@/lib/validators/characteristics'

interface VisionResponse {
  characteristics?: Characteristics
  error?: string
  code?: string
}

const ERROR_MESSAGES: Record<string, string> = {
  AI_DISABLED: 'AI rozbor není na tomto nasazení k dispozici.',
  DAILY_CAP: 'AI rozbor je pro dnešek vyčerpaný. Zkuste to prosím zítra.',
  AI_REFUSAL: 'AI fotku odmítla vyhodnotit.',
  AI_ERROR: 'AI rozbor se nepodařilo dokončit. Zkuste to prosím znovu.',
  AI_EMPTY: 'AI rozbor nevrátil použitelný výsledek.',
  AI_INVALID: 'AI rozbor vrátil neplatná data.',
  AI_NO_DATABASE:
    'AI rozbor je teď nedostupný — nejde ověřit denní strop volání. Zkuste to prosím za chvíli, ruční doplnění funguje dál.',
  VALIDATION_ERROR: 'Požadavek se nepodařilo zpracovat. Zkuste fotku vyfotit znovu.',
  BAD_REQUEST: 'Požadavek se nepodařilo zpracovat. Zkuste fotku vyfotit znovu.',
}

/**
 * Opt-in AI rozbor: fotka se pošle na server (a odtud ke Gemini na Vertex AI) jen
 * po explicitním souhlasu — jde o biometrický údaj dle čl. 9 GDPR. Zbytek
 * aplikace (detekce v prohlížeči, ruční vyplnění) na tomhle nezávisí.
 */
export function AiVisionOptIn({
  dataUrl,
  normalizedDataUrl,
  onResult,
}: {
  dataUrl: string
  // Narovnaný výřez dlaně z normalizePalm() — když existuje, jde k AI jako
  // druhý, čitelnější obrázek vedle syrové fotky (viz app/api/vision/route.ts).
  normalizedDataUrl?: string
  onResult: (characteristics: Characteristics) => void
}) {
  const [consent, setConsent] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  async function run() {
    setLoading(true)
    setError(undefined)
    try {
      const response = await fetch('/api/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: dataUrl,
          normalizedImage: normalizedDataUrl,
          consent: true,
        }),
      })
      const data: VisionResponse = await response.json()
      if (!response.ok || !data.characteristics) {
        setError(ERROR_MESSAGES[data.code ?? ''] ?? data.error ?? 'AI rozbor selhal.')
        return
      }
      onResult(data.characteristics)
    } catch {
      setError('Server neodpovídá. Zkuste to prosím znovu.')
    } finally {
      setLoading(false)
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-sm text-palm-700 underline"
      >
        Zkusit přesnější rozbor pomocí AI
      </button>
    )
  }

  return (
    <div className="bg-white border border-palm-200 rounded-lg p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-palm-800 mb-1">AI rozbor fotografie</h3>
        <p className="text-sm text-gray-600">
          Fotografie dlaně je biometrický údaj. Odesláním na AI rozbor ji
          pošlete na server a odtud k vyhodnocení přes Gemini na Vertex AI — mimo
          tuto volbu fotka nikdy neopouští váš prohlížeč. Zpátky se vrátí jen
          znaky (typ ruky, čáry, pahorky, tvar prstů a nehtů), ne obrázek.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Fotografii neukládáme</strong> — projde serverem a zahodí se.
          Ukládá se jen záznam, že volání proběhlo (datum a čas, nic víc), aby
          se dal hlídat denní strop. Co s odeslanou fotkou dělá Google na své
          straně, se řídí podmínkami Vertex AI a my to neovlivníme.{' '}
          <a href="/privacy" className="text-palm-700 underline">
            Podrobnosti o zpracování
          </a>
        </p>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1"
        />
        <span>Souhlasím s odesláním fotografie k AI rozboru.</span>
      </label>

      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={run}
          disabled={!consent || loading}
          className="bg-palm-700 hover:bg-palm-800 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg text-sm font-semibold"
        >
          {loading ? 'Analyzuji…' : 'Spustit AI rozbor'}
        </button>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          disabled={loading}
          className="text-sm text-gray-500"
        >
          Zrušit
        </button>
      </div>
    </div>
  )
}
