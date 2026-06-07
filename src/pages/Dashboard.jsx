import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  BookOpen,
  Clock,
  Flame,
  Heart,
  Mail,
  Sparkles,
  Target,
  Quote,
  Shield,
  BarChart3,
} from 'lucide-react'

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

const premiumCardBase = `${cardInteractive} border-slate-200/70 bg-white/80 dark:bg-zinc-900/60`

function formatPercent(n) {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return '—'
  return `${Math.round(v)}%`
}



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
  const [data, setData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(null)


  const [stats, setStats] = useState({
    totalJournalEntries: 0,
    totalMoodLogs: 0,
    totalFocusSessions: 0,
    totalFocusMinutes: 0,
    mostCommonMood: '—',
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadAll() {
      try {
        setDataLoading(true)
        setDataError(null)

        const result = await api.getDashboardStats()
        if (cancelled) return

        // Backend returns the dashboard stats payload (greeting/quote/analytics/etc.)
        setData(result)
      } catch (err) {
        if (cancelled) return
        setDataError(err?.message || 'Failed to load dashboard data')
        setData(null)
      } finally {
        if (cancelled) return
        setDataLoading(false)
      }

      try {
        setStatsLoading(true)
        setStatsError(null)
        const result = await api.getDashboardStats()
        if (cancelled) return
        setStats(result)
      } catch (err) {
        if (cancelled) return
        setStatsError(err?.message || 'Failed to load dashboard stats')
        setStats(null)
      } finally {
        if (cancelled) return
        setStatsLoading(false)
      }
    }

    loadAll()
    return () => {
      cancelled = true
    }
  }, [])


  return (
    <div className={pageShell}>
      {dataLoading ? (
        <div className="flex items-center justify-center py-16" aria-busy="true" />
      ) : dataError ? (
        <div
          className={`${cardInteractive} border-white/30 bg-white/60 dark:bg-zinc-900/45 p-4`}
          role="alert"
        >
          <p className="font-medium text-zinc-900 dark:text-stone-50">Couldn’t load dashboard.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-stone-400">{dataError}</p>
        </div>
      ) : null}


      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={heroSection + ' relative overflow-hidden'}
      >
        {/* premium cinematic layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          aria-hidden
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#0B1633]/70 via-primary/10 to-accent/10"
          />
          <div
            className="absolute -top-24 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/25 via-accent/15 to-transparent blur-3xl"
          />
          <div
            className="absolute right-[-10rem] top-[-6rem] h-64 w-64 rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.55]"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(167,139,250,0.22), transparent 55%), radial-gradient(circle at 70% 40%, rgba(56,189,248,0.18), transparent 55%)' }}
          />
        </div>

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className={subheading}>Your sanctuary</p>
              <h1 className={`${headingDisplay} mt-1`}>
                {data?.greeting?.label || 'Welcome'}, welcome back
              </h1>
              <p className={`mt-3 max-w-2xl text-base ${bodyText}`}>{data?.greeting?.tone || ''}</p>
            </div>
          </div>
          <blockquote className="max-w-sm rounded-2xl border border-blue-200/50 bg-white/60 px-5 py-4 backdrop-blur-sm dark:border-primary-2/20 dark:bg-zinc-900/50">
            <p className="font-serif text-base italic leading-relaxed text-zinc-800 dark:text-stone-200">
              &ldquo;{data?.quote || ''}&rdquo;
            </p>
          </blockquote>
        </div>
      </motion.section>

      {/* Statistics (MongoDB-backed) */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
        className="mb-5"
      >
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className={subheading}>Statistics</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50">
              Your at-a-glance progress
            </h2>
          </div>
        </div>

        {statsLoading ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">

            {[
              'Journal Entries',
              'Mood Logs',
              'Focus Sessions',
              'Focus Minutes',
              'Most Common Mood',
            ].map((k) => (
              <div
                key={k}
                className={`${cardInteractive} h-[108px] min-h-[108px] border-white/20 bg-white/60 dark:bg-zinc-900/45 p-4 animate-pulse`}
              />
            ))}
          </div>
        ) : statsError ? (
          <div
            className={`${cardInteractive} border-white/30 bg-white/60 dark:bg-zinc-900/45 p-4`}
            role="alert"
          >
            <p className="font-medium text-zinc-900 dark:text-stone-50">Couldn’t load stats.</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-stone-400">{statsError}</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {[
              {
                label: 'Journal Entries',
                value: stats?.totalJournalEntries ?? 0,
                icon: BookOpen,
                accent: 'from-primary/30 via-accent/15 to-accent/0',
              },
              {
                label: 'Mood Logs',
                value: stats?.totalMoodLogs ?? 0,
                icon: Heart,
                accent: 'from-amber-400/25 via-amber-300/15 to-transparent',
              },
              {
                label: 'Focus Sessions',
                value: stats?.totalFocusSessions ?? 0,
                icon: Target,
                accent: 'from-accent/25 via-primary/15 to-transparent',
              },
              {
                label: 'Focus Minutes',
                value: stats?.totalFocusMinutes ?? 0,
                icon: Clock,
                accent: 'from-primary/25 via-cobalt-400/15 to-transparent',
              },
              {
                label: 'Most Common Mood',
                value: stats?.mostCommonMood ?? '—',
                icon: Flame,
                accent: 'from-amber-400/25 via-accent/15 to-transparent',
                textValue: true,
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={`${cardInteractive} relative flex flex-col justify-between overflow-hidden px-4 py-3 h-[108px] min-h-[108px]`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity bg-gradient-to-br ${stat.accent}`}
                  aria-hidden
                />

                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ice-100/70 shadow-inner dark:bg-blue-950/30">
                      <stat.icon className="h-5 w-5 text-primary dark:text-icy-300" />
                    </div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-stone-400">
                      {stat.label}
                    </p>
                  </div>

                  <p className={stat.textValue
                    ? 'mt-2 truncate font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50'
                    : 'mt-2 font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50'
                  }>
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Analytics row (6 compact stats in ONE responsive row) */}
      <motion.div

        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-4 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      >
        {[
          {
            label: 'Journal Entries',
            value: data.journalCount,
            icon: BookOpen,
            accent: 'from-primary/30 via-accent/15 to-accent/0',
            suffix: '',
          },
          {
            label: 'Mood Streak',
            value: data.moodStreak,
            icon: Flame,
            accent: 'from-amber-400/25 via-amber-300/15 to-transparent',
            suffix: 'd',
          },
          {
            label: "Today's Mood",
            value: data.todayMood ?? '—',
            icon: Heart,
            accent: 'from-primary/25 via-accent/15 to-transparent',
            textValue: true,
            suffix: '',
          },
          {
            label: 'Focus Hours',
            value: data.focusWeekHours,
            icon: Clock,
            accent: 'from-accent/25 via-primary/15 to-transparent',
            suffix: 'h',
          },
          {
            label: 'Wellness Score',
            value: formatPercent(
              50 + (data.moodStreak || 0) * 4 + (Number(data.focusWeekHours) || 0) * 2
            ),
            icon: Shield,
            accent: 'from-primary/25 via-cobalt-400/15 to-transparent',
            suffix: '',
          },
          {
            label: 'Weekly Progress',
            value: formatPercent(
              Math.min(100, 10 + (Number(data.journalCount) || 0) * 6)
            ),
            icon: BarChart3,
            accent: 'from-accent/25 via-primary/15 to-transparent',
            suffix: '',
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={
              `${cardInteractive} relative flex items-center gap-3 px-4 py-3 ` +
              'h-[108px] min-h-[108px]'
            }
          >
            <div
              className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-250 group-hover:opacity-100 bg-gradient-to-br ${stat.accent}`}
              aria-hidden
            />

            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ice-100/70 shadow-inner dark:bg-blue-950/30">
              <stat.icon className="h-5 w-5 text-primary dark:text-icy-300" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-stone-400">
                {stat.label}
              </p>

              <p className="mt-1 truncate font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50">
                {stat.textValue ? (
                  <span>{stat.value}</span>
                ) : (
                  <>
                    <AnimatedCounter
                      value={typeof stat.value === 'number' ? stat.value : Number(stat.value) || 0}
                    />
                    {stat.suffix}
                  </>
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Slim quote card below analytics */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={`${cardInteractive} mb-6 border-white/30 bg-white/60 dark:bg-zinc-900/45`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Quote className="h-4 w-4 text-primary dark:text-icy-300" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-stone-400">
              Daily Quote
            </span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <p className="font-serif text-base italic leading-relaxed text-zinc-900 dark:text-stone-200">“{data.quote}”</p>
          </div>
        </div>
      </motion.section>

      {/* Feature navigation cards (moved below analytics + quote) */}
      {data.latestJournal && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${cardInteractive} mb-6 border-white/40 bg-white/80 dark:bg-zinc-900/55`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={subheading}>Latest reflection</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50">
                {data.latestJournal.title}
              </h2>
              <div className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-stone-400">
                {data.latestJournal.preview}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              <span className="inline-flex items-center gap-2 rounded-full bg-ice-100 px-3 py-1 text-xs font-medium text-cobalt-600 shadow-sm dark:bg-blue-950/35 dark:text-icy-200">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(167,139,250,0.7)]"
                  aria-hidden
                />
                {data.latestJournal.mood}
              </span>
            </div>
          </div>
        </motion.section>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-6 lg:grid-cols-2"
      >
        {modules.map((item) => (
          <motion.article
            key={item.title}
            variants={staggerItem}
            className={cardInteractive}
          >
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

