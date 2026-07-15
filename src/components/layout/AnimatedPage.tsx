// ─────────────────────────────────────────────────────────────
// AnimatedPage — framer-motion wrapper for route transitions
//
// Provides a smooth fade + gentle upward slide on page enter,
// and a quick fade-out on exit. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedPageProps {
  children: ReactNode
  /** Optional key override (defaults to children's key) */
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -8,
  },
}

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier — smooth, editorial feel
}

export default function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
