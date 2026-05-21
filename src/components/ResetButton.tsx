type ResetButtonProps = {
  buttonRef?: React.RefObject<HTMLButtonElement | null>
  onReset: () => void
}

export function ResetButton({ buttonRef, onReset }: ResetButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="btn-reset"
      onClick={onReset}
    >
      Reset
    </button>
  )
}
