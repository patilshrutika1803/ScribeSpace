import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  BookOpen,
  Brain,
  Coffee,
  Clock,
  Flame,
  Maximize,
  Minimize,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react'
import EmptyState from '../components/EmptyState'
import AnimatedCounter from '../components/AnimatedCounter'
import { staggerContainer, staggerItem } from '../constants/motion'
import {
  bodyText,
  btnGradient,
  btnGhost,
  card,
  cardSoft,
  headingDisplay,
  heroSection,
  pageShell,
  sectionTitle,
  subheading,
} from '../constants/ui'
import { AMBIENT_MODES, startAmbient, stopAmbient } from '../utils/ambientAudio'
import { playCompletionSound } from '../utils/focusSounds'
import {
  FOCUS_PRESETS,
  FOCUS_MODES,
  createSession,
  deleteSession,

  formatSessionDate,
  formatTime,
  getFocusStats,
  getModeConfig,
  getRandomQuote,
  getSessions,
} from '../utils/focusStorage'
import { api } from '../utils/api'


const MODE_ICONS = {
  'Deep Work': Brain,
  Study: BookOpen,
  Meditation: Sparkles,
  Breathing: Wind,
  Relax: Coffee,
  'Night Focus': Moon,
}

const BREATH_PHASES = [
  { label: 'Inhale', duration: 4, scale: 1.18 },
  { label: 'Hold', duration: 4, scale: 1.18 },
  { label: 'Exhale', duration: 4, scale: 0.82 },
]

function BreathingCircle({ timerActive }) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const phase = BREATH_PHASES[phaseIndex]

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % BREATH_PHASES.length)
    }, phase.duration * 1000)
    return () => clearTimeout(timer)
  }, [phaseIndex, phase.duration])

  return (
    <div className="flex flex-col items-center py-6">
      <motion.div
        animate={{
          scale: phase.scale,
          boxShadow: timerActive
                ? '0 0 48px rgba(37, 99, 235, 0.40)'
                : '0 0 24px rgba(37, 99, 235, 0.18)',
        }}
        transition={{ duration: phase.duration, ease: 'easeInOut' }}
        className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-ice-400/30 via-primary-2/25 to-accent-2/35 ring-2 ring-primary/35"
      >
        <motion.div
          animate={{ scale: phase.scale }}
          transition={{ duration: phase.duration, ease: 'easeInOut' }}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-xl"
        >
          <Wind className="h-10 w-10 text-white" />
        </motion.div>
      </motion.div>
      <motion.p
        key={phase.label}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 text-lg font-medium text-primary dark:text-icy-300"
      >
        {phase.label}
      </motion.p>

      <p className={`mt-1 text-sm ${bodyText}`}>Breathe with the orb — 4s per phase</p>
    </div>
  )
}

