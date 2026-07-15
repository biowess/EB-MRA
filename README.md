# EB-MRA — Evidence-Based Medical Readiness Assessment

> A deterministic, fully rule-based self-reflection instrument for premedical students, career-changers, and early medical trainees — built as a methodology proposal, not a validated clinical tool.

[![License: Custom Source-Available 1.0](https://img.shields.io/badge/license-Source--Available%201.0-blue.svg)](./LICENSE)
[![Built with React](https://img.shields.io/badge/frontend-React%2019%20%2B%20TypeScript-61dafb.svg)](#tech-stack)
[![Status](https://img.shields.io/badge/status-methodology%20proposal%20%7C%20not%20validated-orange.svg)](#-scientific-status--limitations)

---

## ⚠️ What this is — and what it is not

EB-MRA is a **104-item, 8-domain, fully deterministic self-report questionnaire** with an auditable scoring engine and a plain-language report generator. It was built as a **methodology proposal and engineering exercise**: a demonstration of how a transparent, rule-based (no ML, no black box) psychometric-style instrument *could* be built and eventually validated.

It is **not**:
- A validated psychological or medical test (no reliability/validity data exists yet — see [Scientific Status](#-scientific-status--limitations))
- A diagnostic, screening, or clinical tool
- An admissions, hiring, or credentialing input
- A substitute for professional medical or mental health advice

Every score in this app is fully traceable to an explicit, documented rule. There is no hidden weighting and no AI/ML in the scoring path — see [`ALGORITHM.md`](./ALGORITHM.md) for the complete, code-level walkthrough of how a raw answer becomes a report.

---

## What it does

A respondent answers 104 items (Likert-scale, forced-choice, and scenario-based) spanning eight readiness domains, and receives a plain-language report built entirely from deterministic rules:

| # | Domain | Code |
|---|---|---|
| 1 | Systems & Analytical Reasoning | `SAR` |
| 2 | Evidence Literacy & Critical Appraisal | `ELCA` |
| 3 | Intellectual Humility & Openness to Revision | `IHOR` |
| 4 | Ambiguity Tolerance | `AMB` |
| 5 | Empathic Communication & Patient-Centred Care | `ECPC` |
| 6 | Ethics & Reflective Practice | `ERP` |
| 7 | Conscientiousness & Self-Regulation | `CSR` |
| 8 | Resilience & Stress Tolerance | `RST` |

On top of the eight domain scores, the engine runs:

- **A safety gate** that halts scoring and redirects to crisis resources if a respondent's answers indicate acute risk
- **Validity checks** — consistency-pair divergence, straight-line (careless-response) detection, core-vs-scenario contradiction detection, and a social-desirability index
- **An overall confidence rating**, penalized by the validity checks above
- **8 cross-domain interaction rules** (e.g., high analytical reasoning + low ambiguity tolerance) that surface nuanced, non-obvious feedback
- **A 24-profile assignment system** that matches the respondent's domain-tier pattern to the best-fit narrative profile

The full 8-part technical specification behind this build (`ebmraspec.md`) covers domain rationale, the complete item bank, scoring formulas, report templates, the profile matrix, developer data schemas, and a roadmap for turning this into a real, statistically validated instrument.

## 📊 Scientific status & limitations

This instrument has **not been field-tested**. There is no established reliability (Cronbach's alpha, test-retest) or validity (predictive, construct) data. Every psychometric-sounding number in the spec and codebase is explicitly a placeholder pending a real validation study. Report language is deliberately hedged ("consistently endorses…" rather than "is skilled at…") to avoid overstating what a self-report questionnaire can claim. See Part 1 §1.3 and Part 7 of `ebmraspec.md` for the full discussion and the proposed validation roadmap.

If you or someone you know is in crisis, this app is not a substitute for professional help — please reach out to a crisis line or emergency services in your area.

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **React Router 7** for navigation, **Framer Motion** for page/section transitions
- **Tailwind CSS 4** for styling, with a custom design-token layer (`src/styles/tokens.css`)
- **Vitest** + **Testing Library** + **jsdom** for unit/integration tests
- **Oxlint** for linting
- All domain content (questions, weights, thresholds, profiles, report copy) lives in versioned JSON under `src/data/`, loaded and validated by typed loaders — the scoring engine itself contains no hard-coded content

## Getting started

```bash
# clone
git clone https://github.com/<your-username>/ebmra-app.git
cd ebmra-app/ebmra-app

# install
npm install

# run the dev server
npm run dev

# run the test suite
npm test

# lint
npm run lint

# production build
npm run build
```

Requires Node 20+ (Vite 8 / Vitest 4 target current-LTS Node).

## Project structure

```
ebmra-app/
├── ebmraspec.md              # Full 8-part technical specification (source of truth)
├── ALGORITHM.md              # Code-level walkthrough of the scoring pipeline
├── LICENSE
└── ebmra-app/                # The Vite/React application
    ├── src/
    │   ├── data/              # Questions, weights, domains, profiles, rules — as JSON
    │   ├── engine/             # Pure scoring functions (no React, no side effects)
    │   │   ├── contribution.ts       # raw answer → contribution score
    │   │   ├── domainScore.ts        # full scoring pipeline orchestrator
    │   │   ├── validityChecks.ts     # consistency / straight-line / contradiction / SD
    │   │   └── profileAssignment.ts  # domain-tier pattern → best-fit profile
    │   ├── hooks/              # useAssessment, useScoringResult
    │   ├── components/         # Question renderers, gates, layout
    │   ├── views/               # Routed pages (Home, Assessment, Report, FAQ, etc.)
    │   └── types/                # Shared TypeScript types
    └── tests/                   # Integration tests
```

## How scoring works

The short version: raw answers → per-item contribution scores → per-domain weighted mean → normalized 0–100 domain scores → validity checks run in parallel → confidence rating → interaction rules evaluated against final scores → profile assignment. Every step is a pure function over the answer set — same input, same output, every time.

For the full breakdown — every formula, every threshold, and where each lives in the codebase — see **[`ALGORITHM.md`](./ALGORITHM.md)**.

## License

This project is released under a **Custom Source-Available License 1.0** — you're welcome to read, run, and learn from the code, but commercial use, resale, and rebranding are not permitted without written permission. See [`LICENSE`](./LICENSE) for the full terms.

## Author

Developed by **Mohammed W. Hammami** as an open, transparent methodology proposal. Suggested citation:

> Hammami, M.W. (2026). *The Evidence-Based Medical Readiness Assessment (EB-MRA): Development, Scoring Architecture, and a Roadmap for Empirical Validation of a Self-Report Instrument for Premedical and Early Medical Trainees.*