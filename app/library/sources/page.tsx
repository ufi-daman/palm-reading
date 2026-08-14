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
          <strong>Co z pramenů vědomě nepřebíráme.</strong> U vedlejších
          znaků Cheiro z velké části přestává popisovat povahu a přechází
          k věštění: z cestovních čar odečítá konkrétní cesty a nehody,
          z vztahových čar rozvody, úmrtí partnera a data událostí,
          o Saturnově prstenu píše, že jeho nositel skončí v bídě.
          Přebíráme z těchto kapitol jen to, co vypovídá o povaze.
        </p>
        <p>
          Dva znaky proto v knihovně nenajdete vůbec, protože po tomhle
          řezu z nich nezbylo nic: <strong>čáry dětí</strong> (Cheiro z nich
          odečítá počet a pohlaví dětí a u jedné varianty tvrdí, že dítě
          nedospěje) a <strong>náramky</strong> (legenda o zdraví, bohatství
          a štěstí plus tvrzení o neplodnosti žen). Stejně tak vynecháváme
          jeho lékařská tvrzení — o závislostech a duševních nemocech.
        </p>
        <p>
          <strong>Stav zpracování:</strong> páteří báze zůstává Cheiro
          (nejsystematičtější popis čar, pahorků a typů rukou ze čtyř
          pramenů) — u čar a pahorků z něj vychází naprostá většina
          významů. Dale a Markun jsou dotažení jako křížová kontrola:
          na 23 místech (8 u čar, 15 u pahorků), kde se věcně shodují nebo
          smysluplně rozcházejí s Cheirem, je to u dané položky vidět
          jmenovitě v textu. Většina obou knih ale byla nepoužitelná —
          Dale je z velké části čistě astrologický a fatalistický
          (předpovědi nemocí, smrti, bohatství podle planet), Markun celou
          tradici otevřeně ironizuje jako „pseudo-vědu" a jeho kapitoly
          o čarách jsou skoro výhradně diagnostika nemocí a konkrétní
          předpovědi — přebíráme z něj tedy věcné shrnutí tradice, ne jeho
          osobní přesvědčení (žádné nemá). Čar je <strong>14</strong> —
          osm hlavních a šest vedlejších. <strong>Benham</strong> je sken
          (670 stran) a potřebuje OCR — rozjeté: pahorek Jupitera už má
          citace z jeho kapitoly, zbylých šest pahorků a celá část o čarách
          čekají jako navazující práce, stejně jako{' '}
          <strong>znamení</strong> (kříž, hvězda, čtverec, ostrov…).
        </p>
      </div>
    </div>
  )
}
