import Link from 'next/link'

export function Navigation() {
  return (
    <header className="bg-palm-800 text-white print:hidden">
      <nav className="container mx-auto flex flex-wrap items-center justify-between gap-4 py-5">
        <Link href="/" className="text-2xl font-bold">
          ✋ Čtení z dlaně
        </Link>
        <div className="flex gap-6 text-sm sm:text-base">
          <Link href="/analyzer" className="hover:text-palm-200 transition">
            Analyzátor
          </Link>
          <Link href="/library" className="hover:text-palm-200 transition">
            Knihovna
          </Link>
          <Link href="/library/guide" className="hover:text-palm-200 transition">
            Průvodce
          </Link>
        </div>
      </nav>
    </header>
  )
}
