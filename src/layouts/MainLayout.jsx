import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { fadeUp, pageTransition } from '../constants/motion'

export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen text-zinc-900 transition-colors duration-300 dark:text-stone-50">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-50 blur-3xl transition-opacity duration-500"
        style={{ background: 'var(--hero-glow)' }}
        aria-hidden
      />
      <Navbar />

      <main className="relative min-h-[calc(100vh-4.5rem)] pt-[4.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
