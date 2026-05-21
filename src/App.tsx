import { useRef, useState } from 'react'
import { BillInput } from './components/BillInput'
import { PeopleInput } from './components/PeopleInput'
import { ResetButton } from './components/ResetButton'
import { ResultsPanel } from './components/ResultsPanel'
import { TipSelector } from './components/TipSelector'
import {
  INITIAL_STATE,
  useTipCalculator,
  type CalculatorState,
} from './hooks/useTipCalculator'
import './App.css'

function App() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE)
  const tipCustomRef = useRef<HTMLInputElement>(null)
  const peopleRef = useRef<HTMLInputElement>(null)
  const resetRef = useRef<HTMLButtonElement>(null)

  const {
    billRef,
    errors,
    ready,
    result,
    perPersonDisplay,
    setBill,
    setTip,
    setPeople,
    selectPreset,
    touchField,
    reset,
  } = useTipCalculator(state, setState)

  const focusTipCustom = () => tipCustomRef.current?.focus()
  const focusPeople = () => peopleRef.current?.focus()
  const focusReset = () => resetRef.current?.focus()

  return (
    <div className="app">
      <header className="header">
        <h1>Tipy</h1>
        <p className="tagline">Split the bill fairly, to the cent.</p>
      </header>

      <main className="layout">
        <form
          className="inputs"
          noValidate
          onSubmit={(e) => e.preventDefault()}
        >
          <BillInput
            id="bill"
            errorId="bill-error"
            value={state.bill}
            error={errors.bill}
            inputRef={billRef}
            onChange={setBill}
            onBlur={() => touchField('bill')}
            onEnter={focusTipCustom}
          />

          <TipSelector
            customId="tip-custom"
            errorId="tip-error"
            customValue={state.tip}
            activePreset={state.activePreset}
            error={errors.tip}
            customInputRef={tipCustomRef}
            onSelectPreset={selectPreset}
            onCustomChange={setTip}
            onBlur={() => touchField('tip')}
            onEnter={focusPeople}
          />

          <PeopleInput
            id="people"
            errorId="people-error"
            value={state.people}
            error={errors.people}
            inputRef={peopleRef}
            onChange={setPeople}
            onBlur={() => touchField('people')}
            onEnter={focusReset}
          />

          <div className="actions">
            <ResetButton buttonRef={resetRef} onReset={reset} />
          </div>
        </form>

        <ResultsPanel
          result={result}
          ready={ready}
          perPersonDisplay={perPersonDisplay}
        />
      </main>
    </div>
  )
}

export default App
