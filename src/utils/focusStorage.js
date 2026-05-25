const STORAGE_KEY = 'scribespace-focus-sessions'

export const FOCUS_PRESETS = [15, 25, 45, 60]

export const FOCUS_MODES = [
  {
    id: 'Deep Work',
    description: 'Uninterrupted flow for demanding tasks.',
    gradient: 'from-primary to-accent',
    badge: 'bg-blue-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
  },

  {
    id: 'Study',
    description: 'Structured learning and revision blocks.',
    gradient: 'from-primary to-ice-300',
    badge: 'bg-blue-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
  },
  {
    id: 'Meditation',
    description: 'Quiet mind, gentle awareness.',
    gradient: 'from-cobalt-500 to-accent',
    badge: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/50 dark:text-icy-200',
  },
  {
    id: 'Breathing',
    description: 'Rhythmic breath to calm your nervous system.',
    gradient: 'from-icy-400 to-cyan-400',
    badge: 'bg-sky-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
  },


  {
    id: 'Relax',
    description: 'Soft rest without pressure to perform.',
    gradient: 'from-cobalt-400 to-primary',
    badge: 'bg-blue-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
  },

  {
    id: 'Night Focus',
    description: 'Low-stimulus focus for evening hours.',
    gradient: 'from-navy-700 to-primary',
    badge: 'bg-slate-200 text-slate-800 dark:bg-blue-900/50 dark:text-icy-200',
  },

]

export const FOCUS_QUOTES = [
  'Breathe in calm. Breathe out noise.',
  'One gentle session at a time.',
  'Your focus is a sanctuary you can return to.',
  'Progress grows in quiet, consistent moments.',
  'You do not need to rush to be worthy of rest.',
  'Let this timer hold space for your clarity.',
  'Small depths of attention change entire days.',
  'Stillness is not empty — it is full of renewal.',
  'Show up softly. Stay with intention.',
  'The next minute is yours to shape with care.',
]

export function getSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function createSession({ mode, duration, completed }) {
  const session = {
    id: crypto.randomUUID(),
    mode,
    duration,
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
  }
  const sessions = [session, ...getSessions()]
  saveSessions(sessions)
  return session
}

export function deleteSession(id) {
  const sessions = getSessions().filter((s) => s.id !== id)
  saveSessions(sessions)
  return sessions
}

export function getRandomQuote() {
  return FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)]
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatSessionDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

function computeStreak(sessions) {
  const completed = sessions.filter((s) => s.completed)
  if (!completed.length) return 0

  const daySet = new Set(
    completed.map((s) => startOfDay(s.createdAt).toDateString()),
  )
  let streak = 0
  const cursor = startOfDay(new Date())

  while (daySet.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export function getWeekLogs(sessions) {
  const weekAgo = startOfDay(new Date())
  weekAgo.setDate(weekAgo.getDate() - 6)
  return sessions.filter((s) => startOfDay(s.createdAt) >= weekAgo)
}

export function getFocusStats(sessions) {
  const completed = sessions.filter((s) => s.completed)
  const today = new Date()
  const todaySessions = completed.filter((s) => isSameDay(s.createdAt, today))
  const totalMinutes = completed.reduce((sum, s) => sum + s.duration, 0)

  return {
    totalSessions: completed.length,
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    todaySessions: todaySessions.length,
    streak: computeStreak(sessions),
  }
}

export function getModeConfig(modeId) {
  return FOCUS_MODES.find((m) => m.id === modeId) || FOCUS_MODES[0]
}
