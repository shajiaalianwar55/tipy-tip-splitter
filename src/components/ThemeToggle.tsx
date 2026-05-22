import type { Theme } from '../hooks/useTheme'

type ThemeToggleProps = {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const tryLabel = isDark ? 'Try light mode' : 'Try dark mode'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={tryLabel}
      title={tryLabel}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span className="theme-toggle__label">{tryLabel}</span>
    </button>
  )
}
