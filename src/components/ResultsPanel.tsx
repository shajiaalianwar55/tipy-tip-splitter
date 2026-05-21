import { formatMoney, formatMoneyFromCents } from '../lib/format'
import type { SplitResult } from '../lib/types'

type ResultsPanelProps = {
  result: SplitResult | null
  ready: boolean
  perPersonDisplay: {
    primary: number
    note: string | null
  } | null
}

export function ResultsPanel({ result, ready, perPersonDisplay }: ResultsPanelProps) {
  return (
    <section
      className="results"
      aria-labelledby="results-heading"
      aria-live="polite"
    >
      <h2 id="results-heading">Your split</h2>
      <dl className="results-list">
        <div className="results-row">
          <dt>Total tip</dt>
          <dd>{ready && result ? formatMoneyFromCents(result.tipAmountCents) : '—'}</dd>
        </div>
        <div className="results-row results-row--highlight">
          <dt>Grand total</dt>
          <dd>{ready && result ? formatMoneyFromCents(result.grandTotalCents) : '—'}</dd>
        </div>
        <div className="results-row">
          <dt>Per person</dt>
          <dd>
            {ready && result && perPersonDisplay
              ? formatMoney(perPersonDisplay.primary)
              : '—'}
          </dd>
        </div>
      </dl>
      {ready && perPersonDisplay?.note && (
        <p className="results-note">{perPersonDisplay.note}</p>
      )}
    </section>
  )
}
