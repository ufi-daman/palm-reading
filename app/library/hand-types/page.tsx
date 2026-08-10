import Link from 'next/link'
import { getHandTypes } from '@/lib/content'

const ICONS: Record<string, string> = {
  earth: '🌍',
  fire: '🔥',
  air: '💨',
  water: '💧',
  mixed: '🔀',
}

export default function HandTypesPage() {
  const handTypes = getHandTypes()

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-3">Typy rukou</h1>
      <p className="text-palm-700 mb-8">
        Typ ruky se určuje z poměru tvaru dlaně a délky prstů. Je to první krok
        každého čtení — určuje, jak vykládat všechno ostatní.
      </p>

      <div className="space-y-6">
        {handTypes.map((type) => (
          <article
            key={type.name}
            className="bg-white rounded-xl border border-palm-200 p-6"
          >
            <h2 className="text-2xl font-bold text-palm-800 mb-1">
              {ICONS[type.name] ?? '🖐️'} {type.nameCs}
            </h2>
            <p className="text-sm text-palm-600 mb-3">Živel {type.element}</p>
            <p className="text-gray-700 mb-2">{type.description}</p>
            <p className="text-gray-700 mb-4">{type.personality}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <h3 className="font-semibold text-palm-700 text-sm mb-1">
                  Znaky
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {type.characteristics.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-palm-700 text-sm mb-1">
                  Přednosti
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {type.strengths.map((item) => (
                    <li key={item}>✅ {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-palm-700 text-sm mb-1">
                  Výzvy
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {type.challenges.map((item) => (
                    <li key={item}>⚠️ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
