// ─────────────────────────────────────────────────────────────
// ReportView — deterministic report assembly
//
// Renders, in order:
//   1. Footer notices (non-admissions + non-diagnostic) — PROMINENT at top
//   2. 8 domain score cards (band label + domain_fragments text)
//   3. Interaction flag blocks (interaction_blocks text) — if any fired
//   4. Assigned profile summary OR "not enough data" fallback (§8.4)
//   5. Footer notices repeated at the bottom
//
// All interpretive copy is sourced from reports.json (via REPORTS) and
// profiles.json (via PROFILES). Zero hardcoded interpretive text.
//
// Design constraints (tokens.css "luxurious, calm" system):
//   • Serif body / heading fonts via CSS custom properties
//   • No Tailwind utility classes
//   • 300ms deliberate transitions
//   • Border-based elevation only (no heavy drop shadows)
// ─────────────────────────────────────────────────────────────

import type { ScoringResult } from '../engine/domainScore'
import type { ProfileAssignmentResult } from '../types/profileAssignment'
import { REPORTS } from '../data/loadReports'
import { PROFILES } from '../data/loadProfiles'
import ReactMarkdown from 'react-markdown'
import styles from './ReportView.module.css'

// ── Band label lookup ─────────────────────────────────────────
// Boundaries from Part 3 §5.3: low ≤ score < high, top band inclusive.
// 0–24 Emerging | 25–49 Developing | 50–74 Established | 75–100 Strong

type BandLabel = 'Emerging' | 'Developing' | 'Established' | 'Strong' | 'VeryStrong'

function scoreToBand(normalizedScore: number, domainId: string): BandLabel {
  if (domainId === 'CSR' && normalizedScore >= 90) return 'VeryStrong'
  if (normalizedScore >= 75) return 'Strong'
  if (normalizedScore >= 50) return 'Established'
  if (normalizedScore >= 25) return 'Developing'
  return 'Emerging'
}

// ── Confidence Band lookup ────────────────────────────────────
function getConfidenceBand(score: number): { label: string; desc: string } {
  if (score >= 85) return { label: 'High confidence', desc: '' }
  if (score >= 65) return { label: 'Moderate confidence', desc: '' }
  if (score >= 40) return { label: 'Reduced confidence', desc: ' — interpret cautiously' }
  return { label: 'Low confidence', desc: ' — results likely unreliable' }
}


// ── Domain display names ──────────────────────────────────────
// Short labels for the 8 domain IDs used throughout the UI.

const DOMAIN_LABELS: Record<string, string> = {
  SAR: 'Scientific & Analytical Reasoning',
  ELCA: 'Evidence Literacy & Critical Appraisal',
  IHOR: 'Intellectual Humility & Openness to Revision',
  AMB: 'Ambiguity Tolerance',
  ECPC: 'Empathic Communication & Patient-Centred Care',
  ERP: 'Ethics & Reflective Practice',
  CSR: 'Conscientiousness & Self-Regulation',
  RST: 'Resilience & Stress Tolerance',
}

// ── No-data message (§8.4) ────────────────────────────────────
// Spec text: "not enough data for a profile summary, but your available
// domain scores are shown above"
const NO_PROFILE_MESSAGE =
  'Not enough data for a profile summary, but your available domain scores are shown above.'

// ── Footer notices sub-component ─────────────────────────────

function FooterNotices({ id }: { id: string }) {
  const { footer } = REPORTS
  return (
    <aside
      className={styles.footerNotices}
      aria-label="Important notices"
      id={id}
    >
      <p className={styles.noticeText} data-notice-type="non-admissions">
        {footer.non_admissions_notice}
      </p>
      <p className={styles.noticeText} data-notice-type="non-diagnostic">
        {footer.non_diagnostic_notice}
      </p>
    </aside>
  )
}

// ── Estimate Caption sub-component ────────────────────────────

