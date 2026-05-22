import type { CSSProperties } from 'react'
import {
  formatTipAmount,
  handleArrowKeyDown,
} from '../lib/keyboardAdjust'
import { parseTipPercent } from '../lib/parse'
import { MAX_TIP_PERCENT, TIP_PRESETS, type TipPreset } from '../lib/types'
import { FieldError } from './FieldError'

const SLIDER_STEP = 0.5

function getSliderValue(customValue: string): number {
  const parsed = parseTipPercent(customValue)
  if (parsed === null) return 0
  return Math.min(MAX_TIP_PERCENT, Math.max(0, parsed))
}

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
  const sliderId = `${customId}-slider`
  const sliderValue = getSliderValue(customValue)
  const describedBy = error ? `${errorId} ${sliderId}-value` : `${sliderId}-value`

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
            handleArrowKeyDown(e, {
              value: customValue,
              parse: parseTipPercent,
              step: SLIDER_STEP,
              min: 0,
              max: MAX_TIP_PERCENT,
              emptyDefault: SLIDER_STEP,
              format: formatTipAmount,
              onChange: onCustomChange,
            })
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
      <div className="tip-slider">
        <label htmlFor={sliderId} className="tip-slider__label">
          Slide to adjust
        </label>
        <div className="tip-slider__row">
          <div
            className="tip-slider__control"
            style={
              {
                '--tip-fill': `${(sliderValue / MAX_TIP_PERCENT) * 100}%`,
              } as CSSProperties
            }
          >
            <input
              id={sliderId}
              className="tip-slider__input"
              type="range"
              min={0}
              max={MAX_TIP_PERCENT}
              step={SLIDER_STEP}
              value={sliderValue}
              aria-labelledby="tip-label"
              aria-describedby={describedBy}
              aria-invalid={error ? true : undefined}
              onChange={(e) => onCustomChange(e.target.value)}
              onBlur={onBlur}
            />
          </div>
          <span id={`${sliderId}-value`} className="tip-slider__value" aria-live="polite">
            {sliderValue}%
          </span>
        </div>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}
