# ALGORITHM.md — How the EB-MRA Scoring Engine Works

This document is a pure, code-level walkthrough of the scoring pipeline: no product copy, no UI concerns — just how a raw answer set becomes a `ScoringResult`. It mirrors `ebmraspec.md` Part 3 (§4–5) but is organized around the actual implementation in `src/engine/`, so you can read this side-by-side with the code.

Everything described here is a **pure function of the answer set**. There is no randomness, no external model call, and no hidden state — the same 104 answers always produce the same result.

## Contents

1. [Pipeline overview](#1-pipeline-overview)
2. [Data model](#2-data-model)
3. [Step 1 — Contribution score](#3-step-1--contribution-score)
4. [Step 2 — Safety gate](#4-step-2--safety-gate)
5. [Step 3 — Per-domain weighted scoring](#5-step-3--per-domain-weighted-scoring)
6. [Step 4 — Normalization to 0–100](#6-step-4--normalization-to-0100)
7. [Step 5 — Missing-data handling](#7-step-5--missing-data-handling)
8. [Step 6 — Validity checks](#8-step-6--validity-checks)
9. [Step 7 — Confidence rating](#9-step-7--confidence-rating)
10. [Step 8 — Interaction rules](#10-step-8--interaction-rules)
11. [Step 9 — Profile assignment](#11-step-9--profile-assignment)
12. [Worked example](#12-worked-example)
13. [Source map](#13-source-map)

---

## 1. Pipeline overview

`computeDomainScore()` in `src/engine/domainScore.ts` is the single entry point. It runs, in fixed order:

```
answers (Record<questionId, AnswerValue>)
   │
   ▼
1. checkSafetyGate()          → safety_gate_triggered, safety_gate_details
2. computeDomainScores()      → per-domain raw + normalized scores
3. checkConsistency()         → 10 consistency-pair checks
4. detectStraightLine()       → careless-response detection
5. detectContradictions()     → core-vs-scenario contradiction per domain
6. computeSDIndex()           → social-desirability index
7. computeConfidence()        → 0–100 overall confidence
8. evaluateInteractionRules() → cross-domain flags, evaluated on FINAL scores
9. shouldSuppressProfile()    → SD-index-based profile suppression
   │
   ▼
ScoringResult
```

The safety gate is deliberately evaluated first and independently of everything else — in the product, a triggered safety gate **halts** the normal report flow regardless of what any other step computes.

## 2. Data model

- **`AnswerValue`** — `1 | 2 | 3 | 4 | 5 | "A" | "B" | "C" | "D"`. Numeric values are raw Likert-5 responses; letters are `SINGLE_SELECT` scenario-item choices.
- **`Question`** — one of 104 items, each tagged with `domain`, `item_type` (`core` / `auxiliary` / `scenario` / `auxiliary_sd_detector`), `response_type` (`LIKERT5` / `SINGLE_SELECT`), and `reverse_scored`.
- **`WeightEntry`** (`src/data/weights.json`, per domain) — `{ weight, reverse, scored_toward_domain, option_scores? }` for each item. This is the single source of truth for how much an item counts, whether it's reverse-keyed, and whether it counts toward the domain total at all (the `*-A03` SD-detector items are `scored_toward_domain: false`).

Every domain has 13 items: 8 core + 3 auxiliary + 2 scenario, of which 12 are `scored_toward_domain = true` (the SD-detector `*-A03` item is excluded from domain scoring but still feeds the SD index — see §8).

## 3. Step 1 — Contribution score

`src/engine/contribution.ts`

Every raw answer is first converted into a **contribution score** in the range `[1, 5]`:

```ts
function contributionScore(rawValue, question) {
  if (question.response_type === "SINGLE_SELECT") {
    // scenario items: look up the pre-authored option_scores table
    return WEIGHTS[question.domain][question.id].option_scores[rawValue]
  }

  // LIKERT5 items
  return question.reverse_scored ? 6 - rawValue : rawValue
}
```

- **Forward-keyed Likert items**: contribution = raw value, unchanged.
- **Reverse-keyed Likert items**: contribution = `6 − raw value` (so a raw `1` becomes contribution `5`, etc.) — this is what lets a "disagree with a negatively-worded statement" answer count the same direction as "agree with a positively-worded" one.
- **Scenario (`SINGLE_SELECT`) items**: each option (`A`/`B`/`C`/`D`) has a pre-authored score baked into `weights.json`, since scenario options don't map onto a simple numeric scale.

This single function is the only place raw answers touch a lookup table — everything downstream operates on contribution scores.

## 4. Step 2 — Safety gate

`checkSafetyGate()` in `domainScore.ts`

Runs **before** anything else. Triggers a hard stop when:

1. The main scenario item `RST-S02` was answered with option `"C"` (the crisis-indicating option), **and**
2. At least 2 of the 3 satellite items `RST-C03`, `RST-C05`, `RST-C08` were answered **and** at least 2 of those answered items have `contribution_score ≤ 2`.

```ts
if (mainAnswer !== "C") return null            // not triggered
const flagged = satelliteItems.filter(s => contribution(s) <= 2)
if (answeredSatellites.length < 2 || flagged.length < 2) return null
return { main_item: "RST-S02", supporting_items: [...] }
```

Requiring a **corroborating pattern** (main item + 2 satellite items), rather than a single item, is a deliberate design choice to reduce false positives from a single ambiguous answer while still being sensitive to a genuine pattern. When triggered, the product routes the respondent to crisis resources instead of a report.

## 5. Step 3 — Per-domain weighted scoring

`computeDomainScores()` in `domainScore.ts` — spec §5.1–5.2

For each of the 8 domains, over its `scored_toward_domain = true` items that were actually answered:

```
RawSum(D)         = Σ contribution_score(i) × item_weight(i)
EffectiveWeight(D) = Σ item_weight(i)
WeightedMean(D)    = RawSum(D) / EffectiveWeight(D)        // in [1, 5]
```

This is an **available-item weighted mean** — unanswered items are excluded from *both* numerator and denominator, not zero-filled. Zero-filling would bias scores downward purely because someone skipped a question, which the spec explicitly calls out as unacceptable.

At full completion, `EffectiveWeight(D) = 8×1.0 (core) + 2×0.5 (non-SD auxiliary) + 2×1.5 (scenario) = 12.0`.

## 6. Step 4 — Normalization to 0–100

```
DomainScore(D) = ROUND( (WeightedMean(D) − 1) / 4 × 100, 1 )
clamped to [0, 100]
```

```ts
const normalized = Math.round(((rawWeightedMean - 1) / 4) * 100 * 10) / 10
const clamped = Math.max(0, Math.min(100, normalized))
```

This linearly stretches the `[1, 5]` weighted-mean range to `[0, 100]` with one decimal place of precision. A `WeightedMean` of `3.8`, for example, normalizes to `70.0`.

## 7. Step 5 — Missing-data handling

Three tiers, all evaluated in `computeDomainScores()` / `computeDomainScore()`:

| Tier | Condition | Effect |
|---|---|---|
| 1 — item | ≤ 2 items missing in a domain | Silently excluded from that domain's mean (§5) — no flag |
| 2 — domain | ≥ 3 items missing in a single domain | `insufficient_data: true`, `normalized_score: null`, flagged `"score_suppressed"` — still computed internally but the report must not display a number |
| 3 — assessment | > 25% of all 104 items missing | `incomplete: true` at the top level — the product should not generate a full report at all |

Tier 3's separate **10%** threshold (rather than 25%) also feeds a `−10` global confidence penalty (`CM-02`, see §9) even before the assessment is bad enough to be `incomplete`.

## 8. Step 6 — Validity checks

`checkConsistency()`, `detectStraightLine()`, `detectContradictions()`, `computeSDIndex()` in `domainScore.ts` (equivalently `validityChecks.ts` for the standalone, hook-level versions used elsewhere in the app).

### 8.1 Consistency pairs

10 fixed item pairs (6 domain auxiliary pairs + 4 core conceptual pairs), e.g. `["SAR-C01", "SAR-C05"]`:

```
Divergence(X, Y) = | contribution_score(X) − contribution_score(Y) |
INCONSISTENT if Divergence(X, Y) ≥ 3
```

Since paired items are designed to move together, a divergence of 3+ on a 1–5 scale (e.g., "Strongly Agree" vs. a reversed "Strongly Disagree") is a substantive contradiction, not noise.

### 8.2 Straight-line detection

Over the LIKERT5 items only, in fixed presentation order (`SAR → ELCA → IHOR → AMB → ECPC → ERP → CSR → RST`, each internally core-then-auxiliary-then-scenario):

```
FOR each sliding window of 10 consecutive LIKERT5 items:
  IF all 10 raw_values are identical → flag STRAIGHT_LINE
```

Checked on **raw value**, not contribution score, since straight-lining is a response-pattern signal (the respondent clicking the same button repeatedly) independent of item polarity.

### 8.3 Contradiction detection

Per domain, compares the mean contribution of `core` items against the mean contribution of `scenario` items:

```
IF |CoreMean(D) − ScenarioMean(D)| ≥ 2.5 → DOMAIN_CONTRADICTION(D)
```

This catches a respondent who, e.g., endorses "I always seek out disconfirming evidence" (core, direct self-statement) while picking the least evidence-seeking option in a behavioral scenario for the same domain — social-desirability bias tends to inflate direct self-statements more than scenario choices, so a large gap is informative.

### 8.4 Social Desirability (SD) index

8 dedicated SD-detector items (one `*-A03` per domain, excluded from domain scoring — see §5):

```
SD_index = Σ over SD items where raw_value ≥ 4:  (item weight)
         = 1.0 per flagged item, except ERP-A03 which weighs 1.5
```

## 9. Step 7 — Confidence rating

`computeConfidence()` — spec §5.10

```
BaseConfidence = 100
 − 20   if SD_index ≥ 3                          (CM-01)
 − 10   if missing_data_rate > 10%                (CM-02)
 − 25   if any STRAIGHT_LINE window flagged        (CM-03)
 − 5 × min(inconsistent pair count, 4)             (max −20)
Clamp to [0, 100]
```

All four penalties are independent and additive (before clamping), so a badly-behaved response set can bottom out at 0 confidence even though each individual signal is only ever evaluated once.

## 10. Step 8 — Interaction rules

`evaluateInteractionRules()` — spec §4.3/§5.11. Evaluated **after** normalization, against final 0–100 domain scores, in a fixed order:

| Rule | Condition | Meaning |
|---|---|---|
| `AR-03` | `SAR ≥ 70` and `AMB ≤ 40` | Strong analytical reasoning paired with low ambiguity tolerance |
| `AR-03b` | `AMB ≤ 40` and `CSR ≥ 70` | Low ambiguity tolerance paired with high conscientiousness |
| `IH-01` | `SAR ≥ 70` and `IHOR ≤ 40` | Strong analytical reasoning, low intellectual humility |
| `CR-02` | `CSR ≥ 80` and `RST ≤ 40` | High conscientiousness, low resilience |
| `EC-01` | `SAR ≥ 70` and `ECPC ≤ 40` | Strong analytical reasoning, weak patient-centred communication |
| `CM-04` | `RST ≤ 40` and `ERP ≥ 80` | Confidence modifier only — reduces the ERP domain's *reported* confidence by 15, does not surface as a report block itself |
| `PC-01` | `CSR ≥ 90` | Standalone perfectionism note |
| `OA-01` | `SAR ≥ 90` | Standalone over-analysis note |

Every rule is a simple threshold comparison over already-computed domain scores — no rule ever re-touches raw answers.

## 11. Step 9 — Profile assignment

`src/engine/profileAssignment.ts` — spec Part 5 (§7)

1. Each domain score is bucketed into a **tier** via `tier_thresholds.json` (`High ≥ 65`, `Moderate` 35–64.999, `Low < 35`; `UNKNOWN` if the domain was suppressed for insufficient data).
2. Each of the 24 profiles in `profiles.json` declares `required_tiers` (must match) and `excluded_if` (must not match). A profile is rejected outright if any required domain is `UNKNOWN`.
3. Among all non-rejected profiles, the one with the highest `fitScore` (count of matched required-tier conditions) wins; ties break on the profile's declared `priority_order`.
4. Two profiles have bespoke rules: **PROF-21** ("Balanced Generalist") is assigned when no domain is `High`/`Low` outlier (`highCount ≤ 1 && lowCount ≤ 1 && unknownCount === 0`) and doubles as the fallback when nothing else matches; **PROF-23** requires `CSR ≥ 90` directly rather than a tier match.
5. **Profile assignment is suppressed entirely** (`suppress_profile_assignment: true`) when `SD_index ≥ 5.5` — at that point the response pattern is judged too sociallydesirable-skewed to trust a narrative pattern match, and the report engine shows validity caveats instead of a profile.

`profileFitConfidence` is then labeled `"Strong pattern match"` (fitScore ≥ 3), `"Moderate pattern match"` (fitScore = 2), or `"Partial pattern match"` (fitScore = 1) for report-language purposes.

## 12. Worked example

A respondent with `WeightedMean(SAR) = 3.8` (all 12 SAR-scored items answered):

```
DomainScore(SAR) = ROUND((3.8 − 1) / 4 × 100, 1) = 70.0
```

If their `AMB` domain normalizes to `35.0` and no validity flags fired:

- `AR-03` triggers (`SAR = 70 ≥ 70` and `AMB = 35 ≤ 40`)
- Both domains get `High`/`Low`-ish tiers feeding into profile assignment
- `overall_confidence` stays at `100` (no SD, missing-data, straight-line, or consistency penalties)

## 13. Source map

| Concern | File |
|---|---|
| Contribution scoring (raw → [1,5]) | `src/engine/contribution.ts` |
| Full pipeline orchestration | `src/engine/domainScore.ts` |
| Standalone validity-check functions | `src/engine/validityChecks.ts` |
| Profile assignment | `src/engine/profileAssignment.ts` |
| Question bank, weights, thresholds, profiles, rules | `src/data/*.json` |
| Typed data loaders | `src/data/load*.ts` |
| React-facing hook wrapping the engine | `src/hooks/useAssessment.ts`, `src/hooks/useScoringResult.ts` |
| Full formulas + rationale (prose spec) | `ebmraspec.md`, Part 3 (§4–5) |

For test coverage of every formula above, see `src/engine/*.test.ts` and `tests/profileAssignment.test.ts` — the engine's unit tests are effectively an executable version of this document.