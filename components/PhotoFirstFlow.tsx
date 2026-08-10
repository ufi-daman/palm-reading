'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GuidedCapture, type CaptureResult } from './GuidedCapture'
import { AnalyzerWizard } from './AnalyzerWizard'
import { detectHandLandmarks } from '@/lib/vision/mediapipe'
import { classifyHandType } from '@/lib/vision/handType'

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Obrázek se nepodařilo načíst.'))
    img.src = dataUrl
  })
}

type FlowState =
  | { phase: 'capture' }
  | { phase: 'detecting'; dataUrl: string }
  | { phase: 'found'; dataUrl: string; handType: string }
  | { phase: 'not-found'; dataUrl: string }
  | { phase: 'detection-failed'; dataUrl: string; message: string }

export function PhotoFirstFlow() {
  const [state, setState] = useState<FlowState>({ phase: 'capture' })

  async function handleCapture(result: CaptureResult) {
    setState({ phase: 'detecting', dataUrl: result.dataUrl })
    try {
      const image = await loadImage(result.dataUrl)
      const landmarks = await detectHandLandmarks(image)
      if (!landmarks) {
        setState({ phase: 'not-found', dataUrl: result.dataUrl })
        return
      }
      const { handType } = classifyHandType(landmarks)
      setState({ phase: 'found', dataUrl: result.dataUrl, handType })
    } catch (error) {
      setState({
        phase: 'detection-failed',
        dataUrl: result.dataUrl,
        message: error instanceof Error ? error.message : 'Detekce selhala.',
      })
    }
  }

  function retake() {
    setState({ phase: 'capture' })
  }

  const manualAlternatives = (
    <p className="text-sm text-gray-600 text-center">
      Bez focení:{' '}
      <Link href="/analyzer/interactive" className="text-palm-700 underline">
        interaktivní diagram
      </Link>{' '}
      nebo{' '}
      <Link href="/analyzer/text-input" className="text-palm-700 underline">
        textový formulář
      </Link>
      .
    </p>
  )

  if (state.phase === 'capture') {
    return (
      <div className="space-y-6">
        <GuidedCapture onCapture={handleCapture} />
        {manualAlternatives}
      </div>
    )
  }

  if (state.phase === 'detecting') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-palm-200 p-10 text-center">
          <p className="text-palm-700 font-medium">Hledám na fotce dlaň…</p>
        </div>
      </div>
    )
  }

  if (state.phase === 'not-found') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
          <p className="text-amber-900 font-medium">
            Na fotce se nepodařilo najít otevřenou dlaň. Zkuste ji vyfotit
            znovu — celou v záběru, ne moc zblízka, s dobrým osvětlením.
          </p>
          <button
            type="button"
            onClick={retake}
            className="bg-palm-700 hover:bg-palm-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Vyfotit znovu
          </button>
        </div>
        {manualAlternatives}
      </div>
    )
  }

  if (state.phase === 'detection-failed') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
          <p className="text-amber-900 font-medium">
            Rozpoznávání dlaně se v tomto prohlížeči nepodařilo spustit.
            Pokračujte prosím ručně.
          </p>
        </div>
        {manualAlternatives}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-palm-100 border border-palm-300 rounded-lg px-4 py-3 text-palm-800 text-sm flex items-center justify-between gap-4">
        <span>Typ ruky rozpoznán z fotky. Čtení níže se dá upřesnit.</span>
        <button type="button" onClick={retake} className="underline whitespace-nowrap">
          Vyfotit znovu
        </button>
      </div>
      <AnalyzerWizard
        variant="panel"
        hasPhoto
        backgroundImage={state.dataUrl}
        initialHandType={state.handType}
      />
      {manualAlternatives}
    </div>
  )
}
