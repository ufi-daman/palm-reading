'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GuidedCapture, type CaptureResult } from './GuidedCapture'
import { AnalyzerWizard } from './AnalyzerWizard'
import { AiVisionOptIn } from './AiVisionOptIn'
import { detectHandLandmarks } from '@/lib/vision/mediapipe'
import { classifyHandType } from '@/lib/vision/handType'
import { detectLines } from '@/lib/vision/lines/detect'
import type { LineKey, MountKey } from '@/lib/content/types'
import type { Characteristics } from '@/lib/validators/characteristics'

type PanelLineValue = { present: boolean; strength?: string; length?: string; quality?: string }
type PanelMountValue = { size?: string; strength?: string }

type FlowState =
  | { phase: 'capture' }
  | { phase: 'detecting'; dataUrl: string }
  | {
      phase: 'found'
      dataUrl: string
      handType: string
      lines: Partial<Record<LineKey, PanelLineValue>>
      mounts: Partial<Record<MountKey, PanelMountValue>>
      detectedCount: number
      usedAi: boolean
      revision: number
    }
  | { phase: 'not-found'; dataUrl: string }
  | { phase: 'detection-failed'; dataUrl: string; message: string }

function characteristicsToPanelLines(
  characteristics: Characteristics,
): Partial<Record<LineKey, PanelLineValue>> {
  const lines: Partial<Record<LineKey, PanelLineValue>> = {}
  for (const [key, value] of Object.entries(characteristics.palmLines ?? {})) {
    if (value?.present) {
      lines[key as LineKey] = {
        present: true,
        strength: value.strength,
        length: value.length,
        quality: value.quality,
      }
    }
  }
  return lines
}

function characteristicsToPanelMounts(
  characteristics: Characteristics,
): Partial<Record<MountKey, PanelMountValue>> {
  const mounts: Partial<Record<MountKey, PanelMountValue>> = {}
  for (const [key, value] of Object.entries(characteristics.mounts ?? {})) {
    if (value && (value.size || value.strength)) {
      mounts[key as MountKey] = { size: value.size, strength: value.strength }
    }
  }
  return mounts
}

export function PhotoFirstFlow() {
  const [state, setState] = useState<FlowState>({ phase: 'capture' })

  async function handleCapture(result: CaptureResult) {
    setState({ phase: 'detecting', dataUrl: result.dataUrl })
    try {
      // Detekce jede z nekomprimovaného canvasu (`frame`), ne z JPEG
      // náhledu — ten je jen pro zobrazení a pro AI rozbor.
      const image = result.frame
      const landmarks = await detectHandLandmarks(image)
      if (!landmarks) {
        setState({ phase: 'not-found', dataUrl: result.dataUrl })
        return
      }
      const { handType } = classifyHandType(landmarks)

      // Detekce čar je oddělený krok — když selže, čtení pokračuje aspoň
      // podle typu ruky, ne že celý tok spadne.
      let lines: Partial<Record<LineKey, PanelLineValue>> = {}
      let detectedCount = 0
      try {
        const lineResult = detectLines(image, landmarks)
        if (lineResult) {
          detectedCount = lineResult.detectedCount
          for (const key of Object.keys(lineResult.lines) as LineKey[]) {
            const detected = lineResult.lines[key]!
            lines[key] = {
              present: true,
              strength: detected.strength,
              length: detected.length,
              quality: detected.quality,
            }
          }
        }
      } catch {
        lines = {}
        detectedCount = 0
      }

      setState({
        phase: 'found',
        dataUrl: result.dataUrl,
        handType,
        lines,
        mounts: {},
        detectedCount,
        usedAi: false,
        revision: 0,
      })
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

  function applyAiResult(dataUrl: string, characteristics: Characteristics) {
    const lines = characteristicsToPanelLines(characteristics)
    const mounts = characteristicsToPanelMounts(characteristics)
    setState((prev) => ({
      phase: 'found',
      dataUrl,
      handType: characteristics.handType,
      lines,
      mounts,
      detectedCount: Object.keys(lines).length + Object.keys(mounts).length,
      usedAi: true,
      revision: prev.phase === 'found' ? prev.revision + 1 : 1,
    }))
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
          <div>
            <AiVisionOptIn
              dataUrl={state.dataUrl}
              onResult={(characteristics) => applyAiResult(state.dataUrl, characteristics)}
            />
          </div>
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
        <span>
          {state.usedAi ? 'Znaky doplněné AI rozborem' : 'Typ ruky rozpoznán z fotky'}
          {state.detectedCount > 0
            ? ` spolu s ${state.detectedCount} ${state.detectedCount === 1 ? 'znakem' : 'znaky'}.`
            : ', čáry se rozpoznat nepodařilo — doplňte je níže ručně.'}{' '}
          Čtení se dá upřesnit.
        </span>
        <button type="button" onClick={retake} className="underline whitespace-nowrap">
          Vyfotit znovu
        </button>
      </div>
      <AnalyzerWizard
        key={state.revision}
        variant="panel"
        hasPhoto
        backgroundImage={state.dataUrl}
        initialHandType={state.handType}
        initialLines={state.lines}
        initialMounts={state.mounts}
        detectedCount={state.detectedCount}
        usedAi={state.usedAi}
      />
      {!state.usedAi && (
        <AiVisionOptIn
          dataUrl={state.dataUrl}
          onResult={(characteristics) => applyAiResult(state.dataUrl, characteristics)}
        />
      )}
      {manualAlternatives}
    </div>
  )
}
