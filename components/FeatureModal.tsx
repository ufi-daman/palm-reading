'use client'

import { useEffect } from 'react'

export interface OptionGroup {
  /** Klíč osy, např. "strength" nebo "size". */
  axis: string
  legend: string
  options: { value: string; label: string; hint?: string }[]
}

export interface FeatureModalProps {
  title: string
  description?: string
  groups: OptionGroup[]
  values: Record<string, string | undefined>
  onChange: (axis: string, value: string) => void
  onClose: () => void
  onConfirm: () => void
  onSkip?: () => void
}

export function FeatureModal({
  title,
  description,
  groups,
  values,
  onChange,
  onClose,
  onConfirm,
  onSkip,
}: FeatureModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="modal-overlay p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="modal-content w-full"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-palm-800 mb-1">{title}</h2>
        {description && <p className="text-gray-600 mb-5">{description}</p>}

        <div className="space-y-6">
          {groups.map((group) => (
            <fieldset key={group.axis}>
              <legend className="font-semibold text-palm-700 mb-2">
                {group.legend}
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const selected = values[group.axis] === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => onChange(group.axis, option.value)}
                      title={option.hint}
                      className={`px-4 py-2 rounded-lg border-2 transition ${
                        selected
                          ? 'bg-palm-600 border-palm-700 text-white'
                          : 'bg-white border-palm-200 text-palm-800 hover:border-palm-400'
                      }`}
                      aria-pressed={selected}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-8">
          <button
            type="button"
            onClick={onConfirm}
            className="bg-palm-700 hover:bg-palm-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Potvrdit
          </button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="border-2 border-palm-300 text-palm-700 px-6 py-2 rounded-lg hover:bg-palm-50"
            >
              Přeskočit
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 px-4 py-2 rounded-lg hover:text-gray-700"
          >
            Zavřít
          </button>
        </div>
      </div>
    </div>
  )
}
