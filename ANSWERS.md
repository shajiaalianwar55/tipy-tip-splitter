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

**Production preview:**

```bash
npm run build
npm run preview
```

**Tests:**

```bash
npm test
```

**Deployed URL:** Not deployed for this submission. A one-command deploy would be `npm run build` and upload `dist/` to Vercel or Netlify.

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

**Accessibility skipped:** Full internationalization (multiple currencies/locales and RTL layouts). The app is USD-only with `en-US` formatting; adding i18n would need `Intl` locale props, translated strings, and RTL-aware layout — out of scope for a timed assessment.

---

## 4. AI usage

| Tool | What I asked | What it gave | What I changed |
|------|----------------|--------------|----------------|
| Cursor (Claude) | Implement assessment plan: structure, validation, rounding | Scaffolded React+Vite layout, lib modules, component list | I chose **cent remainder distribution** instead of a naive `round(total/people)` and added Vitest tests for adversarial inputs |
| Cursor (Claude) | Foolproof parsing for pasted garbage | Regex-based sanitizers | I made `parsePeople` **reject** strings containing `.` instead of stripping the dot (which turned `"2.7"` into `27`) |
| Cursor (Claude) | Styling / layout | Dark theme CSS with grid | I set desktop results to **40% column width sticky** and mobile **5rem bottom padding** for keyboard clearance |

**Specific change example:** The AI’s first pass stripped punctuation from people input, so `"2.7"` parsed as `27`. I changed `parsePeople` and `isPeopleInputAllowed` to return invalid when the raw string contains `.`, and block `.` / `e` in `onKeyDown` on the people field — so graders pasting `"2.7"` see “Enter a whole number of people” instead of a wrong split.

---

## 5. Honest gap

**Gap:** No deployed public URL yet, and no end-to-end browser tests (Playwright). Unit tests cover math/validation, but not real mobile keyboard overlap in every browser.

**With another day:** Deploy to Vercel from `dist/`, add a short Playwright smoke test (type bill → see grand total), and record a 10-second phone viewport clip to verify keyboard + scroll behavior.

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
