// ─────────────────────────────────────────────────────────────
// DocumentationView — full technical documentation derived from
// ebmraspec.md (Parts 1–4). Covers architecture, domains, scoring
// algorithm, report engine, scientific limitations, and privacy.
// ─────────────────────────────────────────────────────────────

import PageShell from '../components/layout/PageShell'
import styles from './DocumentationView.module.css'

// ── Data ──────────────────────────────────────────────────────

const DOMAINS = [
  {
    code: 'SAR',
    name: 'Scientific & Analytical Reasoning',
    cluster: 'Cognitive & Analytical Habits',
    weight: '0.14',
    desc:
      'Preference for systematic, evidence-weighing reasoning over snap judgment; comfort with probabilistic thinking. Relevant to diagnostic reasoning, interpreting test sensitivity/specificity, and evaluating study applicability.',
  },
  {
    code: 'ELCA',
    name: 'Evidence Literacy & Critical Appraisal',
    cluster: 'Cognitive & Analytical Habits',
    weight: '0.14',
    desc:
      'Self-assessed literacy with research-evidence concepts: study designs, statistical basics, source credibility judgment. Core to reading clinical trials, evaluating new guidelines, and resisting anecdote-driven practice.',
  },
  {
    code: 'IHOR',
    name: 'Intellectual Humility & Openness to Revision',
    cluster: 'Cognitive & Analytical Habits',
    weight: '0.13',
    desc:
      'Self-reported openness to revising views, tolerance for being shown wrong, active-open-mindedness. Protective against diagnostic anchoring, premature closure, and confirmation-bias-driven errors.',
  },
  {
    code: 'AMB',
    name: 'Ambiguity Tolerance & Uncertainty Management',
    cluster: 'Interpersonal & Professional Habits',
    weight: '0.13',
    desc:
      'Comfort with incomplete information, willingness to act or appropriately wait without full certainty. Relevant to undifferentiated presentations, communicating uncertain prognoses, and probabilistic guideline-based practice.',
  },
  {
    code: 'ECPC',
    name: 'Empathic Communication & Patient-Centeredness',
    cluster: 'Interpersonal & Professional Habits',
    weight: '0.14',
    desc:
      'Self-reported perspective-taking, active listening, comfort communicating uncertainty and bad news. Directly relevant to history-taking, shared decision-making, and informed-consent conversations.',
  },
  {
    code: 'ERP',
    name: 'Ethical Reasoning & Professionalism',
    cluster: 'Interpersonal & Professional Habits',
    weight: '0.13',
    desc:
      'Self-reported tendencies in ethical decision-making: honesty under social pressure, disclosure of error, conflict-of-interest recognition. Measured primarily through scenario-based (situational) items due to social desirability risk.',
  },
  {
    code: 'CSR',
    name: 'Conscientiousness & Self-Regulation',
    cluster: 'Self-Regulation & Resilience',
    weight: '0.10',
    desc:
      'Self-reported organisation, follow-through, reliability, delay of gratification. Supports rigorous study habits, clinical documentation obligations, and managing the long timelines of medical training.',
  },
  {
    code: 'RST',
    name: 'Resilience & Stress Tolerance',
    cluster: 'Self-Regulation & Resilience',
    weight: '0.09',
    desc:
      'Self-reported recovery from setbacks, coping-strategy repertoire, help-seeking tendency. Emphasises learnable coping strategies over fixed trait affect, relevant to avoiding burnout during demanding training periods.',
  },
]

const SCORE_BANDS = [
  { range: '0–24', label: 'Emerging', className: styles.bandEmerging, desc: 'Foundational growth area; early-stage endorsement of the construct.' },
  { range: '25–49', label: 'Developing', className: styles.bandDeveloping, desc: 'Inconsistent or situational endorsement; a workable foundation to build on.' },
  { range: '50–74', label: 'Established', className: styles.bandEstablished, desc: 'Generally reliable endorsement of the construct; well-suited to current training.' },
  { range: '75–100', label: 'Strong', className: styles.bandStrong, desc: 'Consistently strong endorsement; watch for domain-specific shadow sides where documented.' },
]

