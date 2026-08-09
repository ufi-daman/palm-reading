import Link from 'next/link'

const METHODS = [
  {
    href: '/analyzer/interactive',
    icon: '🎨',
    title: 'Interaktivní čtení',
    description:
      'Klikáte přímo do diagramu dlaně a u každé čáry i pahorku popíšete, jak vypadá. Nejnázornější cesta.',
    recommended: true,
  },
  {
    href: '/analyzer/image-upload',
    icon: '📷',
    title: 'Nahrát fotografii',
    description:
      'Nahrajete fotku dlaně, ta se zobrazí pod diagramem a vy podle ní označíte jednotlivé znaky.',
    recommended: false,
  },
  {
    href: '/analyzer/text-input',
    icon: '📝',
    title: 'Textový formulář',
    description:
      'Bez diagramu — vyberete čáry a pahorky ze seznamu. Vhodné, když víte, co hledáte.',
    recommended: false,
  },
]

export default function AnalyzerHub() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-palm-900 mb-3">Analyzátor dlaně</h1>
      <p className="text-lg text-palm-700 mb-10">
        Vyberte způsob, jakým chcete svou dlaň popsat. Všechny tři vedou ke
        stejnému výsledku — liší se jen ovládáním.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {METHODS.map((method) => (
          <Link
            key={method.href}
            href={method.href}
            className="bg-white rounded-xl border-2 border-palm-200 hover:border-palm-500 p-6 transition shadow-sm hover:shadow-md"
          >
            <div className="text-4xl mb-3">{method.icon}</div>
            <h2 className="text-xl font-bold text-palm-800 mb-2">
              {method.title}
              {method.recommended && (
                <span className="ml-2 align-middle text-xs bg-palm-100 text-palm-700 px-2 py-1 rounded-full">
                  doporučeno
                </span>
              )}
            </h2>
            <p className="text-gray-600 text-sm">{method.description}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-gray-600">
        Nevíte, co která čára znamená? Začněte{' '}
        <Link href="/library/guide" className="text-palm-700 underline">
          průvodcem čtením z dlaně
        </Link>
        .
      </p>
    </div>
  )
}
