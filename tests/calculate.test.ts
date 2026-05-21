import { describe, expect, it } from 'vitest'
import {
  calculateSplit,
  fromCents,
  toCents,
  verifySplitTotals,
} from '../src/lib/calculate'

describe('calculateSplit', () => {
  it('computes tip and grand total for $100 at 15% with 3 people', () => {
    const result = calculateSplit(100, 15, 3)
    expect(result.tipAmountCents).toBe(1500)
    expect(result.grandTotalCents).toBe(11500)
    expect(result.perPersonBaseCents).toBe(3833)
    expect(result.remainderCount).toBe(1)
    expect(verifySplitTotals(result, 3)).toBe(true)
  })

  it('distributes remainder so totals match exactly', () => {
    const result = calculateSplit(100, 0, 3)
    expect(result.grandTotalCents).toBe(10000)
    expect(result.perPersonBaseCents).toBe(3333)
    expect(result.remainderCount).toBe(1)
    const shares = [
      ...Array(result.remainderCount).fill(result.perPersonBaseCents + 1),
      ...Array(3 - result.remainderCount).fill(result.perPersonBaseCents),
    ]
    expect(shares.reduce((a, b) => a + b, 0)).toBe(result.grandTotalCents)
  })

  it('handles single person with no remainder', () => {
    const result = calculateSplit(50, 20, 1)
    expect(result.grandTotalCents).toBe(6000)
    expect(result.perPersonBaseCents).toBe(6000)
    expect(result.remainderCount).toBe(0)
    expect(verifySplitTotals(result, 1)).toBe(true)
  })

  it('handles zero tip', () => {
    const result = calculateSplit(42.5, 0, 2)
    expect(result.tipAmountCents).toBe(0)
    expect(result.grandTotalCents).toBe(toCents(42.5))
    expect(verifySplitTotals(result, 2)).toBe(true)
  })

  it('handles large bill within cap', () => {
    const result = calculateSplit(999999.99, 10, 5)
    expect(verifySplitTotals(result, 5)).toBe(true)
    expect(fromCents(result.grandTotalCents)).toBeGreaterThan(1_000_000)
  })
})

describe('toCents', () => {
  it('rounds half-up at two decimals', () => {
    expect(toCents(10.005)).toBe(1001)
    expect(toCents(10.004)).toBe(1000)
  })
})
