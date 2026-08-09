'use client'

import { useState } from 'react'
import { HandDiagram, LINE_LABELS, MOUNT_LABELS } from './HandDiagram'
import { FeatureModal, type OptionGroup } from './FeatureModal'
import { ResultCard, type AnalysisResult } from './ResultCard'
import type { LineKey, MountKey } from '@/lib/content/types'

type LineValue = {
  present?: boolean
  strength?: string
  length?: string
  quality?: string
}
type MountValue = { size?: string; strength?: string }

const LINE_GROUPS: OptionGroup[] = [
  {
    axis: 'strength',
    legend: 'Jak výrazná čára je?',
    options: [
      { value: 'weak', label: 'Slabá', hint: 'Jemná, sotva znatelná' },
      { value: 'medium', label: 'Střední', hint: 'Zřetelná, ale ne dominantní' },
      { value: 'strong', label: 'Silná', hint: 'Hluboká a výrazná' },
    ],
  },
  {
    axis: 'length',
    legend: 'Jak je dlouhá?',
    options: [
      { value: 'short', label: 'Krátká' },
      { value: 'medium', label: 'Střední' },
      { value: 'long', label: 'Dlouhá' },
    ],
  },
  {
    axis: 'quality',
    legend: 'Jaký má průběh?',
    options: [
      { value: 'clear', label: 'Jasná', hint: 'Souvislá, bez přerušení' },
      { value: 'broken', label: 'Přerušená', hint: 'Má viditelné mezery' },
      { value: 'chained', label: 'Řetízková', hint: 'Skládá se z drobných oček' },
      { value: 'island', label: 'S ostrůvkem', hint: 'Obsahuje oválné rozdvojení' },
    ],
  },
]

const MOUNT_GROUPS: OptionGroup[] = [
  {
    axis: 'size',
    legend: 'Jak velká vyvýšenina je?',
    options: [
      { value: 'small', label: 'Malá', hint: 'Téměř plochá' },
      { value: 'medium', label: 'Střední' },
      { value: 'large', label: 'Velká', hint: 'Zřetelně vystupuje' },
    ],
  },
  {
    axis: 'strength',
    legend: 'Jak je pevná na dotek?',
    options: [
      { value: 'weak', label: 'Měkká' },
      { value: 'normal', label: 'Normální' },
      { value: 'prominent', label: 'Pružná a pevná' },
    ],
  },
]

const HAND_TYPES = [
  { value: 'earth', label: '🌍 Země', hint: 'Čtvercová dlaň, kratší silné prsty' },
  { value: 'fire', label: '🔥 Oheň', hint: 'Obdélníková dlaň, kratší prsty' },
  { value: 'air', label: '💨 Vzduch', hint: 'Čtvercová dlaň, dlouhé tenké prsty' },
  { value: 'water', label: '💧 Voda', hint: 'Obdélníková dlaň, dlouhé prsty' },
  { value: 'mixed', label: '🔀 Smíšená', hint: 'Znaky několika typů dohromady' },
]

const ADDITIONAL_GROUPS: OptionGroup[] = [
  {
    axis: 'fingerLengths',
    legend: 'Délka prstů',
    options: [
      { value: 'short', label: 'Krátké' },
      { value: 'normal', label: 'Normální' },
      { value: 'long', label: 'Dlouhé' },
    ],
  },
  {
    axis: 'nails',
    legend: 'Tvar nehtů',
    options: [
      { value: 'normal', label: 'Pravidelné' },
      { value: 'wide', label: 'Široké' },
      { value: 'narrow', label: 'Úzké' },
    ],
  },
  {
    axis: 'palmColor',
    legend: 'Barva dlaně',
    options: [
      { value: 'pale', label: 'Bledá' },
      { value: 'normal', label: 'Přirozená' },
      { value: 'ruddy', label: 'Zčervenalá' },
    ],
  },
  {
    axis: 'skinTexture',
    legend: 'Struktura kůže',
    options: [
      { value: 'fine', label: 'Jemná' },
      { value: 'coarse', label: 'Hrubší' },
    ],
  },
]

const STEPS = ['Typ ruky', 'Čáry', 'Pahorky', 'Doplňky', 'Souhrn'] as const

