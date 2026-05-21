import { describe, expect, it } from 'vitest'
import { parseBill, parsePeople, parseTipPercent } from '../src/lib/parse'
import {
  hasErrors,
  isCalculationReady,
  validateInputs,
} from '../src/lib/validate'

const untouched = { bill: false, tip: false, people: false }

function parsed(raw: { bill: string; tip: string; people: string }) {
  return {
    bill: parseBill(raw.bill),
    tip: parseTipPercent(raw.tip),
    people: parsePeople(raw.people),
  }
}

describe('validateInputs', () => {
  it('does not error on empty untouched fields', () => {
    const errors = validateInputs(
      { bill: null, tip: null, people: null },
      { bill: '', tip: '', people: '' },
      untouched,
    )
    expect(hasErrors(errors)).toBe(false)
  })

  it('errors on zero bill when touched', () => {
    const raw = { bill: '0', tip: '15', people: '2' }
    const errors = validateInputs(parsed(raw), raw, {
      bill: true,
      tip: true,
      people: true,
    })
    expect(errors.bill).toBe('Bill must be greater than 0')
  })

  it('errors on negative tip', () => {
    const raw = { bill: '50', tip: '-1', people: '2' }
    const errors = validateInputs(parsed(raw), raw, {
      bill: true,
      tip: true,
      people: true,
    })
    expect(errors.tip).toContain('between 0%')
  })

  it('errors on tip over 100%', () => {
    const raw = { bill: '50', tip: '101', people: '2' }
    const errors = validateInputs(parsed(raw), raw, {
      bill: true,
      tip: true,
      people: true,
    })
    expect(errors.tip).toContain('between 0%')
  })

  it('errors on zero people', () => {
    const raw = { bill: '50', tip: '15', people: '0' }
    const errors = validateInputs(parsed(raw), raw, {
      bill: true,
      tip: true,
      people: true,
    })
    expect(errors.people).toBe('At least 1 person required')
  })

  it('errors on garbage bill', () => {
    const raw = { bill: 'abc', tip: '15', people: '2' }
    const errors = validateInputs(parsed(raw), raw, {
      bill: true,
      tip: false,
      people: false,
    })
    expect(errors.bill).toBe('Enter a valid bill amount')
  })
})

describe('isCalculationReady', () => {
  it('is false when errors exist', () => {
    const raw = { bill: '0', tip: '15', people: '2' }
    const p = parsed(raw)
    const errors = validateInputs(p, raw, {
      bill: true,
      tip: true,
      people: true,
    })
    expect(isCalculationReady(p, errors)).toBe(false)
  })

  it('is true for valid inputs', () => {
    const raw = { bill: '100', tip: '15', people: '3' }
    const p = parsed(raw)
    const errors = validateInputs(p, raw, untouched)
    expect(isCalculationReady(p, errors)).toBe(true)
  })
})
