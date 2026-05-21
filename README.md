# Tipy — Tip Calculator & Bill Splitter

A single-screen tip calculator that updates live as you type. Built for the Frontend Assessment (Tip Calculator variant).

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm 9+

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Other commands

```bash
npm run build    # production build
npm run preview  # serve the production build
npm test         # run unit tests (calculation & validation)
```

## Deployed demo

_Not deployed yet._ To deploy: run `npm run build` and publish the `dist/` folder to Vercel, Netlify, or GitHub Pages.

## Project structure

- `src/lib/` — pure parsing, validation, and cent-accurate split math (Vitest-tested)
- `src/components/` — UI inputs and results panel
- `src/hooks/useTipCalculator.ts` — state wiring between UI and lib
- `ANSWERS.md` — assessment write-up (stack, a11y, rounding policy, AI usage)
