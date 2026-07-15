// ─────────────────────────────────────────────────────────────
// PrivacyView — Privacy Policy page
//
// EB-MRA collects no personal data, uses no analytics,
// uses no cookies except optional localStorage for results.
// This policy documents that in a clear, readable format.
// ─────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import styles from './PrivacyView.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function PrivacyView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className={styles.page} id="main-content">
        <div className={styles.container}>

          {/* ── Header ──────────────────────────────────────── */}
          <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.eyebrow}>Legal</span>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.meta}>Last updated: July 2026 · Effective immediately upon use</p>
          </motion.header>

          {/* ── Intro callout ────────────────────────────────── */}
          <motion.div
            className={styles.callout}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <p>
              <strong>Short version:</strong> EB-MRA does not collect, store, or transmit any personal
              data to external servers. There are no analytics trackers, no cookies, and no accounts.
              Your assessment responses exist only in your browser for the duration of your session, or
              in your browser's <code>localStorage</code> if you choose to save results.
            </p>
          </motion.div>

          {/* ── 1. Who we are ───────────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            aria-labelledby="who-heading"
          >
            <h2 className={styles.sectionTitle} id="who-heading">1. Who We Are</h2>
            <div className={styles.sectionBody}>
              <p>
                EB-MRA (Evidence Based Medicine Readiness Assessment) is a research tool developed by
                <strong> Mohammed W. Hammami</strong> as part of ongoing psychometric research into
                evidence-based medicine competency. This application is a static single-page web
                application with no backend server of its own.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 2. Data we collect ──────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            aria-labelledby="data-heading"
          >
            <h2 className={styles.sectionTitle} id="data-heading">2. Data We Collect</h2>
            <div className={styles.sectionBody}>
              <p>
                We collect <strong>no personal data</strong>. The table below summarises every category
                of data that touches this application and where it goes.
              </p>
            </div>
            <table className={styles.dataTable} aria-label="Data collection summary">
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">What happens</th>
                  <th scope="col">Stored where</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Assessment responses</strong></td>
                  <td>Held in React component state during your session. Never sent to any server.</td>
                  <td>Browser memory (RAM) only. Cleared when tab closes.</td>
                </tr>
                <tr>
                  <td><strong>Last result cache</strong></td>
                  <td>
                    If you complete an assessment, the scored result may be saved to{' '}
                    <code>localStorage</code> so you can revisit it at <em>/results</em>.
                  </td>
                  <td>
                    Your browser's <code>localStorage</code> — never leaves your device.
                    You can clear it at any time via your browser settings.
                  </td>
                </tr>
                <tr>
                  <td><strong>Analytics</strong></td>
                  <td>None. No Google Analytics, Plausible, Mixpanel, or any third-party tracker.</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td><strong>Cookies</strong></td>
                  <td>No cookies are set by this application.</td>
                  <td>N/A</td>
                </tr>
                <tr>
                  <td><strong>IP address / server logs</strong></td>
                  <td>
                    If this app is hosted on a static host (e.g. Netlify, Vercel, GitHub Pages),
                    the host may log your IP address as part of standard web server operation.
                    This is outside our control and subject to the host's privacy policy.
                  </td>
                  <td>Hosting provider only — not accessible to the developer.</td>
                </tr>
              </tbody>
            </table>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 3. No third-party services ──────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            aria-labelledby="third-heading"
          >
            <h2 className={styles.sectionTitle} id="third-heading">3. Third-Party Services</h2>
            <div className={styles.sectionBody}>
              <p>
                EB-MRA loads <strong>no external scripts, fonts, or assets</strong> from third-party
                domains. All fonts (Source Serif 4, Newsreader) are self-hosted within this repository.
                There are no CDN dependencies that could track you.
              </p>
              <p>
                External links in the footer (e.g. ResearchGate, GitHub) are regular hyperlinks.
                Clicking them opens those third-party sites in a new tab and subjects you to their
                respective privacy policies. We have no relationship with, nor receive any data from,
                those services as a result of your navigation.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 4. localStorage ─────────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            aria-labelledby="storage-heading"
          >
            <h2 className={styles.sectionTitle} id="storage-heading">4. Local Storage &amp; Your Control</h2>
            <div className={styles.sectionBody}>
              <p>
                The only browser storage this application may use is <code>localStorage</code> to
                persist your most recent assessment result, enabling the <em>/results</em> view.
                This data:
              </p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-ink-muted)' }}>
                <li style={{ marginBottom: 'var(--space-2)' }}>Is stored <strong>entirely on your device</strong>.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>Is <strong>never transmitted</strong> to any server.</li>
                <li style={{ marginBottom: 'var(--space-2)' }}>Contains only your aggregate domain scores — not individual responses.</li>
                <li>Can be deleted at any time via your browser's developer tools or settings.</li>
              </ul>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 5. Children ─────────────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            aria-labelledby="children-heading"
          >
            <h2 className={styles.sectionTitle} id="children-heading">5. Children's Privacy</h2>
            <div className={styles.sectionBody}>
              <p>
                EB-MRA is designed for use by qualified clinicians, medical students, and health
                professionals. It is not directed at children under 13. We collect no data from any
                user, so no special measures regarding minors are required beyond this notice.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 6. Changes to this policy ───────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            aria-labelledby="changes-heading"
          >
            <h2 className={styles.sectionTitle} id="changes-heading">6. Changes to This Policy</h2>
            <div className={styles.sectionBody}>
              <p>
                If this policy changes materially (e.g. because analytics are added in a future
                version), the "Last updated" date above will change and a note will appear in the
                project's GitHub release notes. We encourage you to review this page periodically.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── 7. Contact ──────────────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={7}
            aria-labelledby="contact-heading"
          >
            <h2 className={styles.sectionTitle} id="contact-heading">7. Contact</h2>
            <div className={styles.sectionBody}>
              <p>
                Questions about this privacy policy or data handling practices can be directed to the
                author via the project's GitHub Issues page.
              </p>
            </div>
            <div className={styles.contactBlock}>
              <p><strong>Mohammed W. Hammami</strong></p>
              <p>
                Contact via:{' '}
                <a
                  href="https://github.com/biowess/EB-MRA/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Issues ↗
                </a>
              </p>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)' }}>
                Please allow up to 14 days for a response.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Back link ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <Link to="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-faint)' }}>
              ← Back to home
            </Link>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
