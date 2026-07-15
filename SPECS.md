# Evidence-Based Medical Readiness Assessment (EB-MRA)
## Technical Specification — Part 1 of 8: Assessment Architecture & Domain Specification

**A note on scope and honesty, before anything else:**
This tool is a **structured self-reflection and readiness-orientation instrument**, not a validated psychological or medical test. Nothing in this document should be read as claiming the instrument has established reliability or validity — it has not been field-tested. Anywhere a number looks like a real psychometric statistic (difficulty, discrimination, alpha, factor loadings), it is a **placeholder for a value that must come from actual respondent data**, clearly labeled as such. Section 11 (in a later part) will lay out exactly how to replace every placeholder with a real number through a proper validation study. Treating placeholders as real findings — in the app, in marketing copy, or in advising conversations with candidates — would misrepresent the tool and could mislead people making real decisions about their careers. Build it as what it actually is: a well-organized, transparent reflection tool that *could become* empirically validated, not one that already is.

---

## 1. Assessment Architecture

### 1.1 Assessment Goals

The Evidence Based Medicine Readiness Assessment (EB-MRA) exists to help a candidate — most often a premedical student, career-changer, or early medical trainee — reflect systematically on the dispositions and habits of mind that evidence-based medicine practice tends to demand, and to surface areas worth deliberate development before or during medical training.

Concretely, the instrument aims to:

1. Give the respondent a structured, multi-domain snapshot of self-reported tendencies relevant to medical practice (analytical reasoning habits, tolerance for uncertainty, communication style, resilience under pressure, ethical reasoning tendencies, and related constructs).
2. Translate that snapshot into plain-language, actionable feedback — strengths to leverage, growth edges to work on, and concrete next steps — rather than a bare numeric score.
3. Do so through a fully deterministic, auditable scoring pipeline so that the same answers always produce the same report, and so that every scoring decision can be traced back to an explicit, documented rule.
4. Avoid impersonating a diagnostic, admissions, or credentialing instrument. It is explicitly **not** a fitness-for-practice test, not a substitute for MCAT/GPA/interview-based admissions processes, and not a clinical or psychiatric screening tool.

### 1.2 Assessment Philosophy

Three design commitments shape everything downstream:

**(a) Self-report, not performance.** The instrument measures self-reported tendencies and preferences, not demonstrated competence. A high score on "evidence literacy" means the respondent *endorses* evidence-literate attitudes and behaviors on a questionnaire, not that they have been observed practicing them. Report language must never blur this line (e.g., never say "you are highly skilled at critical appraisal"; say "you consistently endorse critical-appraisal habits").

**(b) Transparency over mystique.** Every score, every profile assignment, and every report fragment must be traceable to an explicit rule in the specification. No hidden weighting, no opaque "AI insight." This is a deliberate rejection of black-box personality-quiz design, and it is also what makes the instrument auditable, debuggable, and eventually validatable.

**(c) Formative, not gatekeeping.** The instrument is designed to be used by the respondent for their own development, ideally alongside an advisor, mentor, or educator — not as an automated pass/fail gate, and not as an input to any admissions or employment decision. This constraint should be enforced in the product (see §1.5 exclusion criteria) and stated explicitly in every report.

### 1.3 Scientific Limitations (stated up front, and repeated in-product)

The specification is written to be scientifically *honest*, which means being explicit about what it is not:

- **No established reliability.** Internal consistency (Cronbach's alpha / McDonald's omega), test-retest reliability, and inter-item correlations are unknown until a validation study is run (Part 6 of this spec series will detail that study design).
- **No established validity.** There is no evidence yet that scores predict any real-world outcome (medical school performance, clinical competence, wellbeing, attrition, etc.). Any predictive-sounding language in reports must be softened to "may relate to" framing at most, and ideally avoided in favor of purely descriptive/reflective framing.
- **Self-report bias.** Social-desirability bias, mood-state effects, and self-perception inaccuracy are inherent limits of any self-report instrument and cannot be fully corrected by validity-check items (Part 3 covers mitigation, not elimination).
- **Cultural and linguistic scope.** Item wording is developed in one language/cultural context (assumed U.S./English-language premedical context unless otherwise localized) and has not been checked for measurement invariance across cultures, languages, or educational systems.
- **Not diagnostic.** The instrument must never be marketed or used as screening for a mental health condition, a learning disability, or any clinical entity, even though some domains (e.g., resilience, stress tolerance) overlap thematically with constructs psychology also studies.
- **Not an admissions tool.** Scores must not be used, or be usable, in any admissions, hiring, licensing, or credentialing decision. This is both a scientific limitation (unvalidated for that purpose) and an ethical requirement.

### 1.4 Intended Users

Primary:
- Premedical undergraduates exploring fit with a medicine career.
- Postbaccalaureate / career-change candidates preparing for application.
- Early medical students (M1–M2) doing self-directed reflection, often prompted by an advisor or wellness curriculum.

Secondary:
- Premedical advisors and mentors, using the report as a conversation-starter with a student (never as a decision input).
- Medical education researchers, once a validated version exists, studying the instrument itself.

Explicitly out of scope as primary users:
- Admissions committees (see exclusion criteria).
- Residency programs or employers.
- Anyone under 16 (see exclusion criteria) — this is a career-reflection tool assuming a baseline of exposure to the premedical pathway.

### 1.5 Exclusion Criteria

The product should actively discourage or block use in the following situations:

1. **Any use as an admissions, screening, or hiring input.** The consent/intro screen must state this explicitly, and no export format should be described as "share with your admissions committee."
2. **Respondents under 16.** The construct set (professional identity, career-stage reasoning) assumes some exposure to the premedical pathway; below this age the self-report is unlikely to be meaningful and consent/data considerations for minors get materially more complex.
3. **Acute mental health crisis.** If free-text or validity-check responses indicate the respondent may be in crisis, the product must not proceed to scoring or a report; it should present crisis-resource information instead (see Part 4, validity/safety checks). This is a product safety rule, not merely a data-quality rule.
4. **Non-English locales.** The current product is English-only by design; no machine-translated or localized version exists or is offered. Should localization be pursued in the future, it must not ship silently — a "not yet validated for this language/region" notice would be required until localization and measurement-invariance testing is complete for that locale.

### 1.6 Estimated Completion Time

**Target: 20–30 minutes.** Rationale:

- Below ~15 minutes, domain coverage (see §1.8) is too thin to support the profile system's granularity (Part 5) without single-item-per-construct fragility.
- Above ~35 minutes, attention decay and straight-lining risk rise sharply in unincentivized self-report instruments, which directly undermines the validity-check strategy in Part 4.
- 20–30 minutes matches a single advising-session or class-period block, supporting the "used alongside a mentor" philosophy in §1.2(c).

At an average reading+response pace of ~12–15 seconds per item (scenario-based items run longer, ~20–25 seconds), this bounds question count (§1.7) to roughly 90–120 items total.

### 1.7 Recommended Number of Questions

**Recommendation: 104 items** (13 per domain × 8 domains — see §1.8 for domain count rationale), decomposed as:

- 8 items per domain scored on the primary construct ("core" items).
- 3 items per domain reserved for validity/consistency checking, reverse-scored pairs, or cross-domain interaction detection ("auxiliary" items), embedded within the same 13 rather than appended as an obvious separate block (obvious validity blocks are easy for respondents to detect and defeats their purpose).
- 2 items per domain that are scenario-based (behavioral, situational) rather than direct Likert self-statement, per the "avoid obvious desirable answers" requirement — these tend to run longer to read but resist social-desirability distortion better than direct trait statements.

This yields exactly 8 × 13 = 104 items. Part 2 of this spec will deliver the full 104-item bank against this allocation.

**Why not fewer (e.g., 40–60)?** Each domain needs enough items to (a) compute a reasonably stable domain score even after removing flagged/invalid responses, and (b) support the future computation of internal-consistency statistics (Part 6) — Cronbach's alpha estimates are unstable below ~6–8 items per scale.

**Why not more (e.g., 200+)?** Completion-time ceiling (§1.6) and diminishing returns: beyond ~13 items per domain, marginal reliability gains are small relative to marginal respondent fatigue.

### 1.8 Recommended Number of Domains

**Recommendation: 8 domains.** Listed in full in §2. Rationale:

- **Construct coverage:** EBM practice readiness plausibly spans at least three superordinate clusters — *cognitive/analytical* habits, *interpersonal/professional* habits, and *self-regulatory/resilience* habits. Eight domains (roughly 2–3 per cluster) gives enough resolution within each cluster to differentiate, e.g., "resilience" from "conscientiousness," without over-fragmenting into so many narrow domains that the profile system (Part 5) becomes combinatorially unmanageable.
- **Report usability:** A report with 8 domain scores is legible on a single dashboard screen (see Part 4/mockup guidance) without scrolling fatigue; 15–20 domains would force either information overload or a secondary "drill-down" navigation layer that adds implementation complexity disproportionate to the benefit at this (pre-validation) stage.
- **Profile system feasibility:** Part 5 requires defining 20–40 profiles as score-combination patterns across domains. Eight domains gives a combinatorial space (2^8 = 256 high/low patterns, before considering "moderate" bands) that comfortably supports 20–40 *meaningfully distinct* profiles without needing so many domains that most combinations are empirically implausible or redundant.

### 1.9 Design-Decision Rationale Summary Table

| Decision | Chosen value | Key rationale |
|---|---|---|
| Domain count | 8 | Balances construct coverage, report legibility, profile-system feasibility |
| Items per domain | 13 (8 core + 3 auxiliary + 2 scenario) | Supports future reliability estimation; resists social desirability |
| Total items | 104 | Fits 20–30 min completion target |
| Completion time | 20–30 min | Matches advising-session use case; limits attention decay |
| Scoring model | Fully deterministic, rule-based | No AI/ML in scoring per hard requirement; auditability |
| Primary use case | Self-directed reflection + advisor conversation | Matches "formative not gatekeeping" philosophy |
| Excluded uses | Admissions, hiring, diagnosis, under-16 | Scientific limitations + ethical guardrails |

---

## 2. Domain Specification

Eight domains, organized into three clusters per §1.8. For each domain: name, scientific rationale, evidence summary (qualitative — no fabricated statistics), psychological construct, medical relevance, domain weight, score range, interpretation bands, and cross-domain interactions.

**Scoring convention used throughout this spec:** every domain is normalized to a **0–100 scale** regardless of raw item count, computed as described in Part 3 (Scoring Algorithm). Domain weights are relative contributions to any composite/summary score, not to the domain's own 0–100 range.

---

### Cluster A — Cognitive & Analytical Habits

#### 2.1 Domain: Scientific & Analytical Reasoning (SAR)

- **Scientific rationale:** Medicine increasingly requires clinicians to reason from probabilistic evidence, weigh base rates, and update beliefs on new data — habits of mind studied broadly under "analytical/rational thinking style" in judgment-and-decision-making research.
- **Evidence summary (qualitative):** Decision-science literature broadly distinguishes intuitive ("System 1") from deliberate, analytical ("System 2") processing; a general finding in that literature is that over-reliance on unexamined intuition is associated with more susceptibility to certain reasoning errors (e.g., base-rate neglect), while deliberate cross-checking tends to reduce them — a pattern often invoked as relevant to clinical reasoning training. This is offered as background motivation for the domain, not as a validated predictor of this instrument's scores.
- **Psychological construct:** Preference for and self-reported facility with systematic, evidence-weighing reasoning over snap judgment; comfort with probabilistic (vs. purely categorical) thinking.
- **Medical relevance:** Diagnostic reasoning, interpreting test sensitivity/specificity, evaluating a study's applicability to a specific patient.
- **Domain weight:** 0.14 (of composite; see Part 3 for composite formula)
- **Score range:** 0–100
- **Interpretation bands:**
  - 0–24: *Emerging* — tends to favor quick, intuitive calls; may benefit from deliberate practice slowing down on ambiguous problems.
  - 25–49: *Developing* — inconsistent use of systematic reasoning; situational.
  - 50–74: *Established* — generally reaches for structured reasoning under complexity.
  - 75–100: *Strong* — consistently endorses deliberate, evidence-weighing habits; watch for over-analysis paralysis as a possible shadow side (flagged in report logic, Part 4).
- **Interactions with other domains:** Very high SAR combined with very low Ambiguity Tolerance (2.4) can indicate a "needs certainty before acting" pattern worth flagging (see Outcome Matrix rule AR-03 in Part 5). Very high SAR combined with low Empathic Communication (2.5) can indicate a purely technical orientation the report should surface as a growth conversation, not a deficiency.

#### 2.2 Domain: Evidence Literacy & Critical Appraisal (ELCA)

- **Scientific rationale:** EBM as a discipline is defined by the capacity to find, appraise, and apply research evidence; this domain operationalizes self-reported comfort with that specific skill set, distinct from general analytical reasoning (2.1).
- **Evidence summary (qualitative):** Critical-appraisal skill is widely taught as a discrete, learnable competency in medical curricula (distinguishing study designs, recognizing confounding, understanding absolute vs. relative risk), suggesting it is meaningfully separable from general analytical disposition — motivating a dedicated domain rather than folding this into SAR.
- **Psychological construct:** Self-assessed literacy and confidence with research-evidence concepts (study design hierarrchies, statistical basics, source credibility judgment).
- **Medical relevance:** Reading a clinical trial, evaluating a new guideline, resisting anecdote-driven practice.
- **Domain weight:** 0.14
- **Score range:** 0–100
- **Interpretation bands:**
  - 0–24: *Emerging* — evidence concepts feel unfamiliar or intimidating; foundational coursework likely to help substantially.
  - 25–49: *Developing* — has some exposure but self-reported confidence is inconsistent across item types.
  - 50–74: *Established* — reports comfort with core evidence-appraisal ideas.
  - 75–100: *Strong* — reports high confidence across study-design and statistical-literacy items.
- **Interactions:** Low ELCA + high SAR is common and expected (analytical disposition without yet having the specific EBM vocabulary) — report logic should *not* flag this as a contradiction (see consistency-check exclusions, Part 3 §5.6). Low ELCA + low SAR together is a stronger signal worth a distinct report fragment (Part 4).

#### 2.3 Domain: Intellectual Humility & Openness to Revision (IHOR)

- **Scientific rationale:** The willingness to say "I was wrong" and update a working diagnosis or plan given new evidence is repeatedly identified in medical-error literature as protective against premature closure and confirmation-bias-driven mistakes.
- **Evidence summary (qualitative):** Intellectual humility is an actively studied individual-difference construct in personality/social psychology, generally characterized as recognizing the limits of one's knowledge and being responsive to good counter-evidence; this is the conceptual anchor for the domain, without asserting this instrument replicates any specific published measure.
- **Psychological construct:** Self-reported openness to revising one's view, tolerance for being shown wrong, active-open-mindedness.
- **Medical relevance:** Avoiding diagnostic anchoring/premature closure; accepting supervisor/peer correction; updating practice as guidelines change.
- **Domain weight:** 0.13
- **Score range:** 0–100
- **Interpretation bands:** same 4-band structure (Emerging/Developing/Established/Strong) at the same 0–24/25–49/50–74/75–100 cut points, used consistently across all 8 domains for report-template simplicity (Part 4).
- **Interactions:** Very low IHOR + very high SAR is a specific pattern (confident reasoner who resists correction) worth its own outcome-matrix rule (Part 5, rule IH-01) since it is a plausible risk pattern for diagnostic overconfidence.

---

### Cluster B — Interpersonal & Professional Habits

#### 2.4 Domain: Ambiguity Tolerance & Uncertainty Management (AMB)

- **Scientific rationale:** Clinical practice is irreducibly uncertain (differential diagnoses, prognostic ranges, incomplete information); comfort operating under uncertainty is distinct from analytical skill itself.
- **Evidence summary (qualitative):** "Tolerance of ambiguity" is a long-studied individual-difference construct; in medical-education contexts it is frequently discussed as relevant to trainee stress and to willingness to act (or appropriately delay action) under diagnostic uncertainty.
- **Psychological construct:** Comfort with incomplete information, willingness to act (or to appropriately wait) without full certainty, low intolerance-of-uncertainty distress.
- **Medical relevance:** Managing undifferentiated presentations, communicating uncertain prognoses to patients, working within probabilistic guidelines.
- **Domain weight:** 0.13
- **Score range:** 0–100
- **Interpretation bands:** standard 4-band.
- **Interactions:** Low AMB + high Conscientiousness (2.7) can produce a specific "checks and re-checks, struggles to close" pattern flagged in Part 5 (rule AR-03, shared with 2.1).

#### 2.5 Domain: Empathic Communication & Patient-Centeredness (ECPC)

- **Scientific rationale:** Communication quality is consistently discussed in medical-education literature as central to patient trust, adherence, and satisfaction, and as a distinct, trainable skill set alongside technical competence.
- **Evidence summary (qualitative):** Perspective-taking and active-listening constructs from communication and clinical-empathy research motivate this domain; framed here purely as background rationale, not as a claim that this instrument has been validated against any specific published empathy scale.
- **Psychological construct:** Self-reported perspective-taking, active listening tendency, comfort communicating uncertainty/bad news, patient-centered (vs. purely disease-centered) orientation.
- **Medical relevance:** History-taking, shared decision-making, breaking bad news, informed consent conversations.
- **Domain weight:** 0.14
- **Score range:** 0–100
- **Interpretation bands:** standard 4-band.
- **Interactions:** Low ECPC + high SAR (2.1) — flagged above in 2.1; report fragment should frame this as a growth-edge opportunity, never as a character deficiency (tone requirement, Part 4).

#### 2.6 Domain: Ethical Reasoning & Professionalism (ERP)

- **Scientific rationale:** Professional codes of conduct and ethics curricula are core, examined components of medical education; this domain captures self-reported reasoning tendencies around professional obligation, honesty, and boundary-setting.
- **Evidence summary (qualitative):** Professional-identity-formation literature in medical education frames ethical reasoning as a developmental process rather than a fixed trait, motivating scenario-based (situational judgment) items in this domain specifically (see §1.7 scenario-item allocation).
- **Psychological construct:** Self-reported tendencies in ethical decision rules (honesty under social pressure, disclosure of error, conflict-of-interest recognition).
- **Medical relevance:** Informed consent integrity, error disclosure, professional boundary maintenance.
- **Domain weight:** 0.13
- **Score range:** 0–100
- **Interpretation bands:** standard 4-band, **plus** a mandatory report note (Part 4) that this domain is especially vulnerable to social-desirability distortion and should be interpreted with the widest error margin of all 8 domains.
- **Interactions:** No strong cross-domain rule by default; treated as an independent domain given its distinct construct.

---

### Cluster C — Self-Regulation & Resilience

#### 2.7 Domain: Conscientiousness & Self-Regulation (CSR)

- **Scientific rationale:** Conscientiousness is one of the most consistently studied personality dimensions in relation to academic and professional performance broadly, motivating its inclusion as a self-regulation domain here.
- **Evidence summary (qualitative):** Big-Five conscientiousness research generally associates the trait with organization, follow-through, and reliability; used here as background motivation for item content, not as a claim of equivalence with any specific commercial Big-Five instrument.
- **Psychological construct:** Self-reported organization, follow-through, reliability, delay of gratification.
- **Medical relevance:** Sustaining rigorous study habits, meeting clinical documentation/follow-up obligations, managing long training timelines.
- **Domain weight:** 0.10
- **Score range:** 0–100
- **Interpretation bands:** standard 4-band, plus a specific note at 90–100 flagging possible perfectionism as a shadow side (report fragment, Part 4) rather than treating "higher is unambiguously better."
- **Interactions:** See 2.4 (AMB) interaction; also interacts with 2.8 (Resilience) — very high CSR + low Resilience is a specific overextension-risk pattern (Part 5, rule CR-02).

#### 2.8 Domain: Resilience & Stress Tolerance (RST)

- **Scientific rationale:** Medical training is widely documented as high-stress; self-reported coping style and recovery-from-setback tendency are relevant to sustainable engagement with that training, distinct from (though related to) general wellbeing.
- **Evidence summary (qualitative):** Resilience is studied both as a trait-like tendency and as a set of learnable coping strategies in medical-trainee wellbeing literature; this domain intentionally emphasizes *coping strategy* items (which are more actionable/developable) over pure trait-affect items.
- **Psychological construct:** Self-reported recovery from setbacks, coping-strategy repertoire, help-seeking tendency (as a positive indicator, not a deficit).
- **Medical relevance:** Sustaining engagement through failure (a poor grade, a difficult rotation, a missed diagnosis in training), avoiding burnout trajectory.
- **Domain weight:** 0.09
- **Score range:** 0–100
- **Interpretation bands:** standard 4-band, **plus a hard product rule**: this domain's items and report language must be reviewed against the safety requirements in §1.5(3) — no RST item or report fragment may be worded in a way that could function as a mental-health self-diagnosis, and any low-RST + crisis-indicator combination must route to the safety flow (Part 3 §5, Part 4), not to a normal report.
- **Interactions:** See 2.7 (CSR); also, very low RST combined with very high ERP (2.6) self-report can indicate socially-desirable over-reporting on the ethics domain and should soften confidence on ERP specifically (Part 3, confidence-modifier rule CM-04).

---

### 2.9 Domain Weight Summary

| # | Domain | Code | Weight | Cluster |
|---|---|---|---|---|
| 1 | Scientific & Analytical Reasoning | SAR | 0.14 | Cognitive |
| 2 | Evidence Literacy & Critical Appraisal | ELCA | 0.14 | Cognitive |
| 3 | Intellectual Humility & Openness to Revision | IHOR | 0.13 | Cognitive |
| 4 | Ambiguity Tolerance & Uncertainty Management | AMB | 0.13 | Interpersonal/Professional |
| 5 | Empathic Communication & Patient-Centeredness | ECPC | 0.14 | Interpersonal/Professional |
| 6 | Ethical Reasoning & Professionalism | ERP | 0.13 | Interpersonal/Professional |
| 7 | Conscientiousness & Self-Regulation | CSR | 0.10 | Self-Regulation |
| 8 | Resilience & Stress Tolerance | RST | 0.09 | Self-Regulation |
| | **Total** | | **1.00** | |

Weights are deliberately close to uniform (0.09–0.14) rather than sharply differentiated: with no validation data yet (Part 6), asserting strong differential importance between domains would be an unsupported claim. The mild skew present (Cognitive + interpersonal domains weighted slightly above self-regulation domains) reflects the instrument's EBM-specific framing (evidence/reasoning/communication are more directly tied to "EBM readiness" than general resilience is), and should be revisited once real predictive-validity data exists (Part 6).

---

## What's next

Part 2 will deliver the complete 104-item question bank (13 items × 8 domains) built directly against this domain specification, with every item carrying question ID, purpose, construct measured, response type, full answer options with scores, reverse-scoring flags, weights, and clearly-labeled placeholder difficulty/discrimination estimates per your instruction to mark those as illustrative pending real field data.

---

## Technical Specification — Part 2 of 8: Complete Question Bank

Builds on Part 1. 104 items total: 13 per domain × 8 domains, per §1.7's allocation of 8 core + 3 auxiliary + 2 scenario items per domain.

**Reminder carried over from Part 1:** the *Difficulty* and *Discrimination* columns below are **illustrative placeholders**, not real psychometric findings. They are included so the data structures and scoring pipeline have a value to consume, and so the format is ready to receive real numbers once Part 6's validation study is run. They should render in-app (if surfaced to developers/researchers at all — never to respondents) with a visible "estimated, pending validation" tag.

---

## 3.0 Shared Response-Type Definitions

To avoid repeating this 88 times, all **core** and **auxiliary** items use the same 5-point Likert scale unless individually noted:

**Response Type `LIKERT5`:**
| Option | Label | Raw value |
|---|---|---|
| 1 | Strongly Disagree | 1 |
| 2 | Disagree | 2 |
| 3 | Neither Agree nor Disagree | 3 |
| 4 | Agree | 4 |
| 5 | Strongly Agree | 5 |

**Scoring:** Forward-keyed items score = raw value (1–5). Reverse-keyed items (flagged `Reverse = Y` below) score = `6 − raw value`. This produces a 1–5 "contribution score" for every item regardless of keying direction, which Part 3 then weights and normalizes to the domain's 0–100 scale.

**Item weight convention:** `Core = 1.0`, `Auxiliary = 0.5` (lower weight — these exist primarily for validity/consistency detection, not pure score contribution), `Scenario = 1.5` (higher weight — behavioral/situational items are harder to fake and given more credit). Domain raw-score formula uses these weights; full formula in Part 3.

**Difficulty placeholder scale:** 0.00 (almost everyone endorses/agrees) to 1.00 (almost no one does) — analogous to classical-test-theory item difficulty (proportion endorsing the "high" end), **all values below are estimates by the design team, not measured data.**

**Discrimination placeholder scale:** −1.00 to 1.00, analogous to a point-biserial/item-total correlation — **all values below are estimates by the design team, not measured data.**

---

