import { describe, expect, it } from 'vitest'
import {
  isBillInputAllowed,
  isPeopleInputAllowed,
  isTipInputAllowed,
  parseBill,
  parsePeople,
  parseTipPercent,
} from '../src/lib/parse'

describe('parseBill', () => {
  it('parses plain numbers', () => {
    expect(parseBill('100')).toBe(100)
    expect(parseBill('42.50')).toBe(42.5)
  })

  it('strips currency symbols and commas', () => {
    expect(parseBill('$1,234.56')).toBe(1234.56)
  })

  it('returns null for empty or invalid', () => {
    expect(parseBill('')).toBeNull()
    expect(parseBill('abc')).toBeNull()
    expect(parseBill('12abc')).toBeNull()
    expect(parseBill('--5')).toBeNull()
    expect(parseBill('1e5')).toBeNull()
  })

  it('rejects invalid shapes while typing guard', () => {
    expect(isBillInputAllowed('12.3.4')).toBe(false)
    expect(isBillInputAllowed('abc')).toBe(false)
  })

  it('allows at most 2 decimal places', () => {
    expect(isBillInputAllowed('12.34')).toBe(true)
    expect(isBillInputAllowed('12.345')).toBe(false)
    expect(parseBill('12.345')).toBeNull()
  })
})

describe('parseTipPercent', () => {
  it('parses with percent sign', () => {
    expect(parseTipPercent('20%')).toBe(20)
    expect(parseTipPercent('15.5')).toBe(15.5)
  })

  it('returns null for garbage', () => {
    expect(parseTipPercent('abc')).toBeNull()
    expect(parseTipPercent('-5')).toBeNull()
  })

  it('allows at most 2 decimal places', () => {
    expect(isTipInputAllowed('15.55')).toBe(true)
    expect(isTipInputAllowed('15.555')).toBe(false)
    expect(parseTipPercent('15.555')).toBeNull()
  })
})

describe('parsePeople', () => {
  it('parses integers only', () => {
    expect(parsePeople('3')).toBe(3)
    expect(parsePeople('001')).toBe(1)
  })

  it('rejects decimals and garbage', () => {
    expect(parsePeople('2.7')).toBeNull()
    expect(parsePeople('abc')).toBeNull()
    expect(parsePeople('1.5')).toBeNull()
  })

  it('blocks decimal input while typing', () => {
    expect(isPeopleInputAllowed('2.')).toBe(false)
    expect(isPeopleInputAllowed('2.7')).toBe(false)
    expect(isTipInputAllowed('e')).toBe(false)
  })
})
