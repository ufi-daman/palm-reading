import Link from 'next/link'
import { BIBLIOGRAPHY } from '@/lib/content/sources'

export const metadata = {
  title: 'Prameny',
}

export default function SourcesPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-3">Prameny</h1>
      <p className="text-palm-700 mb-8">
        Znalostní báze vychází ze čtyř volných děl (autorská práva vypršela,
        všechna vydána před rokem 1929). Text jsme přeložili a přepsali
        vlastními slovy — nejde o doslovný překlad — ale každé tvrzení jde
        dohledat ke konkrétní kapitole u konkrétního díla. Odkaz na zdroj
        najdete u každého znaku v knihovně.
      </p>

      <div className="space-y-4 mb-8">
        {BIBLIOGRAPHY.map((entry) => (
          <article key={entry.work} className="bg-white rounded-xl border border-palm-200 p-6">
            <h2 className="text-xl font-bold text-palm-800">{entry.work}</h2>
            <p className="text-sm text-palm-600 mb-2">
              {entry.author} · {entry.year}
              {entry.gutenbergId && ` · Project Gutenberg #${entry.gutenbergId}`}
            </p>
            <p className="text-gray-700">{entry.note}</p>
          </article>
        ))}
      </div>

      <div className="bg-palm-50 border border-palm-200 rounded-lg p-5 text-sm text-gray-700 space-y-2">
        <p>
          <strong>Kde se prameny rozcházejí</strong> — a stává se to často —
          uvádíme obě čtení s tím, který pramen za kterým stojí, ne
          sloučené do jednoho tvrzení, které neříká ani jeden z nich.
        </p>
        <p>
          <strong>Stav zpracování:</strong> čáry, pahorky a typy rukou
          v knihovně čerpají zatím hlavně z Cheira (nejsystematičtější a
          nejobsáhlejší popis těchto tří oblastí ze čtyř pramenů).
          Křížové porovnání s Benhamem, Dale a Markunem, rozšíření na
          vedlejší čáry nad rámec současných osmi a doplnění chirognomie a
          znamení jsou navazující práce.
        </p>
      </div>
    </div>
  )
}
