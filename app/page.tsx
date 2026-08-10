import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { PhotoFirstFlow } from '@/components/PhotoFirstFlow'

export default function Home() {
  return (
    <>
      <Navigation />

      <main className="flex-1 bg-gradient-to-br from-palm-50 to-palm-100">
        <section className="container mx-auto pt-16 pb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-palm-900 mb-4">
            Co všechno je vepsané ve vaší dlani?
          </h1>
          <p className="text-lg text-palm-700 mb-2 max-w-2xl mx-auto">
            Vyfoťte dlaň — čtení se sestaví rovnou z toho, co se na fotce
            rozpozná.
          </p>
          <p className="text-sm text-palm-600 max-w-2xl mx-auto">
            Fotografie zůstává ve vašem prohlížeči a nikdy se neodesílá na
            server.
          </p>
        </section>

        <section className="container mx-auto pb-16 max-w-2xl">
          <PhotoFirstFlow />
        </section>

        <section className="bg-white py-14 border-t border-palm-100">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-xl font-bold text-palm-800 mb-2">
              Bez focení nebo bez kamery?
            </h2>
            <p className="text-gray-600 mb-6">
              Stejný výklad jde sestavit i ručně — klikáním do diagramu nebo
              výběrem ze seznamu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/analyzer/interactive"
                className="bg-white text-palm-700 border-2 border-palm-700 px-6 py-3 rounded-lg hover:bg-palm-50 transition"
              >
                🎨 Interaktivní diagram
              </Link>
              <Link
                href="/analyzer/text-input"
                className="bg-white text-palm-700 border-2 border-palm-700 px-6 py-3 rounded-lg hover:bg-palm-50 transition"
              >
                📝 Textový formulář
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-palm-50 py-14">
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
                Fotografie se zpracuje jen ve vašem prohlížeči. Na server jde
                jen výsledek rozpoznávání, nikdy obrázek samotný.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-10 text-center">
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
      </main>

      <Footer />
    </>
  )
}
