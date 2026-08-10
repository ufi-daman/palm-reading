import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Podmínky užití',
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-palm-50">
        <div className="container mx-auto py-10 max-w-3xl">
          <h1 className="text-4xl font-bold text-palm-900 mb-8">
            Podmínky užití
          </h1>

          <div className="bg-white rounded-xl border border-palm-200 p-8 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                K čemu aplikace slouží
              </h2>
              <p>
                Aplikace zpřístupňuje tradiční výkladové postupy čtení z dlaně
                pro zábavu a vzdělávání. Výsledky jsou výkladem, nikoli měřením
                nebo předpovědí.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Čím aplikace není
              </h2>
              <ul className="space-y-1">
                <li>❌ Není lékařskou ani psychologickou diagnostikou.</li>
                <li>❌ Není proroctvím ani předpovědí budoucnosti.</li>
                <li>❌ Není odborným právním, finančním ani zdravotním poradenstvím.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Odpovědnost
              </h2>
              <p>
                Neodpovídáme za rozhodnutí učiněná na základě výsledků analýzy.
                Máte-li zdravotní nebo psychické potíže, obraťte se na
                odborníka.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Fotografovaný obsah
              </h2>
              <p>
                Fotografujte pouze vlastní ruce, případně ruce osob, které
                vám k tomu daly souhlas. Fotografie se ve výchozím stavu
                zpracuje jen ve vašem prohlížeči; na server jde jen pokud si
                výslovně vyžádáte AI rozbor (viz{' '}
                <a href="/privacy" className="text-palm-700 underline">
                  ochrana osobních údajů
                </a>
                ).
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