export default function Focus() {
  const [sessions, setSessions] = useState(() => getSessions())
  const [mode, setMode] = useState('Deep Work')

  const [durationMin, setDurationMin] = useState(25)
  const [remaining, setRemaining] = useState(25 * 60)
  const [status, setStatus] = useState('idle')
  const [quote, setQuote] = useState(() => getRandomQuote())
  const [ambient, setAmbient] = useState('silence')
  const [soundOn, setSoundOn] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const completedRef = useRef(false)
  const focusRef = useRef(null)

  const totalSeconds = durationMin * 60
  const [stats, setStats] = useState(() => ({
    totalSessions: 0,
    totalHours: 0,
    todaySessions: 0,
    streak: 0,
  }))

  useEffect(() => {
    let cancelled = false

    const loadStats = async () => {
      try {
        const apiStats = await api.getFocusStats()

        // Backend currently returns: { totalMinutes, totalHours, sessionsCount }
        // but the UI expects: { totalSessions, totalHours, todaySessions, streak }
        // Map + provide safe fallbacks so Focus page never crashes.
        const totalSessions = apiStats?.sessionsCount ?? apiStats?.sessionsCount === 0 ? apiStats.sessionsCount : 0
        const totalHours = apiStats?.totalHours ?? 0

        const mapped = {
          totalSessions,
          totalHours,
          todaySessions: totalSessions,
          streak: 0,
        }


        if (!cancelled) setStats(mapped)
      } catch {
        // Keep existing UI values if stats fail to load
      }
    }


    loadStats()

    return () => {
      cancelled = true
    }
  }, [])

  const modeConfig = getModeConfig(mode)
  const progress = totalSeconds > 0 ? (totalSeconds - remaining) / totalSeconds : 0
  const timerActive = status === 'running'

  const ringRadius = 100
  const circumference = 2 * Math.PI * ringRadius
  const strokeOffset = circumference * (1 - progress)

  const handleComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true

    // Persist completion to backend
    api
      .createFocusSession(mode, durationMin, true)
      .catch(() => {
        // Keep existing UX even if API fails
      })

    // Preserve existing local session history + UI exactly as before
    const session = createSession({ mode, duration: durationMin, completed: true })
    setSessions((prev) => [session, ...prev])

    setQuote(getRandomQuote())
    if (soundOn) playCompletionSound()
  }, [mode, durationMin, soundOn])


  useEffect(() => {
    if (status !== 'running') return undefined
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setStatus('completed')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [status])

  useEffect(() => {
    if (status === 'completed') handleComplete()
    if (status !== 'completed') completedRef.current = false
  }, [status, handleComplete])

  useEffect(() => {
    startAmbient(ambient)
    return () => stopAmbient()
  }, [ambient])

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => document.removeEventListener('fullscreenchange', onFullscreen)
  }, [])

  const toggleFullscreen = useCallback(async () => {
    if (!focusRef.current) return
    if (!document.fullscreenElement) {
      await focusRef.current.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return
      if (e.code === 'Space') {
        e.preventDefault()
        if (status === 'running') setStatus('paused')
        else if (status === 'paused') setStatus('running')
        else if (status === 'idle' || status === 'completed') {
          setQuote(getRandomQuote())
          if (remaining <= 0) setRemaining(totalSeconds)
          setStatus('running')
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        setRemaining(totalSeconds)
        setStatus('idle')
        completedRef.current = false
      }
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, remaining, totalSeconds, toggleFullscreen])

  const setPreset = (minutes) => {
    if (status === 'running' || status === 'paused') return
    setDurationMin(minutes)
    setRemaining(minutes * 60)
    setStatus('idle')
  }

  const timerRunning = status === 'running' || status === 'paused'

  return (
    <div ref={focusRef} className={`${pageShell} ${isFullscreen ? 'min-h-screen bg-zinc-950/95' : ''}`}>
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={heroSection}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
              <Target className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className={subheading}>Focus room</p>
              <h1 className={headingDisplay}>Your calm workspace</h1>
              <p className={`mt-2 max-w-xl ${bodyText}`}>
                Pomodoro sessions, ambient sound, and breath — keyboard: Space pause, R reset, F fullscreen.
              </p>
            </div>
          </div>
          {!isFullscreen && (
            <Link to="/dashboard" className="text-sm font-medium text-primary dark:text-icy-300">
              ← Dashboard
            </Link>
          )}
        </div>
      </motion.header>

      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 rounded-2xl border border-blue-200/50 bg-white/80 px-6 py-5 shadow-sm backdrop-blur-xl dark:border-primary-2/20 dark:bg-zinc-900/60"
      >
        <p className="font-serif text-lg italic leading-relaxed text-zinc-800 dark:text-stone-200">
          &ldquo;{quote}&rdquo;
        </p>
      </motion.blockquote>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`text-sm ${bodyText}`}>Ambience</span>
        {AMBIENT_MODES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmbient(a)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-all duration-300 ${
              ambient === a
                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                : 'border border-stone-200 bg-white/90 dark:border-white/10 dark:bg-zinc-800'
            }`}
          >
            {a}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSoundOn((s) => !s)}
          className={btnGhost}
          title="Completion sound"
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button type="button" onClick={toggleFullscreen} className={btnGhost}>
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total sessions', value: stats?.totalSessions ?? 0, icon: Target },
          { label: 'Focus time', value: stats?.totalHours ?? 0, suffix: 'h', icon: Clock },
          { label: "Today's sessions", value: stats?.todaySessions ?? 0, icon: Sparkles },
          { label: 'Streak', value: stats?.streak ?? 0, suffix: 'd', icon: Flame, glow: (stats?.streak ?? 0) > 0 },

        ].map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className={`${card} flex items-center gap-4 ${stat.glow ? 'shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/25' : ''}`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ice-100 dark:bg-blue-950/35">
              <stat.icon className="h-5 w-5 text-primary dark:text-icy-300" />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider ${bodyText}`}>{stat.label}</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-stone-50">
                {stat.suffix ? (
                  <>
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </>
                ) : stat.label === 'Focus time' ? (
                  `${stat.value}h`
                ) : (
                  <AnimatedCounter value={stat.value} />
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <section className="mb-8">
        <h2 className={sectionTitle}>Focus mode</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_MODES.map((m) => {
            const Icon = MODE_ICONS[m.id]
            const selected = mode === m.id
            return (
              <motion.button
                key={m.id}
                type="button"
                disabled={timerRunning}
                onClick={() => setMode(m.id)}
                whileTap={{ scale: 0.98 }}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  selected
            ? `border-transparent bg-gradient-to-br ${m.gradient} text-white shadow-lg shadow-primary/20`
                    : 'border-stone-200/90 bg-white/90 hover:border-blue-300 dark:border-white/10 dark:bg-zinc-900/70'
                } ${timerRunning ? 'opacity-60' : 'hover:-translate-y-0.5'}`}
              >
                <Icon className={`mb-2 h-6 w-6 ${selected ? 'text-white' : 'text-primary dark:text-icy-300'}`} />
                <p className={`font-semibold ${selected ? 'text-white' : 'text-zinc-900 dark:text-stone-50'}`}>{m.id}</p>
                <p className={`mt-1 text-xs ${selected ? 'text-white/90' : bodyText}`}>{m.description}</p>
              </motion.button>
            )
          })}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.section
          animate={
            timerActive
              ? { boxShadow: '0 0 40px rgba(139, 92, 246, 0.25)' }
              : { boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }
          }
          transition={{ duration: 0.5 }}
          className={`${cardSoft} ${timerActive ? 'ring-2 ring-primary/40' : ''}` }
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${modeConfig.badge}`}>{mode}</span>
            {status === 'completed' && (
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Session complete</span>
            )}
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {FOCUS_PRESETS.map((min) => (
              <button
                key={min}
                type="button"
                disabled={timerRunning}
                onClick={() => setPreset(min)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  durationMin === min
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
                    : 'border border-stone-200/90 bg-white dark:border-white/10 dark:bg-zinc-800'
                }`}
              >
                {min} min{min === 25 ? ' · Pomodoro' : ''}
              </button>
            ))}
          </div>

          <div className="relative mx-auto mb-8 flex h-64 w-64 items-center justify-center">
            {timerActive && (
              <motion.div
                className="absolute inset-4 rounded-full bg-primary/15 blur-2xl"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <svg className="-rotate-90" width="256" height="256" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r={ringRadius} fill="none" strokeWidth="10" className="stroke-stone-200/80 dark:stroke-zinc-800" />
              <motion.circle
                cx="128"
                cy="128"
                r={ringRadius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className="stroke-primary dark:stroke-icy-300"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-5xl font-semibold tracking-tight text-zinc-900 dark:text-stone-50">
                {formatTime(remaining)}
              </span>
              <span className={`mt-1 text-sm ${bodyText}`}>
                {status === 'idle' && 'Ready'}
                {status === 'running' && 'In focus'}
                {status === 'paused' && 'Paused'}
                {status === 'completed' && 'Done'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {(status === 'idle' || status === 'completed') && (
              <motion.button type="button" onClick={() => { setQuote(getRandomQuote()); if (remaining <= 0) setRemaining(totalSeconds); setStatus('running') }} className={btnGradient} whileTap={{ scale: 0.97 }}>
                <Play className="h-4 w-4" /> Start
              </motion.button>
            )}
            {status === 'running' && (
              <motion.button type="button" onClick={() => setStatus('paused')} className={btnGhost} whileTap={{ scale: 0.97 }}>
                <Pause className="h-4 w-4" /> Pause
              </motion.button>
            )}
            {status === 'paused' && (
              <motion.button type="button" onClick={() => setStatus('running')} className={btnGradient} whileTap={{ scale: 0.97 }}>
                <Play className="h-4 w-4" /> Resume
              </motion.button>
            )}
            {(status === 'running' || status === 'paused' || status === 'completed') && (
              <motion.button type="button" onClick={() => { setRemaining(totalSeconds); setStatus('idle'); completedRef.current = false }} className={btnGhost} whileTap={{ scale: 0.97 }}>
                <RotateCcw className="h-4 w-4" /> Reset
              </motion.button>
            )}
          </div>
        </motion.section>

        <section className={`${cardSoft} ${mode === 'Breathing' ? 'ring-2 ring-teal-400/35' : ''}`}>
          <div className="mb-2 border-b border-stone-100 px-6 py-4 dark:border-white/5">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-stone-50">Breathing mode</h2>
            <p className={`text-sm ${bodyText}`}>Inhale · hold · exhale — synced with your focus energy.</p>
          </div>
          <BreathingCircle timerActive={timerActive} />
        </section>
      </div>

      <section className="mt-10">
        <h2 className={sectionTitle}>Session history ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Your calm workspace is waiting."
            description="Begin a gentle focus session when you are ready. There is no rush — only presence."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {sessions.map((session, index) => {
              const config = getModeConfig(session.mode)
              const Icon = MODE_ICONS[session.mode] || Target
              return (
                <motion.article
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`${card} group flex gap-4`}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.gradient}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-stone-50">{session.mode}</p>
                        <p className={`text-sm ${bodyText}`}>
                          {session.duration} min · {session.completed ? 'Completed' : 'Incomplete'}
                        </p>
                      </div>
                      <button type="button" onClick={() => setSessions(deleteSession(session.id))} className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 hover:text-rose-500" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{formatSessionDate(session.createdAt)}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
