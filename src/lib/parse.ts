/** Strip currency/percent decoration and normalize whitespace. */
function sanitize(raw: string, allowDecimal: boolean): string {
  let s = raw.trim().replace(/[$,%\s,]/g, '')
  if (!allowDecimal) {
    s = s.replace(/\./g, '')
  }
  return s
}

/** True when the string is a valid partial or complete decimal number while typing. */
function isValidNumericShape(s: string, allowDecimal: boolean): boolean {
  if (s === '') return true
  if (!allowDecimal) return /^\d+$/.test(s)
  if (s === '.') return true
  return /^\d*\.?\d*$/.test(s) && (s.match(/\./g)?.length ?? 0) <= 1
}

export function parseBill(raw: string): number | null {
  const s = sanitize(raw, true)
  if (s === '' || s === '.') return null
  if (!isValidNumericShape(s, true)) return null
  const n = Number(s)
  if (!Number.isFinite(n)) return null
  return n
}

export function parseTipPercent(raw: string): number | null {
  const s = sanitize(raw, true)
  if (s === '' || s === '.') return null
  if (!isValidNumericShape(s, true)) return null
  const n = Number(s)
  if (!Number.isFinite(n)) return null
  return n
}

export function parsePeople(raw: string): number | null {
  if (raw.includes('.') || raw.includes('e') || raw.includes('E')) return null
  const s = sanitize(raw, false)
  if (s === '') return null
  if (!isValidNumericShape(s, false)) return null
  const n = Number(s)
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null
  return n
}

export function isBillInputAllowed(raw: string): boolean {
  const s = sanitize(raw, true)
  return isValidNumericShape(s, true)
}


export function isPeopleInputAllowed(raw: string): boolean {
  if (raw.includes('.') || raw.includes('e') || raw.includes('E')) return false
  const s = sanitize(raw, false)
  return isValidNumericShape(s, false)
}

export function isTipInputAllowed(raw: string): boolean {
  if (raw.includes('-') || raw.includes('+')) return false
  const s = sanitize(raw, true)
  return isValidNumericShape(s, true)
}
