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
                server a odtud jednorázově k vyhodnocení přes Gemini na
                Vertex AI (Google Cloud). Jde o předání zvláštní kategorie
                údajů třetí straně — proto to vyžaduje samostatný, výslovný
                souhlas (zaškrtávací pole před odesláním), ne obecný souhlas
                s podmínkami užití. <strong>Na našem serveru se fotografie
                neukládá</strong> — projde pamětí a zahodí se, vrací se jen
                rozpoznané znaky. Server eviduje pouze počet volání za den
                (datum a čas volání, bez fotografie a bez obsahu), aby šlo
                hlídat bezpečnostní strop.
              </p>
              <p>
                Co se s odeslaným snímkem děje <strong>na straně Googlu</strong>,
                se řídí podmínkami Vertex AI a jeho zásadami pro uchovávání dat
                — to už není v naší moci a nemůžeme to za Google zaručit.
                Dřívější znění téhle stránky tvrdilo, že se fotka neukládá
                „ani u Google"; to jsme nemohli doložit, tak jsme to opravili.
                Pokud vám tahle nejistota vadí, AI rozbor nepoužívejte —
                aplikace bez něj funguje v plném rozsahu a fotka pak
                prohlížeč vůbec neopustí.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">
                Provozní statistiky
              </h2>
              <p>
                Po dokončení čtení se do databáze zapíše jeden řádek: typ
                ruky, způsob vstupu (fotka/ruční/text), kolik znaků našla
                detekce a kolik jich doplnil uživatel, zda se použil AI
                rozbor, spočtená míra jistoty výkladu a u fotky navíc
                rozpad úspěšnosti po jednotlivých čarách — tedy u každé
                čáry jen dvě čísla: jestli ji filtr našel a s jakým skóre.
              </p>
              <p>
                Bez fotografie, bez osobních údajů, bez IP adresy a bez
                vazby na vaši totožnost. Z uložených čísel nejde zpětně
                poskládat obrázek dlaně ani nikoho identifikovat — jsou to
                skóre filtru, ne obrys ruky. Slouží k ladění prahů detekce
                na skutečných rukou (dosud se ladily jen na dvou testovacích
                fotkách) a k přehledu o používání na chráněné stránce{' '}
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