function EstimateCaption() {
  return (
    <div className={styles.estimateCaption}>
      Estimate only — bands are provisional and not empirically validated.
    </div>
  )
}

// ── Domain card sub-component ─────────────────────────────────

interface DomainCardProps {
  domainId: string
  normalizedScore: number | null
  insufficientData: boolean
  domainConfidence?: number | null
  hasContradiction?: boolean
}

function DomainCard({ domainId, normalizedScore, insufficientData, domainConfidence, hasContradiction }: DomainCardProps) {
  const label = DOMAIN_LABELS[domainId] ?? domainId
  const fragments = REPORTS.domain_fragments[domainId]

  if (insufficientData || normalizedScore === null || !fragments) {
    return (
      <article
        className={`${styles.domainCard} ${styles.domainCardInsufficient}`}
        data-domain={domainId}
        data-testid={`domain-card-${domainId}`}
        aria-label={`${label}: insufficient data`}
      >
        <header className={styles.domainCardHeader}>
          <span className={styles.domainId}>{domainId}</span>
          <h2 className={styles.domainName}>{label}</h2>
        </header>
        <p className={styles.insufficientNote}>
          Not enough data to score this domain.
        </p>
      </article>
    )
  }

  const band = scoreToBand(normalizedScore, domainId)
  const fragment = fragments[band]

  if (!fragment) return null

  return (
    <article
      className={styles.domainCard}
      data-domain={domainId}
      data-band={band}
      data-testid={`domain-card-${domainId}`}
      aria-label={`${label}: ${band}`}
    >
      <header className={styles.domainCardHeader}>
        <div className={styles.domainMeta}>
          <span className={styles.domainId}>{domainId}</span>
          <span
            className={`${styles.bandChip} ${styles[`band${band}`]}`}
            data-testid={`band-label-${domainId}`}
          >
            {band}
          </span>
        </div>
        <h2 className={styles.domainName}>{label}</h2>
        <p className={styles.domainScore}>
          Score: {Math.round(normalizedScore)}
          <span className={styles.scoreMax}> / 100</span>
        </p>
        <EstimateCaption />
      </header>

      <div className={styles.domainBody}>
        {/* Interpretation */}
        <p className={styles.interpretation}>{fragment.interpretation}</p>

        {/* Caveats */}
        {(domainConfidence !== null && domainConfidence !== undefined) && (
          <p className={styles.domainCaveat}>
            <strong>Note:</strong> The confidence score for this domain is reduced to {domainConfidence}/100.
          </p>
        )}
        {hasContradiction && (
          <p className={styles.domainCaveat}>
            <strong>Note:</strong> Responses in this domain showed significant contradiction between core and scenario items. Interpret with caution.
          </p>
        )}

        {/* Strength */}
        <section className={styles.fragmentSection} aria-label="Strength">
          <h3 className={styles.fragmentHeading}>Strength</h3>
          <ReactMarkdown>{fragment.strength}</ReactMarkdown>
        </section>

        {/* Growth */}
        <section className={styles.fragmentSection} aria-label="Growth opportunity">
          <h3 className={styles.fragmentHeading}>Growth opportunity</h3>
          <ReactMarkdown>{fragment.growth}</ReactMarkdown>
        </section>

        {/* Study advice */}
        <section className={styles.fragmentSection} aria-label="Study advice">
          <h3 className={styles.fragmentHeading}>Study advice</h3>
          <ReactMarkdown>{fragment.study_advice}</ReactMarkdown>
        </section>

        {/* Wellbeing note */}
        {fragment.wellbeing_advice && (
          <section className={styles.fragmentSection} aria-label="Wellbeing note">
            <h3 className={styles.fragmentHeading}>Wellbeing note</h3>
            <ReactMarkdown>{fragment.wellbeing_advice}</ReactMarkdown>
          </section>
        )}

        {/* Medical practice relevance */}
        <section className={styles.fragmentSection} aria-label="Medical practice relevance">
          <h3 className={styles.fragmentHeading}>Medical practice relevance</h3>
          <ReactMarkdown>{fragment.medical_practice_relevance}</ReactMarkdown>
        </section>

        {/* Warning — only if non-trivial */}
        {fragment.warning && fragment.warning !== 'None.' && (
          <section
            className={`${styles.fragmentSection} ${styles.warningSection}`}
            aria-label="Watch-item"
          >
            <h3 className={`${styles.fragmentHeading} ${styles.warningHeading}`}>
              Watch-item
            </h3>
            <ReactMarkdown>{fragment.warning}</ReactMarkdown>
          </section>
        )}

        {/* Resources */}
        {fragment.resources.length > 0 && (
          <section className={styles.fragmentSection} aria-label="Resources">
            <h3 className={styles.fragmentHeading}>Resources</h3>
            <ul className={styles.resourcesList}>
              {fragment.resources.map((r, i) => (
                <li key={i} className={styles.resourceItem}>{r}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}

// ── Interaction block sub-component ──────────────────────────

interface InteractionBlockProps {
  ruleId: string
}

function InteractionBlock({ ruleId }: InteractionBlockProps) {
  const block = REPORTS.interaction_blocks[ruleId]
  if (!block) return null
  return (
    <article
      className={styles.interactionBlock}
      data-rule={ruleId}
      data-testid={`interaction-block-${ruleId}`}
      aria-label={`Pattern note: ${ruleId}`}
    >
      <p className={styles.interactionText}>{block.text}</p>
    </article>
  )
}

// ── Profile summary sub-component ─────────────────────────────

interface ProfileSummaryProps {
  profileResult: ProfileAssignmentResult
}

function ProfileSummary({ profileResult }: ProfileSummaryProps) {
  const { assigned_profile, profileFitConfidence } = profileResult

  if (!assigned_profile) {
    return (
      <section
        className={styles.profileSection}
        aria-label="Profile summary"
        data-testid="profile-summary"
      >
        <h2 className={styles.profileHeading}>Profile Summary</h2>
        <p
          className={styles.noProfileMessage}
          data-testid="no-profile-message"
        >
          {NO_PROFILE_MESSAGE}
        </p>
      </section>
    )
  }

  // Look up profile data from profiles.json
  const profileData = PROFILES.profiles.find((p) => p.id === assigned_profile)

  if (!profileData) {
    return (
      <section
        className={styles.profileSection}
        aria-label="Profile summary"
        data-testid="profile-summary"
      >
        <h2 className={styles.profileHeading}>Profile Summary</h2>
        <p className={styles.noProfileMessage}>{NO_PROFILE_MESSAGE}</p>
      </section>
    )
  }

  return (
    <section
      className={styles.profileSection}
      aria-label="Profile summary"
      data-testid="profile-summary"
    >
      <h2 className={styles.profileHeading}>Profile Summary</h2>

      <div
        className={styles.profileCard}
        data-profile-id={assigned_profile}
        data-testid="profile-card"
      >
        <div className={styles.profileMeta}>
          <span className={styles.profileId}>{profileData.id}</span>
          {profileFitConfidence && (
            <span className={styles.profileConfidence}>
              {profileFitConfidence}
            </span>
          )}
        </div>

        <h3
          className={styles.profileName}
          data-testid="profile-name"
        >
          {profileData.name}
        </h3>

        <p className={styles.profileDescription}>{profileData.description}</p>

        {/* Framing reminder: profiles are descriptive archetypes for reflection, not labels */}
      </div>
    </section>
  )
}

// ── Main component ────────────────────────────────────────────

export interface ReportViewProps {
  scoringResult: ScoringResult
  profileResult: ProfileAssignmentResult
}

export default function ReportView({ scoringResult, profileResult }: ReportViewProps) {
  const { domain_scores, interaction_flags, overall_confidence, sd_index, validation_checks } = scoringResult
  const { straight_line, consistency, contradictions } = validation_checks

  // Only triggered flags that have a matching interaction_blocks entry
  const triggeredFlags = interaction_flags.filter(
    (f) => f.triggered && REPORTS.interaction_blocks[f.rule] !== undefined
  )

  const erpConfidenceFlag = interaction_flags.find(f => f.rule === 'CM-04' && f.triggered)
  const erpConfidence = erpConfidenceFlag ? Math.max(0, overall_confidence - 15) : undefined

  const inconsistentCount = consistency.filter(c => !c.consistent).length

  return (
    <div
      className={styles.reportRoot}
      id="report-view"
      data-testid="report-view"
    >
      {/* ── (1) Notices — PROMINENT at top ──────────────────── */}
      <FooterNotices id="top-notices" />

      {/* ── Report heading ─────────────────────────────────── */}
      <header className={styles.reportHeader}>
        <h1 className={styles.reportTitle}>Your Medical Readiness Report</h1>
        <p className={styles.reportSubtitle}>
          A self-reflection tool based on your responses across eight domains.
        </p>
        
        <div className={styles.globalConfidence}>
          <span className={styles.confidenceLabel}>Confidence Score:</span> {overall_confidence}/100 
          <span className={styles.confidenceDesc}>
            {' '}({getConfidenceBand(overall_confidence).label}{getConfidenceBand(overall_confidence).desc})
          </span>
        </div>
      </header>

      {/* ── Global Caveats ─────────────────────────────────── */}
      {(sd_index >= 3 || straight_line.length > 0 || inconsistentCount >= 3) && (
        <section className={styles.globalCaveatsSection} aria-label="Data quality notes">
          {sd_index >= 3 && (
            <p className={styles.globalCaveat}>
              <strong>Note:</strong> You may have presented a more idealized self-picture than usual in your responses. This can affect the accuracy of the report.
            </p>
          )}
          {straight_line.length > 0 && (
            <p className={styles.globalCaveat}>
              <strong>Note:</strong> A pattern of identical consecutive answers was detected. Interpret overall scores with caution.
            </p>
          )}
          {inconsistentCount >= 3 && (
            <p className={styles.globalCaveat}>
              <strong>Note:</strong> Three or more inconsistent answer pairs were detected. Interpret overall scores with caution.
            </p>
          )}
        </section>
      )}

      {/* ── (2) Domain score cards ─────────────────────────── */}
      <section
        className={styles.domainsSection}
        aria-label="Domain scores"
        data-testid="domains-section"
      >
        <h2 className={styles.sectionHeading}>Domain Results</h2>
        <div className={styles.domainsGrid}>
          {domain_scores.map((ds) => (
            <DomainCard
              key={ds.domain}
              domainId={ds.domain}
              normalizedScore={ds.normalized_score}
              insufficientData={ds.insufficient_data}
              domainConfidence={ds.domain === 'ERP' ? erpConfidence : undefined}
              hasContradiction={contradictions.includes(ds.domain)}
            />
          ))}
        </div>
      </section>

      {/* ── (3) Interaction flags ───────────────────────────── */}
      {triggeredFlags.length > 0 && (
        <section
          className={styles.interactionsSection}
          aria-label="Pattern notes"
          data-testid="interactions-section"
        >
          <h2 className={styles.sectionHeading}>Pattern Notes</h2>
          <p className={styles.interactionsPreamble}>
            The following patterns were detected across your domain scores
            and may be worth reflecting on.
          </p>
          {triggeredFlags.map((f) => (
            <InteractionBlock key={f.rule} ruleId={f.rule} />
          ))}
        </section>
      )}

      {/* ── (4) Profile summary ─────────────────────────────── */}
      <ProfileSummary profileResult={profileResult} />

      {/* ── (5) Footer notices repeated at end ─────────────── */}
      <FooterNotices id="bottom-notices" />
    </div>
  )
}
