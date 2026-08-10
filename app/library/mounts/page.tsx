import Link from 'next/link'
import { getMounts } from '@/lib/content'

const VALUE_LABELS: Record<string, string> = {
  small: 'Malý',
  medium: 'Střední',
  large: 'Velký',
  weak: 'Měkký',
  normal: 'Normální',
  prominent: 'Pevný',
}

export default function MountsPage() {
  const mounts = getMounts()

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-3">
        Pahorky dlaně
      </h1>
      <p className="text-palm-700 mb-8">
        Vyvýšeniny na dlani. Nahmatáte je palcem druhé ruky — porovnávejte je
        vždy s okolím téže dlaně, ne s cizí rukou.
      </p>

      <div className="space-y-6">
        {mounts.map((mount) => (
          <article
            key={mount.key}
            className="bg-white rounded-xl border border-palm-200 p-6"
          >
            <h2 className="text-2xl font-bold text-palm-800">{mount.nameCs}</h2>
            <p className="text-xs text-palm-500 mb-2">{mount.nameEn}</p>
            <p className="text-sm text-palm-600 mb-3">📍 {mount.location}</p>
            <p className="text-gray-700 mb-4">{mount.description}</p>

            <div className="grid gap-3 sm:grid-cols-3">
              {Object.entries(mount.meanings?.size ?? {}).map(
                ([value, meaning]) => (
                  <div
                    key={value}
                    className="bg-palm-50 rounded-lg p-3 border border-palm-100"
                  >
                    <h3 className="font-semibold text-palm-700 text-sm mb-1">
                      {VALUE_LABELS[value] ?? value}
                    </h3>
                    <p className="text-gray-700 text-sm">{meaning.meaning}</p>
                  </div>
                ),
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
