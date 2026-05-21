import { TIP_PRESETS, type TipPreset } from '../lib/types'
import { FieldError } from './FieldError'

type TipSelectorProps = {
  customId: string
  errorId: string
  customValue: string
  activePreset: TipPreset | null
  error?: string
  customInputRef?: React.RefObject<HTMLInputElement | null>
  onSelectPreset: (preset: TipPreset) => void
  onCustomChange: (value: string) => void
  onBlur: () => void
  onEnter: () => void
}

export function TipSelector({
  customId,
  errorId,
  customValue,
  activePreset,
  error,
  customInputRef,
  onSelectPreset,
  onCustomChange,
  onBlur,
  onEnter,
}: TipSelectorProps) {
  return (
    <div className="field">
      <span id="tip-label" className="field-label">
        Tip percentage
      </span>
      <div
        className="tip-presets"
        role="group"
        aria-labelledby="tip-label"
      >
        {TIP_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`tip-preset${activePreset === preset ? ' tip-preset--active' : ''}`}
            aria-pressed={activePreset === preset}
            onClick={() => onSelectPreset(preset)}
          >
            {preset}%
          </button>
        ))}
      </div>
      <label htmlFor={customId} className="sr-only">
        Custom tip percentage
      </label>
      <div className="tip-custom">
        <input
          ref={customInputRef}
          id={customId}
          name="tip"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Custom %"
          value={customValue}
          aria-labelledby="tip-label"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onCustomChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onEnter()
            }
          }}
        />
        <span className="tip-suffix" aria-hidden="true">
          %
        </span>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}