# Domain 1 — Scientific & Analytical Reasoning (SAR)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| SAR-C01 | When I hear a surprising claim, I check for evidence before accepting it. | Core endorsement of evidence-seeking default | N | 0.35 | 0.42 | Mild social desirability (sounds like the "right" answer) | Higher = more evidence-seeking default | Pair conceptually with SAR-C05 (reverse) for consistency check, Part 3 §5.5 |
| SAR-C02 | I prefer decisions based on data over gut feeling alone. | Preference for analytical over intuitive mode | N | 0.40 | 0.38 | Desirability; may conflate "prefer" with "always do" | Higher = stated preference for data-driven decisions | Note: does not measure actual behavior, only preference |
| SAR-C03 | I notice when an argument leans on one unrepresentative example. | Self-assessed skill at spotting anecdotal reasoning | N | 0.45 | 0.44 | Overconfidence risk — high scorers may overestimate own skill | Higher = self-perceived skill at spotting weak generalization | Cross-check candidate against ELCA-C03 |
| SAR-C04 | I find it satisfying to break a complicated problem into smaller parts. | Analytical-decomposition disposition | N | 0.30 | 0.35 | Low — behaviorally neutral phrasing | Higher = enjoys structured problem decomposition | — |
| SAR-C05 | When I already believe something, I don't feel a need to check it against new information. | Detects confirmation-bias tolerance (inverted) | Y | 0.55 | 0.40 | Desirability pushes toward disagreeing regardless of true tendency | Lower raw agreement (= higher scored contribution after reversal) = less confirmation-bias tolerance | Consistency partner to SAR-C01 |
| SAR-C06 | I ask "how do we know that?" more often than most people I know. | Self-comparative evidence-questioning habit | N | 0.50 | 0.33 | Comparative self-assessment is noisy (respondent doesn't know "most people") | Higher = self-perceived above-average questioning habit | Weakest discrimination estimate in domain; candidate for revision after piloting |
| SAR-C07 | I tend to trust my first impression over further analysis. | Detects intuitive-over-analytical default (inverted) | Y | 0.45 | 0.39 | Some respondents may read "trust first impression" as a positive trait (fast decision-making), muddying intent | Lower raw agreement = higher scored contribution = more analytical default | Flag for cognitive interview during pilot (Part 6) — wording risk noted |
| SAR-C08 | I'm comfortable estimating a probability even without exact numbers. | Comfort with probabilistic estimation under uncertainty | N | 0.40 | 0.41 | Low | Higher = more comfort with rough probabilistic reasoning | Shares conceptual ground with AMB domain; kept here since it's about the *reasoning act*, not the *discomfort* |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| SAR-A01 | I double-check a calculation or claim even when I'm fairly confident I'm right. | Validity/consistency check against SAR-C01 | N | 0.35 | 0.30 | Desirability | Should correlate with SAR-C01; large divergence flags inconsistent responding | See Part 3 §5.5 consistency-pair table |
| SAR-A02 | Once I've worked something out, going back to check it feels like a waste of time. | Reverse-worded restatement of A01's underlying idea | Y | 0.50 | 0.32 | Desirability push toward disagreeing | Should track SAR-A01 after reversal; divergence >2 points flags inconsistency | Consistency pair with SAR-A01 |
| SAR-A03 | I have never once made a reasoning error. | Social-desirability / extreme-response detector | Y | 0.90 | 0.20 (intentionally low — not meant to discriminate the construct) | High — this item is *designed* to catch over-claiming | Any agreement above "Neither Agree nor Disagree" (raw ≥4) contributes to the Social Desirability flag, not to the SAR domain score | **Excluded from domain raw score entirely** — routed only to the validity-check subsystem, Part 3 §5.4. Listed here for completeness of the domain's item set per the "13 items" allocation, but its 0.5 weight is applied to the SD index, not SAR. |

### Scenario items

**SAR-S01**
- **Text:** "A friend tells you a new study 'proves' that a popular supplement improves memory, based on a single small trial reported in a news article. What's closest to your first instinct?"
- **Purpose:** Behavioral proxy for evidence-seeking vs. narrative acceptance, resistant to social-desirability faking (all options sound plausible).
- **Construct measured:** SAR (applied evidence-skepticism)
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "That's interesting, I'd probably mention it to others too." — score 1
  - B. "I'd wonder if it's been replicated or if it's just one small study." — score 4
  - C. "I'd assume the news article oversimplified it either way and stop thinking about it." — score 2
  - D. "I'd look up the original study or a summary of its methodology before forming an opinion." — score 5
- **Reverse scoring flag:** N/A (scenario items are scored per-option, not reversed)
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.40
- **Discrimination (placeholder):** 0.48
- **Potential bias:** Respondents familiar with research methods may recognize the "correct-sounding" answer (D) and select it performatively rather than because it reflects real behavior — a general limitation of self-report scenario items, mitigated but not eliminated by behavioral framing.
- **Expected interpretation:** Higher score = stronger applied tendency toward verification over narrative acceptance.
- **Developer notes:** Options intentionally avoid an obviously "worst" option to reduce ceiling effects; B and D both score positively to reflect that skepticism-without-verification is still a meaningfully evidence-oriented response, just a smaller step than actively checking the source.

**SAR-S02**
- **Text:** "You're comparing two study strategies for an exam. One 'feels' more effective; the other has weaker anecdotal support from classmates but is recommended by learning-science sources you've seen cited. Which are you more likely to actually try first?"
- **Purpose:** Behavioral proxy for choosing evidence-recommended over intuitively-preferred options in a low-stakes, relatable context.
- **Construct measured:** SAR (evidence-over-intuition in personal decision-making)
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "The one that feels more effective — I trust my own experience." — score 2
  - B. "The evidence-recommended one, even though it feels less natural at first." — score 5
  - C. "I'd try to blend both somehow." — score 3
  - D. "Whichever my classmates seem to be using." — score 1
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.46
- **Potential bias:** "Blend both" (C) is a common hedge response that may attract respondents regardless of true tendency; monitor its selection rate during piloting for potential over-selection (ceiling on the middle option).
- **Expected interpretation:** Higher score = more willingness to act on evidence-based recommendation over personal feel or peer anecdote.
- **Developer notes:** Deliberately domain-relevant to "study strategy" rather than a clinical scenario, since this domain's core items are already fairly abstract — grounding in a familiar student context improves comprehension per UX-research review.

---

# Domain 2 — Evidence Literacy & Critical Appraisal (ELCA)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ELCA-C01 | I feel confident explaining the difference between correlation and causation to someone else. | Self-assessed core EBM literacy concept | N | 0.45 | 0.47 | Overconfidence risk | Higher = higher self-assessed literacy | Anchor item for domain |
| ELCA-C02 | I know roughly what it means for a study to have a "control group." | Basic study-design literacy | N | 0.35 | 0.40 | Ceiling risk among premed respondents with coursework exposure | Higher = more self-assessed familiarity | Expect ceiling effects in premed sample; retain for broader (career-changer) population |
| ELCA-C03 | I can usually tell when a health claim is based on weak evidence (e.g., one small study, an anecdote). | Applied appraisal confidence | N | 0.50 | 0.45 | Overconfidence | Higher = more self-assessed appraisal skill | Cross-check candidate with SAR-C03 |
| ELCA-C04 | Terms like "relative risk" and "absolute risk" are things I understand. | Statistical-literacy self-assessment | N | 0.55 | 0.43 | Desirability + overconfidence | Higher = higher self-assessed statistical literacy | Likely lowest mean score in domain pre-coursework; useful floor item |
| ELCA-C05 | I don't really think about how a study was designed when I hear about its results. | Detects appraisal disengagement (inverted) | Y | 0.40 | 0.38 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = more engaged appraisal habit | — |
| ELCA-C06 | When a guideline changes, I want to understand why before I accept the new version. | Evidence-updating orientation, EBM-specific | N | 0.35 | 0.41 | Low | Higher = more evidence-updating orientation | Complements IHOR domain without duplicating its trait framing |
| ELCA-C07 | Statistics in news articles about health mostly go over my head. | Detects low statistical confidence (inverted) | Y | 0.45 | 0.36 | Desirability push toward disagreeing even if true | Lower raw agreement = higher contribution = more statistical confidence | Wording deliberately blunt to resist "sounds smart" answer-shopping |
| ELCA-C08 | I know where to look for reliable medical information versus unreliable sources. | Source-credibility literacy | N | 0.40 | 0.44 | Overconfidence; "knowing where to look" may not equal actually doing it | Higher = higher self-assessed source literacy | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ELCA-A01 | I'd rather read the original study than a summary of it, if I had time. | Consistency check with ELCA-C01/C03 cluster | N | 0.50 | 0.30 | Desirability | Should positively correlate with core cluster | — |
| ELCA-A02 | Honestly, one source is about as reliable as another to me. | Reverse restatement testing ELCA-C08 consistency | Y | 0.60 | 0.33 | Desirability push toward disagreeing | Should track ELCA-C08 after reversal | Consistency pair with ELCA-C08 |
| ELCA-A03 | I have fully mastered how to critically appraise any medical study, with no gaps in my understanding. | Social-desirability / extreme-claim detector | Y | 0.92 | 0.18 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem per Part 3 §5.4, matching SAR-A03's pattern |

### Scenario items

**ELCA-S01**
- **Text:** "You read a headline: 'New Study Shows Coffee Cuts Disease Risk by 50%.' What do you want to know before deciding how much weight to give this?"
- **Purpose:** Applied appraisal instinct in a familiar, low-stakes context.
- **Construct measured:** ELCA
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Nothing else — a 50% reduction sounds like a big deal either way." — score 1
  - B. "Whether it was in humans or animals, and how large/long the study was." — score 5
  - C. "Whether other news outlets are also reporting it." — score 2
  - D. "Whether the relative risk reduction translates to a meaningful absolute risk reduction." — score 5
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.50
- **Discrimination (placeholder):** 0.50
- **Potential bias:** D requires prior exposure to the relative/absolute risk distinction — respondents without that specific coursework may under-score on genuine appraisal instinct they'd otherwise show; consider a "select all that apply" variant in a future revision to reduce this confound (developer note, not part of this version's scoring).
- **Expected interpretation:** Higher score = more applied critical-appraisal instinct.
- **Developer notes:** Both B and D score 5; they are not mutually exclusive in principle, but the single-select format forces a choice to keep response burden low — accepted tradeoff, documented for future multi-select revision.

