'use client'

import { useState } from 'react'
import { AnalyzerWizard } from './AnalyzerWizard'

export function ImageUploadAnalyzer() {
  const [preview, setPreview] = useState<string>()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(undefined)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Nahrání se nezdařilo.')
        return
      }
      setPreview(data.previewUrl)
    } catch {
      setError('Server neodpovídá. Zkuste to prosím znovu.')
    } finally {
      setUploading(false)
    }
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="bg-palm-100 border border-palm-300 rounded-lg px-4 py-3 text-palm-800 text-sm">
          Fotografie je nahraná a zobrazí se pod diagramem. Podle ní teď označte
          jednotlivé znaky.{' '}
          <button
            type="button"
            onClick={() => setPreview(undefined)}
            className="underline"
          >
            Nahrát jinou
          </button>
        </div>
        <AnalyzerWizard
          variant="interactive"
          backgroundImage={preview}
          imageUrl={preview}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-palm-200 p-8">
      <h2 className="text-2xl font-bold text-palm-800 mb-2">
        Nahrajte fotografii dlaně
      </h2>
      <p className="text-gray-600 mb-6">
        Vyfoťte otevřenou dlaň za denního světla, ideálně shora a bez stínů.
        Podporujeme JPG, PNG a WebP do 5 MB.
      </p>

      <label className="block border-2 border-dashed border-palm-300 rounded-lg p-10 text-center cursor-pointer hover:border-palm-500 transition">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="sr-only"
          disabled={uploading}
        />
        <span className="text-4xl block mb-3">📷</span>
        <span className="text-palm-700 font-semibold">
          {uploading ? 'Nahrávám…' : 'Vyberte soubor nebo ho sem přetáhněte'}
        </span>
      </label>

      {error && (
        <p className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Fotografie se automaticky smaže po 30 dnech a nikdy ji nesdílíme s
        třetími stranami.
      </p>
    </div>
  )
}
