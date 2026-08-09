import Link from 'next/link'

export const metadata = {
  title: 'Průvodce čtením z dlaně',
}

const STEPS = [
  {
    title: '1. Vyberte ruku',
    body: 'Tradice říká, že nedominantní ruka ukazuje vrozené dispozice a dominantní to, co jste s nimi udělali. Pro první čtení použijte dominantní ruku — tu, kterou píšete.',
  },
  {
    title: '2. Určete typ ruky',
    body: 'Porovnejte délku dlaně a délku prstů. Čtvercová dlaň s krátkými prsty je Země, obdélníková s krátkými prsty Oheň, čtvercová s dlouhými prsty Vzduch a obdélníková s dlouhými prsty Voda. Když si nejste jistí, jde nejspíš o smíšenou ruku.',
  },
  {
    title: '3. Najděte hlavní čáry',
    body: 'Čára srdce vede nejvýš napříč dlaní, čára hlavy pod ní a čára života obtáčí kořen palce. Svislá čára středem dlaně je čára osudu — ta u mnoha lidí chybí a není to nic špatného.',
  },
  {
    title: '4. Popište, jak čáry vypadají',
    body: 'U každé čáry si všímejte tří věcí: jak je výrazná, jak je dlouhá a jestli je souvislá. Přerušení, řetízkování ani ostrůvky nejsou předpovědí neštěstí — popisují období, kdy bylo nebo je potřeba víc síly.',
  },
  {
    title: '5. Nahmatejte pahorky',
    body: 'Vyvýšeniny pod prsty a na okrajích dlaně nahmatáte palcem druhé ruky. Porovnávejte je vždy mezi sebou v rámci jedné dlaně — velikost sama o sobě nic neznamená.',
  },
  {
    title: '6. Skládejte, nečtěte izolovaně',
    body: 'Jednotlivý znak nikdy nedává celý obraz. Smysl vzniká až v kombinaci — silná čára hlavy znamená něco jiného na ruce Země a něco jiného na ruce Vody.',
  },
]

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/library" className="text-palm-700 underline text-sm">
        ← Zpět do knihovny
      </Link>
      <h1 className="text-4xl font-bold text-palm-900 mt-3 mb-3">
        Průvodce čtením z dlaně
      </h1>
      <p className="text-lg text-palm-700 mb-8">
        Šest kroků, které stačí k prvnímu vlastnímu čtení.
      </p>

      <div className="space-y-5">
        {STEPS.map((step) => (
          <section
            key={step.title}
            className="bg-white rounded-xl border border-palm-200 p-6"
          >
            <h2 className="text-xl font-bold text-palm-800 mb-2">
              {step.title}
            </h2>
            <p className="text-gray-700 leading-relaxed">{step.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-palm-100 border border-palm-300 rounded-xl p-6">
        <h2 className="text-xl font-bold text-palm-800 mb-2">
          Jak brát výsledky
        </h2>
        <p className="text-palm-800">
          Čtení z dlaně je tradiční výkladová technika, ne měření. Nepředpovídá
          budoucnost a nenahrazuje lékaře ani psychologa. Berte ho jako podnět k
          přemýšlení o sobě — nic víc a nic míň.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/analyzer"
          className="inline-block bg-palm-700 hover:bg-palm-800 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Zkusit vlastní čtení
        </Link>
      </div>
    </div>
  )
}
