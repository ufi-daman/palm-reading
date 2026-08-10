'use client'

import { useEffect, useRef, useState } from 'react'
import { checkImageQuality, type QualityCheck } from '@/lib/vision/imageQuality'

const MAX_DIMENSION = 1568
const JPEG_QUALITY = 0.85
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 15 * 1024 * 1024

export interface CaptureResult {
  dataUrl: string
  width: number
  height: number
}

function resizeCanvasToDataUrl(source: CanvasImageSource, width: number, height: number): string {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
  const outWidth = Math.round(width * scale)
  const outHeight = Math.round(height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = outWidth
  canvas.height = outHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas není podporován.')
  ctx.drawImage(source, 0, 0, outWidth, outHeight)
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

function resizeFileToDataUrl(file: File): Promise<CaptureResult> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      try {
        const dataUrl = resizeCanvasToDataUrl(img, img.width, img.height)
        resolve({ dataUrl, width: img.width, height: img.height })
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Obrázek se nepodařilo načíst.'))
    }
    img.src = objectUrl
  })
}

type CameraState = 'checking' | 'available' | 'unavailable' | 'denied'

/**
 * Naváděné focení: živý náhled z kamery s průběžnou kontrolou ostrosti a
 * expozice, spoušť fotoaparátu se zpřístupní až po splnění obou. Kdykoliv
 * je k dispozici i nahrání souboru — jak jako záložní cesta pro zařízení
 * bez kamery, tak pro odmítnutá oprávnění.
 *
 * Živou kameru (getUserMedia) v tomto headless prostředí nelze odzkoušet —
 * cestu přes soubor ano.
 */
export function GuidedCapture({
  onCapture,
}: {
  onCapture: (result: CaptureResult) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<CameraState>('checking')
  const [quality, setQuality] = useState<QualityCheck | null>(null)
  const [error, setError] = useState<string>()
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setCameraState('unavailable')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraState('available')
      })
      .catch(() => {
        if (!cancelled) setCameraState('denied')
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => {
    if (cameraState !== 'available') return
    const interval = setInterval(() => {
      const video = videoRef.current
      if (!video || video.videoWidth === 0) return
      const result = checkImageQuality(video, video.videoWidth, video.videoHeight)
      setQuality(result)
    }, 350)
    return () => clearInterval(interval)
  }, [cameraState])

  async function capture() {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    setProcessing(true)
    setError(undefined)
    try {
      const dataUrl = resizeCanvasToDataUrl(video, video.videoWidth, video.videoHeight)
      onCapture({ dataUrl, width: video.videoWidth, height: video.videoHeight })
    } catch {
      setError('Snímek se nepodařilo zpracovat. Zkuste to znovu.')
    } finally {
      setProcessing(false)
    }
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
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
      const result = await resizeFileToDataUrl(file)
      onCapture(result)
    } catch {
      setError('Obrázek se nepodařilo zpracovat. Zkuste jiný soubor.')
    } finally {
      setProcessing(false)
    }
  }

  const canShoot = quality?.ok ?? false

  return (
    <div className="bg-white rounded-xl border border-palm-200 p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-palm-800 mb-2">Vyfoťte dlaň</h2>
        <p className="text-gray-600 text-sm">
          Otevřenou dlaň, celou v záběru, světlo ze strany nebo zepředu — ne
          zezadu proti objektivu. Fotografie zůstává ve vašem prohlížeči.
        </p>
      </div>

      {cameraState === 'available' && (
        <div className="space-y-3">
          <div className="relative rounded-lg overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-6 border-2 border-dashed border-white/60 rounded-lg pointer-events-none" />
          </div>

          <div className="text-center text-sm">
            {quality === null ? (
              <span className="text-gray-500">Kontroluji obraz…</span>
            ) : canShoot ? (
              <span className="text-green-700">✓ Obraz je dost ostrý a dobře osvětlený</span>
            ) : (
              <span className="text-amber-700">
                {!quality.isSharp && 'Přidržte telefon klidně, obraz je rozmazaný. '}
                {!quality.isWellExposed && 'Upravte osvětlení — je moc tmavo nebo přesvětleno.'}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={capture}
              disabled={!canShoot || processing}
              className="bg-palm-700 hover:bg-palm-800 disabled:bg-gray-300 text-white px-8 py-3 rounded-full font-semibold"
            >
              {processing ? 'Zpracovávám…' : '📸 Vyfotit'}
            </button>
            {!canShoot && (
              <button
                type="button"
                onClick={capture}
                disabled={processing}
                className="text-xs text-gray-500 underline"
              >
                Přesto vyfotit
              </button>
            )}
          </div>
        </div>
      )}

      {cameraState === 'checking' && (
        <p className="text-sm text-gray-500 text-center py-8">Připravuji kameru…</p>
      )}

      {(cameraState === 'unavailable' || cameraState === 'denied') && (
        <div className="bg-palm-50 border border-palm-200 rounded-lg px-4 py-3 text-sm text-palm-800">
          {cameraState === 'denied'
            ? 'Přístup ke kameře nebyl povolen.'
            : 'Kamera není na tomto zařízení dostupná.'}{' '}
          Nahrajte fotografii ze souboru.
        </div>
      )}

      <div className="border-t border-palm-100 pt-4">
        <label className="block border-2 border-dashed border-palm-300 rounded-lg p-6 text-center cursor-pointer hover:border-palm-500 transition">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="sr-only"
            disabled={processing}
          />
          <span className="text-palm-700 font-medium text-sm">
            {cameraState === 'available'
              ? 'nebo nahrajte soubor místo focení'
              : 'Vybrat soubor'}
          </span>
        </label>
      </div>

      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </p>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          Fotografie se zpracuje jen ve vašem prohlížeči a nikdy se neodesílá na
          server — pokud si výslovně nevyžádáte AI rozbor.
        </p>
        <p>
          Právě proto se po prvním vyfocení stáhne asi 18 MB rozpoznávacího
          modelu. Děje se to jednou a pak si ho prohlížeč pamatuje — na mobilních
          datech s tím ale počítejte.
        </p>
      </div>
    </div>
  )
}
