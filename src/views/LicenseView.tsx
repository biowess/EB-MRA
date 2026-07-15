// ─────────────────────────────────────────────────────────────
// LicenseView — Custom Source-Available License 1.0
// Populated from the user's license text provided 2026-07-14
// ─────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import styles from './LicenseView.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function LicenseView() {
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
            <h1 className={styles.title}>Custom Source-Available License 1.0</h1>
            <p className={styles.meta}>Copyright © 2026 Mohammed W. Hammami · All rights reserved</p>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>Source-Available</span>
              <span className={styles.badge}>Non-Commercial</span>
              <span className={styles.badge}>Attribution Required</span>
            </div>
          </motion.header>

          {/* ── Section 1: Permissions ──────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            aria-labelledby="perm-heading"
          >
            <p className={styles.sectionNumber}>Section 1</p>
            <h2 className={styles.sectionTitle} id="perm-heading">Permission Granted</h2>
            <div className={styles.sectionBody}>
              <p>You are permitted to:</p>
            </div>
            <ul className={`${styles.permissionList} ${styles.permitList}`}>
              <li>View and study the source code.</li>
              <li>Clone and download the repository.</li>
              <li>Run the software locally for personal or educational use.</li>
              <li>Modify the source code for personal learning purposes.</li>
              <li>
                Share snippets or modified versions for non-commercial educational purposes,
                provided proper credit is clearly given to the original author.
              </li>
            </ul>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 2: Restrictions ─────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            aria-labelledby="restrict-heading"
          >
            <p className={styles.sectionNumber}>Section 2</p>
            <h2 className={styles.sectionTitle} id="restrict-heading">Restrictions</h2>
            <div className={styles.sectionBody}>
              <p>
                You may <strong>NOT</strong>, without prior written permission from the copyright holder:
              </p>
            </div>
            <ul className={`${styles.permissionList} ${styles.restrictList}`}>
              <li>Sell this software or any modified version of it.</li>
              <li>Use this software in a commercial product or service.</li>
              <li>Offer this software as a paid SaaS, hosted platform, or subscription service.</li>
              <li>Rebrand, sublicense, or redistribute this software while claiming it as your own work.</li>
              <li>Remove copyright notices, attribution, or license text.</li>
              <li>Use substantial portions of this software in commercial projects.</li>
              <li>Create commercial derivatives based primarily on this project.</li>
            </ul>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 3: Attribution ──────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            aria-labelledby="attr-heading"
          >
            <p className={styles.sectionNumber}>Section 3</p>
            <h2 className={styles.sectionTitle} id="attr-heading">Attribution Requirement</h2>
            <div className={styles.sectionBody}>
              <p>
                Any public use, fork, modification, or redistribution of this project or its
                derivatives must include visible credit to the original author.
              </p>
              <p>Example attribution:</p>
            </div>
            <blockquote className={styles.attributionBlock}>
              Hammami, M.W. (2026). The Evidence Based Medicine Readiness Assessment: Development,
              Scoring Architecture, and a Roadmap for Empirical Validation.
            </blockquote>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 4: Ownership ────────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            aria-labelledby="own-heading"
          >
            <p className={styles.sectionNumber}>Section 4</p>
            <h2 className={styles.sectionTitle} id="own-heading">Ownership</h2>
            <div className={styles.sectionBody}>
              <p>
                The software and all associated intellectual property remain the exclusive
                property of the copyright holder.
              </p>
              <p>
                This license does not transfer ownership of the software or grant any trademark rights.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 5: Contributions ────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
            aria-labelledby="contrib-heading"
          >
            <p className={styles.sectionNumber}>Section 5</p>
            <h2 className={styles.sectionTitle} id="contrib-heading">Contributions</h2>
            <div className={styles.sectionBody}>
              <p>
                Unless explicitly stated otherwise, any contributions submitted to this project
                may be incorporated into the project under this same license.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 6: Warranty Disclaimer ──────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
            aria-labelledby="warranty-heading"
          >
            <p className={styles.sectionNumber}>Section 6</p>
            <h2 className={styles.sectionTitle} id="warranty-heading">Warranty Disclaimer</h2>
            <div className={styles.warrantyBlock}>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              <br /><br />
              IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE,
              ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN THE SOFTWARE.
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Section 7: Acceptance ───────────────────────── */}
          <motion.section
            className={styles.section}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={7}
            aria-labelledby="accept-heading"
          >
            <p className={styles.sectionNumber}>Section 7</p>
            <h2 className={styles.sectionTitle} id="accept-heading">Acceptance</h2>
            <div className={styles.sectionBody}>
              <p>
                By cloning, downloading, using, or modifying this software, you agree to the
                terms of this license.
              </p>
            </div>
          </motion.section>

          <hr className={styles.divider} />

          {/* ── Back link ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
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