const PIPELINE_STEPS = [
  { name: 'Safety gate check', desc: 'Runs first on raw answers before any other step. If the RST-S02 response is option C and two or more of RST-C03, RST-C05, RST-C08 score ≤ 2, the pipeline halts and routes to the support resources screen. This is the only halting condition in the entire pipeline.' },
  { name: 'Contribution scores', desc: 'Every raw LIKERT5 answer (1–5) is converted to a contribution_score. Forward-keyed items: score = raw value. Reverse-keyed items: score = 6 − raw value. Scenario items are scored per-option from a lookup table.' },
  { name: 'Missing-data handling', desc: 'Tier 1 (≤2 missing per domain): excluded from that domain\'s mean, no flag. Tier 2 (3+ missing in a domain): domain marked "insufficient data." Tier 3 (>25% missing overall): no report generated, resume prompt shown.' },
  { name: 'Per-domain raw → weighted score', desc: 'RawSum = Σ(contribution_score × item_weight) for answered, domain-scored items. Core items weight 1.0; auxiliary items 0.5; scenario items 1.5. The SD-detector (*-A03) item in each domain is excluded from domain scoring.' },
  { name: 'Normalisation to 0–100', desc: 'DomainScore = ROUND((WeightedMean − 1) / 4 × 100, 1). This maps the [1, 5] weighted-mean range linearly to [0, 100]. Band boundaries use low ≤ score < high except the top band which is inclusive of 100.' },
  { name: 'Validity checks', desc: 'Consistency pairs (|A − B| ≥ 3 flags the pair), straight-line detection (10+ consecutive identical LIKERT5 raw values), domain contradiction detection (|CoreMean − ScenarioMean| ≥ 2.5), and social desirability index.' },
  { name: 'Confidence rating', desc: 'BaseConfidence starts at 100. Deductions: SD index ≥ 3 (−20), missing rate >10% (−10), any straight-line flag (−25), up to 4 consistency flags (−5 each). ERP receives an additional −15 if RST ≤ 40 and ERP ≥ 80 (CM-04).' },
  { name: 'Interaction rules', desc: 'Eight named cross-domain rules evaluated against final domain scores (AR-03, AR-03b, IH-01, CR-02, EC-01, CM-04, PC-01, OA-01). Rules add report flags only — they never modify numeric domain scores.' },
  { name: 'ScoringResult emission', desc: 'A structured object containing all domain scores, domain flags, consistency/contradiction/SD flags, global confidence, ERP-specific confidence, interaction flags, and profile-suppression boolean, passed to the report engine.' },
]

const INTERACTION_RULES = [
  { id: 'AR-03', condition: 'SAR ≥ 70 AND AMB ≤ 40', effect: '"Wanting certainty before acting" pattern — analytical strength paired with discomfort acting on incomplete information.' },
  { id: 'AR-03b', condition: 'AMB ≤ 40 AND CSR ≥ 70', effect: '"Checking and re-checking before closing" pattern — strong planning instinct paired with ambiguity discomfort.' },
  { id: 'IH-01', condition: 'SAR ≥ 70 AND IHOR ≤ 40', effect: '"Confident reasoning paired with resistance to correction" — a pattern discussed in medical-error literature as relevant to diagnostic overconfidence.' },
  { id: 'CR-02', condition: 'CSR ≥ 80 AND RST ≤ 40', effect: '"Overextension risk" — strong follow-through paired with difficulty recovering from sustained stress; wellbeing-oriented note.' },
  { id: 'EC-01', condition: 'SAR ≥ 70 AND ECPC ≤ 40', effect: '"Technical orientation" — strong analytical habit paired with a more fact-focused communication default; framed as a growth opportunity, never a deficiency.' },
  { id: 'PC-01', condition: 'CSR ≥ 90', effect: '"Possible perfectionism" — extremely high conscientiousness may come with self-imposed pressure not sustainable over a multi-year training arc.' },
  { id: 'OA-01', condition: 'SAR ≥ 90', effect: '"Possible over-analysis" — very high analytical scores can occasionally correlate with decision paralysis on lower-stakes matters.' },
  { id: 'CM-04', condition: 'RST ≤ 40 AND ERP ≥ 80', effect: 'Confidence-only modifier (no report flag): ERP confidence rating reduced by 15 points, reflecting likely social-desirability over-reporting on the ethics domain.' },
]

const VALIDITY_CHECKS = [
  { check: 'Consistency pairs', desc: 'Ten documented A/B item pairs. If |contribution_score(A) − contribution_score(B)| ≥ 3, the pair is flagged INCONSISTENT. Three or more flagged pairs triggers a report-level caution note.', impact: 'Each flagged pair contributes −5 to GlobalConfidence (capped at 4 pairs, max −20).' },
  { check: 'Straight-line detection', desc: 'Any run of 10+ consecutive LIKERT5 items in presentation order with identical raw values (1–5) is flagged. Scenario items are excluded.', impact: '−25 to GlobalConfidence. Report still generated with a data-quality caveat.' },
  { check: 'Domain contradiction', desc: 'For each domain: if |CoreMean − ScenarioMean| ≥ 2.5 (on a 1–5 scale), a domain-level DOMAIN_CONTRADICTION flag is added.', impact: 'Domain-specific caveat sentence in the report. No change to global confidence (avoids double-penalising).' },
  { check: 'Social desirability index', desc: 'Each domain contains one *-A03 item phrased as an absolute claim (e.g. "I have never once made a reasoning error"). Agreeing (raw ≥ 3) with any *-A03 item is a probable over-claim. ERP-A03 is weighted 1.5×.', impact: 'SD index ≥ 3: −20 to GlobalConfidence + caveat. SD index ≥ 5.5: additionally suppresses profile assignment.' },
]

