import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function AnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-palm-50">
        <div className="container mx-auto py-10">{children}</div>
      </main>
      <Footer />
    </>
  )
}
