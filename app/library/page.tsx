import Link from 'next/link'
import { getHandTypes, getMounts, getPalmLines } from '@/lib/content'

export default function LibraryHub() {
  const lines = getPalmLines()
  const mounts = getMounts()
  const handTypes = getHandTypes()

  const sections = [
    {
      href: '/library/lines',
      icon: '➰',
      title: 'Čáry dlaně',
      count: lines.length,
      description:
        'Hlavní i vedlejší čáry, jejich průběh a co znamenají jejich varianty.',
    },
    {
      href: '/library/mounts',
      icon: '⛰️',
      title: 'Pahorky dlaně',
      count: mounts.length,
      description:
        'Vyvýšeniny pod prsty a na okrajích dlaně a jejich výklad podle velikosti.',
    },
    {
      href: '/library/hand-types',
      icon: '🖐️',
      title: 'Typy rukou',
      count: handTypes.length,
      description:
        'Rozdělení podle živlů — tvar dlaně a délka prstů jako základ celého čtení.',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-palm-900 mb-3">Knihovna</h1>
      <p className="text-lg text-palm-700 mb-10">
        Referenční přehled znaků dlaně. Každý znak má vlastní stránku s popisem
        i výkladem jednotlivých variant.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="bg-white rounded-xl border-2 border-palm-200 hover:border-palm-500 p-6 transition"
          >
            <div className="text-4xl mb-3">{section.icon}</div>
            <h2 className="text-xl font-bold text-palm-800">{section.title}</h2>
            <p className="text-sm text-palm-600 mb-2">{section.count} položek</p>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-xl border border-palm-200 p-6">
        <h2 className="text-xl font-bold text-palm-800 mb-2">
          Nevíte, kde začít?
        </h2>
        <p className="text-gray-600 mb-4">
          Průvodce vysvětlí základní postup čtení krok za krokem.
        </p>
        <Link
          href="/library/guide"
          className="inline-block bg-palm-700 hover:bg-palm-800 text-white px-6 py-2 rounded-lg"
        >
          Otevřít průvodce
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-600 text-center">
        Odkud výklad vychází?{' '}
        <Link href="/library/sources" className="text-palm-700 underline">
          Prameny znalostní báze
        </Link>
      </p>
    </div>
  )
}
