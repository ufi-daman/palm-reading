import { prisma } from '@/lib/db/client'

export const dynamic = 'force-dynamic'

interface DetectionEntry {
  found?: boolean
  score?: number
}

function aggregateDetection(rows: { detectionDetail: string | null }[]) {
  const perLine = new Map<string, { found: number; total: number }>()

  for (const row of rows) {
    if (!row.detectionDetail) continue
    let parsed: Record<string, DetectionEntry>
    try {
      parsed = JSON.parse(row.detectionDetail)
    } catch {
      continue
    }
    for (const [key, entry] of Object.entries(parsed)) {
      const stat = perLine.get(key) ?? { found: 0, total: 0 }
      stat.total += 1
      if (entry?.found) stat.found += 1
      perLine.set(key, stat)
    }
  }

  return Array.from(perLine.entries())
    .map(([key, stat]) => ({
      key,
      ...stat,
      rate: stat.total > 0 ? stat.found / stat.total : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

export default async function AdminStatsPage() {
  if (!prisma) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-4">Statistiky nejsou dostupné</h1>
        <p className="text-gray-600">
          Chybí proměnná <code>DATABASE_URL</code>. Aplikace jinak funguje
          normálně — statistika je jen doplňková.
        </p>
      </div>
    )
  }

  const [total, byHandType, byInputType, aiCount, recent] = await Promise.all([
    prisma.analysisStat.count(),
    prisma.analysisStat.groupBy({ by: ['handType'], _count: true }),
    prisma.analysisStat.groupBy({ by: ['inputType'], _count: true }),
    prisma.analysisStat.count({ where: { usedAi: true } }),
    prisma.analysisStat.findMany({
      select: { detectionDetail: true, linesDetected: true, linesManual: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
  ])

  const detectionStats = aggregateDetection(recent)
  const totalDetected = recent.reduce((sum, r) => sum + r.linesDetected, 0)
  const totalManual = recent.reduce((sum, r) => sum + r.linesManual, 0)

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-palm-900">Statistiky</h1>
        <p className="text-gray-600 mt-1">
          Bez osobních údajů, fotografií nebo IP adres. Slouží k ladění prahů
          detekce a přehledu o používání.
        </p>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-palm-200 p-4">
          <div className="text-3xl font-bold text-palm-800">{total}</div>
          <div className="text-sm text-gray-500">čtení celkem</div>
        </div>
        <div className="bg-white rounded-lg border border-palm-200 p-4">
          <div className="text-3xl font-bold text-palm-800">{aiCount}</div>
          <div className="text-sm text-gray-500">s AI rozborem</div>
        </div>
        <div className="bg-white rounded-lg border border-palm-200 p-4">
          <div className="text-3xl font-bold text-palm-800">{totalDetected}</div>
          <div className="text-sm text-gray-500">znaků detekováno</div>
        </div>
        <div className="bg-white rounded-lg border border-palm-200 p-4">
          <div className="text-3xl font-bold text-palm-800">{totalManual}</div>
          <div className="text-sm text-gray-500">znaků doplněno ručně</div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-palm-800 mb-3">
          Úspěšnost detekce podle čáry
        </h2>
        {detectionStats.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Zatím žádná data — detekce ještě neběžela nebo neukládá podrobnosti.
          </p>
        ) : (
          <table className="w-full text-sm bg-white rounded-lg border border-palm-200 overflow-hidden">
            <thead className="bg-palm-50 text-left">
              <tr>
                <th className="px-4 py-2">Znak</th>
                <th className="px-4 py-2">Nalezeno</th>
                <th className="px-4 py-2">Celkem pokusů</th>
                <th className="px-4 py-2">Úspěšnost</th>
              </tr>
            </thead>
            <tbody>
              {detectionStats.map((row) => (
                <tr key={row.key} className="border-t border-palm-100">
                  <td className="px-4 py-2 font-medium">{row.key}</td>
                  <td className="px-4 py-2">{row.found}</td>
                  <td className="px-4 py-2">{row.total}</td>
                  <td className="px-4 py-2">{Math.round(row.rate * 100)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-palm-800 mb-3">Podle typu ruky</h2>
          <ul className="bg-white rounded-lg border border-palm-200 divide-y divide-palm-100">
            {byHandType.map((row) => (
              <li key={row.handType} className="px-4 py-2 flex justify-between text-sm">
                <span>{row.handType}</span>
                <span className="font-medium">{row._count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-palm-800 mb-3">Podle způsobu vstupu</h2>
          <ul className="bg-white rounded-lg border border-palm-200 divide-y divide-palm-100">
            {byInputType.map((row) => (
              <li key={row.inputType} className="px-4 py-2 flex justify-between text-sm">
                <span>{row.inputType}</span>
                <span className="font-medium">{row._count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
