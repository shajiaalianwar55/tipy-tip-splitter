const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(dollars: number): string {
  return currencyFormatter.format(dollars)
}

export function formatMoneyFromCents(cents: number): string {
  return formatMoney(cents / 100)
}

export function formatPercent(value: number): string {
  const trimmed = Number.isInteger(value) ? String(value) : String(value)
  return `${trimmed}%`
}