export function AnalyzerWizard({
  variant,
  backgroundImage,
  imageUrl,
}: {
  variant: 'interactive' | 'text'
  backgroundImage?: string
  imageUrl?: string
}) {
  const [step, setStep] = useState(0)
  const [handType, setHandType] = useState<string>()
  const [lines, setLines] = useState<Partial<Record<LineKey, LineValue>>>({})
  const [mounts, setMounts] = useState<Partial<Record<MountKey, MountValue>>>({})
  const [additional, setAdditional] = useState<Record<string, string>>({})
  const [openLine, setOpenLine] = useState<LineKey>()
  const [openMount, setOpenMount] = useState<MountKey>()
  const [draft, setDraft] = useState<Record<string, string | undefined>>({})
  const [result, setResult] = useState<AnalysisResult>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  function openLineModal(key: LineKey) {
    setOpenLine(key)
    setDraft({ ...(lines[key] as Record<string, string | undefined>) })
  }

  function openMountModal(key: MountKey) {
    setOpenMount(key)
    setDraft({ ...(mounts[key] as Record<string, string | undefined>) })
  }

  function confirmLine() {
    if (!openLine) return
    setLines((prev) => ({ ...prev, [openLine]: { present: true, ...draft } }))
    setOpenLine(undefined)
    setDraft({})
  }

  function confirmMount() {
    if (!openMount) return
    setMounts((prev) => ({ ...prev, [openMount]: { ...draft } }))
    setOpenMount(undefined)
    setDraft({})
  }

  async function submit() {
    setLoading(true)
    setError(undefined)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputType: imageUrl ? 'image' : variant === 'text' ? 'text' : 'interactive',
          imageUrl,
          characteristics: {
            handType,
            palmLines: lines,
            mounts,
            additionalFeatures: additional,
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Analýzu se nepodařilo dokončit.')
        return
      }
      setResult(data)
    } catch {
      setError('Server neodpovídá. Zkuste to prosím znovu.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <ResultCard result={result} />
        <button
          type="button"
          onClick={() => {
            setResult(undefined)
            setStep(0)
          }}
          className="border-2 border-palm-300 text-palm-700 px-6 py-2 rounded-lg hover:bg-palm-50"
        >
          Nová analýza
        </button>
      </div>
    )
  }

  const filledLines = Object.keys(lines).length
  const filledMounts = Object.keys(mounts).length

  return (
    <div className="space-y-6">
      {/* Kroky */}
      <ol className="flex flex-wrap gap-2 text-sm">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`px-3 py-1 rounded-full border ${
              index === step
                ? 'bg-palm-700 text-white border-palm-700'
                : index < step
                  ? 'bg-palm-100 text-palm-800 border-palm-300'
                  : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      {/* Krok 1 — typ ruky */}
      {step === 0 && (
        <section className="bg-white rounded-xl border border-palm-200 p-6">
          <h2 className="text-2xl font-bold text-palm-800 mb-2">
            Jaký je tvar vaší dlaně?
          </h2>
          <p className="text-gray-600 mb-5">
            Porovnejte délku dlaně a prstů. Tento údaj je povinný — od něj se
            odvíjí celé čtení.
          </p>
          <div className="flex flex-wrap gap-3">
            {HAND_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setHandType(type.value)}
                title={type.hint}
                aria-pressed={handType === type.value}
                className={`px-5 py-3 rounded-lg border-2 text-left transition ${
                  handType === type.value
                    ? 'bg-palm-600 border-palm-700 text-white'
                    : 'bg-white border-palm-200 hover:border-palm-400'
                }`}
              >
                <span className="block font-semibold">{type.label}</span>
                <span className="block text-xs opacity-80">{type.hint}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Krok 2 — čáry */}
      {step === 1 && (
        <section className="bg-white rounded-xl border border-palm-200 p-6">
          <h2 className="text-2xl font-bold text-palm-800 mb-2">Čáry dlaně</h2>
          <p className="text-gray-600 mb-5">
            {variant === 'interactive'
              ? 'Klikněte na čáru v diagramu a popište, jak vypadá na vaší dlani. Vyplněné čáry ztmavnou.'
              : 'Vyberte čáru ze seznamu a popište ji. Vyplnit můžete jen ty, které na dlani rozeznáte.'}{' '}
            Vyplněno: {filledLines} z 8.
          </p>

          {variant === 'interactive' && (
            <HandDiagram
              mode="lines"
              completedLines={Object.fromEntries(
                Object.keys(lines).map((key) => [key, true]),
              )}
              onSelectLine={openLineModal}
              backgroundImage={backgroundImage}
            />
          )}

          {/* Seznam je i v interaktivním režimu: u průsečíků čar není klik do
              diagramu jednoznačný a přes klávesnici se v SVG vybírá špatně. */}
          <div className="grid gap-2 sm:grid-cols-2 mt-6">
            {(Object.keys(LINE_LABELS) as LineKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => openLineModal(key)}
                className={`px-4 py-3 rounded-lg border-2 text-left ${
                  lines[key]
                    ? 'bg-palm-100 border-palm-400'
                    : 'bg-white border-palm-200 hover:border-palm-400'
                }`}
              >
                {lines[key] ? '✓ ' : ''}
                {LINE_LABELS[key]}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Krok 3 — pahorky */}
      {step === 2 && (
        <section className="bg-white rounded-xl border border-palm-200 p-6">
          <h2 className="text-2xl font-bold text-palm-800 mb-2">Pahorky dlaně</h2>
          <p className="text-gray-600 mb-5">
            Vyvýšeniny na dlani. Nahmatejte je palcem druhé ruky. Vyplněno:{' '}
            {filledMounts} z 8.
          </p>

          {variant === 'interactive' && (
            <HandDiagram
              mode="mounts"
              completedMounts={Object.fromEntries(
                Object.keys(mounts).map((key) => [key, true]),
              )}
              onSelectMount={openMountModal}
              backgroundImage={backgroundImage}
            />
          )}

          <div className="grid gap-2 sm:grid-cols-2 mt-6">
            {(Object.keys(MOUNT_LABELS) as MountKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => openMountModal(key)}
                className={`px-4 py-3 rounded-lg border-2 text-left ${
                  mounts[key]
                    ? 'bg-palm-100 border-palm-400'
                    : 'bg-white border-palm-200 hover:border-palm-400'
                }`}
              >
                {mounts[key] ? '✓ ' : ''}
                {MOUNT_LABELS[key]}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Krok 4 — doplňky */}
      {step === 3 && (
        <section className="bg-white rounded-xl border border-palm-200 p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-palm-800 mb-2">
              Doplňující znaky
            </h2>
            <p className="text-gray-600">Nepovinné — zpřesní výsledek.</p>
          </div>
          {ADDITIONAL_GROUPS.map((group) => (
            <fieldset key={group.axis}>
              <legend className="font-semibold text-palm-700 mb-2">
                {group.legend}
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={additional[group.axis] === option.value}
                    onClick={() =>
                      setAdditional((prev) => ({
                        ...prev,
                        [group.axis]: option.value,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg border-2 ${
                      additional[group.axis] === option.value
                        ? 'bg-palm-600 border-palm-700 text-white'
                        : 'bg-white border-palm-200 hover:border-palm-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
        </section>
      )}

      {/* Krok 5 — souhrn */}
      {step === 4 && (
        <section className="bg-white rounded-xl border border-palm-200 p-6">
          <h2 className="text-2xl font-bold text-palm-800 mb-4">
            Souhrn před analýzou
          </h2>
          <dl className="space-y-2 text-gray-700">
            <div className="flex gap-2">
              <dt className="font-semibold">Typ ruky:</dt>
              <dd>
                {HAND_TYPES.find((type) => type.value === handType)?.label ??
                  'nevybráno'}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">Popsané čáry:</dt>
              <dd>
                {filledLines > 0
                  ? (Object.keys(lines) as LineKey[])
                      .map((key) => LINE_LABELS[key])
                      .join(', ')
                  : 'žádné'}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">Popsané pahorky:</dt>
              <dd>
                {filledMounts > 0
                  ? (Object.keys(mounts) as MountKey[])
                      .map((key) => MOUNT_LABELS[key])
                      .join(', ')
                  : 'žádné'}
              </dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={loading || !handType}
            className="mt-6 bg-palm-700 hover:bg-palm-800 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold"
          >
            {loading ? 'Analyzuji…' : 'Vygenerovat čtení'}
          </button>
          {!handType && (
            <p className="mt-2 text-sm text-red-600">
              Nejprve se vraťte na první krok a vyberte typ ruky.
            </p>
          )}
        </section>
      )}

      {/* Navigace */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(0, prev - 1))}
          disabled={step === 0}
          className="border-2 border-palm-300 text-palm-700 px-6 py-2 rounded-lg disabled:opacity-40"
        >
          Zpět
        </button>
        <button
          type="button"
          onClick={() => setStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
          disabled={step === STEPS.length - 1 || (step === 0 && !handType)}
          className="bg-palm-600 hover:bg-palm-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-300"
        >
          Další
        </button>
      </div>

      {openLine && (
        <FeatureModal
          title={LINE_LABELS[openLine]}
          description="Popište, jak čára vypadá na vaší dlani. Vyplnit můžete jen část."
          groups={LINE_GROUPS}
          values={draft}
          onChange={(axis, value) =>
            setDraft((prev) => ({ ...prev, [axis]: value }))
          }
          onClose={() => {
            setOpenLine(undefined)
            setDraft({})
          }}
          onConfirm={confirmLine}
          onSkip={() => {
            setLines((prev) => ({ ...prev, [openLine]: { present: false } }))
            setOpenLine(undefined)
            setDraft({})
          }}
        />
      )}

      {openMount && (
        <FeatureModal
          title={MOUNT_LABELS[openMount]}
          description="Nahmatejte vyvýšeninu palcem druhé ruky a porovnejte s okolím."
          groups={MOUNT_GROUPS}
          values={draft}
          onChange={(axis, value) =>
            setDraft((prev) => ({ ...prev, [axis]: value }))
          }
          onClose={() => {
            setOpenMount(undefined)
            setDraft({})
          }}
          onConfirm={confirmMount}
        />
      )}
    </div>
  )
}
