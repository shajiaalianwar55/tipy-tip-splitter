export type FieldKey = 'bill' | 'tip' | 'people'

export type FieldErrors = Partial<Record<FieldKey, string>>

export type ParsedInputs = {
  bill: number | null
  tip: number | null
  people: number | null
}

export type SplitResult = {
  tipAmountCents: number
  grandTotalCents: number
  perPersonBaseCents: number
  remainderCount: number
}

export const TIP_PRESETS = [10, 15, 20] as const
export type TipPreset = (typeof TIP_PRESETS)[number]

export const MAX_BILL = 999_999.99
export const MAX_TIP_PERCENT = 100
export const MAX_PEOPLE = 999
