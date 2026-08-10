'use client'

export interface AnalysisResult {
  analysisId: string
  inputType: string
  personality: string
  strengths: string[]
  challenges: string[]
  guidance: string
  confidence: number
  matchedCombinations: number
  highlights: {
    category: string
    label: string
    detail: string
    meaning: string
    personality: string
  }[]
  alternatives: { personality: string; confidence: number }[]
}

export function ResultCard({ result }: { result: AnalysisResult }) {
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <article className="bg-white rounded-xl shadow-lg border border-palm-200 overflow-hidden">
      <header className="bg-palm-700 text-white px-6 py-5">
        <h2 className="text-2xl font-bold">Vaše čtení z dlaně</h2>
        <p className="text-sm text-palm-100 mt-1">
          Jistota výkladu {confidencePercent} % · nalezeno{' '}
          {result.matchedCombinations} odpovídajících kombinací
        </p>
        <div
          className="mt-3 h-2 bg-palm-900 rounded-full overflow-hidden"
          role="img"
          aria-label={`Jistota výkladu ${confidencePercent} procent`}
        >
          <div
            className="h-full bg-palm-300"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </header>

      <div className="px-6 py-6 space-y-8">
        <section>
          <h3 className="text-lg font-bold text-palm-800 mb-2">Osobnost</h3>
          <p className="text-gray-700 leading-relaxed">{result.personality}</p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h3 className="text-lg font-bold text-palm-800 mb-2">Přednosti</h3>
            <ul className="space-y-1 text-gray-700">
              {result.strengths.map((item) => (
                <li key={item}>✅ {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-palm-800 mb-2">Výzvy</h3>
            <ul className="space-y-1 text-gray-700">
              {result.challenges.map((item) => (
                <li key={item}>⚠️ {item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-palm-50 border border-palm-200 rounded-lg p-5">
          <h3 className="text-lg font-bold text-palm-800 mb-2">Doporučení</h3>
          <p className="text-gray-700 leading-relaxed">{result.guidance}</p>
        </section>

        {result.highlights.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-palm-800 mb-3">
              Rozbor jednotlivých znaků
            </h3>
            <ul className="space-y-3">
              {result.highlights.map((item, index) => (
                <li
                  key={`${item.label}-${item.detail}-${index}`}
                  className="border-l-4 border-palm-300 pl-4 py-1"
                >
                  <p className="text-sm font-semibold text-palm-800">
                    {item.label}
                    {item.detail && (
                      <span className="font-normal text-palm-600">
                        {' '}
                        · {item.detail}
                      </span>
                    )}
                  </p>
                  {/* Pořadí není kosmetika: `personality` říká, co znak
                      znamená pro čtenáře, `meaning` jen popisuje jeho tvar.
                      Popis jako první četl uživatel právem jako „obecný
                      poznatek o čáře, nikoliv význam zjištění" — proto vede
                      výklad a popis je až podklad pod ním. */}
                  {item.personality && (
                    <p className="text-gray-800">{item.personality}</p>
                  )}
                  {item.meaning && item.meaning !== item.personality && (
                    <p className="text-gray-500 text-sm mt-1">
                      <span className="text-palm-500">Proč: </span>
                      {item.meaning}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.alternatives.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-palm-800 mb-3">
              Další možné výklady
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              {result.alternatives.map((item, index) => (
                <li key={index}>{item.personality}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
