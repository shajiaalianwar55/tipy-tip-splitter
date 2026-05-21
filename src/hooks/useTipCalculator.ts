import {
  useCallback,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { calculateSplit, fromCents } from '../lib/calculate'
import {
  isBillInputAllowed,
  isPeopleInputAllowed,
  isTipInputAllowed,
  parseBill,
  parsePeople,
  parseTipPercent,
} from '../lib/parse'
import { TIP_PRESETS, type TipPreset } from '../lib/types'
import {
  isCalculationReady,
  validateInputs,
  type TouchState,
} from '../lib/validate'

export type CalculatorState = {
  bill: string
  tip: string
  people: string
  activePreset: TipPreset | null
  touched: TouchState
}

export const INITIAL_STATE: CalculatorState = {
  bill: '',
  tip: '15',
  people: '1',
  activePreset: 15,
  touched: { bill: false, tip: false, people: false },
}

export function useTipCalculator(
  state: CalculatorState,
  setState: Dispatch<SetStateAction<CalculatorState>>,
) {
  const billRef = useRef<HTMLInputElement>(null)

  const parsed = useMemo(
    () => ({
      bill: parseBill(state.bill),
      tip: parseTipPercent(state.tip),
      people: parsePeople(state.people),
    }),
    [state.bill, state.tip, state.people],
  )

  const errors = useMemo(
    () => validateInputs(parsed, state, state.touched),
    [parsed, state],
  )

  const ready = isCalculationReady(parsed, errors)

  const result = useMemo(() => {
    if (!ready || parsed.bill === null || parsed.tip === null || parsed.people === null) {
      return null
    }
    return calculateSplit(parsed.bill, parsed.tip, parsed.people)
  }, [ready, parsed])

  const setBill = useCallback(
    (value: string) => {
      if (!isBillInputAllowed(value)) return
      setState((s) => ({ ...s, bill: value, touched: { ...s.touched, bill: true } }))
    },
    [setState],
  )

  const setTip = useCallback(
    (value: string) => {
      if (!isTipInputAllowed(value)) return
      const preset = TIP_PRESETS.find((p) => String(p) === value) ?? null
      setState((s) => ({
        ...s,
        tip: value,
        activePreset: preset,
        touched: { ...s.touched, tip: true },
      }))
    },
    [setState],
  )

  const setPeople = useCallback(
    (value: string) => {
      if (!isPeopleInputAllowed(value)) return
      setState((s) => ({
        ...s,
        people: value,
        touched: { ...s.touched, people: true },
      }))
    },
    [setState],
  )

  const selectPreset = useCallback(
    (preset: TipPreset) => {
      setState((s) => ({
        ...s,
        tip: String(preset),
        activePreset: preset,
        touched: { ...s.touched, tip: true },
      }))
    },
    [setState],
  )

  const touchField = useCallback(
    (field: keyof TouchState) => {
      setState((s) => ({
        ...s,
        touched: { ...s.touched, [field]: true },
      }))
    },
    [setState],
  )

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    requestAnimationFrame(() => billRef.current?.focus())
  }, [setState])

  const perPersonDisplay = useMemo(() => {
    if (!result) return null
    const base = fromCents(result.perPersonBaseCents)
    const extra = fromCents(result.perPersonBaseCents + 1)
    const { remainderCount } = result
    const people = parsed.people ?? 1
    if (remainderCount === 0) {
      return { primary: base, note: null as string | null }
    }
    const normalCount = people - remainderCount
    return {
      primary: extra,
      note:
        remainderCount === people
          ? `Each person pays ${formatNote(extra)}`
          : `First ${remainderCount} ${remainderCount === 1 ? 'person pays' : 'people pay'} ${formatNote(extra)}; ${normalCount > 0 ? `the other ${normalCount} ${normalCount === 1 ? 'person pays' : 'people pay'} ${formatNote(base)}` : ''}`,
    }
  }, [result, parsed.people])

  return {
    billRef,
    parsed,
    errors,
    ready,
    result,
    perPersonDisplay,
    setBill,
    setTip,
    setPeople,
    selectPreset,
    touchField,
    reset,
  }
}

function formatNote(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
