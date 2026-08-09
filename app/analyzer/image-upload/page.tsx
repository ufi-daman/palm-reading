import { ImageUploadAnalyzer } from '@/components/ImageUploadAnalyzer'

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
        Nahrajte fotku dlaně. Zobrazí se jako podklad pod diagramem, takže znaky
        označíte přímo podle své ruky.
      </p>
      <ImageUploadAnalyzer />
    </div>
  )
}
