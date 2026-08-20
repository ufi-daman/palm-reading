import Link from 'next/link'
import { getMounts } from '@/lib/content'

const AXIS_TITLES = {
  size: 'Podle velikosti',
  strength: 'Podle pevnosti',
} as const

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
        vždy s okolím téže dlaně, ne s cizí rukou. Každý pahorek se čte ve
        dvou osách: jak je <strong>velký</strong> a jak je <strong>pevný</strong>.
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
            <p className="text-gray-700 mb-5">{mount.description}</p>

            {(['size', 'strength'] as const).map((axis) => {
              const group = mount.meanings?.[axis]
              if (!group) return null
              return (
                <section key={axis} className="mb-5 last:mb-0">
                  <h3 className="font-bold text-palm-700 text-sm uppercase tracking-wide mb-2">
                    {AXIS_TITLES[axis]}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {Object.entries(group).map(([value, meaning]) => (
                      <div
                        key={value}
                        className="bg-palm-50 rounded-lg p-3 border border-palm-100"
                      >
                        <h4 className="font-semibold text-palm-700 text-sm mb-1">
                          {VALUE_LABELS[value] ?? value}
                        </h4>
                        <p className="text-gray-700 text-sm">{meaning.meaning}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {meaning.personality}
                        </p>
                        {meaning.source && meaning.source.length > 0 && (
                          <p className="text-xs text-palm-400 mt-2">
                            Zdroj:{' '}
                            {meaning.source
                              .map((s) => `${s.work} (${s.year}) — ${s.locator}`)
                              .join('; ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </article>
        ))}
      </div>
    </div>
  )
}
