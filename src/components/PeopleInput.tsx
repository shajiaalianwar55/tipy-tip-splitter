import {
  formatPeopleCount,
  handleArrowKeyDown,
} from '../lib/keyboardAdjust'
import { parsePeople } from '../lib/parse'
import { MAX_PEOPLE } from '../lib/types'
import { FieldError } from './FieldError'

type PeopleInputProps = {
  id: string
  errorId: string
  value: string
  error?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  onChange: (value: string) => void
  onBlur: () => void
  onEnter: () => void
}

export function PeopleInput({
  id,
  errorId,
  value,
  error,
  inputRef,
  onChange,
  onBlur,
  onEnter,
}: PeopleInputProps) {
  return (
    <div className="field">
      <label htmlFor={id}>Number of people</label>
      <input
        ref={inputRef}
        id={id}
        name="people"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="1"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
            e.preventDefault()
          }
          handleArrowKeyDown(e, {
            value,
            parse: parsePeople,
            step: 1,
            min: 1,
            max: MAX_PEOPLE,
            emptyDefault: 1,
            format: formatPeopleCount,
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
