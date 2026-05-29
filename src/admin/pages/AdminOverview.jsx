import { motion } from 'framer-motion'
import { Activity, BookOpen, Clock, Sparkles, Heart, Users } from 'lucide-react'
import AnimatedCounter from '../../components/AnimatedCounter'
import EmptyState from '../../components/EmptyState'
import { cardInteractive, headingDisplay, bodyText, subheading } from '../../constants/ui'
import { getDashboardInsights } from '../../utils/dashboardStats'
import { getRelativeTodayCount } from './helpers'

function StatCard({ icon: Icon, label, value, hint, glow = false }) {
  return (
    <motion.div
      className={`relative ${cardInteractive} flex items-center gap-4`}
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${
          glow
            ? 'bg-gradient-to-br from-primary/20 via-accent/15 to-transparent ring-1 ring-primary/30'
            : 'bg-ice-100'
        } shadow-inner dark:bg-blue-950/35`}
      >
        <Icon className="h-5 w-5 text-primary dark:text-icy-300" />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-stone-300">{label}</p>
        <p className="mt-1 truncate font-serif text-3xl font-semibold text-zinc-900 dark:text-stone-50">
          {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
        </p>
        {hint ? <p className={`mt-1 text-xs ${bodyText}`}>{hint}</p> : null}
      </div>
    </motion.div>
  )
}

export default function AdminOverview() {
  // Use existing user-facing insights for a “wellness” flavor.
  // Admin stats are demo (until backend exists).
  const data = getDashboardInsights()

  // Safe demo derivations for “active today” etc.
  const activeUsersToday = getRelativeTodayCount('activeUsersToday', 86)
  const totalUsers = getRelativeTodayCount('totalUsers', 1248)

  const totalJournalEntries = 5320
  const totalMoodLogs = 3912
  const totalFocusSessions = 2140

  // Derive a wellness score placeholder using available dashboard mood
  const wellnessScore = data.todayMood ? 86.4 : 79.2

  return (
    <div className="space-y-7">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-sm font-medium uppercase tracking-wider text-primary dark:text-icy-300">Admin overview</p>
        <h1 className={`${headingDisplay} mt-1`}>Control center</h1>
        <p className={`mt-3 max-w-2xl ${bodyText}`}>
          Premium wellness admin console (demo data). Analytics + moderation powered by local mock state.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Users} label="Total Users" value={totalUsers} glow />
        <StatCard
          icon={Activity}
          label="Active Users Today"
          value={activeUsersToday}
          hint="Updated moments ago"
        />
        <StatCard icon={BookOpen} label="Total Journal Entries" value={totalJournalEntries} />
        <StatCard icon={Heart} label="Total Mood Logs" value={totalMoodLogs} />
        <StatCard icon={Clock} label="Total Focus Sessions" value={totalFocusSessions} />
        <StatCard
          icon={Sparkles}
          label="Average Wellness Score"
          value={Math.round(wellnessScore * 10) / 10}
          hint="Cinematic wellness index"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.section
          className={cardInteractive}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className={subheading}>Today’s reflection pulse</p>
          <h2 className="mt-1 font-serif text-2xl font-semibold text-zinc-900 dark:text-stone-50">
            {data.greeting.label}, welcome back
          </h2>
          <p className={`mt-2 text-sm ${bodyText}`}>{data.greeting.tone}</p>
          <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-stone-300">Latest quote</p>
            <p className="mt-2 font-serif text-lg italic text-zinc-900 dark:text-stone-50">“{data.quote}”</p>
          </div>
        </motion.section>

        <EmptyState
          title="Demo mode"
          description="Admin features run on local mock data (no backend). Replace mock modules with real APIs later."
          className="h-full"
        />
      </div>
    </div>
  )
}