**ELCA-S02**
- **Text:** "A relative shares a health claim they found on social media and asks what you think. The claim isn't obviously false, but it's not something you've seen from a mainstream source either. What do you do?"
- **Purpose:** Applied evidence-literacy behavior in an interpersonal, socially-loaded context (distinct from S01's purely informational framing).
- **Construct measured:** ELCA
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Say it sounds plausible so as not to argue." — score 1
  - B. "Say you're not sure and offer to look into it together." — score 4
  - C. "Say you'd want to see it from a source you trust before believing it." — score 5
  - D. "Change the subject." — score 2
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.42
- **Potential bias:** This item also loads somewhat on ECPC (communication tact) — accepted as a minor secondary loading (see Part 3 §4, secondary domain effects) since it is fundamentally an evidence-literacy behavior enacted in a social setting.
- **Expected interpretation:** Higher score = more willingness to apply evidence standards even in socially delicate moments.
- **Developer notes:** D scores above A specifically because disengaging is judged less actively evidence-*avoidant* than affirming an unverified claim; this ordering is a designed judgment call, documented per the "justify every design decision" requirement.

---

# Domain 3 — Intellectual Humility & Openness to Revision (IHOR)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| IHOR-C01 | When someone points out a flaw in my thinking, I try to genuinely consider it rather than defend my position. | Core openness-to-correction | N | 0.35 | 0.46 | High desirability | Higher = more self-reported openness to correction | Anchor item |
| IHOR-C02 | I can name a time I changed my mind about something important after seeing new evidence. | Concrete-memory-based openness proxy | N | 0.40 | 0.44 | Recall bias; may reward articulateness over true openness (though scored as agree/disagree, not free text, in this version) | Higher = more accessible evidence of revising behavior | Consider free-text companion in a future qualitative version — out of scope here (fully deterministic scoring required) |
| IHOR-C03 | I get uncomfortable when I realize I've been wrong about something. | Detects discomfort-with-error (inverted) | Y | 0.35 | 0.35 | Desirability push toward disagreeing regardless of true feeling | Lower raw agreement = higher contribution = more comfort with being wrong | Distinguishes *comfort with error* from *behavioral openness* (C01) — intentionally a separate facet |
| IHOR-C04 | I'd rather admit I don't know something than guess and sound confident. | Honesty-about-limits facet | N | 0.40 | 0.41 | Desirability | Higher = more self-reported epistemic honesty | — |
| IHOR-C05 | Once I've made up my mind, I rarely go back on it. | Detects rigidity (inverted) | Y | 0.45 | 0.43 | Some respondents read this as "decisiveness," a valued trait — risk of the item being answered on a different dimension than intended | Lower raw agreement = higher contribution = more revision-openness | Flag for cognitive interview in pilot per Part 6 |
| IHOR-C06 | I actively seek out opinions that challenge my own. | Active-open-mindedness behavior | N | 0.55 | 0.39 | Desirability; behavior claim, may be aspirational rather than actual | Higher = more self-reported active engagement with counter-views | Highest difficulty estimate in domain — expect lower endorsement rates |
| IHOR-C07 | Being shown wrong by someone with less experience than me would bother me. | Status-linked defensiveness detector (inverted) | Y | 0.50 | 0.40 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = less status-linked defensiveness | Especially relevant to hierarchical clinical settings (attending/trainee dynamics) |
| IHOR-C08 | I think it's a sign of strength, not weakness, to say "I need to look that up." | Reframing-of-not-knowing facet | N | 0.30 | 0.37 | Desirability | Higher = more positive framing of acknowledged limits | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| IHOR-A01 | If a mentor corrected me in front of others, I'd focus on what I could learn from it. | Consistency check with IHOR-C01/C07 cluster | N | 0.45 | 0.32 | Desirability; hypothetical framing | Should track core cluster | — |
| IHOR-A02 | Being corrected in front of others would mostly just embarrass me. | Reverse restatement of A01's underlying idea | Y | 0.50 | 0.34 | Desirability push toward disagreeing | Should track IHOR-A01 after reversal | Consistency pair with IHOR-A01 |
| IHOR-A03 | I am always right when I'm confident about something. | Social-desirability / extreme-claim detector | Y | 0.90 | 0.19 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem, same pattern as SAR-A03/ELCA-A03 |

### Scenario items

**IHOR-S01**
- **Text:** "You've been confidently explaining something to a study group, and a classmate politely shows you that you had a key detail wrong. What's most likely to be your actual next move?"
- **Purpose:** Behavioral proxy for openness to correction in a realistic, mildly embarrassing social moment.
- **Construct measured:** IHOR
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Thank them and update what I understood." — score 5
  - B. "Feel a bit embarrassed but move on and quietly note it." — score 4
  - C. "Explain why I thought what I thought, even after they clarify." — score 2
  - D. "Feel annoyed they corrected me in front of the group." — score 1
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.40
- **Discrimination (placeholder):** 0.47
- **Potential bias:** Social desirability strongly favors A; behavioral/scenario framing is the main mitigation available in a deterministic, non-adaptive instrument.
- **Expected interpretation:** Higher score = more openness to correction under realistic social discomfort.
- **Developer notes:** B scores 4 rather than 5 to acknowledge that mild embarrassment alongside genuine updating is a normal, healthy response — not a lesser one — while still differentiating it from the fully composed response in A. This is a deliberate design decision to avoid punishing normal emotional reactions.

**IHOR-S02**
- **Text:** "Two weeks after confidently giving a friend advice, you realize the advice was based on something that turned out to be inaccurate. What do you do?"
- **Purpose:** Behavioral proxy for proactive error-correction (distinct from S01's *reactive* correction scenario).
- **Construct measured:** IHOR
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Let it go — it's probably not a big deal now." — score 2
  - B. "Bring it up with them so they have accurate information." — score 5
  - C. "Feel bad about it privately but not say anything." — score 1
  - D. "Mention it if it comes up naturally, but not go out of my way." — score 3
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.50
- **Discrimination (placeholder):** 0.45
- **Potential bias:** Consequentiality is unspecified (advice could range from trivial to important); respondents may answer based on an assumed severity that varies person to person — noted as a wording limitation for future revision.
- **Expected interpretation:** Higher score = more proactive, self-initiated error correction.
- **Developer notes:** This item specifically targets *proactive* disclosure (relevant to error-disclosure professionalism, and thematically linked to ERP domain) — accepted minor secondary loading on ERP, documented per Part 3 §4.

---

# Domain 4 — Ambiguity Tolerance & Uncertainty Management (AMB)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| AMB-C01 | I can act on a decision even when I don't have all the information I'd like. | Core ambiguity-tolerance-in-action | N | 0.45 | 0.44 | Desirability | Higher = more tolerance for acting under uncertainty | Anchor item |
| AMB-C02 | Not knowing the full picture makes me anxious. | Detects uncertainty-related distress (inverted) | Y | 0.40 | 0.42 | Desirability push toward disagreeing regardless of true anxiety level; risk of overlap with clinical anxiety framing — worded generally, not clinically, per §1.3 non-diagnostic requirement | Lower raw agreement = higher contribution = less uncertainty-distress | Explicitly reviewed against §1.5(3) safety requirement: general "anxious" wording only, no clinical terms, no frequency/severity scale that could resemble a screening tool |
| AMB-C03 | I'm comfortable saying "it depends" or giving a range instead of a single firm answer. | Comfort communicating probabilistic/conditional answers | N | 0.40 | 0.38 | Low | Higher = more comfort with conditional/probabilistic answers | Connects to ECPC domain (communicating uncertainty) but scored here as the *comfort*, not the *delivery skill* |
| AMB-C04 | I'd rather wait for more certainty than make a call I might have to reverse. | Detects certainty-seeking-before-action tendency (inverted, situationally) | Y | 0.50 | 0.36 | Some respondents view "waiting for certainty" as prudent rather than avoidant — genuine construct ambiguity, flagged for pilot review | Lower raw agreement = higher contribution = more comfort acting despite reversal risk | Flag for cognitive interview in pilot; risk that this measures risk-tolerance as much as ambiguity-tolerance |
| AMB-C05 | Situations with no clear right answer are more interesting to me than frustrating. | Reframing of ambiguity as engaging rather than aversive | N | 0.55 | 0.40 | Desirability | Higher = more positive framing of ambiguous situations | — |
| AMB-C06 | I need a plan for every scenario before I feel ready to act. | Detects need-for-structure (inverted) | Y | 0.50 | 0.37 | Overlaps conceptually with CSR (conscientiousness); kept here since framing is specifically about *readiness to act under incomplete planning*, not organization itself | Lower raw agreement = higher contribution = more comfort acting without exhaustive planning | Cross-domain overlap flagged for Part 3 secondary-loading table |
| AMB-C07 | When a situation is unclear, I look for the most likely explanation rather than needing the certain one. | Probabilistic-satisficing tendency | N | 0.45 | 0.39 | Low | Higher = more comfort with "most likely" vs. "certain" reasoning | Conceptually adjacent to SAR-C08; kept distinct as this item is about *satisficing under ambiguity* specifically |
| AMB-C08 | I find it stressful when a teacher or supervisor gives instructions that leave room for interpretation. | Detects discomfort with ambiguous instruction (inverted) | Y | 0.45 | 0.35 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = more comfort with ambiguous instructions | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| AMB-A01 | I can be at peace with a decision even if I never find out whether it was the "right" one. | Consistency check with AMB-C01/C04 cluster | N | 0.55 | 0.31 | Desirability | Should track core cluster | — |
| AMB-A02 | I replay decisions in my head, wishing I'd had more certainty before making them. | Reverse restatement of A01's underlying idea | Y | 0.50 | 0.33 | Desirability push toward disagreeing | Should track AMB-A01 after reversal | Consistency pair with AMB-A01 |
| AMB-A03 | I am never bothered by uncertainty, in any situation, ever. | Social-desirability / extreme-claim detector | Y | 0.92 | 0.17 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem, consistent pattern across domains |

### Scenario items

**AMB-S01**
- **Text:** "You're leading a small group project and the instructions from your professor are genuinely ambiguous about what's expected. The deadline is in two days. What do you do?"
- **Purpose:** Behavioral proxy for acting productively under genuine ambiguity with a real constraint (time pressure).
- **Construct measured:** AMB
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Make a reasonable interpretation and move forward, ready to adjust if needed." — score 5
  - B. "Email the professor and wait to hear back before doing much else." — score 3
  - C. "Feel stuck and put off starting until it's clearer." — score 1
  - D. "Ask the professor, but start working on the parts that are clear regardless." — score 4
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.40
- **Discrimination (placeholder):** 0.46
- **Potential bias:** B and D both involve clarifying-seeking, a generally sound strategy — the differentiation is about whether the respondent also acts in the meantime, which is the actual construct target; risk that some readers see B as equally proactive.
- **Expected interpretation:** Higher score = more comfort moving forward productively despite unresolved ambiguity.
- **Developer notes:** A scores highest specifically because it reflects *both* tolerance and initiative; D is a close second because it hedges tolerance with information-seeking, which is a reasonable real-world strategy, not a lesser one — scored close together (5 vs 4) to reflect that closeness.

**AMB-S02**
- **Text:** "A doctor tells a patient (in a case study you're discussing in class) that a test result is 'probably nothing, but we can't be fully sure without more testing.' If you were the patient, how would you feel about that answer?"
- **Purpose:** Perspective-taking proxy for comfort with probabilistic medical communication, from the patient's-eye view (distinct from the practitioner-facing framing of most other AMB items).
- **Construct measured:** AMB (secondary loading: ECPC)
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Frustrated — I'd want a definite answer." — score 1
  - B. "Uneasy, but I'd understand why they can't promise certainty." — score 4
  - C. "I'd want to understand the actual odds involved rather than just 'probably.'" — score 5
  - D. "I wouldn't think much of it either way." — score 2
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.50
- **Discrimination (placeholder):** 0.41
- **Potential bias:** Perspective-taking items can be answered from an idealized "what I should feel" position rather than a genuine gut reaction; accepted limitation of self-report scenario framing.
- **Expected interpretation:** Higher score = more comfort with, and desire to actively engage with, probabilistic uncertainty even from the patient seat — used partly to sanity-check that AMB isn't purely about the respondent's *own* tolerance but generalizes to how they'd want uncertainty handled by others.
- **Developer notes:** Intentional secondary loading on ECPC is accepted and documented (Part 3 §4) rather than rewritten to avoid it, since the perspective-taking angle is valuable and a small amount of cross-loading is expected and acceptable per the domain-interaction design in Part 1 §2.

---

# Domain 5 — Empathic Communication & Patient-Centeredness (ECPC)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ECPC-C01 | When someone's upset, I try to understand their perspective before responding. | Core perspective-taking | N | 0.30 | 0.45 | High desirability | Higher = more self-reported perspective-taking | Anchor item |
| ECPC-C02 | I'm good at explaining complicated things in simple terms. | Communication-clarity self-assessment | N | 0.40 | 0.41 | Overconfidence risk | Higher = higher self-assessed explanatory clarity | — |
| ECPC-C03 | I sometimes find myself thinking about what I'll say next instead of fully listening. | Detects listening-quality issue (inverted) | Y | 0.55 | 0.37 | Fairly honest-inviting wording (normalizes the behavior) reduces some desirability pressure | Lower raw agreement = higher contribution = more full listening | Deliberately normalized phrasing to reduce social-desirability distortion, per §3 "avoid obvious desirable answers" requirement |
| ECPC-C04 | I notice non-verbal cues, like tone of voice or body language, pretty easily. | Non-verbal attunement self-assessment | N | 0.45 | 0.36 | Overconfidence | Higher = higher self-assessed non-verbal attunement | — |
| ECPC-C05 | I'd rather focus on the facts of a situation than how someone is feeling about it. | Detects fact-over-feeling default (inverted) | Y | 0.50 | 0.40 | Some respondents may view this as a neutral/positive trait (objectivity) — genuine construct tension, flagged | Lower raw agreement = higher contribution = more feeling-attentive default | Interacts with SAR domain (2.1) per Part 1 §2.1 interaction note; not treated as a flaw at high SAR, see report logic Part 4 |
| ECPC-C06 | I can usually tell when someone doesn't fully understand what I just explained to them. | Reading comprehension-of-audience skill | N | 0.50 | 0.38 | Overconfidence | Higher = higher self-assessed audience-reading skill | — |
| ECPC-C07 | Talking about difficult topics (like bad news) makes me want to avoid the conversation if I can. | Detects avoidance of difficult communication (inverted) | Y | 0.45 | 0.42 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = less avoidance of hard conversations | Directly relevant to breaking-bad-news competency per Part 1 §2.5 medical relevance |
| ECPC-C08 | I check in to make sure I actually understood someone, rather than assuming I did. | Active-listening confirmation behavior | N | 0.35 | 0.39 | Desirability | Higher = more self-reported check-in behavior | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ECPC-A01 | People have told me I'm easy to talk to. | Consistency check via external-validation framing, correlates with core cluster | N | 0.40 | 0.29 | Depends on whether respondent has received such feedback at all — possible false negatives for genuinely empathic but socially untested respondents | Should loosely track core cluster; interpret divergence cautiously | Weakest consistency-pair candidate in domain — noted for pilot review |
| ECPC-A02 | Honestly, I don't think people find me that easy to open up to. | Reverse restatement of A01's underlying idea | Y | 0.55 | 0.30 | Same caveat as A01 | Should track ECPC-A01 after reversal | Consistency pair with ECPC-A01 |
| ECPC-A03 | I always know exactly how everyone around me is feeling. | Social-desirability / extreme-claim detector | Y | 0.93 | 0.16 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem |

### Scenario items

**ECPC-S01**
- **Text:** "A classmate is venting to you about a stressful situation. They don't ask for advice. What are you most likely to actually do?"
- **Purpose:** Behavioral proxy for listening-first vs. fixing-first communication default.
- **Construct measured:** ECPC
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Listen and ask questions about how they're feeling before offering anything." — score 5
  - B. "Listen for a bit, then offer some suggestions to help." — score 3
  - C. "Jump in with suggestions since that's usually what's actually useful." — score 1
  - D. "Listen, and just ask if they want advice or just want to vent." — score 5
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.40
- **Discrimination (placeholder):** 0.45
- **Potential bias:** B is a very common, reasonable real-world response and may be under-scored relative to its actual social validity; kept at 3 rather than lower to reflect that it's a legitimate middle-ground, not a poor choice.
- **Expected interpretation:** Higher score = more listening-first, consent-checking communication default.
- **Developer notes:** A and D both score 5 as functionally equivalent "listens first" responses — D is arguably the most patient-centered ideal (explicitly checks what's wanted) but is not weighted higher to avoid over-rewarding a single "correct-sounding" script.

**ECPC-S02**
- **Text:** "You have to tell someone news they won't want to hear (e.g., a group project grade came back lower than expected and it affects everyone, including a teammate who worked hard). How do you approach it?"
- **Purpose:** Behavioral proxy for delivering unwelcome information, thematically linked to breaking-bad-news competency.
- **Construct measured:** ECPC
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Send a message so I don't have to see their reaction." — score 1
  - B. "Tell them directly but plan what to say so it lands gently." — score 5
  - C. "Wait for them to ask, rather than bring it up myself." — score 2
  - D. "Tell them quickly and move on to solutions right away." — score 3
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.43
- **Potential bias:** A may be under-selected due to obvious social undesirability even if realistically common (avoidance via text) — expect a floor effect on this option; retained anyway since it's a meaningful behavioral anchor.
- **Expected interpretation:** Higher score = more thoughtful, direct approach to delivering unwelcome information.
- **Developer notes:** D scores above A/C but below B to reflect that "quick and solution-focused" is a real, not-uncommon style that has some merit (efficiency) but is scored lower than B's combination of directness and emotional attunement, consistent with the domain's patient-centeredness framing.

---

# Domain 6 — Ethical Reasoning & Professionalism (ERP)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ERP-C01 | If I made a mistake that affected someone, I would tell them even if I could get away with not saying anything. | Core error-disclosure honesty | N | 0.30 | 0.44 | Very high desirability — this whole domain carries the highest social-desirability risk in the bank, per Part 1 §2.6 | Higher = more self-reported disclosure honesty | Flagged domain-wide for widest interpretive error margin, per Part 1 §2.6 |
| ERP-C02 | I take confidentiality seriously even when it would be easy to share something. | Confidentiality-respecting disposition | N | 0.30 | 0.40 | High desirability | Higher = more self-reported confidentiality discipline | — |
| ERP-C03 | If I noticed a friend cutting corners in a way that could hurt someone, I'd say something even if it strained the friendship. | Willingness to act on ethical concern despite social cost | N | 0.50 | 0.43 | High desirability; also genuinely difficult hypothetical, may not predict real behavior | Higher = more self-reported willingness to act despite social cost | Acknowledge in report language that hypothetical endorsement often exceeds real-world follow-through (general finding in ethics-vignette research, used as background context, not a specific citation) |
| ERP-C04 | Small dishonest shortcuts (like fudging a detail on paperwork) don't really bother me if no one gets hurt. | Detects tolerance for minor dishonesty (inverted) | Y | 0.55 | 0.41 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = less tolerance for minor dishonesty | — |
| ERP-C05 | I think it's important to disclose a conflict of interest even if it might make me look bad. | Conflict-of-interest disclosure disposition | N | 0.35 | 0.39 | High desirability | Higher = more self-reported disclosure willingness | — |
| ERP-C06 | I've bent the truth a little to avoid an awkward conversation before. | Detects real (vs. idealized) honesty behavior (inverted) | Y | 0.35 | 0.34 | Desirability push toward disagreeing despite common, near-universal behavior — item deliberately normalizes a common behavior to fight ceiling effects | Lower raw agreement = higher contribution, but **expect and accept a lower ceiling** — near-universal honest endorsement of "yes, sometimes" is anticipated and not treated as a validity concern by itself | Explicitly excluded from the straight-line/extreme-response validity flags — near-universal moderate agreement here is expected true signal, not a red flag (Part 3 §5.2 exception list) |
| ERP-C07 | I follow rules even when I'm confident no one would notice if I didn't. | Rule-following under low external accountability | N | 0.40 | 0.42 | High desirability | Higher = more self-reported rule-following under low accountability | — |
| ERP-C08 | If I disagreed with a decision my team made, I'd raise it through the proper channels rather than work around it quietly. | Professional-channel-use disposition | N | 0.45 | 0.37 | Desirability; hypothetical | Higher = more self-reported use of proper channels | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| ERP-A01 | I'd rather take the blame myself than let someone else take it for my mistake. | Consistency check with ERP-C01 cluster | N | 0.35 | 0.28 | Very high desirability | Should track core cluster | Domain-wide desirability caveat applies especially strongly here |
| ERP-A02 | If I could avoid taking blame for something without anyone finding out, I probably would. | Reverse restatement of A01's underlying idea | Y | 0.60 | 0.30 | Desirability push toward disagreeing | Should track ERP-A01 after reversal | Consistency pair with ERP-A01; expect the largest forward/reverse gap in the bank given desirability intensity — noted for pilot calibration |
| ERP-A03 | I have never once, in my entire life, told even a small white lie. | Social-desirability / extreme-claim detector | Y | 0.95 | 0.15 (intentionally low) | Very high — designed to catch over-claiming; expect this to be the single most-flagging SD item in the bank | Agreement (raw ≥4) contributes to SD flag, not domain score, with **elevated weight in the SD index** (see Part 3 §5.4) given how norm-violating true agreement would be | **Excluded from domain raw score**, routed to validity subsystem with elevated SD weighting specifically for this item |

### Scenario items

**ERP-S01**
- **Text:** "You're working on a group assignment and realize you made an error that, if left uncorrected, would slightly inflate your team's grade. No one else has noticed. What do you do?"
- **Purpose:** Behavioral proxy for error disclosure under low external accountability and real personal cost (grade).
- **Construct measured:** ERP
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Say nothing — it's a small error and unlikely to matter." — score 1
  - B. "Fix it quietly without drawing attention to it." — score 3
  - C. "Tell my teammates and the instructor so it can be properly corrected." — score 5
  - D. "Tell my teammates but not the instructor." — score 4
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.55
- **Discrimination (placeholder):** 0.48
- **Potential bias:** Highest social-desirability pull in the entire scenario set (C is the "obviously correct" answer) — this is accepted as an unavoidable feature of ethics scenario items and is exactly why ERP carries the widest confidence margin in reporting (Part 1 §2.6, Part 4).
- **Expected interpretation:** Higher score = more proactive, transparent error correction under low accountability.
- **Developer notes:** B is scored meaningfully above A (quiet self-correction is real integrity, just not full transparency) and meaningfully below C/D — a three-tier structure rather than binary right/wrong, matching the "avoid obvious desirable answers" requirement as much as an ethics item reasonably can.

**ERP-S02**
- **Text:** "A close friend asks you to cover for them about where they were last night — nothing illegal or dangerous, just something they don't want a family member to know. What do you do?"
- **Purpose:** Behavioral proxy for honesty under interpersonal/loyalty pressure, deliberately a low-stakes, relatable dilemma (not a medical scenario) so it reads as a genuine values question rather than a "test."
- **Construct measured:** ERP
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Cover for them — loyalty to a friend matters more here." — score 2
  - B. "Tell them I'm not comfortable lying, but I won't volunteer the information either." — score 4
  - C. "Refuse and tell them they should be honest with their family themselves." — score 4
  - D. "Cover for them without hesitation — it's harmless." — score 1
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.50
- **Discrimination (placeholder):** 0.39
- **Potential bias:** Reasonable people genuinely disagree about small social lies for a friend — this item has the most legitimate value-pluralism of any in the bank, which is why no option scores a full 5; treat divergent answers here as differences in values, not skill.
- **Expected interpretation:** Higher score = more consistent honesty orientation even under loyalty pressure, without treating the "harmless white lie" question as a clear-cut ethics failure.
- **Developer notes:** Deliberately no 5-point option in this item — a design decision documented here — because the underlying dilemma is genuinely contested territory (unlike ERP-S01's clearer-cut case), and manufacturing a "perfect" answer would misrepresent the ethics literature's own acknowledgment of reasonable disagreement in low-stakes loyalty dilemmas.

---

# Domain 7 — Conscientiousness & Self-Regulation (CSR)

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| CSR-C01 | I usually finish tasks well before the deadline. | Core follow-through/timeliness | N | 0.45 | 0.42 | Desirability | Higher = more self-reported timeliness | Anchor item |
| CSR-C02 | I keep track of my commitments without needing frequent reminders. | Organizational self-management | N | 0.40 | 0.39 | Desirability | Higher = more self-reported organizational independence | — |
| CSR-C03 | I sometimes start things with enthusiasm but lose steam before finishing. | Detects follow-through inconsistency (inverted) | Y | 0.55 | 0.44 | Fairly honest-inviting wording reduces desirability pressure somewhat | Lower raw agreement = higher contribution = more consistent follow-through | Deliberately normalized phrasing per "avoid obvious desirable answers," same technique as ECPC-C03 |
| CSR-C04 | I'd rather do a task well and a little late than rush and turn it in on time but sloppy. | Quality-vs-timeliness prioritization | N | 0.50 | 0.30 | Genuine values tradeoff, not a pure conscientiousness signal — flagged | Ambiguous; scored as a mild positive but with the lowest discrimination estimate in the domain, reflecting genuine construct ambiguity | Candidate for removal or rewording after pilot data — kept for completeness per 13-item allocation, flagged for review in Part 6 |
| CSR-C05 | I keep a system (calendar, list, app, notebook) to track what I need to do. | Concrete organizational behavior | N | 0.40 | 0.36 | Desirability; behavioral claim easy to over-report | Higher = more self-reported use of organizational systems | — |
| CSR-C06 | Deadlines sneak up on me more often than I'd like to admit. | Detects planning/time-management gaps (inverted) | Y | 0.50 | 0.41 | Honest-inviting wording | Lower raw agreement = higher contribution = fewer planning gaps | — |
| CSR-C07 | Once I commit to something, I follow through even when it stops being convenient. | Reliability-under-inconvenience | N | 0.40 | 0.43 | High desirability | Higher = more self-reported reliability under inconvenience | Strong anchor item candidate |
| CSR-C08 | I can push through a boring or tedious task without needing much external motivation. | Self-regulation under low-interest conditions | N | 0.45 | 0.38 | Desirability | Higher = more self-reported self-motivation under tedium | — |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| CSR-A01 | People can count on me to do what I said I'd do. | Consistency check via external-validation framing | N | 0.35 | 0.29 | Desirability | Should track core cluster | Same "may not have received explicit feedback" caveat as ECPC-A01 |
| CSR-A02 | I've let people down by not following through on something I said I'd do. | Reverse restatement of A01's underlying idea, honestly-worded | Y | 0.55 | 0.31 | Honest-inviting wording, moderate desirability pull | Should track CSR-A01 after reversal | Consistency pair with CSR-A01 |
| CSR-A03 | I have never once procrastinated or missed a self-imposed deadline. | Social-desirability / extreme-claim detector | Y | 0.90 | 0.19 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem |

### Scenario items

**CSR-S01**
- **Text:** "You have three things due the same week: a paper, a group project part, and something you volunteered for. You're realizing you're behind on all three. What's most like your actual pattern?"
- **Purpose:** Behavioral proxy for self-regulation under real competing-deadline pressure.
- **Construct measured:** CSR
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Triage — figure out what actually needs to happen first and work through it in order." — score 5
  - B. "Work on whichever one feels most urgent in the moment, even if it's not the most important." — score 3
  - C. "Feel overwhelmed and lose time deciding where to start." — score 1
  - D. "Push through all three at once, even if none of them get my best work." — score 2
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.46
- **Potential bias:** "Most like your actual pattern" framing invites idealized self-report over true recalled behavior; scenario framing mitigates but doesn't eliminate this.
- **Expected interpretation:** Higher score = more effective self-regulation and prioritization under competing deadlines.
- **Developer notes:** B is scored meaningfully above C/D as a common and not-unreasonable real-world pattern, even though it's not the "ideal" (A) — avoids collapsing all non-ideal answers into equally low scores, per "avoid obvious desirable answers" and to give the scale real range.

**CSR-S02**
- **Text:** "You committed to a study group but you're exhausted and would rather skip it tonight, even though it's not truly an emergency. What do you actually tend to do in situations like this?"
- **Purpose:** Behavioral proxy for follow-through under low-stakes inconvenience (distinct from S01's high-stakes multi-deadline pressure).
- **Construct measured:** CSR
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "Go anyway — I said I would." — score 5
  - B. "Go, but show up a bit late or leave early." — score 4
  - C. "Skip it, but let the group know ahead of time." — score 3
  - D. "Skip it without saying anything, and figure I'll explain later if it comes up." — score 1
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.40
- **Discrimination (placeholder):** 0.44
- **Potential bias:** Low — situation is realistic and low-stakes enough to reduce desirability distortion relative to higher-stakes items elsewhere in the bank.
- **Expected interpretation:** Higher score = more consistent follow-through even under minor personal inconvenience.
- **Developer notes:** C is scored reasonably (3, not 1) to avoid punishing honest, communicated changes of plan — this domain should not implicitly define "conscientious" as "never changes plans," only as "follows through or communicates clearly when not."

---

# Domain 8 — Resilience & Stress Tolerance (RST)

**Domain-wide safety note (repeated from Part 1 §2.8):** every item below has been reviewed to ensure it reads as a general coping/resilience item, not a mental-health screening item. None of these items, individually or in combination, should be interpreted as (or presented as) a depression, anxiety, or burnout screening instrument. Part 3 §5 defines the safety-routing logic that must run before this domain (or any domain) is scored.

### Core items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| RST-C01 | When something doesn't go my way, I usually bounce back within a few days. | Core recovery-from-setback | N | 0.40 | 0.43 | Desirability; also genuinely variable by setback severity, which the item doesn't specify | Higher = more self-reported recovery speed | Anchor item; severity-ambiguity noted, accepted as a general item rather than tied to one specific scenario |
| RST-C02 | I have a few go-to strategies I use when I'm stressed (like exercise, talking to someone, or taking a break). | Coping-strategy repertoire (not affect) | N | 0.35 | 0.41 | Desirability; behavioral-inventory framing reduces some pull relative to affect-based items | Higher = more self-reported coping-strategy repertoire | Deliberately strategy-focused per Part 1 §2.8's emphasis on actionable, learnable coping over trait affect |
| RST-C03 | A bad grade or a harsh piece of feedback can put me in a bad mood for a long time. | Detects prolonged negative-affect response (inverted) | Y | 0.50 | 0.40 | Desirability push toward disagreeing; wording deliberately avoids clinical terms (e.g., no "depressed," no duration/frequency criteria that would resemble a screening item) | Lower raw agreement = higher contribution = shorter-lived negative affect response | Explicitly reviewed for clinical-screening resemblance and cleared — no diagnostic language, no severity/frequency criteria |
| RST-C04 | If I fail at something, I try to figure out what I can learn from it. | Growth-oriented response to failure | N | 0.35 | 0.42 | Desirability | Higher = more self-reported growth-oriented failure response | — |
| RST-C05 | When I'm struggling, I'm comfortable reaching out to someone for support. | Help-seeking as a positive indicator | N | 0.45 | 0.39 | Desirability; help-seeking stigma may suppress honest reporting in the *low* direction more than usual | Higher = more self-reported comfort with help-seeking | Framed explicitly as a strength, not a deficit, per Part 1 §2.8's construct definition — avoid any report language that treats low scores here as "weakness," see Part 4 tone requirements |
| RST-C06 | I tend to expect the worst when something goes wrong, even before I know the details. | Catastrophizing tendency (inverted) | Y | 0.45 | 0.38 | Desirability push toward disagreeing; borders on clinical language ("catastrophizing" is a common CBT term) — item itself uses plain language, not the clinical term, to stay in self-report/coping territory rather than screening territory | Lower raw agreement = higher contribution = less catastrophizing tendency | Reviewed against §1.5(3); plain-language wording retained specifically to avoid clinical-screening resemblance |
| RST-C07 | I can keep functioning reasonably well even during a genuinely stressful stretch (exams, a hard rotation, etc.). | Functioning-under-sustained-stress | N | 0.50 | 0.44 | Desirability | Higher = more self-reported functioning under sustained stress | Directly ties to Part 1 §2.8 medical relevance (sustaining engagement through a difficult rotation) |
| RST-C08 | Setbacks make me want to give up on the bigger goal, at least for a while. | Detects goal-disengagement under setback (inverted) | Y | 0.50 | 0.41 | Desirability push toward disagreeing | Lower raw agreement = higher contribution = less goal-disengagement under setback | Reviewed against §1.5(3): "give up... for a while" is deliberately non-clinical, non-permanent phrasing — does not resemble hopelessness/suicidality screening language, which this instrument must never approximate |

### Auxiliary items (LIKERT5)

| ID | Text | Purpose | Reverse | Diff.* | Discr.* | Potential bias | Expected interpretation | Dev notes |
|---|---|---|---|---|---|---|---|---|
| RST-A01 | Looking back, I've gotten through hard periods before and come out okay. | Consistency check with RST-C01/C07 cluster, retrospective framing | N | 0.35 | 0.28 | Desirability; retrospective framing may not predict future coping | Should track core cluster | — |
| RST-A02 | I worry that if things got really hard, I wouldn't be able to cope. | Reverse restatement of A01's underlying idea | Y | 0.55 | 0.30 | Desirability push toward disagreeing; reviewed against §1.5(3), phrasing kept general/hypothetical rather than about current state, to avoid resembling a present-tense distress screen | Should track RST-A01 after reversal | Consistency pair with RST-A01; explicitly reviewed for crisis-screening resemblance and cleared given hypothetical, non-present-tense framing |
| RST-A03 | Nothing ever really stresses me out, no matter what happens. | Social-desirability / extreme-claim detector | Y | 0.90 | 0.18 (intentionally low) | High — designed to catch over-claiming | Agreement (raw ≥4) contributes to SD flag, not domain score | **Excluded from domain raw score**, routed to validity subsystem |

### Scenario items

**RST-S01**
- **Text:** "You worked hard on something (an exam, an application, a project) and it didn't go the way you hoped. What's most like your actual pattern over the next few days?"
- **Purpose:** Behavioral proxy for recovery trajectory after a real setback, in generic (not domain-specific) framing to keep it broadly relatable.
- **Construct measured:** RST
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "I feel it for a bit, then start thinking about what's next." — score 5
  - B. "It stays with me for a while, but I still keep up with my regular routine." — score 4
  - C. "It's hard to focus on much else for a while." — score 2
  - D. "I try to talk to someone about it, which helps me move forward." — score 5
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.45
- **Potential bias:** Same recall-idealization limitation noted throughout the scenario set; also, severity of "didn't go the way you hoped" is left deliberately unspecified/generic, which trades some precision for broad applicability across very different respondent situations.
- **Expected interpretation:** Higher score = healthier, more functional recovery trajectory after a real setback.
- **Developer notes:** C is not scored as low as the "worst" possible response (kept at 2, not 1) — a period of genuinely reduced focus after a real setback is normal and expected, and scoring it near-zero would pathologize a normal reaction, inconsistent with the domain's non-clinical framing (§1.3, §2.8).

**RST-S02**
- **Text:** "You're in the middle of a demanding stretch (finals, a heavy work period, etc.) and someone asks how you're managing. What's closest to your honest answer?"
- **Purpose:** Behavioral proxy for functioning-under-sustained-stress, self-reported in the moment rather than retrospectively (distinct from S01's after-the-fact framing).
- **Construct measured:** RST
- **Response type:** Single-select, 4 options
- **Options and scores:**
  - A. "It's a lot, but I'm managing okay." — score 5
  - B. "I'm keeping up, but it's taking a toll." — score 4
  - C. "Honestly, I'm barely keeping my head above water." — score 2
  - D. "I've had to let some things slide to keep up with the rest." — score 3
- **Reverse scoring flag:** N/A
- **Item weight:** 1.5
- **Difficulty (placeholder):** 0.45
- **Discrimination (placeholder):** 0.43
- **Potential bias:** C is worded close to a genuine distress signal by design (this domain's construct legitimately includes "currently struggling") — this is why the safety-routing logic in Part 3 §5 must check RST-S02 (and RST-C03/C06/C08) responses as part of the pre-scoring safety gate, not just the free-text fields.
- **Expected interpretation:** Higher score = better self-reported functioning under current sustained stress.
- **Developer notes:** **This item is explicitly flagged for the safety-routing table in Part 3** — a response of C, especially in combination with low scores on RST-C03/C05/C08, should be evaluated by the pre-scoring safety gate (§1.5(3)) before the assessment proceeds to a normal report, per the crisis-handling requirement established in Part 1.

---

## 3.1 Question Bank Summary Table

| Domain | Core | Auxiliary | Scenario | Total | Weight sum (core 1.0 + aux 0.5 + scenario 1.5) |
|---|---|---|---|---|---|
| SAR | 8 | 3 | 2 | 13 | 8(1.0)+3(0.5)+2(1.5) = 12.5 |
| ELCA | 8 | 3 | 2 | 13 | 12.5 |
| IHOR | 8 | 3 | 2 | 13 | 12.5 |
| AMB | 8 | 3 | 2 | 13 | 12.5 |
| ECPC | 8 | 3 | 2 | 13 | 12.5 |
| ERP | 8 | 3 | 2 | 13 | 12.5 |
| CSR | 8 | 3 | 2 | 13 | 12.5 |
| RST | 8 | 3 | 2 | 13 | 12.5 |
| **Total** | **64** | **24** | **16** | **104** | **100.0** |

Note: each domain's three SD-detector auxiliary items (`*-A03`) are excluded from their domain's raw weighted score per-item (see notes above), so the **effective** scoring weight sum per domain used in Part 3's normalization formula is 12.5 − 0.5 = 12.0 (the SD item's 0.5 weight is applied only within the validity-check subsystem). This is documented explicitly here so the Part 3 formula and this table don't appear to disagree.

---

## What's next

Part 3 will cover the complete Answer Mapping (Section 4) and Scoring Algorithm (Section 5): normalization formulas turning the 12.0 effective weight per domain into a 0–100 domain score, the consistency-pair and social-desirability detection logic referenced throughout this bank, the safety-routing gate for RST-S02 and related items, and full pseudocode + JSON examples.

---

## Technical Specification — Part 3 of 8: Answer Mapping & Scoring Algorithm

Builds on Part 1 (`01-architecture-and-domains.md`) and Part 2 (`02-question-bank.md`). This part makes the scoring pipeline fully explicit and deterministic: given any complete or partial set of raw answers, two engineers implementing this spec independently must produce byte-identical scores.

---

## 4. Answer Mapping

### 4.1 General Mapping Structure

Every answer maps to a tuple the scoring engine consumes:

```
AnswerContribution {
  question_id: string        // e.g. "SAR-C05"
  raw_value: integer         // 1-5 for LIKERT5; 1-5 for scenario (option-mapped)
  contribution_score: number // raw_value, or (6 - raw_value) if reverse-keyed
  item_weight: number        // 1.0 core / 0.5 auxiliary / 1.5 scenario
  primary_domain: string     // e.g. "SAR"
  secondary_domains: [{domain: string, loading: number}]  // see 4.2
  scored_toward_domain: boolean  // false for the three *-A03 SD-detector items
  scored_toward_sd_index: boolean // true only for *-A03 items
}
```

For **LIKERT5** items: `contribution_score = raw_value` if `reverse = N`, else `contribution_score = 6 - raw_value`.

For **scenario** items: `contribution_score` is read directly from the per-option score table published in Part 2 for that item (already on the 1–5 scale; no separate reversal step, since scenario options are individually scored rather than keyed).

### 4.2 Domain Effect Mapping (Primary + Secondary Loadings)

Every item has exactly one **primary domain** (the domain whose raw score it feeds, per Part 2's per-domain grouping) and, for a documented subset of items, one **secondary domain** with a smaller loading — capturing the cross-domain overlaps that Part 1 §2 and Part 2 flagged as "accepted secondary loadings" rather than item-design flaws.

Secondary loadings **do not change an item's contribution to its primary domain's score.** They add a smaller, separate contribution to the secondary domain's *interaction index* only (defined in §5.11) — they are used for interaction-rule detection, not for double-counting raw score. This keeps every domain's raw score independently auditable from its own 13 items alone, while still letting the engine detect the cross-domain patterns Parts 1–2 documented.

**Full secondary-loading table** (every item not listed here has no secondary loading):

| Item ID | Primary domain | Secondary domain | Loading | Rationale (from Part 1/2) |
|---|---|---|---|---|
| SAR-C05 | SAR | IHOR | 0.20 | Confirmation-bias tolerance conceptually adjacent to openness-to-revision |
| ECPC-C05 | ECPC | SAR | 0.15 | "Facts over feelings" default interacts with analytical disposition, Part 1 §2.1 |
| AMB-C06 | AMB | CSR | 0.20 | "Need a plan before acting" overlaps conscientiousness/structure-seeking |
| AMB-S02 | AMB | ECPC | 0.20 | Patient-perspective framing of an uncertainty item |
| IHOR-S02 | IHOR | ERP | 0.20 | Proactive disclosure of a past error is also a professionalism behavior |
| ECPC-S02 | ECPC | ERP | 0.15 | Delivering unwelcome news honestly touches professional honesty norms |

All loadings are placeholders in the same sense as the difficulty/discrimination estimates in Part 2 — expert-assigned starting values, to be replaced with factor-analytic loadings once Part 6's validation study runs (see Part 6 in a later document in this series).

### 4.3 Interaction Rules (Formalized)

Part 1 §2 and Part 2 flagged several qualitative cross-domain patterns in prose. Here they become precise, threshold-based, deterministic rules the engine evaluates **after** all eight domain scores are computed. Each rule adds a **report flag** (consumed by Part 4/5's report and profile engines) — interaction rules never modify a domain's numeric score itself, only annotate the profile/report layer, which keeps domain scores independently interpretable.

| Rule ID | Condition (all domain scores on 0–100 scale) | Effect |
|---|---|---|
| AR-03 | `SAR ≥ 70 AND AMB ≤ 40` | Add flag `needs_certainty_before_acting`; surfaces report fragment RPT-AR03 (Part 4) |
| AR-03b | `AMB ≤ 40 AND CSR ≥ 70` | Add flag `checks_and_rechecks_pattern`; surfaces RPT-AR03B — the CSR/AMB variant of the same underlying pattern, kept as a distinct rule since the report language differs (planning-driven vs. certainty-driven) |
| IH-01 | `SAR ≥ 70 AND IHOR ≤ 40` | Add flag `confident_reasoner_resists_correction`; surfaces RPT-IH01, framed as a specific growth-edge, never as a character judgment (tone requirement, Part 4) |
| CR-02 | `CSR ≥ 80 AND RST ≤ 40` | Add flag `overextension_risk`; surfaces RPT-CR02, a wellbeing-oriented (not performance-oriented) report fragment |
| EC-01 | `SAR ≥ 70 AND ECPC ≤ 40` | Add flag `technical_orientation`; surfaces RPT-EC01, framed as a development opportunity, never a deficiency (Part 1 §2.1) |
| CM-04 | `RST ≤ 40 AND ERP ≥ 80` | **Confidence-only modifier** (not a report flag): reduces the *confidence rating* attached to the ERP score specifically by 15 points (see §5.10), reflecting Part 1 §2.8's note that this pattern can indicate social-desirability over-reporting on the ethics domain rather than a report-facing flag |
| PC-01 (perfectionism note) | `CSR ≥ 90` | Surfaces RPT-PC01, a standalone "possible perfectionism" note per Part 1 §2.7, independent of any second domain |
| OA-01 (over-analysis note) | `SAR ≥ 90` | Surfaces RPT-OA01, a standalone "possible over-analysis" note per Part 1 §2.1, independent of any second domain |

Rules are evaluated independently and are **not mutually exclusive** — a single respondent can trigger multiple rules simultaneously (e.g., both AR-03 and IH-01 if SAR is high while both AMB and IHOR are low). The report engine (Part 4) must handle multi-flag assembly without contradictory language; ordering and de-duplication logic for that assembly step is specified in Part 4, not here.

### 4.4 Confidence Modifiers Table

Beyond CM-04 above, three additional confidence modifiers apply globally (i.e., to the respondent's overall confidence rating, not one domain):

| Modifier ID | Condition | Effect |
|---|---|---|
| CM-01 | SD index (§5.9) ≥ 3 of 8 possible SD-item flags | Global confidence rating −20 |
| CM-02 | Missing-data rate > 10% (after applying §5.5 handling) | Global confidence rating −10 |
| CM-03 | Straight-lining detected (§5.7) on ≥ 1 run | Global confidence rating −25 |
| CM-04 | See §4.3 | ERP-specific confidence −15 (domain-specific, not global) |

Confidence-rating computation combining these is given in §5.10.

### 4.5 Risk / Safety Flags

One item in the bank is a designated **safety-gate item**: `RST-S02`. Per Part 2's developer note, a response of **option C** ("barely keeping my head above water") on RST-S02, in combination with low scores on two or more of `{RST-C03, RST-C05, RST-C08}` (raw contribution_score ≤ 2 on each, i.e., in the direction indicating more distress), triggers the **safety gate** defined in §5.12, which halts normal scoring/report generation and routes to a resources screen instead.

This is the only cross-item rule in the entire specification that can halt the pipeline rather than merely annotate the output — consistent with Part 1 §1.5(3)'s exclusion criteria and §2.8's hard product rule.

---

## 5. Scoring Algorithm

### 5.0 Pipeline Overview (high level, detailed in §5.13)

```
1. Ingest raw answers
2. Run safety gate check (§5.12) — HALT here if triggered
3. Compute per-item contribution_score (§4.1)
4. Apply missing-data handling (§5.5)
5. Compute per-domain raw weighted score (§5.2)
6. Normalize each domain to 0-100 (§5.3)
7. Run validity checks: consistency (§5.6), straight-lining (§5.7),
   contradiction detection (§5.8), social desirability (§5.9)
8. Compute confidence rating (§5.10)
9. Evaluate interaction rules (§4.3) against final domain scores
10. Apply confidence modifiers (§4.4, §5.10)
11. Emit ScoringResult object (§5.14) for the report engine (Part 4)
```

### 5.1 Raw Scoring

For a given domain `D` with item set `Items(D)` (13 items per Part 2, of which 12 are `scored_toward_domain = true` and 1 — the `*-A03` item — is `scored_toward_domain = false`):

```
RawSum(D) = Σ [ contribution_score(i) × item_weight(i) ]  for i in Items(D) where scored_toward_domain = true AND answered
EffectiveWeight(D) = Σ [ item_weight(i) ]  for i in Items(D) where scored_toward_domain = true AND answered
```

Both sums iterate only over **answered, domain-scored** items — missing items are excluded from both numerator and denominator per §5.5 (this is a "available-item" weighted mean, not a zero-fill mean, which would bias scores toward the low end simply because someone skipped items).

### 5.2 Weighted Scoring

```
WeightedMean(D) = RawSum(D) / EffectiveWeight(D)
```

`WeightedMean(D)` is a real number in **[1, 5]** (since every `contribution_score` is in [1,5] and it's a weighted average).

Full-completion sanity check: with all 12 domain-scored items answered, `EffectiveWeight(D) = 8×1.0 + 3×0.5 + 2×1.5 = 8 + 1.5 + 3 = 12.5 − 0.5 (the excluded *-A03 weight was never in this sum since it's excluded, so no subtraction needed here)`. Concretely: 8 core (weight 1.0 each = 8.0) + 2 non-SD auxiliary (weight 0.5 each = 1.0) + 2 scenario (weight 1.5 each = 3.0) = **12.0**, matching the "effective weight 12.0" figure noted at the end of Part 2.

### 5.3 Normalization to 0–100

```
DomainScore(D) = ROUND( (WeightedMean(D) - 1) / (5 - 1) × 100 , 1)   // one decimal place
```

This linearly maps the [1,5] weighted-mean range to [0,100]. `DomainScore` is what populates every interpretation band in Part 1 §2 and every threshold in §4.3's interaction rules.

**Worked example:** if a respondent's SAR `WeightedMean = 3.8`, `DomainScore(SAR) = (3.8 − 1) / 4 × 100 = 70.0` → falls in the "Established" band (50–74)... note 70.0 is inside 50-74, just under the 75 "Strong" cutoff — illustrates why band edges must use `≥`/`<` consistently: **band membership uses `low ≤ score < high` for all bands except the top band, which uses `low ≤ score ≤ 100`,** to avoid a 100.0 score falling outside every band.

### 5.4 Reverse Scoring (recap, cross-referenced from §4.1)

Restated here because it's foundational to §5.1: reverse-keyed LIKERT5 items use `contribution_score = 6 − raw_value` **before** entering `RawSum`. Scenario items have no separate reverse step; their option-score table (Part 2) already encodes directionality per-option.

### 5.5 Missing Data Handling

Three tiers, applied in order:

**Tier 1 — Item-level (≤ 2 items missing in a domain, i.e., ≤ ~16%):** Excluded from that domain's `RawSum`/`EffectiveWeight` per §5.1. No flag raised. This is the normal, expected case for accidental skips.

**Tier 2 — Domain-level (3+ items missing in a single domain, i.e., ≥ ~23%):** Domain is marked `insufficient_data = true`. `DomainScore(D)` is still computed from whatever was answered (for internal use / potential partial display), but the report engine (Part 4) must render this domain as **"Not enough data to interpret"** rather than a numeric score or band, and must exclude this domain from any interaction-rule evaluation (§4.3) and from the composite score (if computed; composite scoring is out of scope for this document and reserved for a later part if the product requires one).

**Tier 3 — Assessment-level (missing-data rate > 10% across all 104 items, i.e., > ~10 items total):** Apply global confidence modifier CM-02 (§4.4) regardless of which domains were affected. If missing-data rate exceeds **25%** (27+ items), the assessment is marked `incomplete = true` at the top level; the product must not generate a full interpretive report at all, only a "your responses were too incomplete to generate a reliable report; would you like to continue where you left off?" message. This threshold is a deliberate product-safety choice: a report built on fewer than ~77 answered items would rest on domain scores computed from as few as a handful of items in the worst domain, which is not a responsible basis for feedback language, however hedged.

### 5.6 Consistency Checks

Applies to the eight documented consistency pairs (one per domain, matching each domain's `*-A01`/`*-A02` auxiliary pair, per Part 2) plus the two core forward/reverse conceptual pairs called out in Part 2's dev notes — `SAR-C01`/`SAR-C05` and `IHOR-C01`/`IHOR-C05`, specific to the Scientific & Analytical Reasoning and Intellectual Humility & Openness to Revision domains — the full pair list is the union of every pair Part 2 explicitly names as "consistency pair with X".

For each pair `(X, Y)`:

```
Divergence(X,Y) = | contribution_score(X) − contribution_score(Y) |
```

Since both items in a pair are designed to move together (after reversal is already applied inside `contribution_score`), a well-answered pair should have `Divergence` near 0. Threshold:

```
IF Divergence(X,Y) ≥ 3  → flag pair as INCONSISTENT
```

(A divergence of 3 or 4 on a 1–5 scale means, e.g., one item was answered "Strongly Agree" [5] and its conceptual partner's reversed contribution was "Strongly Disagree" [1 or 2] — a substantively contradictory pattern, not noise.)

```
ConsistencyFlagCount = count of pairs flagged INCONSISTENT (out of 10 total pairs: 8 domain aux pairs + 2 core conceptual pairs)
```

`ConsistencyFlagCount ≥ 3` triggers a dedicated report-engine note (Part 4) that domain scores should be interpreted with added caution, and feeds into the confidence calculation (§5.10) at a smaller weight than the SD index, since occasional inconsistency is expected in good-faith responding and is a softer signal than the SD-detector items.

**Exception carried over from Part 2:** `ERP-C06` is explicitly excluded from any straight-line or extreme-response flagging (its own note in Part 2), but it is **not** part of a consistency pair, so no exception is needed here — noted only to avoid confusion between the two different validity mechanisms.

### 5.7 Straight-Line Detection

A "straight-line" run is defined as **10 or more consecutive items** (in the fixed presentation order — see Part 2's domain ordering, SAR→ELCA→IHOR→AMB→ECPC→ERP→CSR→RST, each internally ordered core-then-auxiliary-then-scenario) all answered with the **same raw LIKERT5 value** (1 through 5), regardless of reverse-keying (straight-lining is about response *pattern*, so it's checked on `raw_value`, not `contribution_score`).

```
FOR each window of 10 consecutive LIKERT5 items in presentation order:
  IF all raw_value are identical:
    flag STRAIGHT_LINE at that position
```

Scenario items (single-select among semantically distinct options, not a linear scale) are excluded from straight-line detection — "always picking option A" across scenario items is a different signal (see §5.8) and is handled separately.

Any `STRAIGHT_LINE` flag triggers confidence modifier CM-03 (§4.4). Note this is a **detection**, not an automatic disqualification — the report engine still generates a report but with the reduced confidence rating attached, per the philosophy in Part 1 §1.2(b) of transparency over silent gatekeeping.

### 5.8 Contradictory Response Detection

Distinct from §5.6's paired-item consistency check, this looks for **domain-level implausible combinations** across a whole domain rather than a single pair — for example, endorsing all 8 SAR core items at the maximally analytical end (contribution_score = 5 on every one) while simultaneously selecting the least-analytical option on both SAR scenario items (score = 1 or 2). Formally:

```
FOR each domain D:
  CoreMean(D) = mean(contribution_score) over the 8 core items of D
  ScenarioMean(D) = mean(contribution_score) over the 2 scenario items of D
  IF |CoreMean(D) - ScenarioMean(D)| ≥ 2.5:
    flag DOMAIN_CONTRADICTION(D)
```

This threshold (2.5 on a 1–5 scale) is deliberately conservative — scenario items are *expected* to score somewhat differently from direct self-statement items even in genuine, consistent responders, since they measure applied behavior rather than stated preference (Part 2's own design rationale). A gap this large is treated as a data-quality signal, not a personality finding.

`DOMAIN_CONTRADICTION` flags do not have their own dedicated confidence modifier in §4.4 to avoid double-penalizing respondents already captured by §5.6/§5.7; instead, each `DOMAIN_CONTRADICTION(D)` flag adds a domain-specific caveat sentence to that domain's report block (Part 4), rather than moving the global confidence number.

### 5.9 Social Desirability Detection

The three (well, effectively one-per-domain × 8 domains, but see below) SD-detector items — the `*-A03` items in every domain — are the primary mechanism:

```
SD_raw_count = count of *-A03 items where raw_value ≥ 4  (i.e., "Agree" or "Strongly Agree" only — a neutral "Neither Agree nor Disagree" response is not treated as over-claiming, since it reflects uncertainty rather than endorsement of the absolute claim)
```

There are 8 such items (one per domain). `ERP-A03` carries **elevated weight** per its Part 2 dev note (agreeing that one has never told even a small white lie is a stronger over-claiming signal than, say, agreeing one has never made a reasoning error, given how norm-violating true universal honesty would be):

```
SD_index = SD_raw_count_excluding_ERP × 1.0  +  (ERP-A03 flagged ? 1.5 : 0)
```

So `SD_index` ranges from 0 to 8.5. Thresholds:

- `SD_index ≥ 3`: triggers CM-01 (§4.4), global confidence −20, and a report-level caveat (Part 4) noting the respondent may have presented a more idealized self-picture than usual.
- `SD_index ≥ 5.5`: additionally suppresses the profile-assignment step (Part 5) — the report still shows domain scores (with the caveat), but does not attempt to assign one of the 20–40 named profiles, since profile assignment on top of heavily distorted data risks a confidently-wrong-sounding label.

### 5.10 Confidence Calculation

A single 0–100 **Confidence Rating** is computed per respondent (plus the one domain-specific override, CM-04, for ERP):

```
BaseConfidence = 100
BaseConfidence -= 20   if SD_index ≥ 3          (CM-01)
BaseConfidence -= 10   if missing_data_rate > 10% (CM-02)
BaseConfidence -= 25   if any STRAIGHT_LINE flag  (CM-03)
BaseConfidence -= 5 × min(ConsistencyFlagCount, 4)   // capped contribution, so at most -20 from consistency alone
GlobalConfidence = CLAMP(BaseConfidence, 0, 100)

ERPConfidence = GlobalConfidence
ERPConfidence -= 15   if (RST ≤ 40 AND ERP ≥ 80)   (CM-04)
ERPConfidence = CLAMP(ERPConfidence, 0, 100)
```

`GlobalConfidence` is displayed once at the top of the report; `ERPConfidence` is displayed specifically alongside the Ethical Reasoning & Professionalism domain block, whenever it differs from `GlobalConfidence`. This is the only domain that gets its own confidence number, consistent with Part 1 §2.6 flagging ERP as carrying the widest desirability-driven error margin of all 8 domains.

**Confidence-rating interpretation bands (for report display, Part 4):**

| Range | Label |
|---|---|
| 85–100 | High confidence |
| 65–84 | Moderate confidence |
| 40–64 | Reduced confidence — interpret cautiously |
| 0–39 | Low confidence — results likely unreliable |

### 5.11 Interaction Modifiers — Application Order

Interaction rules (§4.3) are evaluated **after** §5.1–5.10 are complete, using only the final `DomainScore(D)` values (never raw or intermediate values), so that interaction detection is insulated from the specific mechanics of how each domain score was assembled. Evaluation order: `AR-03, AR-03b, IH-01, CR-02, EC-01, CM-04, PC-01, OA-01`, in that fixed order, purely so that flag lists are emitted in a deterministic, stable order for the report engine (Part 4) and for testing/snapshotting — the order has no effect on which flags fire, since each rule's condition is independent of the others.

### 5.12 Safety Gate (Edge Case, Evaluated First)

Per §4.5, this check runs **before** any other scoring step (see §5.0 pipeline step 2), on raw answers directly:

```
IF raw_value(RST-S02) == 3   // option C, "barely keeping my head above water"
   AND count of { RST-C03, RST-C05, RST-C08 } where contribution_score ≤ 2 is ≥ 2:
      HALT normal pipeline
      SET result.safety_gate_triggered = true
      RETURN a resources/support response instead of a scored report (content and resource-list requirements specified in Part 4, consistent with the crisis-resource handling described in this product's broader safety requirements)
```

This is the **only** halting condition in the entire pipeline. Every other check (missing data, consistency, SD, straight-lining, contradictions) degrades confidence or annotates the report — it never blocks a report from being generated, in keeping with Part 1 §1.2(b)'s transparency-over-gatekeeping philosophy. The safety gate is the sole, deliberate exception, because the product-safety requirement in Part 1 §1.5(3) outweighs that general philosophy in this one specific case.

### 5.13 Full Pipeline Pseudocode

```pseudocode
function scoreAssessment(rawAnswers: Map<QuestionID, RawValue>) -> ScoringResult:

    // Step 1-2: Safety gate (runs on raw answers, before anything else)
    if rawAnswers[RST-S02] == 3:
        distressCount = 0
        for qid in [RST-C03, RST-C05, RST-C08]:
            contrib = applyReverse(qid, rawAnswers[qid])
            if contrib <= 2: distressCount += 1
        if distressCount >= 2:
            return ScoringResult(safety_gate_triggered = true)

    // Step 3: contribution scores
    contributions = {}
    for qid, raw in rawAnswers:
        contributions[qid] = computeContribution(qid, raw)  // §4.1

    // Step 4-6: per-domain raw -> weighted -> normalized
    domainScores = {}
    domainFlags = {}
    for D in [SAR, ELCA, IHOR, AMB, ECPC, ERP, CSR, RST]:
        items = domainScoredItems(D)  // excludes *-A03
        answered = [i for i in items if i in contributions]
        missingCount = len(items) - len(answered)

        rawSum = sum(contributions[i] * weight(i) for i in answered)
        effWeight = sum(weight(i) for i in answered)

        if effWeight == 0:
            domainScores[D] = null
            domainFlags[D] = ["insufficient_data"]
            continue

        weightedMean = rawSum / effWeight
        score = round((weightedMean - 1) / 4 * 100, 1)
        domainScores[D] = score

        if missingCount >= 3:
            domainFlags[D] = domainFlags.get(D, []) + ["insufficient_data"]

    // Step 7a: consistency
    consistencyFlags = []
    for (X, Y) in CONSISTENCY_PAIRS:  // 10 pairs, §5.6
        if X in contributions and Y in contributions:
            if abs(contributions[X] - contributions[Y]) >= 3:
                consistencyFlags.append((X, Y))

    // Step 7b: straight-lining
    straightLineFlags = []
    likertSequence = orderedLikertItemsInPresentationOrder()
    for window in slidingWindows(likertSequence, size=10):
        if allEqual([rawAnswers[q] for q in window]):
            straightLineFlags.append(window)

    // Step 7c: contradiction detection
    contradictionFlags = []
    for D in domains:
        coreMean = mean(contributions[i] for i in coreItems(D) if i in contributions)
        scenarioMean = mean(contributions[i] for i in scenarioItems(D) if i in contributions)
        if abs(coreMean - scenarioMean) >= 2.5:
            contradictionFlags.append(D)

    // Step 7d: social desirability
    sdRawCount = 0
    erpSdFlagged = false
    for D in domains:
        qid = D + "-A03"
        if qid in rawAnswers and rawAnswers[qid] >= 4:
            if D == "ERP": erpSdFlagged = true
            else: sdRawCount += 1
    sdIndex = sdRawCount * 1.0 + (1.5 if erpSdFlagged else 0)

    // Step 8: confidence
    missingRate = countMissing(rawAnswers) / 104
    globalConfidence = 100
    if sdIndex >= 3: globalConfidence -= 20
    if missingRate > 0.10: globalConfidence -= 10
    if len(straightLineFlags) > 0: globalConfidence -= 25
    globalConfidence -= 5 * min(len(consistencyFlags), 4)
    globalConfidence = clamp(globalConfidence, 0, 100)

    erpConfidence = globalConfidence
    if domainScores[RST] is not null and domainScores[ERP] is not null:
        if domainScores[RST] <= 40 and domainScores[ERP] >= 80:
            erpConfidence = clamp(erpConfidence - 15, 0, 100)

    // Step 9: interaction rules (fixed order, §5.11)
    interactionFlags = []
    if domainScores[SAR] >= 70 and domainScores[AMB] <= 40: interactionFlags.append("AR-03")
    if domainScores[AMB] <= 40 and domainScores[CSR] >= 70: interactionFlags.append("AR-03b")
    if domainScores[SAR] >= 70 and domainScores[IHOR] <= 40: interactionFlags.append("IH-01")
    if domainScores[CSR] >= 80 and domainScores[RST] <= 40: interactionFlags.append("CR-02")
    if domainScores[SAR] >= 70 and domainScores[ECPC] <= 40: interactionFlags.append("EC-01")
    // CM-04 already applied above as a confidence effect, not a report flag
    if domainScores[CSR] >= 90: interactionFlags.append("PC-01")
    if domainScores[SAR] >= 90: interactionFlags.append("OA-01")

    // Step 10-11: assemble
    return ScoringResult(
        safety_gate_triggered = false,
        domain_scores = domainScores,
        domain_flags = domainFlags,
        consistency_flags = consistencyFlags,
        straight_line_flags = straightLineFlags,
        contradiction_flags = contradictionFlags,
        sd_index = sdIndex,
        global_confidence = globalConfidence,
        erp_confidence = erpConfidence,
        interaction_flags = interactionFlags,
        incomplete = (missingRate > 0.25),
        suppress_profile_assignment = (sdIndex >= 5.5)
    )
```

### 5.14 JSON Examples

**Input (`answers.json`, partial example):**
```json
{
  "respondent_id": "r_8f2a1c",
  "started_at": "2026-07-13T14:02:00Z",
  "completed_at": "2026-07-13T14:26:41Z",
  "answers": {
    "SAR-C01": 4, "SAR-C02": 5, "SAR-C03": 4, "SAR-C04": 3,
    "SAR-C05": 2, "SAR-C06": 3, "SAR-C07": 2, "SAR-C08": 4,
    "SAR-A01": 4, "SAR-A02": 2, "SAR-A03": 1,
    "SAR-S01": 4, "SAR-S02": 5,
    "RST-C01": 2, "RST-C02": 2, "RST-C03": 4, "RST-C04": 3,
    "RST-C05": 2, "RST-C06": 4, "RST-C07": 2, "RST-C08": 4,
    "RST-A01": 2, "RST-A02": 4, "RST-A03": 1,
    "RST-S01": 2, "RST-S02": 3
  }
}
```
*(remaining 6 domains' 78 items omitted from this example for brevity; a real payload contains all 104 keys or a subset if the respondent stopped early)*

**Output (`scoring_result.json`, corresponding to the SAR/RST slice above):**
```json
{
  "respondent_id": "r_8f2a1c",
  "safety_gate_triggered": false,
  "domain_scores": {
    "SAR": 72.5,
    "RST": 38.0
  },
  "domain_flags": {},
  "consistency_flags": [],
  "straight_line_flags": [],
  "contradiction_flags": [],
  "sd_index": 0,
  "global_confidence": 100,
  "erp_confidence": 100,
  "interaction_flags": ["CR-02"],
  "incomplete": false,
  "suppress_profile_assignment": false,
  "notes": "Example computed on a partial (2-domain) payload for illustration; CR-02 would not actually fire in production without a real CSR score present — shown here only to demonstrate the flag format. Full payloads require all 8 domains before interaction rules are meaningful."
}
```

**`weights.json` (full, all 104 items — structure shown, abbreviated to one domain for length; the real file has all 8):**
```json
{
  "SAR": {
    "SAR-C01": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-C02": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-C03": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-C04": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-C05": {"weight": 1.0, "reverse": true,  "scored_toward_domain": true},
    "SAR-C06": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-C07": {"weight": 1.0, "reverse": true,  "scored_toward_domain": true},
    "SAR-C08": {"weight": 1.0, "reverse": false, "scored_toward_domain": true},
    "SAR-A01": {"weight": 0.5, "reverse": false, "scored_toward_domain": true},
    "SAR-A02": {"weight": 0.5, "reverse": true,  "scored_toward_domain": true},
    "SAR-A03": {"weight": 0.5, "reverse": true,  "scored_toward_domain": false, "scored_toward_sd_index": true},
    "SAR-S01": {"weight": 1.5, "reverse": false, "scored_toward_domain": true, "option_scores": {"A":1,"B":4,"C":2,"D":5}},
    "SAR-S02": {"weight": 1.5, "reverse": false, "scored_toward_domain": true, "option_scores": {"A":2,"B":5,"C":3,"D":1}}
  }
}
```

### 5.15 Edge Cases (Consolidated Reference)

| Case | Handling |
|---|---|
| All items answered, no flags | Normal path; full report, all confidence bands high |
| 1–2 items missing in a domain | Excluded from that domain's mean; no flag (§5.5 Tier 1) |
| 3+ items missing in one domain | Domain marked `insufficient_data`; report shows "not enough data" for that domain only (§5.5 Tier 2) |
| >10% items missing overall | Global confidence −10 (CM-02); report still generated |
| >25% items missing overall | `incomplete = true`; no report generated, resume-prompt shown instead (§5.5 Tier 3) |
| Straight-lining detected | Confidence −25; report still generated with a visible data-quality caveat |
| SD index ≥ 3 | Confidence −20; caveat shown |
| SD index ≥ 5.5 | Additionally, profile assignment (Part 5) is suppressed |
| RST-S02 = C + 2+ low RST core items | Safety gate: no scoring, no report — resources screen only (§5.12) |
| Respondent answers every item identically across an entire domain via scenario items too | Not caught by straight-lining (LIKERT-only) or single-pair consistency checks alone, but *is* caught by §5.8's contradiction detection if it diverges from the core-item pattern, and independently by the SD index if it includes agreeing with the domain's `*-A03` item |
| Tie at an interpretation-band boundary (e.g., score = 75.0 exactly) | Resolved by §5.3's explicit rule: `low ≤ score < high` except top band; 75.0 falls in the 75–100 band, not 50–74 |
| Two interaction rules fire on overlapping domains (e.g., AR-03 and IH-01 both involve SAR) | Both flags included in output; Part 4's report assembly handles narrative de-duplication, not this layer |

---

## What's next

Part 4 will cover the Report Generation Engine (Section 6): the modular, rule-based report fragments for every domain/score-range combination referenced throughout this document (RPT-AR03, RPT-IH01, RPT-CR02, RPT-EC01, RPT-PC01, RPT-OA01, and the full per-domain interpretation/strength/growth/study-advice/wellbeing text bank), plus the safety-gate resources screen content and the tone rules (e.g., "never frame low ECPC/RST as deficiency") that the fragments must follow.

---

## Technical Specification — Part 4 of 8: Report Generation Engine

Builds on Parts 1–3. This part specifies the rule-based, no-AI report generator: a deterministic assembly of pre-written fragments, selected purely by `ScoringResult` values (Part 3 §5.14), with zero free-text generation at runtime.

---

## 6. Report Generation Engine

### 6.0 Design Principles (binding on every fragment below)

1. **No generative text.** Every sentence a respondent sees comes from a fragment written in this document (or a later revision of it) and stored verbatim in `reports.json`. The engine's only job is selection and concatenation — string interpolation is limited to inserting the respondent's numeric score and domain name into an otherwise-fixed template.
2. **Descriptive, not diagnostic.** No fragment may state or imply a mental-health diagnosis, a clinical judgment about the respondent, or a prediction about their medical-school outcome. Language stays in "you reported..." / "this may suggest..." register, never "you have..." / "you will...".
3. **No admissions framing.** No fragment may suggest the report is suitable to share with, or was designed for, an admissions committee, employer, or licensing body. The report's own footer must restate the non-admissions purpose from Part 1 §1.5(1).
4. **Strengths-first, growth-framed.** Per Part 1's domain-specific tone requirements (e.g., §2.1, §2.5, §2.8), every band — including the lowest — leads with something constructive before naming a growth area. "Emerging" is never rendered as "weak," "poor," or "low."
5. **Symmetric shadow-side honesty.** The highest band of a domain is not automatically the "best" framing-wise; where Part 1/3 flagged a shadow side (over-analysis at SAR≥90, perfectionism at CSR≥90, etc.), the top-band fragment says so.
6. **Every fragment traceable.** Each fragment has a unique ID (`RPT-<DOMAINCODE>-<BAND>`, plus the interaction-rule IDs from Part 3 §4.3) so the assembled report can be unit-tested fragment-by-fragment.

### 6.1 Domain Score-Range Report Fragments

For all 8 domains, bands follow the fixed structure established in Part 1 §2: **Emerging (0–24), Developing (25–49), Established (50–74), Strong (75–100)**, with the boundary rule from Part 3 §5.3 (`low ≤ score < high`, top band inclusive of 100).

Each fragment below includes the eight required fields: **Interpretation, Strength Description, Growth Opportunity, Study Advice, Wellbeing Advice, Medical-Practice Relevance Note** (this document's implementation of the brief's "clinical advice" field — reframed as *relevance to clinical/medical practice*, never as personal clinical or therapeutic advice, consistent with §1.3's non-diagnostic requirement), **Warning Message** (present only where a genuine shadow-side or caution applies — otherwise "None"), and **Recommended Resources** (generic categories, never branded products, consistent with avoiding any commercial endorsement).

---

#### 6.1.1 SAR — Scientific & Analytical Reasoning

| Field | Emerging (0–24) `RPT-SAR-E` | Developing (25–49) `RPT-SAR-D` | Established (50–74) `RPT-SAR-S` | Strong (75–100) `RPT-SAR-T` |
|---|---|---|---|---|
| Interpretation | You reported leaning more on quick, intuitive judgments than on step-by-step analysis in most situations. | You reported a mixed pattern — sometimes reasoning things through carefully, sometimes going with your gut. | You reported consistently reaching for structured, evidence-weighing reasoning when things get complex. | You reported a strong, consistent preference for deliberate, evidence-based reasoning across nearly every scenario. |
| Strength Description | Quick judgment is a real asset in fast-moving situations and shouldn't be discounted — the goal is adding tools, not replacing this one. | You already shift into a more analytical gear at least some of the time, which is a solid foundation to build on. | This is a well-established habit of mind that will serve you well in coursework built around evidence appraisal. | This is one of the clearest strengths in your profile — deliberate reasoning under complexity is exactly what EBM training rewards. |
| Growth Opportunity | Practicing a deliberate "pause and check" habit before finalizing judgments on unfamiliar or high-stakes questions. | Noticing which situations pull you toward gut response and deliberately slowing down in those specific ones. | Extending the same rigor to areas outside familiar academic contexts — personal decisions, ambiguous real-world situations. | Watching for the shadow side of this strength: knowing when "good enough" analysis is appropriate rather than open-ended deliberation (see Warning Message). |
| Study Advice | Practice working through case-based or problem-set questions out loud, explicitly naming each reasoning step. | Use structured frameworks (e.g., explicit pro/con lists, decision trees) for a few weeks to build the habit before it becomes automatic. | Seek out coursework or clubs involving structured problem-solving (journal clubs, case competitions) to keep building. | Pair this strength with domains like Empathic Communication so technical rigor doesn't crowd out other study priorities. |
| Wellbeing Advice | There's no wellbeing cost to intuitive thinking itself — this note is purely about adding a tool, not correcting a flaw. | Building new habits takes repetition; expect inconsistency at first without treating it as failure. | Established habits like this one are usually stable — no specific wellbeing note needed here. | Watch for decision fatigue or procrastination-via-overanalysis on low-stakes choices; not every decision needs full deliberation. |
| Medical-Practice Relevance | Analytical reasoning underlies diagnostic reasoning and evidence interpretation — an area worth deliberately developing before/during training. | Coursework in research methods or biostatistics tends to accelerate this kind of reasoning quickly once engaged with directly. | This pattern aligns well with how clinical reasoning is taught and assessed in most medical curricula. | This pattern aligns strongly with structured clinical reasoning; the main watch-item is balancing speed with thoroughness under real time pressure. |
| Warning Message | None. | None. | None. | Possible over-analysis tendency — very high scores here can occasionally correlate with decision paralysis on low-stakes matters; not a concern unless it's already causing real friction for you. |
| Recommended Resources | Intro-level critical thinking or logic coursework; case-based study groups. | Decision-frameworks primers; structured problem-set practice. | Journal clubs; research-methods electives. | Time-boxed decision-making practice (setting a deliberate cutoff for lower-stakes analysis). |

---

#### 6.1.2 ELCA — Evidence Literacy & Critical Appraisal

| Field | Emerging `RPT-ELCA-E` | Developing `RPT-ELCA-D` | Established `RPT-ELCA-S` | Strong `RPT-ELCA-T` |
|---|---|---|---|---|
| Interpretation | You reported that research-evidence concepts (study design, statistics, source appraisal) feel unfamiliar or intimidating right now. | You reported some familiarity with evidence-appraisal concepts, but confidence varies by topic. | You reported general comfort with core evidence-appraisal ideas. | You reported high confidence across study-design and statistical-literacy concepts. |
| Strength Description | Recognizing unfamiliarity honestly is itself a useful starting point — this is one of the most learnable domains in the whole assessment. | You have a real foundation already; the gaps are specific and addressable rather than general. | This comfort will make research-heavy coursework meaningfully easier to engage with. | This is a strong, EBM-specific asset that directly supports reading and applying primary literature. |
| Growth Opportunity | Building basic vocabulary (study types, what "control group" means) before tackling appraisal itself. | Identifying which specific sub-skills (statistics vs. study design vs. source-judgment) feel weakest and targeting those. | Practicing appraisal on real, current literature rather than textbook examples. | Practicing explaining these concepts to others — teaching is a strong test of true fluency. |
| Study Advice | Start with a short, structured intro to research methods before attempting to appraise real studies. | Alternate between concept review and applied practice (reading real abstracts) rather than only one or the other. | Set a habit of reading one primary-source abstract a week and appraising it. | Seek out a journal club or research-methods elective that pushes past introductory material. |
| Wellbeing Advice | This is a knowledge gap, not a personal shortfall — expect this to close relatively quickly with direct study. | Confidence unevenness across sub-topics is completely normal at this stage. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | This is foundational to EBM practice and is explicitly taught in most medical curricula — an excellent area to front-load before matriculating. | Building this now will reduce the learning curve during evidence-based-medicine coursework. | This supports reading clinical trials, evaluating new guidelines, and resisting anecdote-driven practice. | This is close to the core definition of EBM competence itself and is a genuine head start. |
| Warning Message | None. | None. | None. | None — confidence here should still be paired with ELCA-A02-style humility about source-credibility judgment, which stays useful at any skill level. |
| Recommended Resources | Introductory research-methods or "how to read a study" primers. | Guided appraisal worksheets; structured abstract-reading practice. | Journal club participation; primary-literature reading habit. | Advanced research-methods or biostatistics coursework; mentoring others in appraisal. |

---

#### 6.1.3 IHOR — Intellectual Humility & Openness to Revision

| Field | Emerging `RPT-IHOR-E` | Developing `RPT-IHOR-D` | Established `RPT-IHOR-S` | Strong `RPT-IHOR-T` |
|---|---|---|---|---|
| Interpretation | You reported that being shown wrong, or revising a firmly-held view, tends to feel uncomfortable or doesn't happen often. | You reported a mixed pattern — open to revision in some situations, more resistant in others. | You reported general comfort with being corrected and updating your views. | You reported strong, consistent comfort with correction and revision, even under social pressure. |
| Strength Description | Strong convictions and follow-through often travel together with this pattern — the goal is adding flexibility, not losing conviction. | You already show real openness some of the time, which is a workable foundation. | This is a genuinely protective habit against a well-documented category of clinical reasoning errors (premature closure). | This is one of the more distinctive strengths a future clinician can have — genuinely rare and valuable. |
| Growth Opportunity | Practicing low-stakes "changing my mind" moments deliberately, to build comfort before it matters more. | Noticing which situations trigger more defensiveness (status-related ones are common) and working with those specifically. | Practicing this under higher-stakes or more public conditions, not just private, low-pressure ones. | Watching that openness doesn't tip into under-confidence or excessive hedging in situations that call for a clear stance. |
| Study Advice | Study in groups where being wrong is normalized and low-stakes, to build tolerance gradually. | Seek out feedback actively rather than only reactively — ask "what am I missing?" before someone tells you. | Take on a role (tutoring, peer review) where correcting others regularly puts you on both sides of the exchange. | Mentor others in normalizing being wrong — this models the behavior for peers who find it harder. |
| Wellbeing Advice | Discomfort with being wrong is extremely common and not a character flaw — this is a skill, not a fixed trait. | This kind of unevenness is expected and improves naturally with low-stakes practice. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | This is directly protective against diagnostic anchoring and premature closure — genuinely worth deliberate practice before clinical training. | Building this now will ease the hierarchical feedback dynamics common in clinical training (attending/trainee correction). | This supports accepting supervisor feedback constructively and updating practice as guidelines evolve. | This is protective against diagnostic overconfidence, a well-recognized risk pattern discussed in medical-error literature. |
| Warning Message | None. | None. | None. | If paired with very high analytical confidence (see interaction rule IH-01 in §6.2), watch for the opposite pattern — confident reasoning that resists correction — which this report will flag separately if it applies to you. |
| Recommended Resources | Low-stakes group study or debate settings; peer feedback practice. | Structured feedback-seeking habits (asking specific "what am I missing" questions). | Peer tutoring or review roles. | Mentoring roles; reflective practice journaling. |

---

#### 6.1.4 AMB — Ambiguity Tolerance & Uncertainty Management

| Field | Emerging `RPT-AMB-E` | Developing `RPT-AMB-D` | Established `RPT-AMB-S` | Strong `RPT-AMB-T` |
|---|---|---|---|---|
| Interpretation | You reported that unclear or incomplete-information situations tend to feel uncomfortable or hard to act within. | You reported a mixed pattern — comfortable with some ambiguity, less so under time pressure or high stakes. | You reported general comfort acting on incomplete information when needed. | You reported strong, consistent comfort operating under uncertainty, even in high-stakes situations. |
| Strength Description | Wanting more certainty before acting often reflects real thoroughness — the goal is adding flexibility for situations where waiting isn't possible. | You already handle some ambiguous situations well, which is a workable starting point. | This is a genuinely useful trait for clinical environments, which are irreducibly uncertain. | This is a strong asset for clinical environments and for communicating honestly with patients about uncertain outcomes. |
| Growth Opportunity | Practicing making small, low-stakes decisions with intentionally incomplete information to build tolerance gradually. | Identifying which specific triggers (time pressure vs. high stakes vs. social visibility) increase your discomfort most. | Practicing communicating uncertainty to others clearly, not just tolerating it internally. | Making sure comfort with ambiguity doesn't tip into insufficient information-gathering when more certainty actually is available and worth pursuing. |
| Study Advice | Practice case-based exercises specifically designed with incomplete information, building comfort through repetition. | Use timed decision exercises to practice acting under a deadline without full information. | Take opportunities (presentations, discussions) to practice communicating a probabilistic answer clearly. | Practice the discipline of still checking available information even when comfortable proceeding without it. |
| Wellbeing Advice | Discomfort with uncertainty is extremely common and often connects to a reasonable desire to avoid mistakes — not a flaw. | This unevenness is expected and typically improves with graded, low-stakes practice. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | Clinical practice is inherently uncertain — this is a genuinely learnable area worth deliberate attention before intensive clinical exposure. | Recognizing your specific triggers now will help target coursework or shadowing experiences that build tolerance safely. | Supports managing undifferentiated presentations and probabilistic guideline-based practice. | Directly supports communicating uncertain prognoses honestly and managing differential diagnoses without premature certainty-seeking. |
| Warning Message | None. | None. | None — if paired with high Conscientiousness, this report separately flags a specific "checks and re-checks" pattern (see §6.2, AR-03b). | If paired with very high analytical scores, this report separately flags a "needs certainty before acting" pattern (see §6.2, AR-03) — worth reading if it applies to you. |
| Recommended Resources | Graded exposure exercises (low-stakes decisions with limited information). | Timed case-based practice; identifying personal ambiguity triggers. | Presentation or discussion practice involving probabilistic communication. | Reflective practice on when "enough is enough" information-gathering applies. |

---

#### 6.1.5 ECPC — Empathic Communication & Patient-Centeredness

| Field | Emerging `RPT-ECPC-E` | Developing `RPT-ECPC-D` | Established `RPT-ECPC-S` | Strong `RPT-ECPC-T` |
|---|---|---|---|---|
| Interpretation | You reported that perspective-taking and attentive listening aren't yet a strong default pattern for you. | You reported a mixed pattern — attentive in some interactions, more fact-focused or distracted in others. | You reported generally strong perspective-taking and listening habits. | You reported consistently strong, patient-centered communication tendencies across situations. |
| Strength Description | A more fact-focused communication style is a real asset in technical contexts — the goal is adding range, not replacing this style. | You already show real strength in some interactions, which is a workable foundation to build from. | This is a well-established interpersonal strength directly relevant to clinical communication. | This is one of the clearest strengths in your profile — genuinely valuable for patient trust and shared decision-making. |
| Growth Opportunity | Practicing active-listening habits deliberately (reflecting back what you heard before responding). | Noticing which situations pull you toward a more fact-focused mode and practicing perspective-taking there specifically. | Practicing this under harder conditions — delivering difficult news, not just everyday conversation. | Making sure strong communication doesn't come at the expense of directness when clarity is what's actually needed. |
| Study Advice | Practice paraphrasing back what a speaker said before responding, in everyday conversations, as a deliberate drill. | Seek feedback specifically on listening (not just content) from people who know you well. | Practice communication in higher-stakes simulated contexts (mock patient interviews, role-play). | Take on roles (tutoring, mentoring, patient-facing volunteer work) that stretch this strength further. |
| Wellbeing Advice | A more fact-focused style is not a deficit — this is a skill-building note, not a correction of a flaw. | This unevenness is common and improves with deliberate, low-stakes practice. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | Communication quality is a distinct, trainable competency in medical curricula — a genuinely learnable area worth early attention. | Building this now will ease history-taking and shared decision-making conversations during clinical training. | Supports history-taking, shared decision-making, and delivering difficult news effectively. | Directly supports breaking bad news, informed consent conversations, and building patient trust. |
| Warning Message | None. | None. | None. | None — if paired with very high analytical scores, this report separately flags a "technical orientation" growth note (see §6.2, EC-01) worth reading if it applies to you. |
| Recommended Resources | Active-listening drills; paraphrasing practice. | Feedback-seeking from trusted peers on listening specifically. | Mock patient interview or role-play practice. | Patient-facing volunteer or mentoring roles. |

---

#### 6.1.6 ERP — Ethical Reasoning & Professionalism

*(Recall from Part 1 §2.6 and Part 3 §5.10: this domain carries the widest desirability-driven error margin of all eight, and its confidence rating may be shown separately from the global confidence rating. Every fragment below includes this caveat implicitly via the report template, not repeated in each cell.)*

| Field | Emerging `RPT-ERP-E` | Developing `RPT-ERP-D` | Established `RPT-ERP-S` | Strong `RPT-ERP-T` |
|---|---|---|---|---|
| Interpretation | You reported some tolerance for minor shortcuts or hesitancy around disclosure in the scenarios presented. | You reported a mixed pattern across the ethical-reasoning scenarios in this section. | You reported generally strong, consistent ethical-reasoning tendencies across scenarios. | You reported very strong, consistent ethical-reasoning tendencies across nearly every scenario. |
| Strength Description | Many of these scenarios involve genuine gray areas (see ERP-S02's design note in Part 2) — this isn't a clear-cut finding. | You show real strength in some scenarios, which is a reasonable foundation. | This is a well-established strength directly relevant to professional conduct expectations. | This is a strong, consistent asset — professional codes of conduct are core, examined parts of medical training, and this suggests a head start. |
| Growth Opportunity | Reflecting on specific scenarios where the "harder" answer wasn't chosen, and why, in a low-stakes setting (e.g., with a mentor). | Identifying which specific scenario types (disclosure vs. confidentiality vs. loyalty conflicts) felt harder. | Practicing these judgments in slightly higher-stakes, real contexts to build confidence they'll hold under pressure. | Reflecting honestly on whether real behavior matches stated intentions — ethics vignette research generally finds a gap between hypothetical endorsement and real follow-through, which is worth naming here. |
| Study Advice | Case-based ethics discussion (with peers or a mentor) tends to be more useful here than solo reflection. | Continue engaging with case-based ethics scenarios, particularly ones involving the specific tension points identified above. | Seek out professionalism coursework or discussions that involve real (not hypothetical) case review. | Consider a mentoring or teaching role in ethics case discussion — explaining your reasoning to others is a strong test of its consistency. |
| Wellbeing Advice | This domain measures scenario responses, not character — no wellbeing note needed beyond that reframe. | No specific wellbeing note needed here. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | Ethics and professionalism are explicitly taught, developmental (not fixed) competencies in medical curricula — this is a normal starting point, not a red flag. | This supports informed consent integrity and conflict-of-interest recognition, both explicitly taught and assessed in training. | Supports error disclosure and professional boundary maintenance, both examined components of clinical training. | This aligns well with core professional-identity-formation goals in medical education. |
| Warning Message | Interpret this domain's score with extra caution — see the confidence note attached to this section. | Interpret this domain's score with extra caution — see the confidence note attached to this section. | Interpret this domain's score with some caution — see the confidence note attached to this section. | Interpret this domain's score with some caution, especially if this report also flags reduced resilience elsewhere (see confidence modifier CM-04 in Part 3) — very high self-reported ethics scores paired with low resilience scores can sometimes reflect idealized self-presentation rather than a true difference. |
| Recommended Resources | Case-based ethics discussion groups; mentor conversations. | Professionalism coursework; case-based discussion. | Real (not hypothetical) case review, where appropriate and available. | Mentoring or teaching roles in ethics case discussion. |

---

#### 6.1.7 CSR — Conscientiousness & Self-Regulation

| Field | Emerging `RPT-CSR-E` | Developing `RPT-CSR-D` | Established `RPT-CSR-S` | Strong `RPT-CSR-T` (75–89) | Very Strong `RPT-CSR-VT` (90–100) |
|---|---|---|---|---|---|
| Interpretation | You reported that organization and follow-through aren't yet a strong default pattern for you. | You reported a mixed pattern — reliable in some contexts, less so under competing demands. | You reported generally strong organization and follow-through. | You reported consistently strong organization and follow-through across nearly every scenario. | You reported extremely strong, near-uniform organization and follow-through. |
| Strength Description | Flexibility and adaptability often travel with this pattern — the goal is adding structure as a tool, not replacing your style entirely. | You already show real reliability in some contexts, a workable foundation. | This is a well-established strength that will support sustained study habits during training. | This is one of the clearer strengths in your profile — directly supports the long timelines medical training involves. | This is a strong, distinctive asset — but see the Warning Message; it's worth knowing about the shadow side of very high scores here. |
| Growth Opportunity | Building one simple external system (a single calendar or list) before attempting a complex one. | Identifying which specific contexts (competing deadlines, low-interest tasks) most challenge follow-through. | Extending existing systems to handle competing-priority situations specifically. | Practicing flexibility — deliberately letting a plan change without treating it as a failure. | Practicing "good enough" as a deliberate stopping point on lower-stakes tasks, to build resistance to perfectionism. |
| Study Advice | Start with one lightweight tracking tool (a single list or calendar) rather than an elaborate system. | Practice triage skills — deciding what matters most when everything feels urgent. | Take on a role (project lead, mentor) that tests these skills under more real pressure. | Mentor others in organization skills — a strong test of whether the systems are truly internalized. | Practice intentionally submitting "good enough" work on a genuinely low-stakes task, as a deliberate exercise. |
| Wellbeing Advice | Inconsistent follow-through is extremely common and workable with simple systems, not a character flaw. | This unevenness is expected and typically improves with a single, simple system. | No specific wellbeing note needed here. | Watch for early signs of over-committing, since reliability can attract more responsibility than is sustainable. | Watch closely for perfectionism-driven stress; very high scores here sometimes come with self-imposed pressure worth naming to a mentor or advisor. |
| Medical-Practice Relevance | Organizational habits are learnable and directly relevant to clinical documentation and follow-up obligations. | Building this now eases the transition to the long, demanding timelines of medical training. | Supports sustaining rigorous study habits and meeting clinical documentation and follow-up obligations. | Directly supports managing long training timelines and complex clinical responsibilities. | Directly relevant, but pair with the Warning Message here — sustainable rigor matters more than maximal rigor over a multi-year training arc. |
| Warning Message | None. | None. | None. | None — if paired with low Resilience, this report separately flags an "overextension risk" pattern (see §6.2, CR-02). | Possible perfectionism tendency — very high scores here can sometimes correlate with self-imposed pressure that isn't sustainable over a multi-year training arc; worth a conversation with a mentor if this resonates. |
| Recommended Resources | A single lightweight planning tool (calendar or list app). | Triage/prioritization frameworks. | Project-lead or mentoring opportunities. | Mentoring roles in organization/planning. | Reflective practice on "good enough" as a deliberate skill; conversations with an advisor about sustainable pacing. |

*(Note: CSR is the one domain given a 5-row band table instead of 4, splitting "Strong" into 75–89 and a distinct 90–100 "Very Strong" band, to carry the perfectionism note from interaction rule PC-01 §4.3 directly in the base fragment set rather than only as an add-on flag — see §6.2 for how PC-01 interacts with this split.)*

---

#### 6.1.8 RST — Resilience & Stress Tolerance

*(Per Part 1 §2.8 and Part 3's safety-gate design, every fragment here has been reviewed against the non-diagnostic requirement — none of this language names or implies a mental health condition.)*

| Field | Emerging `RPT-RST-E` | Developing `RPT-RST-D` | Established `RPT-RST-S` | Strong `RPT-RST-T` |
|---|---|---|---|---|
| Interpretation | You reported that recovering from setbacks and managing sustained stress currently feels harder than you'd like. | You reported a mixed pattern — recovering well from some setbacks, more affected by others. | You reported generally solid recovery from setbacks and functioning under stress. | You reported strong, consistent resilience and coping across nearly every scenario. |
| Strength Description | Naming this honestly is itself a meaningful strength — this domain is one of the most responsive to deliberate coping-skill building. | You already show real recovery capacity in some situations, a workable foundation. | This is a well-established strength that will support sustained engagement through demanding training. | This is a strong, genuinely protective asset for the demanding stretches medical training involves. |
| Growth Opportunity | Building a small, concrete coping-strategy repertoire (even 2–3 go-to strategies) rather than aiming for a full transformation at once. | Identifying which specific setback types affect you most and building targeted strategies for those. | Practicing these strategies proactively (before a hard stretch), not just reactively. | Making sure resilience doesn't tip into minimizing real strain — checking in with others even when coping well. |
| Study Advice | Consider connecting with campus wellness or counseling resources to build coping strategies alongside academic support. | Build a short list of go-to coping strategies and practice them before a genuinely stressful period, not during one. | Maintain existing strategies proactively during lighter periods so they're strong going into harder ones. | Consider mentoring peers on coping strategies, which reinforces your own practice. |
| Wellbeing Advice | This is a genuinely learnable set of skills, not a fixed trait — please see the resources note below, and know that reaching out for support is itself a sign of strength, not weakness (Part 1 §2.8). | Continue building on the strategies that already work for you; this is normal, expected variation. | No specific wellbeing note needed here. | No specific wellbeing note needed here. |
| Medical-Practice Relevance | Medical training is widely documented as high-stress; building coping skills now is one of the most directly useful things you can do before starting. | This supports sustaining engagement through a difficult rotation or a demanding exam period. | Directly supports functioning well through the genuinely demanding stretches of clinical training. | Directly supports sustained engagement and avoiding burnout trajectory over a multi-year training arc. |
| Warning Message | If this reflects ongoing, significant difficulty rather than a general self-assessment, consider talking with a counselor, campus wellness service, or trusted person — this tool is not a substitute for that kind of support. | None. | None. | If paired with very high Conscientiousness, this report separately flags an "overextension risk" pattern (see §6.2, CR-02) worth reading if it applies to you. |
| Recommended Resources | Campus counseling/wellness services; a short list of concrete coping strategies (built with a counselor or mentor, not self-diagnosed). | Proactive coping-strategy building; peer support. | Maintaining existing strategies proactively. | Peer mentoring on coping strategies. |

---

### 6.2 Interaction-Rule Report Blocks

These are **additional** blocks appended to the report when the corresponding Part 3 §4.3 rule fires — they supplement, never replace, the base domain fragments in §6.1.

**`RPT-AR03`** (fires on rule AR-03: SAR≥70, AMB≤40)
> *Pattern noted: wanting certainty before acting.* Your responses suggest a strong preference for thorough analysis paired with more discomfort acting on incomplete information. This is a common and very workable combination — the analytical strength is real, and the growth opportunity is practicing "good enough" decisions on lower-stakes questions specifically, to build comfort before it's needed in a higher-stakes setting.

**`RPT-AR03B`** (fires on rule AR-03b: AMB≤40, CSR≥70)
> *Pattern noted: checking and re-checking before closing.* Your responses suggest a strong planning/organizational instinct paired with more discomfort in unclear situations. Consider practicing a deliberate "close it out" habit on smaller tasks — setting a stopping point in advance can help build tolerance for finishing without full certainty.

**`RPT-IH01`** (fires on rule IH-01: SAR≥70, IHOR≤40)
> *Pattern noted: confident reasoning paired with more resistance to correction.* This isn't a character flaw — confidence and analytical strength are real assets — but this specific combination is worth deliberate attention, since it's a pattern discussed in medical-error literature as relevant to diagnostic overconfidence. A concrete practice: the next time you're corrected, try pausing before responding and asking one clarifying question before defending your original view.

**`RPT-CR02`** (fires on rule CR-02: CSR≥80, RST≤40)
> *Pattern noted: possible overextension risk.* Your responses suggest strong follow-through and reliability paired with more difficulty recovering from setbacks or managing sustained stress. This combination is worth naming honestly, since high reliability can sometimes mean pushing through strain rather than addressing it. Consider building 2–3 concrete coping strategies now, before a demanding stretch, and don't hesitate to loop in a mentor, advisor, or counselor — this is a wellbeing note, not a performance note.

**`RPT-EC01`** (fires on rule EC-01: SAR≥70, ECPC≤40)
> *Pattern noted: technical orientation.* Your responses suggest strong analytical reasoning paired with a more fact-focused communication default. This is a genuine strength combination for technical problem-solving, and the growth opportunity — not deficiency — is practicing perspective-taking specifically in patient-facing or emotionally-loaded contexts, where technical correctness alone isn't always what's needed.

**`RPT-PC01`** (fires on rule PC-01: CSR≥90)
> *Note on very high conscientiousness.* Extremely strong organization and follow-through is a real strength, and it's also worth naming that scores this high sometimes come with self-imposed pressure that isn't sustainable across a multi-year training arc. If this resonates, a conversation with a mentor about sustainable pacing (not lowering your standards) may be worthwhile.

**`RPT-OA01`** (fires on rule OA-01: SAR≥90)
> *Note on very high analytical reasoning.* Extremely strong deliberate reasoning is a genuine asset, and it's also worth naming that scores this high can occasionally correlate with over-analysis on lower-stakes decisions. If time spent deliberating ever feels disproportionate to what's at stake, a deliberate "good enough, move on" rule for low-stakes choices can help.

*(`CM-04` has no report block by design — per Part 3 §4.3, it is a confidence-only modifier, surfaced only as the ERP confidence-caveat text already embedded in §6.1.6's Warning Message row, not as a separate block here.)*

### 6.3 Assembly Logic

```
function assembleReport(result: ScoringResult) -> Report:
    if result.safety_gate_triggered:
        return safetyGateResponse()   // §6.4 — nothing else in this function runs

    sections = []
    sections.append(reportHeader(result))  // includes global_confidence, non-admissions footer text (§6.0 principle 3)

    for D in [SAR, ELCA, IHOR, AMB, ECPC, ERP, CSR, RST]:
        if "insufficient_data" in result.domain_flags.get(D, []):
            sections.append(insufficientDataBlock(D))
            continue
        band = bandFor(D, result.domain_scores[D])   // Emerging/Developing/Established/Strong(/Very Strong for CSR)
        fragment = lookupFragment(D, band)             // from §6.1 tables, stored in reports.json
        if D == "ERP":
            fragment = attachConfidenceCaveat(fragment, result.erp_confidence)
        if D in result.contradiction_flags:
            fragment = appendContradictionCaveat(fragment)  // §5.8, domain-specific caveat sentence
        sections.append(fragment)

    // Interaction blocks, in the fixed order from Part 3 §5.11
    for flagId in result.interaction_flags:
        sections.append(lookupInteractionBlock(flagId))  // §6.2

    if result.sd_index >= 3:
        sections.append(socialDesirabilityCaveat(result.sd_index))  // global caveat, not per-domain
    if len(result.consistency_flags) >= 3:
        sections.append(consistencyCaveat())
    if len(result.straight_line_flags) > 0:
        sections.append(dataQualityCaveat())

    if not result.suppress_profile_assignment:
        sections.append(profileAssignmentBlock(result))  // Part 5 defines this block's content/logic
    else:
        sections.append(profileSuppressedNote())

    sections.append(reportFooter())  // restates non-diagnostic, non-admissions purpose; thumbs-down-style feedback link if in-product

    return Report(sections)
```

De-duplication note: because interaction blocks reference domains that also appear in the base per-domain fragments (e.g., AR-03 references both SAR and AMB, which each already have their own base fragment), the assembly order **always** places interaction blocks after all base domain blocks, and interaction-block language is written (§6.2) to explicitly say "Pattern noted:" rather than re-explaining each domain from scratch — this avoids redundant restatement while still letting each block stand alone if a UI surfaces it independently (e.g., a "flags" tab).

### 6.4 Safety-Gate Response Content

When `safety_gate_triggered = true` (Part 3 §5.12), the product must **not** call `assembleReport`'s normal path. Instead:

```
function safetyGateResponse() -> Response:
    return {
        "type": "safety_resources",
        "message": "Thank you for your honesty in these responses. Based on what you shared, "
                    + "we want to make sure you have support before anything else — this isn't "
                    + "something an automated report is the right tool for.",
        "resources": [
            { "name": "988 Suicide & Crisis Lifeline (US)", "detail": "Call or text 988, available 24/7." },
            { "name": "Crisis Text Line", "detail": "Text HOME to 741741, available 24/7." },
            { "name": "Campus counseling / student wellness services", "detail": "Most colleges and universities offer free, confidential support — this is often the fastest way to reach someone who knows your specific context." },
            { "name": "If you are outside the US", "detail": "Please look up your local emergency number or a crisis line for your country." }
        ],
        "note": "If you'd like, you can return and complete the assessment another time. There's no rush.",
        "score_report_generated": false
    }
```

This response is deliberately **not** styled or worded like the rest of the product's report UI (no domain scores, no branding-heavy layout) — the product design goal here is to look and feel like a support screen, not a results screen, per Part 1 §1.5(3)'s framing of this as a product safety rule rather than a scoring edge case.

### 6.5 `reports.json` Structure (schema, abbreviated example)

```json
{
  "domain_fragments": {
    "SAR": {
      "Emerging":    { "id": "RPT-SAR-E", "interpretation": "...", "strength": "...", "growth": "...", "study_advice": "...", "wellbeing_advice": "...", "medical_practice_relevance": "...", "warning": null, "resources": ["..."] },
      "Developing":  { "id": "RPT-SAR-D", "...": "..." },
      "Established": { "id": "RPT-SAR-S", "...": "..." },
      "Strong":      { "id": "RPT-SAR-T", "...": "..." }
    }
  },
  "interaction_blocks": {
    "AR-03":  { "id": "RPT-AR03",  "text": "Pattern noted: wanting certainty before acting. ..." },
    "AR-03b": { "id": "RPT-AR03B", "text": "Pattern noted: checking and re-checking before closing. ..." },
    "IH-01":  { "id": "RPT-IH01",  "text": "Pattern noted: confident reasoning paired with more resistance to correction. ..." },
    "CR-02":  { "id": "RPT-CR02",  "text": "Pattern noted: possible overextension risk. ..." },
    "EC-01":  { "id": "RPT-EC01",  "text": "Pattern noted: technical orientation. ..." },
    "PC-01":  { "id": "RPT-PC01",  "text": "Note on very high conscientiousness. ..." },
    "OA-01":  { "id": "RPT-OA01",  "text": "Note on very high analytical reasoning. ..." }
  },
  "safety_gate": { "message": "...", "resources": ["..."], "note": "..." },
  "footer": {
    "non_admissions_notice": "This report is a self-reflection tool. It is not validated for, and must not be used in, admissions, hiring, or credentialing decisions.",
    "non_diagnostic_notice": "This report does not diagnose any medical or mental health condition."
  }
}
```

---

## What's next

Part 5 will cover the Personality/Profile System (Section 7) and the Outcome Matrix (Section 8): the 20–40 named profiles (e.g., "Analytical Scientist," "Compassionate Communicator"), their required/excluded score-combination rules built on top of the eight domains and interaction flags defined so far, and the complete decision table governing profile assignment — including how it interacts with `suppress_profile_assignment` from Part 3.

---

## Technical Specification — Part 5 of 8: Personality/Profile System & Outcome Matrix

Builds on Parts 1–4. Defines 24 deterministic profiles (within the 20–40 target range) and the complete decision table that assigns them.

**Framing reminder (binding on this whole part):** profiles are **descriptive archetypes for reflection**, not categories, types, or labels in any clinical or psychometric sense — no factor-analytic or cluster-analytic evidence yet supports these as "real" groupings (Part 1 §1.3). They exist to make an 8-number score vector easier to talk about with a mentor, nothing more. Every profile description avoids ranking profiles against each other — there is no "best" profile.

---

## 7. Personality / Profile System

### 7.1 Profile Tiers (distinct from report bands)

Part 4's report uses 4 bands per domain (Emerging/Developing/Established/Strong) for individual score interpretation. Profile matching uses a **coarser 3-tier system** instead, to keep the combinatorial space tractable — with 8 domains at 4 bands each there are 4⁸ = 65,536 raw combinations, which cannot be responsibly hand-authored into distinct profiles; a 3-tier system reduces this to 3⁸ = 6,561 combinations, still too many to enumerate exhaustively, which is exactly why §7.3/§8 use a **best-match scoring algorithm** rather than a lookup table keyed on the full combination.

| Tier | Score range | Rationale |
|---|---|---|
| **High** | ≥ 65 | Chosen to align with the top of the report's "Established" band and into "Strong," so a domain must be genuinely above-average, not merely at the midpoint, to count as a profile-defining strength. |
| **Moderate** | 35–64 | The broad middle — deliberately wide, since profile assignment should key off clear differentiators, not moderate scores on every domain. |
| **Low** | < 35 | Chosen slightly below the report's "Emerging/Developing" boundary (25) is *not* used here — 35 is used instead so "Low" in the profile sense means "clearly below average," not merely "in the bottom band," avoiding profiles that over-trigger on scores that are only mildly below the middle. |

### 7.2 Profile Catalog (24 profiles)

Each profile specifies **required tiers** only for the domains that define it — all other domains are unconstrained ("any tier acceptable") for that profile. **Excluded combinations** are conditions that disqualify a respondent from a profile even if the required tiers are met (used mainly to keep thematically opposite profiles from ever double-matching identically).

---

#### Cluster A–leaning profiles (Cognitive/Analytical-dominant)

| # | Profile ID | Name | Required tiers | Excluded if | Description |
|---|---|---|---|---|---|
| 1 | `PROF-01` | Analytical Scientist | SAR=High, ELCA=High | ECPC=Low | Approaches problems through structured, evidence-first reasoning and is comfortable with the technical vocabulary of research. |
| 2 | `PROF-02` | Evidence-Oriented Thinker | ELCA=High, IHOR=High | — | Combines strong evidence literacy with genuine openness to revising conclusions as new evidence appears — a core EBM disposition. |
| 3 | `PROF-03` | Methodical Researcher | CSR=High, SAR=High, ELCA=High | RST=Low | Pairs rigorous reasoning with strong follow-through; likely to thrive in structured research or data-heavy coursework. |
| 4 | `PROF-04` | Curious Skeptic | SAR=High, ELCA=Low | — | Strong instinct to question and analyze, but evidence-specific vocabulary/skills are still developing — a very common and easily-addressed early-stage pattern. |
| 5 | `PROF-05` | Structured Innovator | CSR=High, SAR=High, AMB=Low | — | Brings organized, analytical thinking to new problems, with a preference for having a clear plan before diving in. |
| 6 | `PROF-06` | Data-Driven Communicator | SAR=High, ELCA=High, ECPC=High | — | A relatively rare, high-value combination: technically rigorous *and* able to translate that rigor for a non-technical audience. |
| 7 | `PROF-07` | Independent-Minded Reasoner | SAR=High, ERP=Moderate | IHOR=Low | Reasons confidently and is comfortable reaching conclusions independently; benefits from deliberately seeking outside checks on those conclusions (see IH-01 interaction, Part 3 §4.3, if it also fires). |

#### Cluster B–leaning profiles (Interpersonal/Professional-dominant)

| # | Profile ID | Name | Required tiers | Excluded if | Description |
|---|---|---|---|---|---|
| 8 | `PROF-08` | Compassionate Communicator | ECPC=High, ERP=High | — | Consistently prioritizes the human side of a situation — listening, honesty, and patient-centeredness — across both communication and ethics scenarios. |
| 9 | `PROF-09` | Adaptive Clinician | AMB=High, IHOR=High, ECPC=High | — | Comfortable with uncertainty, open to correction, and attentive to others — a combination well-matched to the ambiguity of real clinical encounters. |
| 10 | `PROF-10` | Reflective Practitioner | IHOR=High, ERP=High | — | Pairs genuine openness to being wrong with strong ethical-reasoning tendencies — likely to seek and use feedback constructively. |
| 11 | `PROF-11` | Empathic Realist | ECPC=High, AMB=High | — | Comfortable sitting with both emotional complexity and factual uncertainty at the same time, without needing to resolve either prematurely. |
| 12 | `PROF-12` | Patient Advocate | ECPC=High, ERP=High, AMB=High | — | A three-domain combination emphasizing person-centered, ethically grounded comfort with uncertainty — thematically aligned with shared decision-making. |
| 13 | `PROF-13` | Principled Skeptic | SAR=High, ERP=High, IHOR=High | — | Reasons rigorously, holds firm ethical standards, and remains open to being shown wrong — a combination that guards against both under- and over-confidence. |
| 14 | `PROF-14` | Rigorous Humanist | SAR=High, ECPC=High | — | A deliberately-named counter-profile to the EC-01 interaction pattern (Part 3 §4.3) — this profile requires *both* SAR and ECPC High simultaneously, i.e., it can only match respondents who do **not** trigger EC-01, since EC-01 requires ECPC=Low. |
| 15 | `PROF-15` | Calm Communicator | ECPC=High, RST=High | — | Stays composed and attentive to others even under stress — a combination especially relevant to difficult-conversation and bad-news scenarios. |

#### Cluster C–leaning profiles (Self-Regulation/Resilience-dominant)

| # | Profile ID | Name | Required tiers | Excluded if | Description |
|---|---|---|---|---|---|
| 16 | `PROF-16` | Resilient Learner | RST=High, CSR=High | — | Combines strong follow-through with strong recovery from setbacks — well-positioned for the sustained demands of training. |
| 17 | `PROF-17` | Steady Under Pressure | RST=High, AMB=High | — | Tolerates both emotional strain and informational uncertainty without becoming destabilized by either. |
| 18 | `PROF-18` | Growth-Minded Trainee | IHOR=High, RST=High | — | Recovers well from setbacks *and* treats them as genuine learning opportunities rather than just something to get through. |
| 19 | `PROF-19` | Steady Ethical Anchor | ERP=High, RST=High, CSR=High | — | A three-domain combination suggesting consistency under pressure — worth noting the ERP domain's wider confidence margin (Part 1 §2.6) applies here as it does everywhere ERP contributes. |
| 20 | `PROF-20` | Detail-Oriented Planner | CSR=High, AMB=Low | — | Thrives with structure and clear plans; may find genuinely unclear situations more effortful than most, which is a workable growth edge, not a weakness. |

#### Cross-cutting / holistic profiles

| # | Profile ID | Name | Required tiers | Excluded if | Description |
|---|---|---|---|---|---|
| 21 | `PROF-21` | Balanced Generalist | *(special rule, see below)* | — | No domain scored clearly high or low — a genuinely common and entirely valid pattern reflecting broad, even development across all eight domains rather than a standout specialty. |
| 22 | `PROF-22` | Emerging Clinician-in-Training | ELCA=Low, CSR=Moderate\|High | SAR=Low AND IHOR=Low | Early-stage profile for respondents who show general analytical/organizational engagement but haven't yet built EBM-specific vocabulary — an expected, addressable starting point, not a readiness concern. |
| 23 | `PROF-23` | High-Achieving Planner | CSR≥90 (raw domain score, not tier) | — | Distinct from `PROF-20`: this profile keys directly off the Part 3 §4.3 `PC-01` threshold (CSR≥90) rather than the 3-tier system, since the perfectionism-relevant pattern is specifically about the *very* top of the range, not simply "High." |
| 24 | `PROF-24` | Sustainable Achiever | CSR=High, RST=High, IHOR=High | — | The constructive counter-pattern to the CR-02 "overextension risk" flag (Part 3 §4.3) — strong follow-through paired with strong (not low) resilience and openness, suggesting sustainable rather than strained high performance. |

### 7.3 Per-Profile Detail Fields

Rather than repeat 24 near-identical tables, the four remaining required fields per profile (**Strengths, Growth Areas, Recommended Learning Strategies, Possible Med-School Challenges**) are generated from a **shared template keyed to each profile's required domains**, using the domain-level content already authored in Part 4 §6.1 — concatenated and lightly re-framed at the profile level rather than rewritten from scratch. This is a deliberate architectural choice, documented here:

```
function profileDetailFields(profile: Profile, result: ScoringResult) -> ProfileDetail:
    strengths = []
    growthAreas = []
    strategies = []
    challenges = []
    for (domain, requiredTier) in profile.required_tiers:
        fragment = lookupFragment(domain, bandFor(domain, result.domain_scores[domain]))  // Part 4 §6.1
        strengths.append(fragment.strength)
        growthAreas.append(fragment.growth)
        strategies.append(fragment.study_advice)
        challenges.append(fragment.medical_practice_relevance)
    return ProfileDetail(
        strengths = dedupeAndJoin(strengths),
        growth_areas = dedupeAndJoin(growthAreas),
        learning_strategies = dedupeAndJoin(strategies),
        challenges = dedupeAndJoin(challenges)
    )
```

This guarantees **perfect consistency** between a respondent's individual domain report (Part 4) and their profile summary — the profile page can never say something that contradicts the domain-by-domain page, because it's built from the same underlying fragments, just recombined. This is preferred over hand-writing 24 × 4 = 96 additional bespoke text fields, which would risk drifting out of sync with Part 4 as that document evolves, and would be substantially more implementation and maintenance burden for a pre-validation-stage instrument.

**`PROF-21` (Balanced Generalist) special case:** since this profile is defined by the *absence* of any High/Low domain rather than a specific domain combination, its detail fields use a fixed, standalone text block (not the template above) — see `profiles.json` example in §8.6.

---

## 8. Outcome Matrix

### 8.1 Profile Assignment Algorithm (Deterministic Best-Match)

With 24 profiles and no exhaustive lookup table (per §7.1's combinatorics argument), assignment uses a **fit-score** computed per profile, with the highest-scoring profile winning and ties broken by a **fixed priority order** (the profile numbering in §7.2, `PROF-01` highest priority) so that two engineers implementing this independently always assign the same profile to the same score vector.

```
function assignProfile(result: ScoringResult) -> ProfileAssignment:
    if result.suppress_profile_assignment:
        return ProfileAssignment(suppressed = true)  // Part 3 §5.9, SD_index >= 5.5

    tiers = {}
    for D in domains:
        if "insufficient_data" in result.domain_flags.get(D, []):
            tiers[D] = "UNKNOWN"
        else:
            tiers[D] = tierFor(result.domain_scores[D])  // High/Moderate/Low per §7.1

    candidates = []
    for profile in PROFILE_CATALOG:  // fixed order, PROF-01 .. PROF-24
        if profile.id == "PROF-21":
            if isBalancedGeneralist(tiers):  // §8.2 special case
                candidates.append((profile, fitScore = 8))  // treated as a perfect, full-domain fit
            continue
        if profile.id == "PROF-23":
            if result.domain_scores.get("CSR", 0) >= 90:
                candidates.append((profile, fitScore = 1))  // single-condition profile, see §8.3
            continue

        if isExcluded(profile, tiers, result):
            continue
        if not allRequiredTiersUnknownSafe(profile, tiers):
            continue  // any required domain with tiers[D] == "UNKNOWN" disqualifies this profile (§8.4)

        matchedCount = 0
        for (D, requiredTier) in profile.required_tiers:
            if matchesTier(tiers[D], requiredTier):  // requiredTier may itself be "Moderate|High" (see PROF-22)
                matchedCount += 1
        if matchedCount == len(profile.required_tiers):  // ALL required domains must match — partial matches don't count
            candidates.append((profile, fitScore = matchedCount))

    if len(candidates) == 0:
        return ProfileAssignment(profile = "PROF-21", reason = "no_specific_match_defaults_to_balanced")
        // Rationale: a respondent matching no specific profile is, by construction, someone without
        // a strong differentiating pattern — functionally the same situation PROF-21 exists to describe,
        // so it is used as the deterministic fallback rather than leaving the field empty.

    candidates.sort(by = (fitScore DESC, profile.priority_order ASC))  // priority_order = catalog position, §7.2
    return ProfileAssignment(profile = candidates[0].profile, fitScore = candidates[0].fitScore)
```

### 8.2 `PROF-21` (Balanced Generalist) Special-Case Rule

```
function isBalancedGeneralist(tiers: Map<Domain,Tier>) -> boolean:
    highCount = count(tiers[D] == "High" for D in domains)
    lowCount  = count(tiers[D] == "Low"  for D in domains)
    unknownCount = count(tiers[D] == "UNKNOWN" for D in domains)
    return highCount <= 1 AND lowCount <= 1 AND unknownCount == 0
```

Rationale for the thresholds: requiring *zero* High/Low domains would make this profile vanishingly rare (most real respondents will have at least one standout domain by chance alone); allowing up to one High and up to one Low keeps the profile meaningful ("no dominant pattern") while still being achievable. `unknownCount == 0` is required because a profile whose entire definition is "no domain stands out" cannot be responsibly assigned when some domains are simply missing data rather than genuinely moderate.

### 8.3 Full Decision Table (Representative Extract — All 24 Profiles Follow This Pattern)

The full table has 24 rows, one per profile, directly reflecting §7.2's catalog. Rather than repeat all 24 (identical in structure to §7.2's table, just reformatted as strict IF/THEN), a representative extract is shown here to make the IF/THEN structure explicit; the complete table is the union of every row in §7.2 read as:

```
IF SAR_tier == High AND ELCA_tier == High
   AND NOT(ECPC_tier == Low)
THEN candidate_profile = PROF-01 ("Analytical Scientist"), fitScore = 2

IF ELCA_tier == High AND IHOR_tier == High
THEN candidate_profile = PROF-02 ("Evidence-Oriented Thinker"), fitScore = 2

IF CSR_tier == High AND SAR_tier == High AND ELCA_tier == High
   AND NOT(RST_tier == Low)
THEN candidate_profile = PROF-03 ("Methodical Researcher"), fitScore = 3

IF SAR_tier == High AND ELCA_tier == Low
THEN candidate_profile = PROF-04 ("Curious Skeptic"), fitScore = 2

...  [continues through PROF-05 .. PROF-20 exactly per §7.2's required-tiers and excluded-if columns] ...

IF (highCount ≤ 1 AND lowCount ≤ 1 AND unknownCount == 0)
THEN candidate_profile = PROF-21 ("Balanced Generalist"), fitScore = 8  [special case, §8.2]

IF ELCA_tier == Low AND (CSR_tier == Moderate OR CSR_tier == High)
   AND NOT(SAR_tier == Low AND IHOR_tier == Low)
THEN candidate_profile = PROF-22 ("Emerging Clinician-in-Training"), fitScore = 2

IF CSR_raw_score >= 90   [note: raw score, not tier — see §7.2 note]
THEN candidate_profile = PROF-23 ("High-Achieving Planner"), fitScore = 1

IF CSR_tier == High AND RST_tier == High AND IHOR_tier == High
THEN candidate_profile = PROF-24 ("Sustainable Achiever"), fitScore = 3

[Final tie-break / fallback rule, evaluated only if no candidate above matched:]
IF no_candidate_matched
THEN assign_profile = PROF-21, reason = "default_fallback"
```

**"Increase confidence" clause (per the brief's example decision-table format):** a `fitScore ≥ 3` (i.e., a profile matched on three or more required domains simultaneously) triggers a **profile-fit confidence** sub-rating, displayed alongside the profile (not to be confused with the statistical `global_confidence`/`erp_confidence` ratings from Part 3 §5.10):

```
IF fitScore >= 3: profileFitConfidence = "Strong pattern match"
IF fitScore == 2: profileFitConfidence = "Moderate pattern match"
IF fitScore <= 1: profileFitConfidence = "Partial pattern match"
IF profile == PROF-21 (balanced): profileFitConfidence = "No dominant pattern (this is itself the finding)"
```

### 8.4 Handling `UNKNOWN` (Insufficient-Data) Domains in Profile Matching

Per §8.1's `allRequiredTiersUnknownSafe` check: **any profile whose required-domain list includes a domain currently marked `UNKNOWN`/`insufficient_data` (Part 3 §5.5 Tier 2) is disqualified from matching entirely** — it is not silently skipped or treated as a wildcard. Rationale: silently ignoring a missing required domain would let a respondent "match" a profile based on only partial evidence for it, which contradicts the transparency principle (Part 1 §1.2(b)) as much as fabricating a score would. If enough domains are `UNKNOWN` that no profile can match, `assignProfile` naturally falls through to the `PROF-21` default-fallback path — but note `PROF-21` itself also requires `unknownCount == 0` (§8.2), so in practice, **heavy missing data results in no profile being assigned at all**, and the report (Part 4 §6.3) must render a plain "not enough data for a profile summary, but your available domain scores are shown above" message rather than force-fitting `PROF-21`.

*(This means §8.1's pseudocode's stated fallback-to-PROF-21 behavior only actually triggers when `candidates` is empty **and** `unknownCount == 0` — i.e., genuinely complete data that simply didn't match a specific pattern. The spec is explicit about this edge case here to prevent a subtle implementation bug where incomplete data gets mislabeled as "balanced.")*

### 8.5 Worked Example

Respondent domain scores: `SAR=78, ELCA=72, IHOR=45, AMB=30, ECPC=55, ERP=68, CSR=60, RST=58` (all data present, no `UNKNOWN`).

Tiers: `SAR=High, ELCA=High, IHOR=Moderate, AMB=Low, ECPC=Moderate, ERP=Moderate, CSR=Moderate, RST=Moderate`.

Evaluate candidates:
- `PROF-01` (SAR=High, ELCA=High, excluded if ECPC=Low): SAR✓ ELCA✓, ECPC=Moderate (not Low, not excluded) → **matches, fitScore=2**
- `PROF-02` (ELCA=High, IHOR=High): IHOR=Moderate ≠ High → no match
- `PROF-04` (SAR=High, ELCA=Low): ELCA=High ≠ Low → no match
- `PROF-21` (Balanced): highCount = 2 (SAR, ELCA) → exceeds the ≤1 threshold → no match
- All other profiles checked similarly; only `PROF-01` matches in this example.

Result: `assigned_profile = PROF-01 ("Analytical Scientist")`, `fitScore = 2`, `profileFitConfidence = "Moderate pattern match"`. Additionally, since `AMB=30 (Low)` and `SAR=78 (≥70)`, interaction rule `AR-03` also fires independently (Part 3 §4.3) and its report block (`RPT-AR03`, Part 4 §6.2) is appended — profile assignment and interaction-rule flagging run as **separate, parallel systems** that both read the same domain scores, not a single combined pipeline, which is why both can and often will fire together.

### 8.6 `profiles.json` Structure (schema, abbreviated example)

```json
{
  "tier_thresholds": { "high_min": 65, "moderate_min": 35, "moderate_max": 64.999, "low_max": 34.999 },
  "profiles": [
    {
      "id": "PROF-01",
      "priority_order": 1,
      "name": "Analytical Scientist",
      "required_tiers": [ { "domain": "SAR", "tier": "High" }, { "domain": "ELCA", "tier": "High" } ],
      "excluded_if": [ { "domain": "ECPC", "tier": "Low" } ],
      "description": "Approaches problems through structured, evidence-first reasoning and is comfortable with the technical vocabulary of research.",
      "detail_fields_source": "template",
      "special_rule": null
    },
    {
      "id": "PROF-21",
      "priority_order": 21,
      "name": "Balanced Generalist",
      "required_tiers": [],
      "excluded_if": [],
      "description": "No domain scored clearly high or low — a genuinely common and entirely valid pattern reflecting broad, even development across all eight domains rather than a standout specialty.",
      "detail_fields_source": "standalone_block",
      "special_rule": "isBalancedGeneralist"
    },
    {
      "id": "PROF-23",
      "priority_order": 23,
      "name": "High-Achieving Planner",
      "required_tiers": [],
      "excluded_if": [],
      "description": "Distinct from PROF-20: keys directly off the raw CSR score (>=90) rather than the tier system, aligned with interaction rule PC-01.",
      "detail_fields_source": "template",
      "special_rule": "csr_raw_score_gte_90"
    }
  ],
  "fallback": { "no_match_profile": "PROF-21", "requires_unknown_count_zero": true }
}
```

---

## What's next

Part 6 will cover Developer Data Structures (Section 9, the remaining JSON schemas not already introduced — `domains.json`, `questions.json`, `answers.json` full schema, `validation.json`) and Validation Rules (Section 10). Part 7 after that will cover Future Scientific Validation (Section 11 — Cronbach's alpha, IRT, DIF, sample sizes, etc.) and the Appendices (Section 12).

---

## Technical Specification — Part 6 of 8: Developer Data Structures & Validation Rules

Builds on Parts 1–5. This part completes the JSON schema set (some files — `weights.json`, `reports.json`, `profiles.json` — already have worked examples in Parts 3–5 and are referenced, not repeated, here) and specifies the input-validation layer that runs **before** any scoring logic touches a submission.

---

## 9. Developer Data Structures

### 9.0 File Inventory

| File | Purpose | Status |
|---|---|---|
| `domains.json` | The 8 domain definitions (Part 1 §2) | New in this part |
| `questions.json` | The 104-item bank (Part 2) | New in this part |
| `answers.json` | Per-respondent submission schema | New in this part (full schema; Part 3 §5.14 showed a worked instance) |
| `weights.json` | Per-item weight/reverse/scored-toward-domain flags | Introduced Part 3 §5.14 |
| `profiles.json` | 24-profile catalog | Introduced Part 5 §8.6 |
| `rules.json` | Interaction rules + confidence modifiers (Part 3 §4.3–4.4) | New in this part |
| `reports.json` | Report fragment bank | Introduced Part 4 §6.5 |
| `validation.json` | Input-validation rule configuration | New in this part (§10) |

### 9.1 `domains.json`

```json
{
  "schema_version": "1.0.0",
  "domains": [
    {
      "id": "SAR",
      "name": "Scientific & Analytical Reasoning",
      "cluster": "Cognitive",
      "weight": 0.14,
      "min_score": 0,
      "max_score": 100,
      "bands": [
        { "label": "Emerging",    "min": 0,  "max": 24.999 },
        { "label": "Developing",  "min": 25, "max": 49.999 },
        { "label": "Established", "min": 50, "max": 74.999 },
        { "label": "Strong",      "min": 75, "max": 100 }
      ],
      "band_boundary_rule": "low_inclusive_high_exclusive_except_top_band",
      "psychological_construct": "Preference for and self-reported facility with systematic, evidence-weighing reasoning over snap judgment.",
      "medical_relevance": "Diagnostic reasoning, interpreting test sensitivity/specificity, evaluating study applicability.",
      "item_ids": ["SAR-C01","SAR-C02","SAR-C03","SAR-C04","SAR-C05","SAR-C06","SAR-C07","SAR-C08","SAR-A01","SAR-A02","SAR-A03","SAR-S01","SAR-S02"]
    },
    {
      "id": "RST",
      "name": "Resilience & Stress Tolerance",
      "cluster": "Self-Regulation",
      "weight": 0.09,
      "min_score": 0,
      "max_score": 100,
      "bands": [
        { "label": "Emerging",    "min": 0,  "max": 24.999 },
        { "label": "Developing",  "min": 25, "max": 49.999 },
        { "label": "Established", "min": 50, "max": 74.999 },
        { "label": "Strong",      "min": 75, "max": 100 }
      ],
      "band_boundary_rule": "low_inclusive_high_exclusive_except_top_band",
      "psychological_construct": "Self-reported recovery from setbacks, coping-strategy repertoire, help-seeking tendency.",
      "medical_relevance": "Sustaining engagement through failure, avoiding burnout trajectory.",
      "safety_flags": { "has_safety_gate_item": true, "safety_gate_item_id": "RST-S02" },
      "item_ids": ["RST-C01","RST-C02","RST-C03","RST-C04","RST-C05","RST-C06","RST-C07","RST-C08","RST-A01","RST-A02","RST-A03","RST-S01","RST-S02"]
    }
    // ... remaining 6 domains (ELCA, IHOR, AMB, ECPC, ERP, CSR) follow the identical structure,
    // populated directly from Part 1 §2's per-domain specification and Part 2's item lists.
  ]
}
```

Note the `bands` array's `max: 24.999`-style values are a deliberate JSON-level implementation of Part 3 §5.3's boundary rule (`low ≤ score < high`, top band inclusive) — encoding the rule as data rather than as a hardcoded conditional in application code, so a future band-boundary change doesn't require a code change.

### 9.2 `questions.json`

```json
{
  "schema_version": "1.0.0",
  "questions": [
    {
      "id": "SAR-C01",
      "domain": "SAR",
      "item_type": "core",
      "text": "When I hear a surprising claim, I check for evidence before accepting it.",
      "purpose": "Core endorsement of evidence-seeking default",
      "construct_measured": "SAR",
      "response_type": "LIKERT5",
      "options": [
        { "value": 1, "label": "Strongly Disagree" },
        { "value": 2, "label": "Disagree" },
        { "value": 3, "label": "Neither Agree nor Disagree" },
        { "value": 4, "label": "Agree" },
        { "value": 5, "label": "Strongly Agree" }
      ],
      "reverse_scored": false,
      "item_weight": 1.0,
      "difficulty_estimate": 0.35,
      "discrimination_estimate": 0.42,
      "estimate_status": "PLACEHOLDER_PENDING_VALIDATION",
      "potential_bias": "Mild social desirability (sounds like the 'right' answer)",
      "expected_interpretation": "Higher = more evidence-seeking default",
      "developer_notes": "Pair conceptually with SAR-C05 (reverse) for consistency check, see rules.json consistency_pairs",
      "secondary_domain": null
    },
    {
      "id": "SAR-A03",
      "domain": "SAR",
      "item_type": "auxiliary_sd_detector",
      "text": "I have never made a reasoning error.",
      "purpose": "Social-desirability / extreme-response detector",
      "construct_measured": "SAR",
      "response_type": "LIKERT5",
      "options": [
        { "value": 1, "label": "Strongly Disagree" },
        { "value": 2, "label": "Disagree" },
        { "value": 3, "label": "Neither Agree nor Disagree" },
        { "value": 4, "label": "Agree" },
        { "value": 5, "label": "Strongly Agree" }
      ],
      "reverse_scored": true,
      "item_weight": 0.5,
      "difficulty_estimate": 0.90,
      "discrimination_estimate": 0.20,
      "estimate_status": "PLACEHOLDER_PENDING_VALIDATION",
      "potential_bias": "High — designed to catch over-claiming",
      "expected_interpretation": "Agreement (raw >= 4) contributes to SD index, not domain score",
      "developer_notes": "scored_toward_domain=false; routed to validity subsystem exclusively",
      "scored_toward_domain": false,
      "scored_toward_sd_index": true,
      "sd_index_weight": 1.0,
      "secondary_domain": null
    },
    {
      "id": "SAR-S01",
      "domain": "SAR",
      "item_type": "scenario",
      "text": "A friend tells you a new study 'proves' that a popular supplement improves memory, based on a single small trial reported in a news article. What's closest to your first instinct?",
      "purpose": "Behavioral proxy for evidence-seeking vs. narrative acceptance",
      "construct_measured": "SAR",
      "response_type": "SINGLE_SELECT",
      "options": [
        { "value": "A", "label": "That's interesting, I'd probably mention it to others too.", "score": 1 },
        { "value": "B", "label": "I'd wonder if it's been replicated or if it's just one small study.", "score": 4 },
        { "value": "C", "label": "I'd assume the news article oversimplified it either way and stop thinking about it.", "score": 2 },
        { "value": "D", "label": "I'd look up the original study or a summary of its methodology before forming an opinion.", "score": 5 }
      ],
      "reverse_scored": false,
      "item_weight": 1.5,
      "difficulty_estimate": 0.40,
      "discrimination_estimate": 0.48,
      "estimate_status": "PLACEHOLDER_PENDING_VALIDATION",
      "potential_bias": "Respondents familiar with research methods may select the 'correct-sounding' answer performatively.",
      "expected_interpretation": "Higher score = stronger applied tendency toward verification over narrative acceptance",
      "developer_notes": "Options intentionally avoid an obviously worst option to reduce ceiling effects.",
      "secondary_domain": null
    }
    // ... remaining 101 items populated identically from Part 2's full item-by-item specification.
  ]
}
```

### 9.3 `answers.json` (Submission Schema)

```json
{
  "schema_version": "1.0.0",
  "type": "object",
  "required": ["respondent_id", "session_id", "started_at", "answers"],
  "properties": {
    "respondent_id": { "type": "string", "description": "Opaque, non-PII respondent identifier" },
    "session_id": { "type": "string" },
    "started_at": { "type": "string", "format": "date-time" },
    "completed_at": { "type": ["string", "null"], "format": "date-time", "description": "null if submission is a partial/abandoned session" },
    "locale": { "type": "string", "default": "en-US", "description": "See Part 1 §1.5(4) — non-en-US locales must carry a not-yet-validated notice" },
    "consent_confirmed": { "type": "boolean", "description": "Must be true; gates access per Part 1 §1.5(1)-(2) exclusion criteria" },
    "age_bracket_confirmed_16_plus": { "type": "boolean", "description": "Must be true; gates access per Part 1 §1.5(2)" },
    "answers": {
      "type": "object",
      "description": "Map of question_id -> response",
      "additionalProperties": {
        "oneOf": [
          { "type": "integer", "minimum": 1, "maximum": 5, "description": "LIKERT5 raw value" },
          { "type": "string", "enum": ["A", "B", "C", "D"], "description": "Scenario item option" }
        ]
      }
    },
    "item_timestamps": {
      "type": "object",
      "description": "OPTIONAL map of question_id -> ISO timestamp when answered, used for response-time-anomaly validation (§10.5). Absence of this field disables that specific check without failing validation overall.",
      "additionalProperties": { "type": "string", "format": "date-time" }
    }
  }
}
```

### 9.4 `rules.json`

```json
{
  "schema_version": "1.0.0",
  "interaction_rules": [
    { "id": "AR-03",  "conditions": [ {"domain":"SAR","op":">=","value":70}, {"domain":"AMB","op":"<=","value":40} ], "effect": "report_flag", "report_block": "RPT-AR03" },
    { "id": "AR-03b", "conditions": [ {"domain":"AMB","op":"<=","value":40}, {"domain":"CSR","op":">=","value":70} ], "effect": "report_flag", "report_block": "RPT-AR03B" },
    { "id": "IH-01",  "conditions": [ {"domain":"SAR","op":">=","value":70}, {"domain":"IHOR","op":"<=","value":40} ], "effect": "report_flag", "report_block": "RPT-IH01" },
    { "id": "CR-02",  "conditions": [ {"domain":"CSR","op":">=","value":80}, {"domain":"RST","op":"<=","value":40} ], "effect": "report_flag", "report_block": "RPT-CR02" },
    { "id": "EC-01",  "conditions": [ {"domain":"SAR","op":">=","value":70}, {"domain":"ECPC","op":"<=","value":40} ], "effect": "report_flag", "report_block": "RPT-EC01" },
    { "id": "CM-04",  "conditions": [ {"domain":"RST","op":"<=","value":40}, {"domain":"ERP","op":">=","value":80} ], "effect": "confidence_modifier", "target": "ERP", "delta": -15 },
    { "id": "PC-01",  "conditions": [ {"domain":"CSR","op":">=","value":90} ], "effect": "report_flag", "report_block": "RPT-PC01" },
    { "id": "OA-01",  "conditions": [ {"domain":"SAR","op":">=","value":90} ], "effect": "report_flag", "report_block": "RPT-OA01" }
  ],
  "evaluation_order": ["AR-03","AR-03b","IH-01","CR-02","EC-01","CM-04","PC-01","OA-01"],
  "confidence_modifiers_global": [
    { "id": "CM-01", "condition": "sd_index >= 3", "delta": -20 },
    { "id": "CM-02", "condition": "missing_data_rate > 0.10", "delta": -10 },
    { "id": "CM-03", "condition": "straight_line_flags.length > 0", "delta": -25 },
    { "id": "CM-consistency", "condition": "min(consistency_flags.length, 4)", "delta_per_unit": -5 }
  ],
  "consistency_pairs": [
    ["SAR-C01","SAR-C05"], ["SAR-A01","SAR-A02"],
    ["IHOR-C01","IHOR-C05"], ["IHOR-A01","IHOR-A02"],
    ["ECPC-A01","ECPC-A02"], ["CSR-A01","CSR-A02"],
    ["AMB-A01","AMB-A02"], ["ELCA-A01","ELCA-A02"],
    ["ERP-A01","ERP-A02"], ["RST-A01","RST-A02"]
  ],
  "safety_gate": {
    "trigger_item": "RST-S02",
    "trigger_value": 3,
    "supporting_items": ["RST-C03","RST-C05","RST-C08"],
    "supporting_threshold_contribution_score": 2,
    "supporting_min_count": 2
  }
}
```

### 9.5 `validation.json`

Introduced in full in §10.6 below, after the validation rules themselves are specified.

---

## 10. Validation Rules

This section governs the **input-validation layer**, which runs on a raw submission **before** it is handed to the Part 3 scoring pipeline. It is a distinct concern from Part 3 §5's statistical validity/consistency checks: those checks interpret *meaningful but suspicious* answer patterns (e.g., social desirability), while this layer rejects or flags *structurally invalid* submissions (e.g., malformed data, impossible values) that should never reach scoring logic at all. A submission can fail input validation before scoring even has a chance to compute a `ScoringResult`.

### 10.1 Missing-Answer Validation

- **Structural check:** every key in `answers` must correspond to a real `question_id` in `questions.json`; any submission answer key not found in the question bank is rejected as malformed input (`ERR_UNKNOWN_QUESTION_ID`), not merely ignored — silently ignoring unrecognized keys could mask a client-side bug (e.g., stale question IDs after a spec revision) that should be surfaced loudly.
- **Coverage check:** the fraction of the 104 canonical question IDs *not* present as keys in `answers` is computed as `missing_data_rate`, feeding directly into Part 3 §5.5's three-tier missing-data handling. This validation layer does not itself reject a submission for having missing answers (partial submissions are explicitly supported, e.g., a respondent who exits early) — it only computes and attaches the rate for the scoring layer to act on.
- **Null/empty check:** a key present with a `null` or empty-string value is treated identically to the key being absent (both count toward `missing_data_rate`), never as a distinct "answered nothing" state that would need separate handling.

### 10.2 Duplicate-Answer Validation

Because `answers` is a `question_id -> response` map (§9.3), the JSON structure itself makes true key-level duplicates impossible in a well-formed payload — this validation instead targets the two realistic duplicate scenarios:

- **Duplicate submission of the same session:** if `session_id` matches a previously completed, fully-scored session, the new submission is rejected (`ERR_DUPLICATE_SESSION`) rather than silently overwriting or re-scoring — re-scoring on resubmission must go through an explicit "retake" flow (out of scope for this spec; a product decision) rather than happen implicitly via a duplicate POST.
- **Duplicate respondent, new session (legitimate retake):** allowed, but the product should surface a "you've completed this before" notice — this is a UX rule (Part 4-adjacent), not a hard validation rejection.

### 10.3 Impossible-Combination Validation

- **Type/range validation:** every `LIKERT5` answer must be an integer in `[1,5]`; every scenario answer must be one of that item's defined option values (`A`-`D` per Part 2). Any value outside these ranges is rejected (`ERR_INVALID_RESPONSE_VALUE`) — this is a hard schema violation, not a data-quality signal, and must never reach the scoring layer.
- **Cross-field impossible combinations:** `completed_at`, if present, must be chronologically after `started_at`; a `completed_at` earlier than `started_at` is rejected (`ERR_INVALID_TIMESTAMP_ORDER`) as a structurally impossible submission, not merely an anomaly to flag.
- **Consent/age gating:** a submission with `consent_confirmed: false` or `age_bracket_confirmed_16_plus: false` must be rejected before any scoring occurs (`ERR_CONSENT_REQUIRED` / `ERR_AGE_REQUIREMENT_NOT_MET`), directly enforcing Part 1 §1.5(1)-(2)'s exclusion criteria at the data layer, not merely as a UI-level gate that a direct API call could bypass.

### 10.4 Random-Answering Detection

Distinct from Part 3 §5.7's straight-line detection (which catches *uniform* responding), this checks for **implausibly high response variance with no discernible pattern**, a signature more associated with rapid/random clicking than either genuine responding or straight-lining:

```
FOR each domain D:
  values = [raw_value(i) for i in LIKERT5 items of D, if answered]
  variance = statisticalVariance(values)
  IF variance >= 2.5 AND len(values) >= 8:
      // 2.5 is close to the maximum possible variance for a 1-5 scale with roughly
      // uniform sampling across all 5 values — a real, engaged respondent's answers
      // on 11 related items within one domain are not expected to swing this randomly
      flag RANDOM_ANSWERING(D)
```

`RANDOM_ANSWERING` flags are logged and contribute to the same confidence-reduction pathway as straight-lining (an extension of CM-03's condition, applied per-domain rather than globally: **any** `RANDOM_ANSWERING(D)` flag also triggers the −25 global confidence modifier, since both are fundamentally "this response pattern doesn't look like genuine engagement" signals).

### 10.5 Response-Time Anomaly Validation

Only evaluated when `item_timestamps` (§9.3, optional field) is present:

- **Total-time floor:** total completion time (`completed_at − started_at`) under **8 minutes** for a full 104-item submission is flagged `RAPID_COMPLETION` — below the ~12-15 sec/item average pace established in Part 1 §1.6, and well below what's plausible even skimming every item.
- **Per-item floor:** more than **15 items** answered in under 2 seconds each (measured as the delta between consecutive `item_timestamps` entries) is flagged `RAPID_ITEM_RESPONSES` — a stronger, more localized signal than the aggregate total-time check, since it can catch rapid-clicking behavior even in a submission whose overall time looks acceptable (e.g., rapid-clicking through most items, then leaving the tab open before submitting).
- **Effect:** either flag triggers the same −25 global confidence modifier as straight-lining/random-answering (all three are collapsed into a single `data_quality_flags` list and a single confidence penalty in the final `ScoringResult`, rather than stacking multiple −25 penalties for what is fundamentally one underlying concern: low-engagement responding).

### 10.6 Social Desirability, Consistency Scoring, Minimum Completion — Cross-References

These three items from the brief's validation list are already fully specified elsewhere and are referenced here for completeness rather than re-specified:

- **Social desirability bias** → Part 3 §5.9 (SD index) and §4.4/§8.1 (its downstream effects on confidence and profile-assignment suppression).
- **Consistency scoring** → Part 3 §5.6 (paired-item divergence) and this document's `rules.json` §9.4 `consistency_pairs` array.
- **Minimum completion thresholds** → Part 3 §5.5 Tier 3 (25% missing-data ceiling before an assessment is marked `incomplete` and withheld from full report generation).

### 10.7 `validation.json`

```json
{
  "schema_version": "1.0.0",
  "structural_rules": {
    "reject_unknown_question_ids": true,
    "reject_out_of_range_values": true,
    "reject_invalid_timestamp_order": true,
    "require_consent_confirmed": true,
    "require_age_bracket_confirmed": true,
    "reject_duplicate_completed_session": true
  },
  "random_answering": {
    "variance_threshold": 2.5,
    "min_items_required": 8
  },
  "response_time": {
    "enabled_if_item_timestamps_present": true,
    "total_time_floor_minutes": 8,
    "per_item_floor_seconds": 2,
    "per_item_floor_count_threshold": 15
  },
  "straight_line": {
    "window_size": 10,
    "applies_to": "LIKERT5_items_only_in_fixed_presentation_order"
  },
  "confidence_penalty_collapse_group": ["straight_line", "random_answering", "rapid_completion", "rapid_item_responses"],
  "confidence_penalty_collapse_group_delta": -25,
  "error_codes": {
    "ERR_UNKNOWN_QUESTION_ID": "Submission contains a question_id not present in questions.json",
    "ERR_INVALID_RESPONSE_VALUE": "Answer value outside the item's defined range/options",
    "ERR_INVALID_TIMESTAMP_ORDER": "completed_at precedes started_at",
    "ERR_CONSENT_REQUIRED": "consent_confirmed is false or missing",
    "ERR_AGE_REQUIREMENT_NOT_MET": "age_bracket_confirmed_16_plus is false or missing",
    "ERR_DUPLICATE_SESSION": "session_id matches a previously completed, scored session"
  }
}
```

### 10.8 Validation Pipeline Position (Restated for Clarity)

```
Raw HTTP submission
   → Structural validation (§10.1-10.3; hard rejection on failure, HTTP 400 + error_code)
   → Data-quality validation (§10.4-10.5; produces flags, never rejects)
   → Part 3 §5.12 Safety Gate (halts normal scoring, does not "reject" — routes to support content)
   → Part 3 §5 Scoring Pipeline proper
   → Part 4 Report Assembly
   → Part 5 Profile Assignment
```

This ordering matters: structural validation must run first and must be capable of rejecting a submission outright (it's protecting data integrity), while every check after it either annotates a valid submission or (safety gate only) redirects it — none of the downstream stages can outright reject a structurally valid submission, keeping "rejection" and "annotation" as cleanly separated concerns per implementation.

---

## What's next

Part 7 will cover Future Scientific Validation (Section 11): the concrete research design needed to replace every `PLACEHOLDER_PENDING_VALIDATION` value in this spec with real numbers — Cronbach's alpha / McDonald's omega, factor analysis, IRT/Rasch modeling, measurement invariance, the four validity types (construct/criterion/predictive/known-group), differential item functioning, and recommended sample sizes for each analysis. Part 8 will close out the series with the Appendices (Section 12): consolidated scoring/decision/rule tables, a suggested database schema, and API endpoint suggestions.

---

## Technical Specification — Part 7 of 8: Future Scientific Validation

Builds on Parts 1–6. This part is explicitly a **roadmap, not a prerequisite** — nothing here blocks publishing the methodology and frontend now, per your plan. Its purpose is to define exactly what "becoming real" would look like later, and to make clear which parts of the current spec are placeholders waiting for this work (every `PLACEHOLDER_PENDING_VALIDATION` tag from Parts 2, 3, and 6).

**Pre-launch note (not a validation step, just a launch-readiness note):** since v1 ships without any of the analyses below, the product's non-admissions/non-diagnostic footer (Part 4 §6.5), the safety gate (Part 4 §6.4), and the "estimated, pending validation" labeling on any surfaced difficulty/discrimination values should ship exactly as specified — these are what keeps an unvalidated instrument honest with the people using it, and they cost little to implement relative to the rest of the build.

---

## 11. Future Scientific Validation

### 11.1 Overview: What "Validation" Would Mean Here

Three broad questions, addressed by different analyses:

1. **Is each domain measuring one coherent thing?** → Reliability analyses (§11.2) and factor analysis (§11.3).
2. **Do the items behave well individually, and consistently across different kinds of people?** → IRT/Rasch (§11.4) and measurement invariance / DIF (§11.5, §11.9).
3. **Do the scores actually relate to anything real outside the instrument itself?** → Construct, criterion, predictive, and known-group validity (§11.6–§11.8).

None of this can be done on the placeholder estimates already in the spec — they exist only so the data model has a value to hold. Real numbers require real response data, collected as described in §11.10.

### 11.2 Internal Consistency: Cronbach's Alpha & McDonald's Omega

**What it tells you:** whether the items within one domain tend to move together — a proxy for whether they're measuring one underlying construct rather than several unrelated things.

**Cronbach's alpha**, per domain:
```
α = (k / (k-1)) × (1 - Σσ²ᵢ / σ²total)
```
where `k` = number of items in the domain (12 domain-scored items per Part 2/3, excluding the `*-A03` SD-detector item), `σ²ᵢ` = variance of item `i`, `σ²total` = variance of the summed domain score.

**Target:** α ≥ 0.70 is the conventional floor for a research/reflection instrument (α ≥ 0.80 for anything closer to decision-grade use, which this instrument explicitly is not — Part 1 §1.5(1)). Given each domain mixes Likert core items with scenario items on a different response format, expect alpha to run somewhat lower than a pure-Likert scale of the same length; this is a known property of mixed-format scales, not necessarily a flaw, which is exactly why:

**McDonald's omega (ω)** should be computed alongside alpha, since omega doesn't assume equal item loadings (tau-equivalence) the way alpha implicitly does, and is generally considered the more defensible statistic for a scale mixing item formats and expected discrimination levels (per Part 2's differentiated discrimination placeholders across core/auxiliary/scenario items).

**Action if below target:** identify the lowest item-total correlations within the domain (candidates: items already flagged with low placeholder discrimination in Part 2, e.g., `SAR-C06`, `CSR-C04`) and consider revision or replacement before the next validation cycle, rather than dropping domain item-count below the 8-core/3-aux/2-scenario structure that Part 1 §1.7 justified on other grounds.

### 11.3 Factor Analysis

**Exploratory Factor Analysis (EFA)** on the first validation dataset, run domain-by-domain (12 items each) and then across the full 96-item domain-scored set, to check:
- Within-domain: do all 12 items load primarily on one factor? (Supports the domain being unidimensional as designed.)
- Across domains: do items cluster into roughly the 8 intended domains, or does the 3-cluster structure from Part 1 §1.8 (Cognitive / Interpersonal-Professional / Self-Regulation) better fit a smaller number of broader factors? This directly tests whether 8 domains is the right granularity or whether Part 1's cluster-level grouping is actually the "real" structure.

**Confirmatory Factor Analysis (CFA)**, on a second, independent dataset (never the same sample used for EFA, to avoid circular confirmation): tests the specific 8-factor model implied by this spec against the data, reporting standard fit indices (CFI, TLI, RMSEA, SRMR). Conventional adequate-fit thresholds: CFI/TLI ≥ 0.90 (≥0.95 preferred), RMSEA ≤ 0.08 (≤0.06 preferred), SRMR ≤ 0.08.

**If the 8-factor model doesn't fit well:** this is a legitimate, expected possible outcome — the domain structure in Part 1 §2 was expert-derived, not data-derived, and should be revised (domains merged, split, or redefined) based on what CFA/EFA actually show, rather than defended past the point the data supports it.

### 11.4 Item Response Theory (IRT) & Rasch Modeling

**Purpose:** replace every placeholder `difficulty_estimate` and `discrimination_estimate` in `questions.json` (Part 2, Part 6 §9.2) with real, data-derived parameters.

**Model choice:** for the LIKERT5 items, a **Graded Response Model (GRM)**, appropriate for ordered polytomous response data, is the natural fit — it estimates one discrimination parameter and four threshold (difficulty) parameters per item (for the four boundaries between five response categories). For the scenario items, since options aren't strictly ordered in the same sense, a **Nominal Response Model (NRM)** is more appropriate, modeling each option's own trace line rather than assuming an ordered latent continuum across options A–D.

**Rasch as a simpler/complementary alternative:** a Rasch (1-PL) model constrains all items to equal discrimination, testing a stronger, more falsifiable hypothesis than GRM's 2-PL-style flexibility. Running both and comparing fit is worthwhile at this stage: if Rasch fits acceptably, it offers a mathematically cleaner property (item-free person measurement) that could simplify future scoring; if it doesn't, GRM's added flexibility better reflects reality and should be preferred.

**Practical output:** item information curves per item, which directly tell you which items are doing the most work distinguishing respondents at which score ranges — useful for a future, shorter "screening" version of the instrument if that's ever wanted, and for identifying which of Part 2's lowest-discrimination-placeholder items (again, e.g., `CSR-C04`, `SAR-C06`) are genuinely weak versus merely mis-estimated by the placeholder guess.

### 11.5 Measurement Invariance

**Purpose:** test whether the instrument measures the same construct the same way across different groups — most importantly here: gender, race/ethnicity, first-generation-college status, and premed vs. career-changer vs. early-medical-student subgroups (Part 1 §1.4's user types).

**Method:** multi-group CFA, tested in the standard nested sequence:
1. **Configural invariance** — same factor structure holds across groups.
2. **Metric invariance** — factor loadings are equal across groups (needed before comparing relationships between domains across groups).
3. **Scalar invariance** — item intercepts are also equal across groups (needed before comparing *mean scores* across groups — this is the level required before ever saying, e.g., "group X scores higher on RST than group Y" in any resource, marketing material, or internal report).

**If scalar invariance fails for a given group comparison:** mean-score comparisons across those specific groups must not be made or published until the specific non-invariant items are identified and revised — this is the direct, load-bearing safeguard against the instrument producing misleading between-group claims, and should be treated as a hard gate, not a nice-to-have.

### 11.6 Construct Validity

**Convergent validity:** correlate each domain against an existing, independently-validated measure of a related construct (e.g., IHOR against an established intellectual-humility scale, RST against an established resilience/coping scale, CSR against a Big-Five conscientiousness measure) — moderate-to-strong correlations (commonly cited rough benchmark: r ≥ 0.40–0.50) support convergent validity. Selection of specific comparison instruments is a licensing/access decision to make at validation-study design time, not specified here.

**Discriminant validity:** confirm domains that are conceptually distinct (e.g., SAR and ECPC) don't correlate so highly with each other that they're empirically indistinguishable — a common quantitative check is the Fornell-Larcker criterion (a domain's own average variance extracted should exceed its squared correlation with every other domain).

### 11.7 Criterion & Predictive Validity

**Criterion validity (concurrent):** correlate scores against a *present-moment* external criterion — e.g., current GPA in science coursework, current standardized-test performance, or faculty/mentor ratings of a respondent's demonstrated (not self-reported) evidence-appraisal or communication skill, collected around the same time as the assessment.

**Predictive validity (longitudinal):** the more scientifically meaningful — and more expensive — test: does the score predict a *future* outcome? Candidate outcomes, tracked over a multi-year follow-up: medical school GPA, clinical clerkship evaluations, USMLE-style exam performance, self-reported burnout/wellbeing at defined checkpoints, or attrition. This requires a genuine longitudinal cohort and years of follow-up — realistically the last analysis in this list to become feasible, and the single most important one for ever making any claim stronger than "this reflects how you currently see yourself."

**A note on interpretation, carried over from Part 1 §1.3:** even strong predictive validity findings would only ever support probabilistic, population-level statements ("respondents scoring X tend to also score Y on outcome Z"), never individual-level predictions suitable for a consequential decision about one specific person — this is a general property of predictive-validity research, not a limitation unique to this instrument, but worth restating given how easily "validated" gets misread as "individually predictive" in less careful public communication.

### 11.8 Known-Group Validity

A lighter-weight validity check available earlier than full predictive validity: does the instrument distinguish between groups already known (on independent grounds) to differ on the relevant construct? Example candidate comparisons: RST scores between respondents who self-report an active, regular coping practice (e.g., established mindfulness/exercise routine) versus those who don't; ERP scores between respondents with and without prior formal ethics-case-discussion coursework. Statistically significant, direction-consistent differences (t-tests or ANOVA across the known groups) provide reasonably quick, low-cost supporting evidence, though weaker than convergent or predictive validity on their own.

### 11.9 Differential Item Functioning (DIF)

**Purpose:** item-level companion to §11.5's scale-level measurement invariance — tests whether a *specific item* behaves differently for respondents at the same underlying trait level but different group membership (e.g., an item that's systematically harder to endorse for one gender even after controlling for true domain standing).

**Method:** logistic-regression-based or IRT-based DIF detection (e.g., comparing item parameters across groups within the GRM/NRM framework from §11.4, or a Mantel-Haenszel approach for a simpler first pass), run for the same group comparisons as §11.5.

**Priority items to check first:** the scenario items are the highest-priority DIF candidates, since their real-world framing (a study group, a friend's advice, a family member's health claim) is more likely to carry unintentional cultural or socioeconomic assumptions than the more abstract Likert core items — worth explicit qualitative expert review *before* the first data collection, not only statistical DIF testing after the fact.

### 11.10 Recommended Sample Sizes

| Analysis | Recommended minimum N | Rationale |
|---|---|---|
| Cronbach's alpha / omega (per domain) | 200 | Conventional rough floor for stable reliability estimation on a 12-item scale; below this, confidence intervals around alpha are too wide to be useful. |
| EFA (full 96-item domain-scored set) | 500 (≥5 respondents per item, conservative end of common EFA sample-size heuristics) | EFA sample-size heuristics vary widely in the literature; 5:1 respondent-to-item ratio is a commonly cited conservative floor for a scale this size. |
| CFA (confirming the 8-factor model) | 300, on an independent sample from the EFA sample | Standard practice to avoid capitalizing on EFA-sample-specific quirks; 300 is a common rough floor for CFA models of this complexity (8 factors, 96 indicators). |
| IRT/GRM item calibration | 500 per item-response category combination is the traditionally cited (conservative) figure for stable polytomous IRT parameter estimation; more realistically for a scale this length, 500–1000 total respondents with reasonable response-category spread is a workable starting target. | Polytomous IRT models have more parameters per item than binary IRT, needing more data per item than a simpler alpha/CFA analysis. |
| Measurement invariance / DIF (per group comparison) | 200 per group, minimum | Below this, group-specific parameter estimates become too unstable to distinguish genuine non-invariance from sampling noise. |
| Known-group validity | 50 per group, minimum (100+ preferred) | Lower bar than the psychometric-modeling analyses above, since this is a simpler between-group comparison, not a parameter-estimation task. |
| Predictive validity (longitudinal) | 300+ at baseline, with attrition-adjusted follow-up sample size depending on the outcome's event rate (e.g., attrition/burnout outcomes need larger baseline N to yield enough observed events) | Longitudinal designs lose power to both dropout and (for rare outcomes) low base rates; 300 is a starting point, not a guarantee of adequate power for every candidate outcome in §11.7. |

**Sequencing recommendation:** reliability (§11.2) and EFA (§11.3) first, since they're achievable with the smallest, earliest dataset and directly inform whether the 8-domain structure itself needs revision before investing in the larger, more expensive analyses (CFA, IRT, invariance, predictive validity) on a structure that might still change.

### 11.11 What Changes in the Spec Once Real Data Exists

A concrete checklist for a future revision of Parts 1–6, once §11.2–11.10 produce real numbers:

- Replace every `difficulty_estimate` / `discrimination_estimate` / `estimate_status: PLACEHOLDER_PENDING_VALIDATION` in `questions.json` (Part 6 §9.2) with real IRT-derived values; remove the placeholder tag.
- Revisit Part 1 §2.9's near-uniform domain weights (0.09–0.14) in light of any predictive-validity findings — if some domains turn out to matter more for real outcomes, weights should shift to reflect that, with the specific empirical basis documented at that time.
- Revisit the 8-domain / 3-cluster structure itself if EFA/CFA suggest a different factor structure fits better (§11.3).
- Revisit or retire any items flagged by DIF (§11.9) as behaving inconsistently across groups.
- Only after scalar measurement invariance (§11.5) is established for a given group comparison: permit between-group score comparisons in any user-facing or internal material.
- Only after meaningful predictive-validity evidence (§11.7): consider (carefully, and probably still not before further ethical review) whether any softened, population-level predictive language belongs in report fragments (Part 4) — and even then, never individual-level predictive claims, per §11.7's closing note.

---

## What's next

Part 8 will close out the series with the Appendices (Section 12): a consolidated scoring table, developer implementation table, the full Question ID / Domain ID / Profile ID indexes, consolidated weight/rule/decision tables (cross-referenced rather than re-derived), text-form flowcharts of the full pipeline, a suggested database schema, and API endpoint suggestions.

---

# Technical Specification — Part 8 of 8: Appendices

Builds on Parts 1–7. This part consolidates reference materials, indexes, tables, flowcharts, and implementation guidance drawn from across the entire specification series. Nothing in this appendix introduces new requirements — it exists to make the specification easier to navigate, implement, and test.

---

## 12. Appendices

### 12.1 Consolidated Scoring Table

This table summarizes every domain's weight, item count, effective scoring weight, and interpretation bands in one place for quick reference.

| # | Domain | Code | Weight | Items (domain-scored) | Effective Weight | Bands (0–100) |
|---|---|---|---|---|---|---|
| 1 | Scientific & Analytical Reasoning | SAR | 0.14 | 12 (8 core + 2 aux + 2 scenario) | 12.0 | Emerging (0–24), Developing (25–49), Established (50–74), Strong (75–100) |
| 2 | Evidence Literacy & Critical Appraisal | ELCA | 0.14 | 12 | 12.0 | Same |
| 3 | Intellectual Humility & Openness to Revision | IHOR | 0.13 | 12 | 12.0 | Same |
| 4 | Ambiguity Tolerance & Uncertainty Management | AMB | 0.13 | 12 | 12.0 | Same |
| 5 | Empathic Communication & Patient-Centeredness | ECPC | 0.14 | 12 | 12.0 | Same |
| 6 | Ethical Reasoning & Professionalism | ERP | 0.13 | 12 | 12.0 | Same |
| 7 | Conscientiousness & Self-Regulation | CSR | 0.10 | 12 | 12.0 | Same (plus an additional 90–100 "Very Strong" band for report-fragment purposes, see Part 4 §6.1.7) |
| 8 | Resilience & Stress Tolerance | RST | 0.09 | 12 | 12.0 | Same |
| **Total** | | | **1.00** | **96** | **96.0** | |

**Notes:**
- Each domain has 13 items total (8 core + 3 auxiliary + 2 scenario), but the `*-A03` auxiliary item in each domain is excluded from the domain's raw score and routed exclusively to the Social Desirability Index, hence the "12 domain-scored items" column.
- Effective weight = `(8 × 1.0) + (2 × 0.5) + (2 × 1.5) = 12.0` per domain, using the item-weight convention from Part 2: core=1.0, auxiliary (non-SD)=0.5, scenario=1.5.
- Domain weights sum to 1.00, as established in Part 1 §2.9.

---

### 12.2 Developer Implementation Table

This table maps each major section of the specification to the concrete data structure or code module that must implement it, organized by the developer's likely implementation order.

| Specification Section | Implementation Artifact | File(s) | Notes |
|---|---|---|---|
| Part 1 §1 (Architecture), §2 (Domains) | Domain definitions | `domains.json` | Static metadata: 8 domains, weights, bands, cluster assignments |
| Part 2 (Question Bank) | Question definitions | `questions.json` | 104 items with full metadata, per-item weights, and placeholder psychometrics |
| Part 3 §4 (Answer Mapping), §5 (Scoring Algorithm) | Scoring engine | `scoring.py` / `scoring.js` / etc. | The core deterministic algorithm: contribution scores → domain scores → confidence → interaction flags. The pseudocode in Part 3 §5.13 is the authoritative reference; JSON examples in §5.14 define expected I/O shape. |
| Part 3 §4.3 (Interaction Rules), §5.9 (Social Desirability), §5.12 (Safety Gate) | Rules engine | `rules.json` + code implementing conditions | Interaction rules, SD-index computation, and the safety-gate halt condition |
| Part 4 (Report Generation) | Report engine | `reports.json` + report assembly code | Fragment lookup, assembly logic, safety-gate response content, confidence-caveat attachment |
| Part 5 (Profile System & Outcome Matrix) | Profile engine | `profiles.json` + profile assignment code | 24-profile catalog, tiering, fit-score computation, and `PROF-21` special-case logic |
| Part 6 §9 (Data Structures), §10 (Validation) | Input validation layer | `validation.json` + validation code | Structural checks, data-quality flags, error-code handling, runs before scoring |
| Part 7 (Validation Roadmap) | Validation study design | (separate research protocol document) | Not an implementation artifact — a research plan to execute after v1 ships |

**Implementation dependency graph:**
```
validation.json → answers.json → scoring engine (weights.json + rules.json + questions.json + domains.json)
                                   ↓
                              ScoringResult
                                   ↓
                 ┌─────────────────┼─────────────────┐
                 ↓                 ↓                 ↓
         report engine      profile engine      (profile assignment)
         (reports.json)     (profiles.json)
                 ↓                 ↓
              assembled final report (JSON) → UI rendering
```

---

### 12.3 Full Question ID Index

All 104 question IDs, organized by domain and item type. This index serves as a quick lookup for developers implementing the scoring pipeline or debugging a specific item.

#### SAR (Scientific & Analytical Reasoning)
| Type | IDs |
|---|---|
| Core | SAR-C01, SAR-C02, SAR-C03, SAR-C04, SAR-C05, SAR-C06, SAR-C07, SAR-C08 |
| Auxiliary | SAR-A01, SAR-A02, SAR-A03 |
| Scenario | SAR-S01, SAR-S02 |

#### ELCA (Evidence Literacy & Critical Appraisal)
| Type | IDs |
|---|---|
| Core | ELCA-C01, ELCA-C02, ELCA-C03, ELCA-C04, ELCA-C05, ELCA-C06, ELCA-C07, ELCA-C08 |
| Auxiliary | ELCA-A01, ELCA-A02, ELCA-A03 |
| Scenario | ELCA-S01, ELCA-S02 |

#### IHOR (Intellectual Humility & Openness to Revision)
| Type | IDs |
|---|---|
| Core | IHOR-C01, IHOR-C02, IHOR-C03, IHOR-C04, IHOR-C05, IHOR-C06, IHOR-C07, IHOR-C08 |
| Auxiliary | IHOR-A01, IHOR-A02, IHOR-A03 |
| Scenario | IHOR-S01, IHOR-S02 |

#### AMB (Ambiguity Tolerance & Uncertainty Management)
| Type | IDs |
|---|---|
| Core | AMB-C01, AMB-C02, AMB-C03, AMB-C04, AMB-C05, AMB-C06, AMB-C07, AMB-C08 |
| Auxiliary | AMB-A01, AMB-A02, AMB-A03 |
| Scenario | AMB-S01, AMB-S02 |

#### ECPC (Empathic Communication & Patient-Centeredness)
| Type | IDs |
|---|---|
| Core | ECPC-C01, ECPC-C02, ECPC-C03, ECPC-C04, ECPC-C05, ECPC-C06, ECPC-C07, ECPC-C08 |
| Auxiliary | ECPC-A01, ECPC-A02, ECPC-A03 |
| Scenario | ECPC-S01, ECPC-S02 |

#### ERP (Ethical Reasoning & Professionalism)
| Type | IDs |
|---|---|
| Core | ERP-C01, ERP-C02, ERP-C03, ERP-C04, ERP-C05, ERP-C06, ERP-C07, ERP-C08 |
| Auxiliary | ERP-A01, ERP-A02, ERP-A03 |
| Scenario | ERP-S01, ERP-S02 |

#### CSR (Conscientiousness & Self-Regulation)
| Type | IDs |
|---|---|
| Core | CSR-C01, CSR-C02, CSR-C03, CSR-C04, CSR-C05, CSR-C06, CSR-C07, CSR-C08 |
| Auxiliary | CSR-A01, CSR-A02, CSR-A03 |
| Scenario | CSR-S01, CSR-S02 |

#### RST (Resilience & Stress Tolerance)
| Type | IDs |
|---|---|
| Core | RST-C01, RST-C02, RST-C03, RST-C04, RST-C05, RST-C06, RST-C07, RST-C08 |
| Auxiliary | RST-A01, RST-A02, RST-A03 |
| Scenario | RST-S01, RST-S02 |

---

### 12.4 Full Profile ID Index

All 24 profile IDs, with their required tiers, excluded conditions, and descriptions (abbreviated from Part 5 §7.2 for quick reference).

| # | ID | Name | Required | Excluded | Description (abbreviated) |
|---|---|---|---|---|---|
| 1 | PROF-01 | Analytical Scientist | SAR=High, ELCA=High | ECPC=Low | Structured, evidence-first reasoning with technical vocabulary |
| 2 | PROF-02 | Evidence-Oriented Thinker | ELCA=High, IHOR=High | — | Combines evidence literacy with openness to revision |
| 3 | PROF-03 | Methodical Researcher | CSR=High, SAR=High, ELCA=High | RST=Low | Rigorous reasoning with strong follow-through |
| 4 | PROF-04 | Curious Skeptic | SAR=High, ELCA=Low | — | Analytical instinct, evidence vocabulary still developing |
| 5 | PROF-05 | Structured Innovator | CSR=High, SAR=High, AMB=Low | — | Organized, analytical thinking with plan preference |
| 6 | PROF-06 | Data-Driven Communicator | SAR=High, ELCA=High, ECPC=High | — | Technical rigor *and* translation ability |
| 7 | PROF-07 | Independent-Minded Reasoner | SAR=High, ERP=Moderate | IHOR=Low | Confident reasoning, benefits from outside checks |
| 8 | PROF-08 | Compassionate Communicator | ECPC=High, ERP=High | — | Prioritizes human side — listening, honesty, patient-centeredness |
| 9 | PROF-09 | Adaptive Clinician | AMB=High, IHOR=High, ECPC=High | — | Comfortable with uncertainty, open, attentive |
| 10 | PROF-10 | Reflective Practitioner | IHOR=High, ERP=High | — | Openness to being wrong + strong ethical reasoning |
| 11 | PROF-11 | Empathic Realist | ECPC=High, AMB=High | — | Sits with emotional complexity and factual uncertainty |
| 12 | PROF-12 | Patient Advocate | ECPC=High, ERP=High, AMB=High | — | Person-centered, ethically grounded comfort with uncertainty |
| 13 | PROF-13 | Principled Skeptic | SAR=High, ERP=High, IHOR=High | — | Rigorous reasoning, ethical standards, open to correction |
| 14 | PROF-14 | Rigorous Humanist | SAR=High, ECPC=High | — | Counter-profile to EC-01; requires both SAR and ECPC High |
| 15 | PROF-15 | Calm Communicator | ECPC=High, RST=High | — | Composed and attentive even under stress |
| 16 | PROF-16 | Resilient Learner | RST=High, CSR=High | — | Strong follow-through + strong recovery |
| 17 | PROF-17 | Steady Under Pressure | RST=High, AMB=High | — | Tolerates emotional strain and informational uncertainty |
| 18 | PROF-18 | Growth-Minded Trainee | IHOR=High, RST=High | — | Recovers well and treats setbacks as learning |
| 19 | PROF-19 | Steady Ethical Anchor | ERP=High, RST=High, CSR=High | — | Consistency under pressure, with ERP confidence caveat |
| 20 | PROF-20 | Detail-Oriented Planner | CSR=High, AMB=Low | — | Thrives with structure; unclear situations are a growth edge |
| 21 | PROF-21 | Balanced Generalist | Special rule (§8.2) | — | No domain clearly high or low — broad, even development |
| 22 | PROF-22 | Emerging Clinician-in-Training | ELCA=Low, CSR=Moderate\|High | SAR=Low AND IHOR=Low | Early-stage, general engagement without EBM-specific vocabulary yet |
| 23 | PROF-23 | High-Achieving Planner | CSR≥90 (raw, not tier) | — | Keys directly off PC-01 threshold (CSR≥90) |
| 24 | PROF-24 | Sustainable Achiever | CSR=High, RST=High, IHOR=High | — | Constructive counter-pattern to CR-02 overextension risk |

---

### 12.5 Consolidated Weight & Rule Tables

#### Domain Weights (from Part 1 §2.9)

| # | Domain | Code | Weight | Cluster |
|---|---|---|---|---|
| 1 | Scientific & Analytical Reasoning | SAR | 0.14 | Cognitive |
| 2 | Evidence Literacy & Critical Appraisal | ELCA | 0.14 | Cognitive |
| 3 | Intellectual Humility & Openness to Revision | IHOR | 0.13 | Cognitive |
| 4 | Ambiguity Tolerance & Uncertainty Management | AMB | 0.13 | Interpersonal/Professional |
| 5 | Empathic Communication & Patient-Centeredness | ECPC | 0.14 | Interpersonal/Professional |
| 6 | Ethical Reasoning & Professionalism | ERP | 0.13 | Interpersonal/Professional |
| 7 | Conscientiousness & Self-Regulation | CSR | 0.10 | Self-Regulation |
| 8 | Resilience & Stress Tolerance | RST | 0.09 | Self-Regulation |
| **Total** | | | **1.00** | |

#### Item Weight Convention (from Part 2 §3.0)

| Item Type | Weight | Count per Domain | Contribution |
|---|---|---|---|
| Core | 1.0 | 8 | 8.0 |
| Auxiliary (non-SD) | 0.5 | 2 | 1.0 |
| Auxiliary (SD-detector) | 0.5 | 1 | Excluded from domain score; routed to SD index |
| Scenario | 1.5 | 2 | 3.0 |
| **Total (domain-scored)** | | **12** | **12.0** |

#### Interaction Rules (from Part 3 §4.3)

| Rule ID | Condition | Effect |
|---|---|---|
| AR-03 | SAR ≥ 70 AND AMB ≤ 40 | Report flag: needs_certainty_before_acting (RPT-AR03) |
| AR-03b | AMB ≤ 40 AND CSR ≥ 70 | Report flag: checks_and_rechecks_pattern (RPT-AR03B) |
| IH-01 | SAR ≥ 70 AND IHOR ≤ 40 | Report flag: confident_reasoner_resists_correction (RPT-IH01) |
| CR-02 | CSR ≥ 80 AND RST ≤ 40 | Report flag: overextension_risk (RPT-CR02) |
| EC-01 | SAR ≥ 70 AND ECPC ≤ 40 | Report flag: technical_orientation (RPT-EC01) |
| CM-04 | RST ≤ 40 AND ERP ≥ 80 | Confidence-only modifier: ERP confidence −15 |
| PC-01 | CSR ≥ 90 | Report flag: possible_perfectionism (RPT-PC01) |
| OA-01 | SAR ≥ 90 | Report flag: possible_over_analysis (RPT-OA01) |

#### Confidence Modifiers (from Part 3 §4.4)

| Modifier ID | Condition | Delta | Target |
|---|---|---|---|
| CM-01 | SD_index ≥ 3 | −20 | Global |
| CM-02 | Missing data rate > 10% | −10 | Global |
| CM-03 | Any straight-line flag | −25 | Global |
| CM-consistency | min(consistency_flags, 4) | −5 per unit | Global |
| CM-04 | RST ≤ 40 AND ERP ≥ 80 | −15 | ERP only |

#### Profile Tier Thresholds (from Part 5 §7.1)

| Tier | Score range | Description |
|---|---|---|
| High | ≥ 65 | Clearly above average |
| Moderate | 35–64 | The broad middle |
| Low | < 35 | Clearly below average |

#### Report Band Thresholds (from Part 1 §2)

| Band | Score range | Description |
|---|---|---|
| Emerging | 0–24 | Early stage, room for development |
| Developing | 25–49 | Inconsistent use, situational |
| Established | 50–74 | Generally solid |
| Strong | 75–100 | Consistently strong |
| *(CSR only)* Very Strong | 90–100 | Extremely high; perfectionism shadow-side note applies |

---

### 12.6 Pipeline Flowchart (Text Format)

This flowchart is rendered as ASCII text rather than an image, per the "everything in plain text" requirement of the specification series. It shows the complete data flow from raw submission to final report.

```
[1] Raw HTTP Submission (answers.json)
    │
    ▼
[2] Input Validation Layer (Part 6 §10)
    │   ├─ Structural validation (reject on: unknown IDs, invalid values, 
    │   │                   invalid timestamps, missing consent/age)
    │   ├─ Data-quality validation (flags only, never rejects):
    │   │   ├─ Random answering detection
    │   │   ├─ Response-time anomaly detection
    │   │   └─ Straight-line detection (also Part 3 §5.7)
    │   └─ Missing-data rate computed (passed to scoring)
    │
    ▼
[3] Safety Gate (Part 3 §5.12)
    │   ├─ Check RST-S02 == 3 AND (2+ of RST-C03/C05/C08 ≤ 2)
    │   └─ IF TRIGGERED: HALT → return safety resources screen (Part 4 §6.4)
    │
    ▼
[4] Scoring Engine (Part 3 §5)
    │   ├─ Compute per-item contribution_score (reverse-score logic)
    │   ├─ Apply missing-data handling (Tier 1/2/3 per §5.5)
    │   ├─ Compute per-domain raw weighted score (Part 3 §5.1-5.2)
    │   ├─ Normalize to 0–100 (Part 3 §5.3)
    │   ├─ Run validity checks:
    │   │   ├─ Consistency-pair divergence (§5.6)
    │   │   ├─ Contradiction detection (§5.8)
    │   │   └─ Social Desirability Index (§5.9)
    │   ├─ Compute confidence ratings (global + ERP-specific) (§5.10)
    │   └─ Evaluate interaction rules against final domain scores (§4.3)
    │
    ▼
[5] Profile Assignment (Part 5 §8)
    │   ├─ Convert each domain score to tier (High/Moderate/Low)
    │   ├─ For each profile in priority order (PROF-01..PROF-24):
    │   │   ├─ Check excluded conditions (if any)
    │   │   ├─ Check required tiers (ALL must match)
    │   │   ├─ Compute fitScore = number of required domains matched
    │   │   └─ Apply special-case rules (PROF-21, PROF-23)
    │   ├─ Sort candidates by fitScore DESC, priority_order ASC
    │   └─ Return highest-scoring profile (or PROF-21 fallback)
    │
    ▼
[6] Report Assembly (Part 4 §6.3)
    │   ├─ For each domain: lookup fragment by score band from reports.json
    │   ├─ Attach confidence caveats where needed (ERP, contradictions)
    │   ├─ Append interaction blocks for any fired rules
    │   ├─ Append data-quality caveats (SD, consistency, straight-line)
    │   ├─ Append profile assignment block (or suppression note)
    │   └─ Add footer (non-admissions, non-diagnostic notices)
    │
    ▼
[7] Final Report (JSON + rendered UI)
```

---

### 12.7 Suggested Database Schema

This is a **suggested schema** for storing respondents, sessions, answers, and results in a relational database. It is not mandatory — the specification is storage-agnostic — but it provides a concrete starting point for implementers who prefer a relational model.

```sql
-- Core tables

CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE NOT NULL,  -- opaque, non-PII
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(64) UNIQUE NOT NULL,
    respondent_id UUID NOT NULL REFERENCES respondents(id),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    locale VARCHAR(10) DEFAULT 'en-US',
    consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    age_bracket_confirmed_16_plus BOOLEAN NOT NULL DEFAULT FALSE,
    is_incomplete BOOLEAN DEFAULT FALSE,
    safety_gate_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assessment_answers (
    session_id UUID NOT NULL REFERENCES assessment_sessions(id),
    question_id VARCHAR(20) NOT NULL,         -- e.g., "SAR-C01"
    raw_value TEXT NOT NULL,                  -- "4" or "B"
    responded_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (session_id, question_id)
);

CREATE TABLE assessment_results (
    session_id UUID PRIMARY KEY REFERENCES assessment_sessions(id),
    scoring_result JSONB NOT NULL,            -- Full ScoringResult object (Part 3 §5.14)
    domain_scores JSONB NOT NULL,             -- { "SAR": 72.5, ... }
    global_confidence INT NOT NULL,           -- 0–100
    erp_confidence INT,                       -- 0–100, null if same as global
    assigned_profile_id VARCHAR(10),          -- e.g., "PROF-01", null if suppressed or no match
    profile_fit_confidence VARCHAR(50),       -- "Strong pattern match", etc.
    interaction_flags JSONB,                  -- ["AR-03", "EC-01", ...]
    data_quality_flags JSONB,                 -- ["STRAIGHT_LINE", "RANDOM_ANSWERING(SAR)", ...]
    report_json JSONB NOT NULL,               -- Full assembled report object
    report_html TEXT,                         -- Rendered HTML (optional cache)
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit / debug tables (optional)

CREATE TABLE validation_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id),
    error_code VARCHAR(50) NOT NULL,          -- "ERR_UNKNOWN_QUESTION_ID", etc.
    error_detail JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scoring_debug_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id),
    step VARCHAR(50) NOT NULL,                -- "safety_gate", "domain_aggregation", etc.
    debug_data JSONB,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries

CREATE INDEX idx_sessions_respondent ON assessment_sessions(respondent_id);
CREATE INDEX idx_sessions_completed_at ON assessment_sessions(completed_at);
CREATE INDEX idx_results_assigned_profile ON assessment_results(assigned_profile_id);
CREATE INDEX idx_results_generated_at ON assessment_results(generated_at);
```

---

### 12.8 Suggested API Endpoints

This is a **suggested API design**, not a required implementation. It reflects the logical operations implied by the specification in a RESTful style.

#### Assessment Lifecycle

| Method | Endpoint | Purpose | Request Body | Response |
|---|---|---|---|---|
| POST | `/api/v1/sessions` | Start a new assessment session | `{ "respondent_id": "r_8f2a1c", "locale": "en-US" }` | `{ "session_id": "sess_abc123", "questions": [ ... ], "started_at": "..." }` |
| PUT | `/api/v1/sessions/{session_id}/answers` | Submit (or update) answers | `{ "answers": { "SAR-C01": 4, ... }, "item_timestamps": { "SAR-C01": "2026-07-13T14:02:05Z", ... } }` | `{ "session_id": "...", "completed_count": 45, "total_count": 104, "missing_count": 59 }` |
| POST | `/api/v1/sessions/{session_id}/complete` | Finish the assessment and get results | (empty, or `{ "force_complete": true }` to override missing-data thresholds) | `{ "session_id": "...", "report": { ... } }` |
| GET | `/api/v1/sessions/{session_id}/report` | Retrieve the generated report | (none) | `{ "session_id": "...", "generated_at": "...", "report": { ... } }` |

#### Administrative / Debug

| Method | Endpoint | Purpose | Response |
|---|---|---|---|
| GET | `/api/v1/admin/validation-rules` | Retrieve active validation rules (from `validation.json`) | The full `validation.json` object |
| GET | `/api/v1/admin/questions` | Retrieve the question bank (from `questions.json`) | The full `questions.json` object |
| GET | `/api/v1/admin/profiles` | Retrieve the profile catalog (from `profiles.json`) | The full `profiles.json` object |
| GET | `/api/v1/admin/sessions/{session_id}/scoring-debug` | Retrieve debug logs for a specific session | `{ "session_id": "...", "steps": [ ... ] }` |

#### Error Responses (consistent with Part 6 §10.7)

All error responses follow a consistent shape:

```json
{
  "error_code": "ERR_UNKNOWN_QUESTION_ID",
  "message": "Submission contains a question_id not present in questions.json",
  "details": {
    "unknown_ids": ["SAR-X99"]
  }
}
```

---

### 12.9 Testing Checklist

A concise checklist for developers implementing the specification, organized by testing level.

#### Unit Tests (Scoring Engine)

- [ ] Reverse-scoring logic: verify `contribution_score = 6 - raw_value` for all reverse-keyed items
- [ ] Missing-data handling: Tier 1 (≤2 missing in domain, excluded), Tier 2 (3+ missing, `insufficient_data`), Tier 3 (>25% overall, `incomplete`)
- [ ] Normalization formula: `(weighted_mean - 1) / 4 × 100`, rounded to 1 decimal
- [ ] Consistency-pair detection: divergence ≥ 3 flags inconsistency
- [ ] Straight-line detection: 10+ consecutive identical raw values flags
- [ ] Contradiction detection: |core_mean - scenario_mean| ≥ 2.5 flags domain contradiction
- [ ] Social Desirability Index: counts `*-A03` items with raw ≥ 4, ERP-A03 weighted 1.5
- [ ] Confidence calculation: all modifiers apply correctly, clamp to 0–100
- [ ] Safety gate: RST-S02 == 3 AND 2+ of RST-C03/C05/C08 ≤ 2 → halt → resources screen
- [ ] Interaction rules: all 8 rules (AR-03, AR-03b, IH-01, CR-02, EC-01, CM-04, PC-01, OA-01) evaluate correctly
- [ ] Profile assignment: all 24 profiles match correctly, priority order respected, PROF-21 special-case works, fallback behavior correct
- [ ] `suppress_profile_assignment`: SD_index ≥ 5.5 → no profile assigned

#### Integration Tests

- [ ] Full end-to-end: raw submission → validation → scoring → report → profile → final JSON
- [ ] Partial submission: missing data handled correctly at all tiers
- [ ] Duplicate session detection: resubmission rejected with ERR_DUPLICATE_SESSION
- [ ] Consent/age rejection: `consent_confirmed: false` or `age_bracket_confirmed_16_plus: false` → rejected with appropriate error code
- [ ] Safety gate route: triggering condition returns resources screen, not a scored report

#### Data Quality Tests

- [ ] Random answering detection: variance ≥ 2.5 with ≥8 items per domain → flagged
- [ ] Response-time anomaly: total <8 min OR >15 items under 2 sec → flagged
- [ ] Straight-line: 10+ consecutive identical raw values → flagged

---

### 12.10 Glossary

A quick-reference glossary of terms used throughout the specification.

| Term | Definition |
|---|---|
| **Auxiliary item** | One of 3 items per domain (weight 0.5) that primarily exists for validity/consistency detection rather than score contribution; the `*-A03` item in each domain is excluded from domain score entirely and routed to the SD index. |
| **Band** | One of the 4 score ranges per domain (Emerging/Developing/Established/Strong), used for report fragment selection and interpretation. |
| **Confidence rating** | A 0–100 score indicating the estimated reliability of a respondent's results, based on data-quality flags (missing data, straight-lining, SD index, consistency flags). |
| **Consistency pair** | A pair of conceptually related items (one forward-keyed, one reverse-keyed) expected to move together after reversal; divergence ≥ 3 flags inconsistency. |
| **Contribution score** | The per-item numeric value (1–5) that enters the domain raw-score sum, after applying reverse-scoring if applicable. |
| **Core item** | One of 8 items per domain (weight 1.0) that are the primary construct-measuring items. |
| **Domain** | One of 8 broad constructs measured by the assessment (SAR, ELCA, IHOR, AMB, ECPC, ERP, CSR, RST). |
| **Fit score** | The number of required domains a profile matches; used to rank candidate profiles for assignment. |
| **Interaction rule** | A deterministic rule that fires when specific domain score thresholds are met, adding a report flag or confidence modifier. |
| **Item** | A single question in the assessment, including its text, response options, and metadata. |
| **Item weight** | The numeric weight applied to an item's contribution score when computing a domain's raw sum (core=1.0, auxiliary=0.5, scenario=1.5). |
| **Profile** | A named combination of required domain tiers (High/Moderate/Low) used to summarize a respondent's pattern of scores. |
| **Safety gate** | A hard halt condition triggered by specific responses on RST items, routing the respondent to a crisis-resources screen rather than a scored report. |
| **Scenario item** | One of 2 items per domain (weight 1.5) using a single-select situational story rather than a direct Likert self-statement, designed to resist social-desirability distortion. |
| **SD index** | Social Desirability Index: a count of `*-A03` items endorsed at or above "Neither Agree," with ERP-A03 weighted 1.5; used to adjust confidence and potentially suppress profile assignment. |
| **Tier** | A coarse 3-level categorization of a domain score (High ≥65, Moderate 35–64, Low <35), used for profile matching. |

---

## End of Technical Specification — Part 8 of 8

This concludes the complete Evidence Based Medicine Readiness Assessment technical specification series (Parts 1–8). All requirements, algorithms, data structures, validation rules, report fragments, profile definitions, and validation roadmap are now fully specified in deterministic, implementable detail.

**Summary of deliverables across all 8 parts:**

| Part | Title | Key Contents |
|---|---|---|
| 1 | Assessment Architecture & Domain Specification | Architecture, 8 domains, weights, evidence rationale, intended use, exclusions |
| 2 | Complete Question Bank | 104 items (13 per domain), full metadata, response types, scoring per option |
| 3 | Answer Mapping & Scoring Algorithm | Contribution scores, normalization, consistency checks, SD index, confidence, interaction rules, safety gate, full pseudocode |
| 4 | Report Generation Engine | Fragment banks, assembly logic, safety-gate response, report footer |
| 5 | Personality/Profile System & Outcome Matrix | 24 profiles, tier system, fit-score algorithm, assignment logic, JSON schemas |
| 6 | Developer Data Structures & Validation Rules | `domains.json`, `questions.json`, `answers.json`, `rules.json`, `validation.json`, input-validation layer |
| 7 | Future Scientific Validation | Cronbach's alpha, omega, EFA, CFA, IRT, measurement invariance, construct/criterion/predictive/known-group validity, DIF, sample sizes, validation roadmap |
| 8 | Appendices | Consolidated tables, indexes, flowcharts, database schema, API suggestions, testing checklist, glossary |

---

*End of Evidence Based Medicine Readiness Assessment Technical Specification Series.*
