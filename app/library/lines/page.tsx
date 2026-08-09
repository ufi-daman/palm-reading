import Link from 'next/link'
import { getPalmLines } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export default async function LinesPage() {
  const lines = await getPalmLines()
  const major = lines.filter((line) => line.type === 'major')
  const minor = lines.filter((line) => line.type === 'minor')

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-8">Čáry dlaně</h1>

      {[
        { title: 'Hlavní čáry', items: major },
        { title: 'Vedlejší čáry', items: minor },
      ].map((group) => (
        <section key={group.title} className="mb-10">
          <h2 className="text-2xl font-bold text-palm-800 mb-4">{group.title}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {group.items.map((line) => (
              <Link
                key={line.key}
                href={`/library/lines/${line.key}`}
                className="bg-white rounded-lg border-2 border-palm-200 hover:border-palm-500 p-5 transition"
              >
                <h3 className="text-lg font-bold text-palm-800">{line.nameCs}</h3>
                <p className="text-xs text-palm-500 mb-2">{line.nameEn}</p>
                <p className="text-gray-600 text-sm">{line.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
