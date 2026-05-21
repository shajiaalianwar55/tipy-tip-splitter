import type { SplitResult } from './types'

/** Convert dollars to integer cents, rounding half-up at 2 decimal places. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100)
}

export function fromCents(cents: number): number {
  return cents / 100
}

/**
 * Remainder distribution: floor split + 1 cent for first `remainder` people.
 * Sum of all shares always equals grandTotalCents.
 */
export function calculateSplit(
  billDollars: number,
  tipPercent: number,
  people: number,
): SplitResult {
  const billCents = toCents(billDollars)
  const tipCents = Math.round((billCents * tipPercent) / 100)
  const grandTotalCents = billCents + tipCents
  const perPersonBaseCents = Math.floor(grandTotalCents / people)
  const remainderCount = grandTotalCents % people

  return {
    tipAmountCents: tipCents,
    grandTotalCents,
    perPersonBaseCents,
    remainderCount,
  }
}

export function verifySplitTotals(result: SplitResult, people: number): boolean {
  const { grandTotalCents, perPersonBaseCents, remainderCount } = result
  const computed =
    perPersonBaseCents * (people - remainderCount) +
    (perPersonBaseCents + 1) * remainderCount
  return computed === grandTotalCents
}
