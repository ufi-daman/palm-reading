import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-palm-50 to-palm-100">
      {/* Header */}
      <header className="bg-palm-800 text-white py-8">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">✋ Čtení z dlaně</h1>
          <div className="space-x-6">
            <Link href="/library" className="hover:text-palm-200 transition">
              Knihovna
            </Link>
            <Link href="/analyzer" className="hover:text-palm-200 transition">
              Analizátor
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-5xl font-bold text-palm-900 mb-6">
          Jaká je vaše budoucnost ve vaší dlani?
        </h2>
        <p className="text-xl text-palm-700 mb-12 max-w-2xl mx-auto">
          Objevte starobylé umění čtení z dlaně. Analyzujte své vlastnosti ruky
          a získejte osobnostní profil s podrobnými interpretacemi.
        </p>

        {/* Main CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <Link
            href="/analyzer/image-upload"
            className="bg-palm-600 hover:bg-palm-700 text-white py-8 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-xl font-bold mb-2">Nahrát fotografii</h3>
            <p className="text-sm">Nahrajte fotku vaší ruky a označte charakteristiky</p>
          </Link>

          <Link
            href="/analyzer/interactive"
            className="bg-palm-600 hover:bg-palm-700 text-white py-8 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Interaktivní čtení</h3>
            <p className="text-sm">Klikejte na interaktivní diagram a vybírejte vlastnosti</p>
          </Link>

          <Link
            href="/analyzer/text-input"
            className="bg-palm-600 hover:bg-palm-700 text-white py-8 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
          >
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">Textový formulář</h3>
            <p className="text-sm">Popište své charakteristiky pomocí formuláře</p>
          </Link>
        </div>

        {/* Secondary CTA */}
        <div className="space-x-4">
          <Link
            href="/library/guide"
            className="inline-block bg-white text-palm-700 border-2 border-palm-700 px-8 py-3 rounded-lg hover:bg-palm-50 transition"
          >
            📚 Co je čtení z dlaně?
          </Link>
          <Link
            href="/library/lines"
            className="inline-block bg-white text-palm-700 border-2 border-palm-700 px-8 py-3 rounded-lg hover:bg-palm-50 transition"
          >
            🔍 Referenční kniha
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-bold text-palm-800 mb-4">📖 Tradiční znalosti</h4>
              <p className="text-gray-600">
                Založeno na klasické palmistice kombinované s moderními poznatky
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-palm-800 mb-4">🎯 Detailná analýza</h4>
              <p className="text-gray-600">
                Komplexní analýza čar, vyvýšenin a typů rukou
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-palm-800 mb-4">🔐 Soukromí</h4>
              <p className="text-gray-600">
                Vaše data nejsou ukládána, fotografie se brzy maže
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Notice */}
      <footer className="bg-palm-900 text-white py-12">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h3 className="text-lg font-bold mb-4">⚠️ Právní upozornění</h3>
            <p className="text-sm text-palm-100 mb-2">
              Tato aplikace je určena pouze pro zábavné a vzdělávací účely.
            </p>
            <ul className="text-sm text-palm-100 space-y-1 mb-4">
              <li>❌ Nejedná se o lékařský poradce</li>
              <li>❌ Nejedná se o psychologickou diagnostiku</li>
              <li>❌ Nejedná se o věštbu nebo pronárodění</li>
            </ul>
            <p className="text-xs text-palm-200">
              Neodpovídáme za rozhodnutí učiněná na základě této analýzy.
            </p>
          </div>
          <div className="border-t border-palm-700 mt-8 pt-8 text-sm text-palm-200">
            <p>© 2026 Čtení z dlaně | <Link href="/privacy" className="hover:text-white">Ochrana údajů</Link> | <Link href="/terms" className="hover:text-white">Podmínky užití</Link></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
