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
                Fotografie dlaní
              </h2>
              <p>
                Nahrané fotografie se ukládají pouze pro potřeby vaší analýzy.
                Automaticky se mažou po 30 dnech. Nesdílíme je s třetími stranami
                a neprovádíme na nich rozpoznávání osob ani biometrické
                zpracování.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-palm-800 mb-2">Analýzy</h2>
              <p>
                Výsledky analýz se ukládají bez vazby na vaši totožnost.
                Aplikace nevyžaduje registraci ani e-mailovou adresu. Uložená
                data slouží pouze ke zobrazení výsledku a k vyhodnocení kvality
                výkladu.
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
                Máte právo požádat o výmaz svých dat. Vzhledem k tomu, že
                fotografie se mažou automaticky a analýzy nejsou spojené s vaší
                totožností, k výmazu ve většině případů dojde bez vaší
                součinnosti.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
