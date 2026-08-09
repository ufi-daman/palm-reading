import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Čtení z dlaně - Palmistika',
  description: 'Interaktivní knihovna čtení z dlaně s osobnostní analýzou',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="bg-white">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
