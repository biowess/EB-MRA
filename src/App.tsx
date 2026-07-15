// ─────────────────────────────────────────────────────────────
// App — root with React Router + framer-motion page transitions
//
// Routes:
//   /              → HomeView        (landing page + CTA)
//   /assessment    → AssessmentRunner (full consent → questions → report flow)
//   /about         → AboutView       (placeholder)
//   /results       → LastResultView  (cached last result from localStorage)
//   /documentation → DocumentationView
//   /license       → LicenseView     (custom source-available license)
//   /privacy       → PrivacyView     (privacy policy)
//   /faq           → FaqView         (frequently asked questions)
//   *              → NotFoundView    (404 catch-all)
//
// TopNav is rendered inside PageShell, so every routed view that
// wraps itself in PageShell automatically gets the nav bar.
// AssessmentRunner renders its own PageShell internally.
//
// AnimatePresence wraps the routes to enable smooth cross-fade
// transitions between pages via the AnimatedPage component.
// ─────────────────────────────────────────────────────────────


import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from './components/layout/AnimatedPage'
import TopNav from './components/layout/TopNav'
import HomeView from './views/HomeView'
import AssessmentRunner from './views/AssessmentRunner'
import AboutView from './views/AboutView'
import LastResultView from './views/LastResultView'
import DocumentationView from './views/DocumentationView'
import LicenseView from './views/LicenseView'
import PrivacyView from './views/PrivacyView'
import FaqView from './views/FaqView'
import NotFoundView from './views/NotFoundView'
import SafetyResourcesScreen from './views/SafetyResourcesScreen'

function AnimatedRoutes() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <AnimatePresence 
      mode="wait"
      onExitComplete={() => {
        // Temporarily disable smooth scrolling for an instant jump
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        // Restore smooth scrolling via CSS
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = '';
        });
      }}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/"              element={<AnimatedPage><HomeView /></AnimatedPage>} />
        <Route path="/assessment"    element={<AnimatedPage><AssessmentRunner /></AnimatedPage>} />
        <Route path="/about"         element={<AnimatedPage><AboutView /></AnimatedPage>} />
        <Route path="/results"       element={<AnimatedPage><LastResultView /></AnimatedPage>} />
        <Route path="/documentation" element={<AnimatedPage><DocumentationView /></AnimatedPage>} />
        <Route path="/license"       element={<AnimatedPage><LicenseView /></AnimatedPage>} />
        <Route path="/privacy"       element={<AnimatedPage><PrivacyView /></AnimatedPage>} />
        <Route path="/faq"           element={<AnimatedPage><FaqView /></AnimatedPage>} />
        <Route path="/safety-preview" element={<AnimatedPage><SafetyResourcesScreen onReturnHome={() => navigate('/')} /></AnimatedPage>} />
        <Route path="*"              element={<AnimatedPage><NotFoundView /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <HashRouter>
      <TopNav />
      <AnimatedRoutes />
    </HashRouter>
  )
}

export default App
