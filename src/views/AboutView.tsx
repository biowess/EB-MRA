// ─────────────────────────────────────────────────────────────
// AboutView — placeholder about page
// ─────────────────────────────────────────────────────────────

import PageShell from '../components/layout/PageShell'

export default function AboutView() {
  return (
    <PageShell
      label="About"
      title="About EB-MRA"
    >
      <section aria-labelledby="about-purpose-heading">
        <h2 id="about-purpose-heading">Purpose</h2>
        <p>
          The Evidence-Based Medical Readiness Assessment (EB-MRA) is an
          open-source self-reflection instrument designed for medical students,
          residents, and clinicians. It is not a diagnostic test, an admissions
          criterion, or a performance evaluation — it is a mirror.
        </p>
        <p>
          The goal is to help practitioners understand their current dispositions
          across eight evidence-based medicine readiness domains and to identify
          areas for deliberate growth.
        </p>
      </section>

      <section aria-labelledby="about-domains-heading" style={{ marginTop: 'var(--space-10)' }}>
        <h2 id="about-domains-heading">The Eight Domains</h2>
        <ol style={{ paddingLeft: 'var(--space-6)', lineHeight: 'var(--leading-relaxed)' }}>
          <li><strong>Systems &amp; Analytical Reasoning (SAR)</strong></li>
          <li><strong>Evidence Literacy &amp; Critical Appraisal (ELCA)</strong></li>
          <li><strong>Intellectual Humility &amp; Openness to Revision (IHOR)</strong></li>
          <li><strong>Ambiguity Tolerance (AMB)</strong></li>
          <li><strong>Empathic Communication &amp; Patient-Centred Care (ECPC)</strong></li>
          <li><strong>Ethics &amp; Reflective Practice (ERP)</strong></li>
          <li><strong>Conscientiousness &amp; Self-Regulation (CSR)</strong></li>
          <li><strong>Resilience &amp; Stress Tolerance (RST)</strong></li>
        </ol>
      </section>

      <section aria-labelledby="about-author-heading" style={{ marginTop: 'var(--space-10)' }}>
        <h2 id="about-author-heading">Authorship</h2>
        <p>
          Developed by Mohammed W. Hammami. This tool is open-source and
          freely available for educational use.
        </p>
      </section>
    </PageShell>
  )
}
