import {
  MAX_BILL,
  MAX_PEOPLE,
  MAX_TIP_PERCENT,
  type FieldErrors,
  type ParsedInputs,
} from './types'

export type TouchState = {
  bill: boolean
  tip: boolean
  people: boolean
}

export function validateInputs(
  parsed: ParsedInputs,
  raw: { bill: string; tip: string; people: string },
  touched: TouchState,
): FieldErrors {
  const errors: FieldErrors = {}

  const showBill = touched.bill || raw.bill.trim() !== ''
  const showTip = touched.tip || raw.tip.trim() !== ''
  const showPeople = touched.people || raw.people.trim() !== ''

  if (showBill) {
    if (raw.bill.trim() === '') {
      errors.bill = 'Enter a bill amount'
    } else if (parsed.bill === null) {
      errors.bill = 'Enter a valid bill amount'
    } else if (parsed.bill <= 0) {
      errors.bill = 'Bill must be greater than 0'
    } else if (parsed.bill > MAX_BILL) {
      errors.bill = 'Bill is too large'
    }
  }

  if (showTip) {
    if (raw.tip.trim() === '') {
      errors.tip = 'Enter a tip percentage'
    } else if (
      parsed.tip === null ||
      raw.tip.trim().startsWith('-') ||
      raw.tip.trim().startsWith('+')
    ) {
      errors.tip =
        raw.tip.trim().startsWith('-') || raw.tip.trim().startsWith('+')
          ? `Tip must be between 0% and ${MAX_TIP_PERCENT}%`
          : 'Enter a valid tip percentage'
    } else if (parsed.tip < 0 || parsed.tip > MAX_TIP_PERCENT) {
      errors.tip = `Tip must be between 0% and ${MAX_TIP_PERCENT}%`
    }
  }

  if (showPeople) {
    if (raw.people.trim() === '') {
      errors.people = 'Enter number of people'
    } else if (parsed.people === null) {
      errors.people = 'Enter a whole number of people'
    } else if (parsed.people < 1) {
      errors.people = 'At least 1 person required'
    } else if (!Number.isInteger(parsed.people)) {
      errors.people = 'At least 1 person required'
    } else if (parsed.people > MAX_PEOPLE) {
      errors.people = 'Too many people'
    }
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}

export function isCalculationReady(
  parsed: ParsedInputs,
  errors: FieldErrors,
): boolean {
  return (
    parsed.bill !== null &&
    parsed.bill > 0 &&
    parsed.tip !== null &&
    parsed.tip >= 0 &&
    parsed.tip <= MAX_TIP_PERCENT &&
    parsed.people !== null &&
    parsed.people >= 1 &&
    Number.isInteger(parsed.people) &&
    !hasErrors(errors)
  )
}
