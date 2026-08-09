import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const METHODS = [
  {
    href: '/analyzer/image-upload',
    icon: '📷',
    title: 'Nahrát fotografii',
    description: 'Vyfoťte dlaň a označte znaky přímo podle své ruky.',
  },
  {
    href: '/analyzer/interactive',
    icon: '🎨',
    title: 'Interaktivní čtení',
    description: 'Klikejte do diagramu dlaně a popisujte, co na ní vidíte.',
  },
  {
    href: '/analyzer/text-input',
    icon: '📝',
    title: 'Textový formulář',
    description: 'Vyberte znaky ze seznamu, bez diagramu.',
  },
]

export default function Home() {
  return (
    <>
      <Navigation />

      <main className="flex-1 bg-gradient-to-br from-palm-50 to-palm-100">
        <section className="container mx-auto py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-palm-900 mb-6">
            Co všechno je vepsané ve vaší dlani?
          </h1>
          <p className="text-lg sm:text-xl text-palm-700 mb-12 max-w-2xl mx-auto">
            Popište čáry, pahorky a tvar své ruky. Aplikace je poskládá do
            souvislého osobnostního profilu podle tradičních výkladových
            postupů.
          </p>

          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mb-12">
            {METHODS.map((method) => (
              <Link
                key={method.href}
                href={method.href}
                className="bg-palm-600 hover:bg-palm-700 text-white py-8 px-6 rounded-xl shadow-lg transition hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{method.icon}</div>
                <h2 className="text-xl font-bold mb-2">{method.title}</h2>
                <p className="text-sm text-palm-50">{method.description}</p>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/library/guide"
              className="bg-white text-palm-700 border-2 border-palm-700 px-8 py-3 rounded-lg hover:bg-palm-50 transition"
            >
              📚 Jak se čte z dlaně
            </Link>
            <Link
              href="/library"
              className="bg-white text-palm-700 border-2 border-palm-700 px-8 py-3 rounded-lg hover:bg-palm-50 transition"
            >
              🔍 Knihovna znaků
            </Link>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto grid gap-12 md:grid-cols-3 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-palm-800 mb-3">
                📖 Tradiční výklad
              </h2>
              <p className="text-gray-600">
                Klasická palmistika doplněná o novější přístupy, přeložená do
                srozumitelné češtiny.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-palm-800 mb-3">
                🎯 Skládaný výsledek
              </h2>
              <p className="text-gray-600">
                Výklad nevzniká z jednoho znaku, ale z kombinace čar, pahorků a
                typu ruky.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-palm-800 mb-3">
                🔐 Soukromí
              </h2>
              <p className="text-gray-600">
                Bez registrace. Nahrané fotografie se automaticky mažou po 30
                dnech.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
