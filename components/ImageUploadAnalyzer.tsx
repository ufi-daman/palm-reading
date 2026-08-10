'use client'

import { useState } from 'react'
import { AnalyzerWizard } from './AnalyzerWizard'

const MAX_DIMENSION = 1568
const JPEG_QUALITY = 0.85

/**
 * Zmenší fotku přímo v prohlížeči přes canvas. Soubor nikdy neopustí
 * zařízení — na server jde jen výsledek vyplnění, ne obrázek.
 */
function resizeInBrowser(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas není podporován.'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Obrázek se nepodařilo načíst.'))
    }

    img.src = objectUrl
  })
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 15 * 1024 * 1024 // vstupní soubor, před zmenšením

export function ImageUploadAnalyzer() {
  const [preview, setPreview] = useState<string>()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string>()

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(undefined)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Nepodporovaný formát. Použijte JPG, PNG nebo WebP.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Soubor je příliš velký (maximum 15 MB).')
      return
    }

    setProcessing(true)
    try {
      const dataUrl = await resizeInBrowser(file)
      setPreview(dataUrl)
    } catch {
      setError('Obrázek se nepodařilo zpracovat. Zkuste jiný soubor.')
    } finally {
      setProcessing(false)
    }
  }

  if (preview) {
    return (
      <div className="space-y-6">
        <div className="bg-palm-100 border border-palm-300 rounded-lg px-4 py-3 text-palm-800 text-sm">
          Fotografie zůstává jen ve vašem prohlížeči a slouží jako podklad pod
          diagramem. Podle ní teď označte jednotlivé znaky.{' '}
          <button
            type="button"
            onClick={() => setPreview(undefined)}
            className="underline"
          >
            Nahrát jinou
          </button>
        </div>
        <AnalyzerWizard variant="interactive" backgroundImage={preview} hasPhoto />
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
        Podporujeme JPG, PNG a WebP.
      </p>

      <label className="block border-2 border-dashed border-palm-300 rounded-lg p-10 text-center cursor-pointer hover:border-palm-500 transition">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="sr-only"
          disabled={processing}
        />
        <span className="text-4xl block mb-3">📷</span>
        <span className="text-palm-700 font-semibold">
          {processing ? 'Zpracovávám…' : 'Vyberte soubor nebo ho sem přetáhněte'}
        </span>
      </label>

      {error && (
        <p className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Fotografie se zpracuje jen ve vašem prohlížeči a nikdy se neodesílá na
        server — pokud si výslovně nevyžádáte AI rozbor.
      </p>
    </div>
  )
}
