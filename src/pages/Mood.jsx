import { useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Cloud,
  Frown,
  Heart,
  Check,
  Loader2,
  Moon,
  Smile,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UserX,
  Zap,
} from 'lucide-react'
import EmptyState from '../components/EmptyState'
import AnimatedCounter from '../components/AnimatedCounter'
import {
  bodyText,
  btnGradient,
  card,
  cardSoft,
  headingDisplay,
  heroSection,
  label,
  pageShell,
  subheading,
} from '../constants/ui'
import {
  MOOD_CONFIG,
  MOOD_LIST,
  formatMoodDate,
  getMoodStats,
  getTodayLogs,
} from '../utils/moodStorage'

import { api } from '../utils/api'


const MOOD_ICONS = {
  Happy: Smile,
  Calm: Cloud,
  Focused: Target,
  Emotional: Heart,
  Tired: Moon,
  Anxious: Frown,
  Excited: Sparkles,
  Lonely: UserX,
}

const textareaClass =
  'min-h-[88px] w-full resize-y rounded-xl border border-stone-300 bg-white/90 px-4 py-3 text-zinc-900 placeholder:text-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-white/15 dark:bg-zinc-950/50 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-400 dark:focus:ring-violet-400/25'

export default function Mood() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState('Calm')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)


  const stats = useMemo(() => getMoodStats(logs), [logs])
  const todayLogs = useMemo(() => getTodayLogs(logs), [logs])


  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const rawLogs = await api.getMoodHistory()

        const normalized = (rawLogs || [])
          .map((log) => ({
            id: log?._id ?? log?.id,
            mood: log?.mood,
            note: log?.note ?? '',
            createdAt: log?.createdAt,
          }))
          .filter((l) => l.id && l.mood && l.createdAt)

        if (isMounted) setLogs(normalized)
      } catch (err) {
        // preserve UI; failure just results in empty history
        if (isMounted) setLogs([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSave = (e) => {

    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      api
        .saveMood(selectedMood, note)
        .then((log) => {
          const normalized = {
            id: log?._id ?? log?.id,
            mood: log?.mood,
            note: log?.note ?? '',
            createdAt: log?.createdAt,
          }

          setLogs((prev) => [normalized, ...prev])
          setNote('')
          setSaving(false)
          setSaved(true)
          setTimeout(() => setSaved(false), 2200)
        })
        .catch(() => {
          setSaving(false)
        })
    }, 600)
  }

  const handleDelete = async (id) => {
    if (!id) return

    try {
      await api.deleteMoodLog(id)

      // Refresh mood history immediately after deletion
      const rawLogs = await api.getMoodHistory()
      const normalized = (rawLogs || [])
        .map((log) => ({
          id: log?._id ?? log?.id,
          mood: log?.mood,
          note: log?.note ?? '',
          createdAt: log?.createdAt,
        }))
        .filter((l) => l.id && l.mood && l.createdAt)

      setLogs(normalized)
    } catch {
      // Preserve existing UI; failure results in no local change
    }
  }



  return (
    <div className={pageShell}>
      {/* Hero header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={heroSection}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <Heart className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className={subheading}>Emotional wellness</p>
              <h1 className={`${headingDisplay} mt-1`}>Mood tracker</h1>
              <p className={`mt-2 max-w-xl ${bodyText}`}>
                Check in with yourself daily. Your mood history stays private on this device.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-300"
          >
            ← Back to dashboard
          </Link>
        </div>
      </motion.header>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total logs', value: stats.total, icon: TrendingUp },
          {
            label: 'Current streak',
            value: stats.streak,
            suffix: 'd',
            icon: Zap,
            glow: stats.streak > 0,
          },
          {
            label: 'Most frequent',
            value: stats.mostFrequent ?? '—',
            icon: MOOD_ICONS[stats.mostFrequent] || Heart,
          },
          {
            label: 'This week',
            value: stats.weekDominant ?? '—',
            icon: MOOD_ICONS[stats.weekDominant] || Sparkles,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.04 }}
            className={`${card} flex items-center gap-4 ${stat.glow ? 'ring-1 ring-amber-400/35 shadow-lg shadow-amber-500/10' : ''}`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
              <stat.icon className="h-5 w-5 text-violet-700 dark:text-violet-300" />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider ${bodyText}`}>{stat.label}</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-stone-50">
                {stat.suffix ? (
                  <>
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </>
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly overview */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/80 sm:p-8"
      >
        <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-stone-50">
          Weekly mood overview
        </h2>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {stats.weeklyOverview.map((day) => {
            const Icon = day.mood ? MOOD_ICONS[day.mood] : null
            const config = day.mood ? MOOD_CONFIG[day.mood] : null
            return (
              <div
                key={day.date.toISOString()}
                className="flex flex-col items-center gap-2 rounded-xl border border-stone-100 bg-stone-50/80 p-2 transition-all duration-200 hover:shadow-md dark:border-white/5 dark:bg-zinc-800/50 sm:p-3"
              >
                <span className="text-xs font-medium text-slate-500 dark:text-stone-500">{day.label}</span>
                {day.mood && Icon && config ? (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${config.gradient} shadow-md`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-stone-300 dark:border-white/20">
                    <span className="text-xs text-slate-400">—</span>
                  </div>
                )}
                <span className="hidden text-center text-[10px] text-slate-500 sm:block dark:text-stone-500">
                  {day.mood ?? 'No log'}
                </span>
              </div>
            )
          })}
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Today's mood + save */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
          className="lg:col-span-2"
        >
          <form
            onSubmit={handleSave}
            className={`${cardSoft} hover:shadow-xl`}
          >
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-stone-50">
              Today&apos;s mood
            </h2>
            {todayLogs.length > 0 && (
              <p className={`mb-4 text-sm ${bodyText}`}>
                You have logged {todayLogs.length} time{todayLogs.length > 1 ? 's' : ''} today.
              </p>
            )}

            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MOOD_LIST.map((mood) => {
                const Icon = MOOD_ICONS[mood]
                const config = MOOD_CONFIG[mood]
                const selected = selectedMood === mood
                return (
                  <motion.button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    animate={selected ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-300 ${
                      selected
                        ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-lg ring-2 ${config.ring} shadow-violet-500/25`
                        : 'border-stone-200 bg-white hover:border-violet-300 dark:border-white/10 dark:bg-zinc-800 dark:hover:border-violet-500'
                    }`}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Icon className={`h-6 w-6 ${selected ? 'text-white' : 'text-violet-600 dark:text-violet-300'}`} />
                    <span
                      className={`text-xs font-medium ${selected ? 'text-white' : 'text-zinc-700 dark:text-stone-300'}`}
                    >
                      {mood}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <div className="mb-6">
              <label htmlFor="mood-note" className={label}>
                Optional note
              </label>
              <textarea
                id="mood-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A few words about how you feel…"
                className={textareaClass}
              />
            </div>

            <motion.button
              type="submit"
              disabled={saving}
              className={`${btnGradient} w-full ${saved ? 'ring-2 ring-emerald-400/50' : ''}`}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving mood…
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Save mood
                </>
              )}
            </motion.button>
          </form>
        </motion.section>

        {/* Mood history */}
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-stone-50">
            Mood history ({logs.length})
          </h2>

          {logs.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your feelings have a home here."
              description="A single check-in today is enough to begin a gentle streak of self-awareness."
            />
          ) : (
            <div className="space-y-4">
              {logs.map((log, index) => {
                const Icon = MOOD_ICONS[log.mood]
                const config = MOOD_CONFIG[log.mood]
                return (
                  <motion.article
                    key={log.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`${card} group flex gap-4 hover:-translate-y-0.5`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient} shadow-md`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}>
                          {log.mood}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDelete(log.id)}
                          className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-900/30 dark:hover:text-rose-300"
                          aria-label="Delete mood log"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {log.note ? (
                        <p className={`mt-2 text-sm ${bodyText}`}>{log.note}</p>
                      ) : (
                        <p className={`mt-2 text-sm italic ${bodyText}`}>No note added</p>
                      )}
                      <p className="mt-2 text-xs text-slate-500 dark:text-stone-500">
                        {formatMoodDate(log.createdAt)}
                      </p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
