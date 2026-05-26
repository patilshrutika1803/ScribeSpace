import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Flame, Heart, Mail, Sparkles, Target } from 'lucide-react'
import AnimatedCounter from '../components/AnimatedCounter'
import { staggerContainer, staggerItem } from '../constants/motion'
import {
  bodyText,
  btnGradient,
  cardInteractive,
  headingDisplay,
  heroSection,
  pageShell,
  subheading,
} from '../constants/ui'
import { getDashboardInsights } from '../utils/dashboardStats'

const modules = [
  {
    title: 'Journal',
    description: 'Write reflections, track moods, and revisit your thoughts.',
    icon: BookOpen,
    to: '/journal',
    active: true,
    cta: 'Open journal',
  },
  {
    title: 'Mood tracker',
    description: 'Log daily emotions, build streaks, and see your weekly patterns.',
    icon: Heart,
    to: '/mood',
    active: true,
    cta: 'Open mood tracker',
  },
  {
    title: 'Focus room',
    description: 'Pomodoro timer, breathing exercises, and session tracking.',
    icon: Target,
    to: '/focus',
    active: true,
    cta: 'Enter focus room',
  },
  {
    title: 'Future letters',
    description: 'Write to your future self. Coming soon.',
    icon: Mail,
    to: null,
    active: false,
    cta: null,
  },
]

export default function Dashboard() {
  const data = getDashboardInsights()

  return (
    <div className={pageShell}>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={heroSection}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className={subheading}>Your sanctuary</p>
              <h1 className={`${headingDisplay} mt-1`}>
                {data.greeting.label}, welcome back
              </h1>
              <p className={`mt-3 max-w-2xl text-base ${bodyText}`}>{data.greeting.tone}</p>
            </div>
          </div>
          <blockquote className="max-w-sm rounded-2xl border border-blue-200/50 bg-white/60 px-5 py-4 backdrop-blur-sm dark:border-primary-2/20 dark:bg-zinc-900/50">
            <p className="font-serif text-base italic leading-relaxed text-zinc-800 dark:text-stone-200">
              &ldquo;{data.quote}&rdquo;
            </p>
          </blockquote>
        </div>
      </motion.section>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: 'Journal entries', value: data.journalCount, icon: BookOpen, glow: false },
          {
            label: 'Mood streak',
            value: data.moodStreak,
            suffix: 'd',
            icon: Flame,
            glow: data.moodStreak > 0,
          },
          {
            label: "Today's mood",
            value: data.todayMood ?? '—',
            icon: Heart,
            isText: true,
            glow: false,
          },
          {
            label: 'Focus this week',
            value: data.focusWeekHours,
            suffix: 'h',
            icon: Clock,
            glow: false,
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className={`${cardInteractive} flex items-center gap-4 ${
              stat.glow ? 'ring-1 ring-amber-400/30 dark:ring-amber-500/20' : ''
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice-100 dark:bg-blue-950/35">
              <stat.icon className="h-5 w-5 text-primary dark:text-icy-300" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs uppercase tracking-wider ${bodyText}`}>{stat.label}</p>
              <p className="truncate text-lg font-semibold text-zinc-900 dark:text-stone-50">
                {stat.isText ? (
                  stat.value
                ) : (
                  <>
                    <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} />
                    {stat.suffix || ''}
                  </>
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {data.latestJournal && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`${cardInteractive} mb-10`}
        >
          <p className={subheading}>Latest reflection</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-zinc-900 dark:text-stone-50">
            {data.latestJournal.title}
          </h2>
          <p className={`mt-2 text-sm ${bodyText}`}>{data.latestJournal.preview}</p>
          <span className="mt-3 inline-block rounded-full bg-ice-100 px-3 py-1 text-xs font-medium text-cobalt-500 dark:bg-blue-950/35 dark:text-icy-200">
            {data.latestJournal.mood}
          </span>
          <Link to="/journal" className={`${btnGradient} mt-4 inline-flex text-sm`}>
            Continue writing
          </Link>
        </motion.section>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-6 sm:grid-cols-2"
      >
        {modules.map((item) => (
          <motion.article key={item.title} variants={staggerItem} className={cardInteractive}>
            <item.icon className="mb-4 h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110 dark:text-icy-300" />
            <h2 className="font-serif text-xl font-semibold text-zinc-900 dark:text-stone-50">
              {item.title}
            </h2>
            <p className={`mt-2 text-sm ${bodyText}`}>{item.description}</p>
            {item.active && item.to ? (
              <Link to={item.to} className={`${btnGradient} mt-5 inline-flex text-sm`}>
                {item.cta}
              </Link>
            ) : (
              <span className="mt-5 inline-block text-xs font-medium uppercase tracking-wider text-slate-400">
                Coming soon
              </span>
            )}
          </motion.article>
        ))}
      </motion.div>
    </div>
  )
}
