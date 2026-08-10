import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Ochrana osobních údajů',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-palm-50">
        <div className="container mx-auto py-10 max-w-3xl">
          <h1 className="text-4xl font-bold text-palm-900 mb-8">
            Ochrana osobních údajů
          </h1>

          <div className="bg-white rounded-xl border border-palm-200 p-8 space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Fotografie dlaně je biometrický údaj
              </h2>
              <p>
                Fotografie ruky je podle čl. 9 GDPR zvláštní kategorií
                osobních údajů. Ve výchozím stavu se zpracuje výhradně ve
                vašem prohlížeči — rozpoznání typu ruky a čar (MediaPipe a
                vlastní filtry v <code>lib/vision/</code>) běží lokálně na
                vašem zařízení. Fotografie se v tomto režimu{' '}
                <strong>nikdy neodesílá na server</strong>, na síťové vrstvě
                to lze ověřit: požadavek na <code>/api/analyze</code>{' '}
                obsahuje jen vyplněné znaky (typ ruky, čáry, pahorky), nikdy
                obrázek.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Volitelný AI rozbor
              </h2>
              <p>
                Pokud si výslovně vyžádáte AI rozbor (tlačítko „Zkusit
                přesnější rozbor pomocí AI“), fotografie se pošle na náš
                server a odtud jednorázově k vyhodnocení přes Anthropic API.
                Jde o předání zvláštní kategorie údajů třetí straně — proto
                to vyžaduje samostatný, výslovný souhlas (zaškrtávací pole
                před odesláním), ne obecný souhlas s podmínkami užití.
                Fotografie se při tom nikde neukládá — ani na našem serveru,
                ani u Anthropic — vrací se jen rozpoznané znaky. Server
                eviduje pouze počet volání za den (bez fotografie, bez
                obsahu), aby šlo hlídat bezpečnostní strop.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Provozní statistiky
              </h2>
              <p>
                Po dokončení čtení se do databáze zapíše jeden řádek: typ
                ruky, způsob vstupu (fotka/ruční/text), kolik znaků našla
                detekce a kolik jich doplnil uživatel, a zda se použil AI
                rozbor. Bez fotografie, bez osobních údajů, bez IP adresy a
                bez vazby na vaši totožnost — slouží jen k ladění prahů
                detekce a přehledu o používání na chráněné stránce{' '}
                <code>/admin/stats</code>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">Cookies</h2>
              <p>
                Nepoužíváme sledovací ani reklamní cookies. Aplikace ukládá
                pouze technické údaje nezbytné pro svůj běh.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Vaše práva
              </h2>
              <p>
                Aplikace nevyžaduje registraci ani e-mailovou adresu a
                statistiky nejsou spojené s vaší totožností, takže je nelze
                dohledat ani smazat jmenovitě — nevznikají v podobě, která by
                to umožňovala. Fotografii máte plně pod kontrolou: dokud
                nezvolíte AI rozbor, neopustí váš prohlížeč vůbec.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
