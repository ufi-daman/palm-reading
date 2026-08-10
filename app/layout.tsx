import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Čtení z dlaně — Palmistika',
  description:
    'Interaktivní knihovna čtení z dlaně s osobnostní analýzou. Čáry, vyvýšeniny a typy rukou vysvětlené česky.',
  // Po přidání na plochu telefonu se použije tenhle kratší název.
  applicationName: 'Čtení z dlaně',
  appleWebApp: {
    capable: true,
    title: 'Čtení z dlaně',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Barva lišty prohlížeče na mobilu — ladí s hlavičkou aplikace.
  themeColor: '#7f5620',
  // Náhled z kamery se špatně rámuje, když stránka „poskakuje" pod prstem.
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="bg-white text-gray-900">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
