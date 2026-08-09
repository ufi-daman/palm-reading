import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPalmLine } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

const AXIS_TITLES: Record<string, string> = {
  strength: 'Podle výraznosti',
  length: 'Podle délky',
  quality: 'Podle průběhu',
}

const VALUE_LABELS: Record<string, string> = {
  weak: 'Slabá',
  medium: 'Střední',
  strong: 'Silná',
  short: 'Krátká',
  long: 'Dlouhá',
  clear: 'Jasná',
  broken: 'Přerušená',
  chained: 'Řetízková',
  island: 'S ostrůvkem',
}

export default async function LineDetailPage({
  params,
}: {
  params: { key: string }
}) {
  const line = await getPalmLine(params.key)
  if (!line) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/library/lines" className="text-palm-700 underline text-sm">
        ← Zpět na čáry
      </Link>

      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-1">
        {line.nameCs}
      </h1>
      <p className="text-palm-500 mb-6">{line.nameEn}</p>

      <div className="bg-white rounded-xl border border-palm-200 p-6 mb-8">
        <p className="text-gray-700 leading-relaxed mb-4">{line.description}</p>
        <h2 className="font-bold text-palm-800 mb-1">Kde ji najdete</h2>
        <p className="text-gray-700">{line.anatomy}</p>
      </div>

      {(['strength', 'length', 'quality'] as const).map((axis) => {
        const group = line.characteristics?.[axis]
        if (!group) return null
        return (
          <section key={axis} className="mb-8">
            <h2 className="text-2xl font-bold text-palm-800 mb-4">
              {AXIS_TITLES[axis]}
            </h2>
            <div className="space-y-3">
              {Object.entries(group).map(([value, meaning]) => (
                <div
                  key={value}
                  className="bg-white rounded-lg border border-palm-200 p-4"
                >
                  <h3 className="font-bold text-palm-700 mb-1">
                    {VALUE_LABELS[value] ?? value}
                  </h3>
                  <p className="text-gray-700">{meaning.meaning}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {meaning.personality}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {line.characteristics?.absent && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-palm-800 mb-4">
            Když čára chybí
          </h2>
          <div className="bg-white rounded-lg border border-palm-200 p-4">
            <p className="text-gray-700">{line.characteristics.absent.meaning}</p>
            <p className="text-gray-500 text-sm mt-1">
              {line.characteristics.absent.personality}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
