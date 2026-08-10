import Link from 'next/link'
import { CHIROGNOMY, CHIROGNOMY_AXIS_LABELS } from '@/lib/content/chirognomy'

export const metadata = {
  title: 'Chirognomie — tvar ruky, prsty, nehty',
}

const VALUE_LABELS: Record<string, string> = {
  short: 'Krátké',
  normal: 'Normální',
  long: 'Dlouhé',
  wide: 'Široké',
  narrow: 'Úzké',
  pale: 'Bledá',
  ruddy: 'Zčervenalá',
  fine: 'Jemná',
  coarse: 'Hrubší',
}

export default function ChirognomyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-3">Chirognomie</h1>
      <p className="text-palm-700 mb-4">
        Čtení z tvaru ruky, prstů, nehtů a kůže — tedy ze všeho kromě čar.
        Tyhle znaky nepotřebují rozpoznávání z fotky, stačí je vyplnit ručně,
        takže fungují spolehlivě bez ohledu na kvalitu detekce.
      </p>

      <div className="bg-palm-50 border border-palm-200 rounded-lg p-4 mb-8 text-sm text-gray-700">
        <p className="mb-2">
          <strong>Co tu záměrně nenajdete.</strong> Klasické prameny u nehtů
          téměř nemluví o povaze, ale diagnostikují nemoci — plíce, srdce,
          páteř. Tyhle výklady nepřebíráme: aplikace není diagnostika a
          taková tvrzení jsou nepodložená.
        </p>
        <p>
          Nejde o naši opatrnost dodatečně přidanou k pramenům. Už Leo Markun
          k témuž v roce 1928 poznamenal, že by případný orgán raději nechal
          vyšetřit lékařem. Stejně tak vynecháváme Cheirovy morální odsudky
          odvozené z držení ruky.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(CHIROGNOMY).map(([axis, values]) => (
          <article key={axis} className="bg-white rounded-xl border border-palm-200 p-6">
            <h2 className="text-2xl font-bold text-palm-800 mb-4">
              {CHIROGNOMY_AXIS_LABELS[axis] ?? axis}
            </h2>
            <div className="space-y-4">
              {Object.entries(values).map(([value, meaning]) => (
                <div key={value} className="border-l-4 border-palm-300 pl-4">
                  <h3 className="font-bold text-palm-700 mb-1">
                    {VALUE_LABELS[value] ?? value}
                  </h3>
                  <p className="text-gray-700">{meaning.meaning}</p>
                  <p className="text-gray-500 text-sm mt-1">{meaning.personality}</p>
                  {meaning.source.length > 0 && (
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
          </article>
        ))}
      </div>
    </div>
  )
}
