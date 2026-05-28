import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { bodyText, btnGhost, btnGradient, headingDisplay } from '../constants/ui'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300"
        style={{ background: 'var(--hero-glow)' }}
        aria-hidden
      />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-[#f4f7fb]/70 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/70 dark:text-stone-400"
        >
          <Sparkles className="h-4 w-4 text-primary dark:text-icy-300" />
          <span>Emotional AI wellness, reimagined</span>
        </motion.div>

        <motion.h1
          variants={item}
          className={`${headingDisplay} text-5xl sm:text-6xl lg:text-7xl`}
        >
          From mental chaos
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-primary-2 dark:to-accent-2">
            to clarity
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className={`mx-auto mt-6 max-w-2xl text-lg sm:text-xl ${bodyText} text-slate-700/95`}
        >
          ScribeSpace is your cinematic sanctuary — a calm, immersive space where
          emotional intelligence meets thoughtful design.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to="/signup" className={`${btnGradient} group`}>
            Begin your journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/login" className={btnGhost}>
            I already have an account
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 to-transparent dark:from-primary-2/50"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        aria-hidden
      />
    </section>
  )
}

