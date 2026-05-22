import type { KeyboardEvent } from 'react'

export type ArrowAdjustOptions = {
  value: string
  parse: (raw: string) => number | null
  step: number
  min: number
  max: number
  emptyDefault: number
  format: (n: number) => string
}

function roundToStep(n: number, step: number): number {
  const decimals = String(step).includes('.')
    ? String(step).split('.')[1]?.length ?? 0
    : 0
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}

export function adjustValueByArrow(
  direction: 'up' | 'down',
  options: ArrowAdjustOptions,
): string | null {
  const { value, parse, step, min, max, emptyDefault, format } = options
  const delta = direction === 'up' ? step : -step

  let next: number
  if (value.trim() === '') {
    next =
      direction === 'up'
        ? emptyDefault
        : roundToStep(emptyDefault - step, step)
  } else {
    const parsed = parse(value)
    if (parsed === null) return null
    next = roundToStep(parsed + delta, step)
  }

  next = Math.min(max, Math.max(min, next))
  return format(next)
}

export function handleArrowKeyDown(
  e: KeyboardEvent<HTMLInputElement>,
  options: ArrowAdjustOptions & { onChange: (value: string) => void },
): void {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return

  e.preventDefault()
  const direction = e.key === 'ArrowUp' ? 'up' : 'down'
  const next = adjustValueByArrow(direction, options)
  if (next !== null) options.onChange(next)
}

export function formatBillAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export function formatTipAmount(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n)
}

export function formatPeopleCount(n: number): string {
  return String(Math.round(n))
}
