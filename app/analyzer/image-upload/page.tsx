import { PhotoFirstFlow } from '@/components/PhotoFirstFlow'

export const metadata = {
  title: 'Čtení z dlaně z fotografie',
}

export default function ImageUploadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-palm-900 mb-3">
        Čtení z fotografie
      </h1>
      <p className="text-palm-700 mb-8">
        Vyfoťte dlaň a čtení se sestaví automaticky z toho, co se na fotce
        rozpozná. Cokoliv chcete upřesnit, doplníte pod výsledkem.
      </p>
      <PhotoFirstFlow />
    </div>
  )
}
