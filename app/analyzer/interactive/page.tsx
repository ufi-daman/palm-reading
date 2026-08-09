import { AnalyzerWizard } from '@/components/AnalyzerWizard'

export const metadata = {
  title: 'Interaktivní čtení z dlaně',
}

export default function InteractiveAnalyzerPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-palm-900 mb-3">
        Interaktivní čtení
      </h1>
      <p className="text-palm-700 mb-8">
        Projděte pět kroků. U čar a pahorků klikejte přímo do diagramu — co
        vyplníte, ztmavne.
      </p>
      <AnalyzerWizard variant="interactive" />
    </div>
  )
}
