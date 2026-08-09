import { AnalyzerWizard } from '@/components/AnalyzerWizard'

export const metadata = {
  title: 'Čtení z dlaně — textový formulář',
}

export default function TextInputAnalyzerPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-palm-900 mb-3">Textový formulář</h1>
      <p className="text-palm-700 mb-8">
        Vyberte čáry a pahorky ze seznamu a popište je. Vyplnit stačí ty, které
        na své dlani rozeznáte.
      </p>
      <AnalyzerWizard variant="text" />
    </div>
  )
}
