import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto bg-palm-900 text-white print:hidden">
      <div className="container mx-auto py-10">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold mb-3">⚠️ Právní upozornění</h2>
          <p className="text-sm text-palm-100 mb-3">
            Tato aplikace slouží k zábavě a vzdělávání. Nejde o lékařskou ani
            psychologickou diagnostiku, o proroctví ani o odborné poradenství.
            Výsledky jsou subjektivní výklad tradičních metod.
          </p>
          <p className="text-xs text-palm-200">
            Neodpovídáme za rozhodnutí učiněná na základě této analýzy.
          </p>
        </div>
        <div className="border-t border-palm-700 mt-8 pt-6 text-sm text-palm-200 flex flex-wrap gap-4">
          <span>© 2026 Čtení z dlaně</span>
          <Link href="/privacy" className="hover:text-white">
            Ochrana údajů
          </Link>
          <Link href="/terms" className="hover:text-white">
            Podmínky užití
          </Link>
        </div>
      </div>
    </footer>
  )
}
