'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GuidedCapture, type CaptureResult } from './GuidedCapture'
import { AnalyzerWizard } from './AnalyzerWizard'
import { AiVisionOptIn } from './AiVisionOptIn'
import { detectHandLandmarks } from '@/lib/vision/mediapipe'
import { classifyHandType } from '@/lib/vision/handType'
import { detectLines, type LineDetectionResult } from '@/lib/vision/lines/detect'
import { normalizePalm } from '@/lib/vision/lines/normalize'
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
      // Narovnaný výřez dlaně z normalizePalm() — jde jako druhý obrázek do
      // AI rozboru, aby model viděl detail zblízka a rovně, ne pod úhlem
      // fotky. Chybí, když se nepodařilo najít landmarky (viz not-found).
      normalizedDataUrl?: string
      handType: string
      lines: Partial<Record<LineKey, PanelLineValue>>
      mounts: Partial<Record<MountKey, PanelMountValue>>
      // Chirognomie (délka prstů, nehty, barva dlaně, kůže). Lokální detekce
      // ji neumí — plní se jen z AI rozboru nebo ručně v panelu oprav.
      additional: Record<string, string>
      detectedCount: number
      /** Rozpad skóre po zónách pro statistiku, viz summarizeDetection. */
      detectionDetail?: string
      usedAi: boolean
      revision: number
    }
  | { phase: 'not-found'; dataUrl: string }
  | { phase: 'detection-failed'; dataUrl: string; message: string }

/** ImageData → JPEG data URL, stejný vzor jako drawToCanvas/toDataURL v GuidedCapture.tsx. */
function imageDataToDataUrl(image: ImageData): string {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')!
  ctx.putImageData(image, 0, 0)
  return canvas.toDataURL('image/jpeg', 0.9)
}

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

/**
 * Rozpad detekce do tvaru, který čeká `aggregateDetection` na /admin/stats:
 * `{ lifeLine: { found, score } }`. Skóre zaokrouhlujeme na dvě místa —
 * na ladění prahů to stačí a řádek ve statistice zůstane malý.
 *
 * Obsahuje jen čísla z filtru: co našel a jak silně. Žádné souřadnice,
 * žádný výřez, nic, z čeho by šla zpětně poskládat dlaň.
 */
function summarizeDetection(
  debug: LineDetectionResult['debug'],
): string | undefined {
  if (!debug) return undefined
  const summary: Record<string, { found: boolean; score: number }> = {}
  for (const zone of debug) {
    summary[zone.zoneKey] = {
      found: zone.accepted,
      score: Math.round(zone.score * 100) / 100,
    }
  }
  return JSON.stringify(summary)
}

/**
 * Chirognomie z AI rozboru. Model ji vrací (viz visionSchema), ale dřív se
 * cestou do panelu zahazovala — jako jediná kategorie přitom nezávisí na
 * kvalitě detekce čar, takže funguje i na fotce, kde se žádná čára nenajde.
 */
function characteristicsToPanelAdditional(
  characteristics: Characteristics,
): Record<string, string> {
  const additional: Record<string, string> = {}
  for (const [key, value] of Object.entries(
    characteristics.additionalFeatures ?? {},
  )) {
    if (typeof value === 'string') additional[key] = value
  }
  return additional
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
      let detectionDetail: string | undefined
      try {
        // withDebug = true: rozpad skóre po zónách je jediný způsob, jak
        // změřit úspěšnost detekce na skutečných rukou místo na dvou
        // kalibračních fotkách. Jde do statistiky, ne do výkladu.
        const lineResult = detectLines(image, landmarks, 'green', true)
        if (lineResult) {
          detectedCount = lineResult.detectedCount
          detectionDetail = summarizeDetection(lineResult.debug)
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

      // Narovnaný výřez pro pozdější AI rozbor — nekritické, selhání se
      // jen přeskočí, AI pak dostane jen syrovou fotku jako dřív.
      let normalizedDataUrl: string | undefined
      try {
        const normalized = normalizePalm(image, landmarks)
        if (normalized) {
          normalizedDataUrl = imageDataToDataUrl(normalized)
        }
      } catch {
        normalizedDataUrl = undefined
      }

      setState({
        phase: 'found',
        dataUrl: result.dataUrl,
        normalizedDataUrl,
        handType,
        lines,
        mounts: {},
        additional: {},
        detectedCount,
        detectionDetail,
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
    const aiLines = characteristicsToPanelLines(characteristics)
    const aiMounts = characteristicsToPanelMounts(characteristics)
    const aiAdditional = characteristicsToPanelAdditional(characteristics)
    setState((prev) => {
      // Lokální detekce (kalibrovaný filtr) a AI jsou dva nezávislé odhady —
      // AI výsledek se doplňuje k tomu, co už našla lokální detekce, ne že by
      // ho nahrazoval. Kde obě metody trefí stejnou čáru, zůstává přesnější
      // lokální měření; AI přidává jen to, co lokální detekce nenašla.
      const localLines = prev.phase === 'found' ? prev.lines : {}
      const lines = { ...aiLines, ...localLines }
      // Pahorky i chirognomii slučujeme stejným směrem jako čáry: co už ve
      // stavu je, má přednost. Lokální detekce je zatím neplní, ale díky
      // tomuhle pořadí je AI nepřepíše, kdyby se to změnilo.
      const localMounts = prev.phase === 'found' ? prev.mounts : {}
      const mounts = { ...aiMounts, ...localMounts }
      const localAdditional = prev.phase === 'found' ? prev.additional : {}
      const additional = { ...aiAdditional, ...localAdditional }
      return {
        phase: 'found',
        dataUrl,
        normalizedDataUrl: prev.phase === 'found' ? prev.normalizedDataUrl : undefined,
        handType: prev.phase === 'found' ? prev.handType : characteristics.handType,
        lines,
        mounts,
        additional,
        // Počet znaků dodaných automaticky — čáry, pahorky i chirognomie.
        // Musí sedět se součtem, který nad ním počítá AnalyzerWizard, jinak
        // by statistika ručních oprav vycházela záporně.
        detectedCount:
          Object.keys(lines).length +
          Object.keys(mounts).length +
          Object.keys(additional).length,
        detectionDetail:
          prev.phase === 'found' ? prev.detectionDetail : undefined,
        usedAi: true,
        revision: prev.phase === 'found' ? prev.revision + 1 : 1,
      }
    })
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
          </p>
          {/*
            AI rozbor běží na serveru a landmarky z prohlížeče nepotřebuje —
            takže i když se místní detekce vůbec nespustí, tahle cesta pořád
            funguje. Dřív tu nabídnutá nebyla a uživatel přišel o obě naráz.
          */}
          <div>
            <AiVisionOptIn
              dataUrl={state.dataUrl}
              onResult={(characteristics) => applyAiResult(state.dataUrl, characteristics)}
            />
          </div>
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

  return (
    <div className="space-y-6">
      <div className="print:hidden bg-palm-100 border border-palm-300 rounded-lg px-4 py-3 text-palm-800 text-sm flex items-center justify-between gap-4">
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
        initialAdditional={state.additional}
        detectedCount={state.detectedCount}
        detectionDetail={state.detectionDetail}
        usedAi={state.usedAi}
      />
      {!state.usedAi && (
        <div className="print:hidden">
          <AiVisionOptIn
            dataUrl={state.dataUrl}
            normalizedDataUrl={state.normalizedDataUrl}
            onResult={(characteristics) => applyAiResult(state.dataUrl, characteristics)}
          />
        </div>
      )}
      <div className="print:hidden">{manualAlternatives}</div>
    </div>
  )
}
