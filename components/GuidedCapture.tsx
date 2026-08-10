'use client'

import { useEffect, useRef, useState } from 'react'
import { PalmOutline } from '@/components/PalmOutline'
import { checkImageQuality, type QualityCheck } from '@/lib/vision/imageQuality'
import {
  checkHandPose,
  frameToGuide,
  type HandPoseCheck,
} from '@/lib/vision/handPose'
import {
  detectHandLandmarksInFrame,
  preloadHandLandmarker,
} from '@/lib/vision/mediapipe'

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
 * Stav navádění podle rozpoznaných bodů ruky. `failed` znamená, že se model
 * nepodařilo načíst — focení tím nekončí, jen se vrátí ke kontrole ostrosti
 * a expozice, kterou navádění doplňuje, ne nahrazuje.
 */
type GuideState = 'off' | 'loading' | 'active' | 'failed'

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
  const frameRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<CameraState>('checking')
  const [quality, setQuality] = useState<QualityCheck | null>(null)
  const [pose, setPose] = useState<HandPoseCheck | null>(null)
  const [handSeen, setHandSeen] = useState(false)
  const [guideState, setGuideState] = useState<GuideState>('off')
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

  /**
   * Stream se přiřazuje až tady, ne hned po jeho získání. Element <video>
   * se renderuje teprve při cameraState === 'available', takže v okamžiku,
   * kdy getUserMedia vrátí stream, ještě neexistuje — dřívější přiřazení
   * propadlo do prázdna a náhled zůstal černý. Protože z černého obrazu
   * vyjde kontrola expozice jako podexponovaná, zůstala navíc zamčená
   * spoušť a focení nešlo spustit vůbec.
   */
  useEffect(() => {
    if (cameraState !== 'available') return
    const video = videoRef.current
    const stream = streamRef.current
    if (!video || !stream) return
    video.srcObject = stream
    // Některé prohlížeče autoplay u srcObject nespustí samy.
    void video.play().catch(() => undefined)
  }, [cameraState])

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

  /**
   * Navádění podle skutečné polohy ruky. Model se stahuje hned při otevření
   * kamery — nejsou to data navíc, analýza snímku ho potřebuje stejně tak;
   * jen se těch 18 MB přesune do doby, kdy si uživatel rovná ruku, místo
   * aby čekal až po stisku spouště.
   */
  useEffect(() => {
    if (cameraState !== 'available') return
    let cancelled = false
    let interval: ReturnType<typeof setInterval> | undefined

    setGuideState('loading')
    preloadHandLandmarker()
      .then(() => {
        if (cancelled) return
        setGuideState('active')
        interval = setInterval(async () => {
          const video = videoRef.current
          const frame = frameRef.current
          if (!video || !frame) return
          const landmarks = await detectHandLandmarksInFrame(video)
          if (cancelled || landmarks === undefined) return
          if (!landmarks) {
            setHandSeen(false)
            setPose(null)
            return
          }
          const box = frame.getBoundingClientRect()
          const mapped = landmarks.map((point) =>
            frameToGuide(
              point,
              { width: video.videoWidth, height: video.videoHeight },
              { width: box.width, height: box.height },
            ),
          )
          setHandSeen(true)
          setPose(checkHandPose(mapped, landmarks))
        }, 250)
      })
      .catch(() => {
        if (!cancelled) setGuideState('failed')
      })

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
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

  const qualityOk = quality?.ok ?? false
  // Navádění spoušť zpřísňuje jen tehdy, když skutečně běží. Dokud se model
  // načítá nebo se načíst nepodařilo, platí původní kritérium — jinak by
  // selhání pomocné funkce zablokovalo focení úplně.
  const poseOk = guideState === 'active' ? (pose?.ok ?? false) : true
  const canShoot = qualityOk && poseOk

  const outlineState: 'idle' | 'adjust' | 'ready' =
    guideState !== 'active' || !handSeen
      ? 'idle'
      : pose?.ok
        ? 'ready'
        : 'adjust'

  function guidanceMessage(): { text: string; tone: 'ok' | 'warn' | 'muted' } {
    if (quality === null) return { text: 'Kontroluji obraz…', tone: 'muted' }
    if (!quality.isSharp)
      return { text: 'Přidržte telefon klidně, obraz je rozmazaný.', tone: 'warn' }
    if (!quality.isWellExposed)
      return {
        text: 'Upravte osvětlení — je moc tmavo nebo přesvětleno. Světlo ze strany, ne zezadu.',
        tone: 'warn',
      }
    if (guideState === 'loading')
      return { text: 'Načítám navádění podle ruky…', tone: 'muted' }
    if (guideState === 'active' && !handSeen)
      return { text: 'Ruku zatím nevidím — vložte dlaň do obrysu.', tone: 'warn' }
    if (guideState === 'active' && pose && !pose.ok)
      return { text: pose.hint ?? 'Zarovnejte dlaň s obrysem.', tone: 'warn' }
    if (guideState === 'active')
      return { text: '✓ Dlaň sedí v obrysu, obraz je ostrý', tone: 'ok' }
    return { text: '✓ Obraz je dost ostrý a dobře osvětlený', tone: 'ok' }
  }

  const guidance = guidanceMessage()

  return (
    <div className="bg-white rounded-xl border border-palm-200 p-6 space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-palm-800 mb-2">Vyfoťte dlaň</h2>
        {/* Rozptyl ve způsobu focení se dřív propisoval až do detekce, kde
            se dal jen těžko dohnat. Proto je postup daný takhle natvrdo. */}
        <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
          <li>Dlaň otevřete naplno, prsty narovnané a mírně od sebe.</li>
          <li>Prsty míří nahoru, dlaň kolmo k objektivu.</li>
          <li>Zarovnejte dlaň do obrysu — palec může zůstat mimo.</li>
          <li>Světlo ze strany nebo zepředu, nikdy zezadu proti objektivu.</li>
          <li>Fotografii pořiďte na neutrálním pozadí, ne na vzorované ploše.</li>
        </ol>
        <p className="text-gray-500 text-xs mt-2">
          Fotografie zůstává ve vašem prohlížeči.
        </p>
      </div>

      {cameraState === 'available' && (
        <div className="space-y-3">
          <div
            ref={frameRef}
            className="relative rounded-lg overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto"
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <PalmOutline state={outlineState} />
          </div>

          <div className="text-center text-sm" role="status" aria-live="polite">
            <span
              className={
                guidance.tone === 'ok'
                  ? 'text-green-700'
                  : guidance.tone === 'warn'
                    ? 'text-amber-700'
                    : 'text-gray-500'
              }
            >
              {guidance.text}
            </span>
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
                className="border-2 border-palm-300 text-palm-700 px-5 py-2 rounded-full text-sm"
              >
                Vyfotit i tak
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
          Právě proto se při otevření kamery stáhne asi 18 MB rozpoznávacího
          modelu — navádí vás při focení a pak z fotky čte body ruky. Děje se to
          jednou a pak si ho prohlížeč pamatuje; na mobilních datech s tím ale
          počítejte.
        </p>
      </div>
    </div>
  )
}
