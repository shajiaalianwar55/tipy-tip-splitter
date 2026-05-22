import {
  formatBillAmount,
  handleArrowKeyDown,
} from '../lib/keyboardAdjust'
import { parseBill } from '../lib/parse'
import { MAX_BILL } from '../lib/types'
import { FieldError } from './FieldError'

type BillInputProps = {
  id: string
  errorId: string
  value: string
  error?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onBlur: () => void
  onEnter: () => void
}

export function BillInput({
  id,
  errorId,
  value,
  error,
  inputRef,
  onChange,
  onBlur,
  onEnter,
}: BillInputProps) {
  return (
    <div className="field">
      <label htmlFor={id}>Bill amount (USD)</label>
      <input
        ref={inputRef}
        id={id}
        name="bill"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0.00"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          handleArrowKeyDown(e, {
            value,
            parse: parseBill,
            step: 1,
            min: 0,
            max: MAX_BILL,
            emptyDefault: 1,
            format: formatBillAmount,
            onChange,
          })
          if (e.key === 'Enter') {
            e.preventDefault()
            onEnter()
          }
        }}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}
