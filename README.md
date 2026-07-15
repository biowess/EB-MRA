<div align="center">

# EB-MRA

## Evidence-Based Medical Readiness Assessment

[![License](https://img.shields.io/badge/license-Source--Available%201.0-FFFBF0.svg)](./LICENSE)
[![Status](https://img.shields.io/badge/status-methodology%20proposal%20%7C%20not%20validated-FFFBF0.svg)](#scientific-status--limitations)
[![React](https://img.shields.io/badge/frontend-React%2019-FFFBF0.svg)](#tech-stack)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-FFFBF0.svg)](#tech-stack)
[![Vite](https://img.shields.io/badge/build-Vite-FFFBF0.svg)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/styling-Tailwind%20CSS-FFFBF0.svg)](#tech-stack)
[![Vitest](https://img.shields.io/badge/testing-Vitest-FFFBF0.svg)](#tech-stack)
[![Oxlint](https://img.shields.io/badge/linting-Oxlint-FFFBF0.svg)](#tech-stack)

</div>

> A deterministic, fully rule-based self-reflection instrument for premedical students, career changers, and early medical trainees. This project is a methodology proposal, not a validated clinical tool.

## Overview

EB-MRA is a 104-item, 8-domain self-report questionnaire with an auditable scoring engine and a plain-language report generator. It was built as a methodology proposal and engineering exercise to demonstrate how a transparent, rule-based psychometric-style instrument could be structured and later validated.

This project is **not**:

* a validated psychological or medical test
* a diagnostic, screening, or clinical tool
* an admissions, hiring, or credentialing instrument
* a substitute for professional medical or mental health advice

Every score produced by the app is traceable to an explicit rule. There is no hidden weighting, no machine learning, and no black-box scoring. See [`ALGORITHM.md`](./ALGORITHM.md) for the full code-level walkthrough of how responses become a report.

## What it does

A respondent answers 104 items across eight readiness domains and receives a structured report generated entirely from deterministic rules.

| # | Domain                                        | Code   |
| - | --------------------------------------------- | ------ |
| 1 | Systems & Analytical Reasoning                | `SAR`  |
| 2 | Evidence Literacy & Critical Appraisal        | `ELCA` |
| 3 | Intellectual Humility & Openness to Revision  | `IHOR` |
| 4 | Ambiguity Tolerance                           | `AMB`  |
| 5 | Empathic Communication & Patient-Centred Care | `ECPC` |
| 6 | Ethics & Reflective Practice                  | `ERP`  |
| 7 | Conscientiousness & Self-Regulation           | `CSR`  |
| 8 | Resilience & Stress Tolerance                 | `RST`  |

The engine also includes:

* a safety gate that redirects to crisis resources when responses indicate acute risk
* validity checks for consistency, straight-lining, contradictions, and social desirability
* a confidence rating adjusted by validity indicators
* cross-domain interaction rules for nuanced feedback
* a 24-profile assignment system for narrative interpretation

The full technical specification in `ebmraspec.md` covers domain rationale, item bank design, scoring formulas, report templates, profile logic, data schemas, and the validation roadmap.

## Scientific status and limitations

EB-MRA has **not** been field-tested. There is no established reliability or validity evidence yet, including internal consistency, test-retest reliability, predictive validity, or construct validity. Any psychometric-style quantities in the spec and codebase are placeholders pending formal validation.

Report language is intentionally cautious. It describes patterns such as “consistently endorses” rather than making stronger claims about ability or competence. See Part 1 §1.3 and Part 7 of `ebmraspec.md` for the full limitations discussion and proposed validation plan.

If you or someone you know is in crisis, this app is not a substitute for professional help. Please contact local emergency services or a crisis line in your area.

## Tech stack

* **React 19**
* **TypeScript**
* **Vite**
* **React Router 7** for routing
* **Framer Motion** for transitions and motion
* **Tailwind CSS 4** with a custom design-token layer in `src/styles/tokens.css`
* **Vitest**, **Testing Library**, and **jsdom** for testing
* **Oxlint** for linting
* Versioned JSON content in `src/data/` for questions, weights, thresholds, profiles, and report copy
* Typed loaders and pure engine functions for deterministic scoring

## Getting started

```bash
# Clone the repository
git clone https://github.com/<your-username>/ebmra-app.git
cd ebmra-app/ebmra-app

# Install dependencies
npm install

# Run the development server
npm run dev

# Run the test suite
npm test

# Lint the codebase
npm run lint

# Build for production
npm run build
```

Requires Node.js 20 or later.

## Project structure

```text
ebmra-app/
├── ebmraspec.md          # Full technical specification
├── ALGORITHM.md          # Scoring pipeline walkthrough
├── LICENSE
└── ebmra-app/            # Vite + React application
    ├── src/
    │   ├── data/         # Questions, weights, domains, profiles, rules
    │   ├── engine/       # Pure scoring functions
    │   │   ├── contribution.ts
    │   │   ├── domainScore.ts
    │   │   ├── validityChecks.ts
    │   │   └── profileAssignment.ts
    │   ├── hooks/        # useAssessment, useScoringResult
    │   ├── components/   # Question renderers, gates, layout
    │   ├── views/        # Home, Assessment, Report, FAQ, and more
    │   └── types/        # Shared TypeScript types
    └── tests/            # Integration tests
```

## How scoring works

The scoring pipeline is fully deterministic:

raw answers → item contribution scores → weighted domain means → normalized 0–100 domain scores → validity checks → confidence rating → cross-domain interactions → profile assignment

Every step is implemented as a pure function. The same inputs always produce the same outputs.

For the complete breakdown of formulas, thresholds, and implementation details, see [`ALGORITHM.md`](./ALGORITHM.md).

## License

This project is released under **Custom Source-Available License 1.0**. You may read, run, and study the code, but commercial use, resale, and rebranding are not permitted without written permission. See [`LICENSE`](./LICENSE) for the full terms.

## Author

Developed by **Mohammed W. Hammami** as an open and transparent methodology proposal.

Suggested citation:

> Hammami, M.W. (2026). *The Evidence-Based Medical Readiness Assessment (EB-MRA): Development, Scoring Architecture, and a Roadmap for Empirical Validation of a Self-Report Instrument for Premedical and Early Medical Trainees.*