// ── Component ─────────────────────────────────────────────────

export default function DocumentationView() {
  const scrollToSection = (e: any, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <PageShell
      label="Technical Documentation"
      title="EB-MRA Documentation"
    >
      {/* Introductory callout */}
      <div className={styles.introCallout}>
        <p>
          <strong>What you're reading:</strong> This page summarises the complete technical specification
          for the Evidence Based Medicine Readiness Assessment (EB-MRA) — covering instrument design, domain
          definitions, scoring algorithm, report engine, and scientific limitations. The full specifications (architecture, question bank, scoring, and report engine) are
          represented here.
        </p>
      </div>

      {/* Stat cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>104</span>
          <span className={styles.statLabel}>Total items</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>8</span>
          <span className={styles.statLabel}>Domains</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>20–30</span>
          <span className={styles.statLabel}>Minutes to complete</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>0–100</span>
          <span className={styles.statLabel}>Score range per domain</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>4</span>
          <span className={styles.statLabel}>Score bands</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Table of contents ──────────────────────────────── */}
        <nav className={styles.toc} aria-label="Documentation sections">
          <span className={styles.tocTitle}>On this page</span>
          <ol className={styles.tocList}>
            <li className={styles.tocItem}><a href="#part1" onClick={(e) => scrollToSection(e, 'part1')}>Part 1 — Architecture</a></li>
            <li className={styles.tocItemSub}><a href="#goals" onClick={(e) => scrollToSection(e, 'goals')}>Assessment Goals</a></li>
            <li className={styles.tocItemSub}><a href="#philosophy" onClick={(e) => scrollToSection(e, 'philosophy')}>Design Philosophy</a></li>
            <li className={styles.tocItemSub}><a href="#limitations" onClick={(e) => scrollToSection(e, 'limitations')}>Scientific Limitations</a></li>
            <li className={styles.tocItemSub}><a href="#users" onClick={(e) => scrollToSection(e, 'users')}>Intended Users</a></li>
            <li className={styles.tocItemSub}><a href="#exclusions" onClick={(e) => scrollToSection(e, 'exclusions')}>Exclusion Criteria</a></li>
            <li className={styles.tocItem}><a href="#part2" onClick={(e) => scrollToSection(e, 'part2')}>Part 2 — Domains</a></li>
            <li className={styles.tocItemSub}><a href="#domains" onClick={(e) => scrollToSection(e, 'domains')}>All 8 Domains</a></li>
            <li className={styles.tocItemSub}><a href="#item-types" onClick={(e) => scrollToSection(e, 'item-types')}>Item Types</a></li>
            <li className={styles.tocItem}><a href="#part3" onClick={(e) => scrollToSection(e, 'part3')}>Part 3 — Scoring</a></li>
            <li className={styles.tocItemSub}><a href="#pipeline" onClick={(e) => scrollToSection(e, 'pipeline')}>Scoring Pipeline</a></li>
            <li className={styles.tocItemSub}><a href="#bands" onClick={(e) => scrollToSection(e, 'bands')}>Score Bands</a></li>
            <li className={styles.tocItemSub}><a href="#validity" onClick={(e) => scrollToSection(e, 'validity')}>Validity Checks</a></li>
            <li className={styles.tocItemSub}><a href="#confidence" onClick={(e) => scrollToSection(e, 'confidence')}>Confidence Rating</a></li>
            <li className={styles.tocItemSub}><a href="#interactions" onClick={(e) => scrollToSection(e, 'interactions')}>Interaction Rules</a></li>
            <li className={styles.tocItemSub}><a href="#safety-gate" onClick={(e) => scrollToSection(e, 'safety-gate')}>Safety Gate</a></li>
            <li className={styles.tocItem}><a href="#part4" onClick={(e) => scrollToSection(e, 'part4')}>Part 4 — Report Engine</a></li>
            <li className={styles.tocItemSub}><a href="#report-principles" onClick={(e) => scrollToSection(e, 'report-principles')}>Design Principles</a></li>
            <li className={styles.tocItemSub}><a href="#report-fragments" onClick={(e) => scrollToSection(e, 'report-fragments')}>Fragment Structure</a></li>
            <li className={styles.tocItem}><a href="#privacy" onClick={(e) => scrollToSection(e, 'privacy')}>Privacy</a></li>
          </ol>
        </nav>

        {/* ── Main content ─────────────────────────────────── */}
        <main className={styles.content}>

          {/* ── Part 1: Architecture ──────────────────────── */}
          <section id="part1" className={styles.section} aria-labelledby="part1-heading">
            <h2 id="part1-heading" className={styles.sectionHeading}>
              <span className={styles.partBadge}>Part 1</span>
              Assessment Architecture
            </h2>

            {/* Goals */}
            <div id="goals">
              <h3 className={styles.subHeading}>Assessment Goals</h3>
              <p className={styles.prose}>
                The EB-MRA exists to help a candidate — most often a premedical student,
                career-changer, or early medical trainee — reflect systematically on the
                dispositions and habits of mind that evidence-based medicine practice tends to
                demand, and to surface areas worth deliberate development before or during
                medical training.
              </p>
              <p className={styles.prose}>Concretely, the instrument aims to:</p>
              <ol style={{ paddingLeft: 'var(--space-6)', marginTop: 'var(--space-4)', lineHeight: 'var(--leading-relaxed)' }}>
                <li style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                  Give the respondent a structured, multi-domain snapshot of self-reported tendencies relevant to EBM practice.
                </li>
                <li style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                  Translate that snapshot into plain-language, actionable feedback — strengths to leverage, growth edges to work on, and concrete next steps — rather than a bare numeric score.
                </li>
                <li style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                  Deliver a fully deterministic, auditable scoring pipeline: the same answers always produce the same report, every decision traceable to an explicit, documented rule.
                </li>
                <li style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink)' }}>
                  Avoid impersonating a diagnostic, admissions, or credentialing instrument — it is explicitly <em>not</em> a fitness-for-practice test or a substitute for MCAT/GPA/interview-based admissions processes.
                </li>
              </ol>
            </div>

            {/* Philosophy */}
            <div id="philosophy">
              <h3 className={styles.subHeading}>Design Philosophy</h3>
              <p className={styles.prose}>Three design commitments shape everything downstream:</p>

              <div style={{ marginTop: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
                {[
                  {
                    label: '(a) Self-report, not performance.',
                    desc: 'The instrument measures self-reported tendencies and preferences, not demonstrated competence. A high score on "evidence literacy" means the respondent endorses evidence-literate attitudes on a questionnaire, not that they have been observed practising them. Report language never blurs this line — never "you are highly skilled at X"; always "you consistently endorse X habits."',
                  },
                  {
                    label: '(b) Transparency over mystique.',
                    desc: 'Every score, every profile assignment, and every report fragment must be traceable to an explicit rule in the specification. No hidden weighting, no opaque "AI insight." This is a deliberate rejection of black-box personality-quiz design, and it is what makes the instrument auditable, debuggable, and eventually validatable.',
                  },
                  {
                    label: '(c) Formative, not gatekeeping.',
                    desc: 'The instrument is designed to be used by the respondent for their own development, ideally alongside an advisor or mentor — not as an automated pass/fail gate, and not as input to any admissions or employment decision. This constraint is enforced in the product and stated explicitly in every report.',
                  },
                ].map(p => (
                  <div key={p.label} style={{ padding: 'var(--space-5)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'var(--text-base)', color: 'var(--color-ink)', marginBottom: 'var(--space-2)' }}>{p.label}</p>
                    <p className={styles.prose} style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-ink-muted)' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Limitations */}
            <div id="limitations">
              <h3 className={styles.subHeading}>Scientific Limitations</h3>
              <p className={styles.prose}>
                The specification is written to be scientifically honest, which means being
                explicit about what the instrument is not. All placeholders (difficulty,
                discrimination, factor loadings) are design-team estimates that must be replaced
                with real values from a validation study before any empirical claims are made.
              </p>
              <ul className={styles.limitList}>
                {[
                  { title: 'No established reliability', desc: 'Internal consistency (Cronbach\'s alpha / McDonald\'s omega), test-retest reliability, and inter-item correlations are unknown until a validation study is run. A proper validation study design is included as Part 6 of this specification series.' },
                  { title: 'No established validity', desc: 'There is no evidence yet that scores predict any real-world outcome (medical school performance, clinical competence, wellbeing, attrition, etc.). Predictive-sounding language in reports is softened to "may relate to" framing at most, and ideally avoided in favour of purely descriptive/reflective framing.' },
                  { title: 'Self-report bias', desc: 'Social-desirability bias, mood-state effects, and self-perception inaccuracy are inherent limits of any self-report instrument and cannot be fully corrected by validity-check items. Part 3 covers mitigation, not elimination.' },
                  { title: 'Cultural and linguistic scope', desc: 'Item wording is developed in one language/cultural context (assumed U.S./English-language premedical context unless otherwise localised) and has not been checked for measurement invariance across cultures, languages, or educational systems.' },
                  { title: 'Not diagnostic', desc: 'The instrument must never be marketed or used as screening for a mental health condition, a learning disability, or any clinical entity, even though some domains (e.g., resilience, stress tolerance) overlap thematically with constructs psychology also studies.' },
                  { title: 'Not an admissions tool', desc: 'Scores must not be used, or be usable, in any admissions, hiring, licensing, or credentialing decision. This is both a scientific limitation (unvalidated for that purpose) and an ethical requirement.' },
                ].map(l => (
                  <li key={l.title} className={styles.limitItem}>
                    <span className={styles.limitBullet} />
                    <div>
                      <div className={styles.limitTitle}>{l.title}</div>
                      <div className={styles.limitDesc}>{l.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intended users */}
            <div id="users">
              <h3 className={styles.subHeading}>Intended Users</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
                <div style={{ padding: 'var(--space-5)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: 'var(--space-3)' }}>Primary Users</p>
                  <ul style={{ paddingLeft: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-muted)' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>Premedical undergraduates exploring fit with a medicine career</li>
                    <li style={{ marginBottom: 'var(--space-2)' }}>Postbaccalaureate / career-change candidates preparing for application</li>
                    <li>Early medical students (M1–M2) doing self-directed reflection, often prompted by an advisor or wellness curriculum</li>
                  </ul>
                </div>
                <div style={{ padding: 'var(--space-5)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink-faint)', marginBottom: 'var(--space-3)' }}>Secondary Users</p>
                  <ul style={{ paddingLeft: 'var(--space-5)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-muted)' }}>
                    <li style={{ marginBottom: 'var(--space-2)' }}>Premedical advisors and mentors (report as conversation-starter, never decision input)</li>
                    <li>Medical education researchers, once a validated version exists, studying the instrument itself</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exclusions */}
            <div id="exclusions">
              <h3 className={styles.subHeading}>Exclusion Criteria</h3>
              <p className={styles.prose}>
                The product actively discourages or blocks use in the following situations:
              </p>
              <div className={styles.tableScroll} style={{ marginTop: 'var(--space-5)' }}>
                <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Scenario</th>
                    <th>Enforcement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: '1', scenario: 'Any use as an admissions, screening, or hiring input', enforcement: 'Consent/intro screen states this explicitly; no export format is described as "share with admissions committee"' },
                    { n: '2', scenario: 'Respondents under 16', enforcement: 'Consent screen age gate; below this age the construct set is unlikely to be meaningful and minor-consent considerations apply' },
                    { n: '3', scenario: 'Acute mental health crisis indicators', enforcement: 'Safety gate check (§5.12) routes to crisis resources instead of a scored report; product safety rule, not merely data-quality' },
                    { n: '4', scenario: 'Non-English locales', enforcement: 'The current product is English-only by design; no machine-translated or localized version exists or is offered. Should localization be pursued in the future, it must not ship silently — a "not yet validated for this language/region" notice would be required until localization and measurement-invariance testing is complete for that locale.' },
                  ].map(r => (
                    <tr key={r.n}>
                      <td style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{r.n}</td>
                      <td>{r.scenario}</td>
                      <td style={{ color: 'var(--color-ink-muted)', fontSize: 'var(--text-xs)' }}>{r.enforcement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </section>

          {/* ── Part 2: Domains ───────────────────────────── */}
          <section id="part2" className={styles.section} aria-labelledby="part2-heading">
            <h2 id="part2-heading" className={styles.sectionHeading}>
              <span className={styles.partBadge}>Part 2</span>
              Domains & Question Bank
            </h2>

            <p className={styles.prose}>
              Eight domains, organised into three superordinate clusters. The instrument
              contains <strong>104 items</strong> total — exactly 13 items per domain — following
              an allocation of 8 core + 3 auxiliary + 2 scenario items. Domain weights are
              close to uniform (0.09–0.14) reflecting the absence of validation data that would
              justify strongly differential importance claims.
            </p>

            {/* Domain cards */}
            <div id="domains">
              {['Cognitive & Analytical Habits', 'Interpersonal & Professional Habits', 'Self-Regulation & Resilience'].map(cluster => (
                <div key={cluster}>
                  <p className={styles.clusterLabel}>{cluster}</p>
                  <div className={styles.domainGrid}>
                    {DOMAINS.filter(d => d.cluster === cluster).map(d => (
                      <div key={d.code} className={styles.domainCard}>
                        <div className={styles.domainCardHeader}>
                          <span className={styles.domainCode}>{d.code}</span>
                          <span className={styles.domainWeight}>weight {d.weight}</span>
                        </div>
                        <div className={styles.domainName}>{d.name}</div>
                        <div className={styles.domainCluster}>{d.cluster}</div>
                        <div className={styles.domainDesc}>{d.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Item types */}
            <div id="item-types">
              <h3 className={styles.subHeading}>Item Types</h3>
              <p className={styles.prose}>
                Every domain contains three item types, each serving a distinct measurement purpose.
                All LIKERT5 items use a standard 5-point agree/disagree scale; reverse-keyed items
                are automatically recoded (score = 6 − raw value) before scoring.
              </p>
              <div className={styles.itemTypeRow}>
                {[
                  { label: 'Core items', value: '8 per domain', weight: 'Weight 1.0', desc: 'Primary construct measurement. Forward- and reverse-keyed self-statement items using the LIKERT5 scale. Largest contribution to domain score.' },
                  { label: 'Auxiliary items', value: '3 per domain', weight: 'Weight 0.5 (or excluded)', desc: 'Validity and consistency checking. The *-A02 item is a reverse-worded restatement of *-A01; the *-A03 item is a social-desirability detector excluded from domain scoring entirely.' },
                  { label: 'Scenario items', value: '2 per domain', weight: 'Weight 1.5', desc: 'Behavioural / situational proxies. Single-select options scored per-option from a lookup table. More resistant to social-desirability distortion than direct self-statements.' },
                ].map(t => (
                  <div key={t.label} className={styles.itemTypeCard}>
                    <span className={styles.itemTypeLabel}>{t.label}</span>
                    <span className={styles.itemTypeValue}>{t.value}</span>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>{t.weight}</div>
                    <div className={styles.itemTypeDesc}>{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Part 3: Scoring ───────────────────────────── */}
          <section id="part3" className={styles.section} aria-labelledby="part3-heading">
            <h2 id="part3-heading" className={styles.sectionHeading}>
              <span className={styles.partBadge}>Part 3</span>
              Answer Mapping & Scoring Algorithm
            </h2>

            <p className={styles.prose}>
              The scoring pipeline is fully deterministic: given any complete or partial set
              of raw answers, two engineers implementing this specification independently must
              produce byte-identical scores. No machine learning or probabilistic inference is
              involved at any stage.
            </p>

            {/* Normalisation formula */}
            <h3 className={styles.subHeading}>Normalisation Formula</h3>
            <p className={styles.prose}>
              Each domain is normalised to a 0–100 scale using a linear mapping from the
              [1, 5] weighted-mean range:
            </p>
            <div className={styles.codeBlock}>
              WeightedMean(D) = RawSum(D) / EffectiveWeight(D)<br />
              <br />
              DomainScore(D) = ROUND( (WeightedMean(D) − 1) / (5 − 1) × 100 , 1)<br />
              <br />
              {/* Worked example */}
              {/* e.g. WeightedMean = 3.8 → DomainScore = (3.8 − 1) / 4 × 100 = 70.0 */}
              Example: WeightedMean = 3.8 → DomainScore = (3.8 − 1) / 4 × 100 = <strong>70.0</strong> (Established band)
            </div>

            {/* Pipeline */}
            <div id="pipeline">
              <h3 className={styles.subHeading}>Scoring Pipeline</h3>
              <ol className={styles.pipelineList}>
                {PIPELINE_STEPS.map((step, i) => (
                  <li key={step.name} className={styles.pipelineItem}>
                    <span className={styles.pipelineNumber}>{String(i + 1).padStart(2, '0')}</span>
                    <div className={styles.pipelineBody}>
                      <div className={styles.pipelineStepName}>{step.name}</div>
                      <div className={styles.pipelineStepDesc}>{step.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Score bands */}
            <div id="bands">
              <h3 className={styles.subHeading}>Score Bands</h3>
              <p className={styles.prose}>
                All eight domains use the same four-band structure. Band membership uses{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>
                  low ≤ score &lt; high
                </code>{' '}
                for all bands except the top band, which is inclusive of 100 to prevent a
                perfect score from falling outside every band.
                <br /><br />
                <strong>Exception:</strong> CSR (Conscientiousness &amp; Self-Regulation) is
                given a 5-band structure, splitting "Strong" into 75–89 and a distinct 90–100
                "Very Strong" band to carry the perfectionism note directly in the base fragment
                set rather than only as an add-on interaction flag.
              </p>
              <div className={styles.tableScroll}>
              <table className={styles.bandTable}>
                <thead>
                  <tr>
                    <th>Range</th>
                    <th>Band</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {SCORE_BANDS.map(b => (
                    <tr key={b.label}>
                      <td style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{b.range}</td>
                      <td><span className={`${styles.bandPill} ${b.className}`}>{b.label}</span></td>
                      <td>{b.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Validity checks */}
            <div id="validity">
              <h3 className={styles.subHeading}>Validity Checks</h3>
              <p className={styles.prose}>
                Four independent validity mechanisms detect low-quality response patterns. None
                (except the safety gate) halt the pipeline — they degrade confidence or annotate
                the report, consistent with the transparency-over-gatekeeping design philosophy.
              </p>
              <div className={styles.tableScroll}>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>Mechanism</th>
                    <th>How it works</th>
                    <th>Impact on output</th>
                  </tr>
                </thead>
                <tbody>
                  {VALIDITY_CHECKS.map(v => (
                    <tr key={v.check}>
                      <td style={{ fontWeight: 500 }}>{v.check}</td>
                      <td>{v.desc}</td>
                      <td style={{ color: 'var(--color-ink-muted)' }}>{v.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            {/* Confidence rating */}
            <div id="confidence">
              <h3 className={styles.subHeading}>Confidence Rating</h3>
              <p className={styles.prose}>
                A single 0–100 Confidence Rating is computed per respondent after all validity
                checks. It is displayed once at the top of the report. ERP receives its own
                separate confidence number when CM-04 applies, as it is the domain with the
                widest desirability-driven error margin.
              </p>
              <div className={styles.codeBlock}>
                BaseConfidence = 100{'\n'}
                BaseConfidence −= 20   if SD_index ≥ 3          (CM-01){'\n'}
                BaseConfidence −= 10   if missing_data_rate &gt; 10% (CM-02){'\n'}
                BaseConfidence −= 25   if any STRAIGHT_LINE flag  (CM-03){'\n'}
                BaseConfidence −= 5 × min(ConsistencyFlagCount, 4)   // max −20{'\n'}
                GlobalConfidence = CLAMP(BaseConfidence, 0, 100){'\n'}
                {'\n'}
                ERPConfidence = GlobalConfidence − 15  if RST ≤ 40 AND ERP ≥ 80   (CM-04)
              </div>

              <div className={styles.confidenceBands}>
                <div className={`${styles.confidenceBand} ${styles.confHigh}`}>
                  <span className={styles.confidenceRange}>85–100</span>
                  <span className={styles.confidenceLabel}>High confidence</span>
                </div>
                <div className={`${styles.confidenceBand} ${styles.confModerate}`}>
                  <span className={styles.confidenceRange}>65–84</span>
                  <span className={styles.confidenceLabel}>Moderate confidence</span>
                </div>
                <div className={`${styles.confidenceBand} ${styles.confReduced}`}>
                  <span className={styles.confidenceRange}>40–64</span>
                  <span className={styles.confidenceLabel}>Reduced — interpret cautiously</span>
                </div>
                <div className={`${styles.confidenceBand} ${styles.confLow}`}>
                  <span className={styles.confidenceRange}>0–39</span>
                  <span className={styles.confidenceLabel}>Low — results likely unreliable</span>
                </div>
              </div>
            </div>

            {/* Interaction rules */}
            <div id="interactions">
              <h3 className={styles.subHeading}>Cross-Domain Interaction Rules</h3>
              <p className={styles.prose}>
                Eight named rules evaluate combinations of final domain scores <em>after</em>{' '}
                all eight domain scores are computed. Rules are evaluated in a fixed order
                (AR-03, AR-03b, IH-01, CR-02, EC-01, CM-04, PC-01, OA-01) and are not mutually
                exclusive — a single respondent can trigger multiple rules simultaneously.
                Rules <strong>never</strong> modify a domain's numeric score; they only annotate
                the report and profile layer.
              </p>
              <div className={styles.ruleGrid}>
                {INTERACTION_RULES.map(r => (
                  <div key={r.id} className={styles.ruleCard}>
                    <span className={styles.ruleId}>{r.id}</span>
                    <div>
                      <div className={styles.ruleCondition}>
                        Condition: <code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>{r.condition}</code>
                      </div>
                      <div className={styles.ruleEffect}>{r.effect}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety gate */}
            <div id="safety-gate">
              <h3 className={styles.subHeading}>Safety Gate</h3>
              <p className={styles.prose}>
                The safety gate is the <strong>only</strong> halting condition in the entire
                scoring pipeline. It runs before any scoring step, directly on raw answers.
              </p>
              <div className={styles.safetyCallout}>
                <strong>Trigger condition</strong>
                <p>
                  RST-S02 response is option C ("barely keeping my head above water") AND
                  two or more of RST-C03, RST-C05, RST-C08 have a contribution_score ≤ 2.
                </p>
              </div>
              <p className={styles.prose} style={{ marginTop: 'var(--space-5)' }}>
                When triggered, the pipeline halts. No scoring or report is generated.
                The product renders a support-resources screen (crisis hotlines, campus
                counselling) styled to look and feel like a support screen, not a results
                screen. The respondent can choose to return and complete the assessment at
                another time. This is a product safety rule, not merely a data-quality edge
                case — it is explicitly documented in Part 1 §1.5(3)'s exclusion criteria.
              </p>
            </div>
          </section>

          {/* ── Part 4: Report Engine ─────────────────────── */}
          <section id="part4" className={styles.section} aria-labelledby="part4-heading">
            <h2 id="part4-heading" className={styles.sectionHeading}>
              <span className={styles.partBadge}>Part 4</span>
              Report Generation Engine
            </h2>

            <p className={styles.prose}>
              The report engine is entirely rule-based and deterministic: every sentence a
              respondent sees comes from a pre-written fragment selected by the{' '}
              <code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>ScoringResult</code>{' '}
              values. No generative AI text is produced at runtime; the engine's only job is
              selection and concatenation. String interpolation is limited to inserting numeric
              scores into otherwise-fixed templates.
            </p>

            {/* Design principles */}
            <div id="report-principles">
              <h3 className={styles.subHeading}>Design Principles</h3>
              <div style={{ display: 'grid', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                {[
                  { n: '1', title: 'No generative text', desc: 'Every fragment is pre-written, stored verbatim in reports.json, and selected by rule. No runtime text generation.' },
                  { n: '2', title: 'Descriptive, not diagnostic', desc: 'No fragment may state or imply a mental-health diagnosis, a clinical judgment, or a prediction about medical-school outcome. Language stays in "you reported…" / "this may suggest…" register, never "you have…" / "you will…"' },
                  { n: '3', title: 'No admissions framing', desc: 'No fragment may suggest the report is suitable to share with an admissions committee, employer, or licensing body. The report footer restates the non-admissions purpose.' },
                  { n: '4', title: 'Strengths-first, growth-framed', desc: 'Every band — including the lowest — leads with something constructive before naming a growth area. "Emerging" is never rendered as "weak," "poor," or "low."' },
                  { n: '5', title: 'Symmetric shadow-side honesty', desc: 'The highest band is not automatically the "best" framing. Where a shadow side is documented (e.g., over-analysis at SAR ≥ 90, perfectionism at CSR ≥ 90), the top-band fragment says so.' },
                  { n: '6', title: 'Every fragment traceable', desc: 'Each fragment has a unique ID (RPT-<DOMAINCODE>-<BAND>, plus interaction-rule IDs) so the assembled report can be unit-tested fragment-by-fragment.' },
                ].map(p => (
                  <div key={p.n} style={{ display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 'var(--space-4)', alignItems: 'start', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-border-dark)', fontWeight: 400 }}>{p.n}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, fontSize: 'var(--text-base)', color: 'var(--color-ink)', marginBottom: 'var(--space-1)' }}>{p.title}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-muted)' }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fragment structure */}
            <div id="report-fragments">
              <h3 className={styles.subHeading}>Fragment Structure</h3>
              <p className={styles.prose}>
                Each domain × band combination produces a fragment with eight required fields.
                All fragments are stored in{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>reports.json</code>{' '}
                and assembled by the report engine at runtime.
              </p>
              <div className={styles.tableScroll}>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { field: 'Interpretation', purpose: 'Plain-language summary of what the score range means for this domain. Always in "you reported…" register.' },
                    { field: 'Strength Description', purpose: 'Constructive framing of what the respondent already shows in this domain, even at Emerging band.' },
                    { field: 'Growth Opportunity', purpose: 'A specific, actionable growth area — never framed as a deficiency or character flaw.' },
                    { field: 'Study Advice', purpose: 'Concrete study/practice recommendations relevant to the band and domain.' },
                    { field: 'Wellbeing Advice', purpose: 'Wellness-oriented note where relevant (especially RST and CSR top bands); "None needed" in many cases.' },
                    { field: 'Medical-Practice Relevance', purpose: 'How this domain connects to actual clinical or medical-education practice — descriptive, not predictive.' },
                    { field: 'Warning Message', purpose: 'Present only where a genuine shadow side or caution applies (e.g., over-analysis at SAR Strong, perfectionism at CSR Very Strong). "None" otherwise.' },
                    { field: 'Recommended Resources', purpose: 'Generic resource categories (no branded products) — e.g., "journal club participation," "campus counselling services."' },
                  ].map(r => (
                    <tr key={r.field}>
                      <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}><code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>{r.field}</code></td>
                      <td>{r.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

              <h4 className={styles.subSubHeading}>Interaction blocks</h4>
              <p className={styles.prose}>
                In addition to per-domain fragments, the report engine appends interaction-rule
                blocks whenever a cross-domain rule fires (§6.2). These blocks are always
                appended <em>after</em> all base domain blocks and are written to stand alone
                (beginning with "Pattern noted:") without re-explaining each domain from scratch.
              </p>
              <p className={styles.prose} style={{ marginTop: 'var(--space-4)' }}>
                If{' '}
                <code style={{ fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--color-accent)' }}>SD_index ≥ 5.5</code>,
                the profile assignment step is suppressed — the report still shows domain scores
                with a caveat, but does not attempt to assign one of the 20–40 named profiles,
                since profile assignment on top of heavily distorted data risks a
                confidently-wrong-sounding label.
              </p>
            </div>
          </section>

          {/* ── Privacy ───────────────────────────────────── */}
          <section id="privacy" className={styles.section} aria-labelledby="privacy-heading">
            <h2 id="privacy-heading" className={styles.sectionHeading}>
              Privacy & Data Handling
            </h2>
            <div className={styles.privacyInset}>
              <p>
                All processing is performed entirely in your browser. No responses, scores, or
                identifying information are ever transmitted to any server or third party.
              </p>
              <p>
                Your last result is cached locally under the key{' '}
                <code>ebmra_last_result</code> in your browser's{' '}
                <code>localStorage</code>. This data never leaves your device and can be
                cleared at any time by clearing your browser's site data for this origin.
              </p>
              <p>
                There is no account system, no telemetry, and no analytics. Assessment
                results are not stored remotely, are not transmitted over a network, and are
                not accessible to anyone other than the person using this browser on this
                device.
              </p>
            </div>
          </section>

        </main>
      </div>
    </PageShell>
  )
}
