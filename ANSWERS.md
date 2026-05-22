# Assessment Answers

## 1. How to run

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone <your-repo-url>
cd tipy
npm install
npm run dev
```

Then open `http://localhost:5173` in a browser.

**Deployed URL:** https://tipy-tip-splitter.vercel.app/

---

## 2. Stack & design choices

**Why React + Vite + TypeScript**

- **React** keeps UI state (bill, tip presets, people, touched/errors) separate from pure calculation logic in `src/lib/`, which makes edge-case testing straightforward.
- **Vite** gives a fast dev server and a single `npm run dev` command for reviewers on a fresh machine.
- **TypeScript** catches mistakes in money math (cents vs dollars) at compile time.

**Design decision 1 — Sticky results column (~40% width on desktop)**

On viewports ≥768px, the layout uses a two-column grid: inputs on the left, results on the right with `position: sticky`. This keeps **Total tip**, **Grand total**, and **Per person** visible while editing the bill on a 1440px laptop. On 360px phones, the stack is single-column with results below the form and extra bottom padding so the mobile keyboard is less likely to cover the totals.

*Affects:* `src/App.css` `.layout` grid and `.results` sticky rules.

**Design decision 2 — Tip presets as large wrap chips**

Preset buttons (10% / 15% / 20%) use `min-height: 44px`, wrap on narrow screens, and show active state with **border + inset ring** (not color alone). That makes the active preset obvious on touch devices and avoids horizontal scrolling on a 360px-wide phone.

*Affects:* `src/components/TipSelector.tsx` and `.tip-presets` / `.tip-preset--active` in `src/App.css`.

---

## 3. Responsive & accessibility

**360px phone:** Single-column layout; inputs full-width; preset chips wrap; results panel sits below the form with `padding-bottom: 5rem` on the app shell so scrolled totals stay reachable above the keyboard; touch targets are at least 44px tall.

**1440px laptop:** Two-column grid (`1fr` + `minmax(280px, 40%)`); results stick to the top of the viewport while scrolling the form.

**Accessibility handled:** Each field uses a visible `<label>`, `aria-invalid` when invalid, and `aria-describedby` pointing at inline error text (`role="alert"`). Preset buttons use `aria-pressed`. Results use `aria-live="polite"` so screen readers hear updated totals. Keyboard users get visible `:focus-visible` rings on inputs and buttons. Enter in a field moves focus to the next control (bill → custom tip → people → reset).

**Accessibility skipped:** Full internationalization (multiple currencies/locales and RTL layouts). The app is USD-only with `en-US` formatting; adding i18n would need `Intl` locale props, translated strings, and RTL-aware layout (out of scope for a timed assessment).

---

## 4. AI usage

| Tool            | What I asked                                                                                          | What it gave                                                                                                        | What I changed                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatGPT         | Explain the assessment requirements, including inline validation and keyboard experience expectations | Clarification of requirements such as inline error messages, logical tab order, and mobile usability considerations | I decided how to implement these requirements in the final UI and validation flow                                                                               |
| ChatGPT         | Discuss frontend stack options and deployment approaches                                              | Comparison of options including Streamlit and React-based approaches                                                | I chose React + Vite because it provided better control over frontend interactions, responsiveness, and accessibility requirements                              |
| ChatGPT         | Suggest edge cases and testing scenarios                                                              | A comprehensive list of validation, keyboard, mobile, and input-handling test cases                                 | I manually tested and refined the application behaviour based on the suggested scenarios                                                                        |
| Cursor (Claude) | Generate the initial React application structure and calculator implementation                        | Initial component structure, calculation logic, validation, and styling                                             | I iteratively refined the implementation through multiple prompts and manual review                                                                             |
| Cursor (Claude) | Improve accessibility and usability features                                                          | Suggested implementation approaches for interaction improvements                                                    | I added a dark/light mode toggle, keyboard-friendly controls, arrow-key support for numeric inputs, and clearer validation messages                             |
| Cursor (Claude) | Enhance tip input experience                                                                          | Initial custom tip input implementation                                                                             | I added a percentage slider beneath the custom tip field, improved slider behaviour at 0% and 100%, and updated messaging to “Enter or choose a tip percentage” |
| Cursor (Claude) | Strengthen input validation                                                                           | Validation logic for bill amount, tip percentage, and people count                                                  | I enforced a maximum of two decimal places for bill and tip inputs and ensured people count only accepts whole numbers within defined limits                    |
| Cursor (Claude) & ChatGPT | Generate project documentation                                                                        | README.md and ANSWERS.md drafts                                                                             | I revised the setup instructions, AI usage disclosures, implementation explanations, and project-specific details                                               |


**Specific change example:** One AI-generated version accepted any number of decimal places for bill and tip inputs. I modified the validation rules to enforce a maximum of two decimal places because the application deals with currency values and displaying long decimal sequences would provide a poor user experience. This also keeps calculations consistent with standard monetary formatting.

---

## 5. Honest gap


**Gap:** The application currently relies on manual testing for interaction behaviour.

**With another day:** I would add automated end-to-end tests covering keyboard navigation, validation messages, tip selection, reset behaviour, and mobile viewport interactions to reduce the risk of regressions in future changes.

---

## Rounding policy

Money is computed in **integer cents** to avoid floating-point drift.

**Per-person split:** `grandTotalCents = billCents + tipCents`, then:

- `base = floor(grandTotalCents / people)`
- `remainder = grandTotalCents % people`
- The first `remainder` people pay `(base + 1)` cent; everyone else pays `base` cents.

This guarantees the sum of all shares **equals** the grand total exactly.

**Example:** Bill $100.00, tip 15%, 3 people.

- Tip: $15.00 → grand total $115.00 (11500¢)
- 11500 ÷ 3 → base 3833¢, remainder 1
- Person 1 pays **$38.34**; persons 2–3 pay **$38.33** each
- $38.34 + $38.33 + $38.33 = $115.00

When everyone pays the same (remainder 0), the UI shows a single per-person amount. When remainder > 0, a note explains who pays the extra cent.
