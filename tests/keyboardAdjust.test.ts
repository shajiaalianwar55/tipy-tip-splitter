import { describe, expect, it } from 'vitest'
import { adjustValueByArrow, formatBillAmount } from '../src/lib/keyboardAdjust'
import { parseBill, parsePeople, parseTipPercent } from '../src/lib/parse'
import { MAX_BILL, MAX_PEOPLE, MAX_TIP_PERCENT } from '../src/lib/types'

describe('adjustValueByArrow', () => {
  it('increments bill by 1', () => {
    const next = adjustValueByArrow('up', {
      value: '50',
      parse: parseBill,
      step: 1,
      min: 0,
      max: MAX_BILL,
      emptyDefault: 1,
      format: formatBillAmount,
    })
    expect(next).toBe('51')
  })

  it('decrements tip by 0.5', () => {
    const next = adjustValueByArrow('down', {
      value: '15',
      parse: parseTipPercent,
      step: 0.5,
      min: 0,
      max: MAX_TIP_PERCENT,
      emptyDefault: 0.5,
      format: (n) => (Number.isInteger(n) ? String(n) : String(n)),
    })
    expect(next).toBe('14.5')
  })

  it('clamps people at minimum 1', () => {
    const next = adjustValueByArrow('down', {
      value: '1',
      parse: parsePeople,
      step: 1,
      min: 1,
      max: MAX_PEOPLE,
      emptyDefault: 1,
      format: (n) => String(n),
    })
    expect(next).toBe('1')
  })
})
