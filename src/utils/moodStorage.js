const STORAGE_KEY = 'scribespace-moods'

export const MOOD_LIST = [
  'Happy',
  'Calm',
  'Focused',
  'Emotional',
  'Tired',
  'Anxious',
  'Excited',
  'Lonely',
]

export const MOOD_CONFIG = {
  Happy: {
    gradient: 'from-amber-400 to-yellow-300',
    badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200',
    ring: 'ring-amber-400/60',
    bar: 'bg-gradient-to-t from-amber-500 to-yellow-400',
  },
  Calm: {
    gradient: 'from-sky-400 to-cyan-300',
    badge: 'bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-200',
    ring: 'ring-sky-400/60',
    bar: 'bg-gradient-to-t from-sky-500 to-cyan-400',
  },
  Focused: {
    gradient: 'from-primary to-accent',
    badge: 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-icy-200',
    ring: 'ring-primary/35',
    bar: 'bg-gradient-to-t from-primary to-accent',
  },
  Emotional: {
    gradient: 'from-cobalt-500 to-ice-300',
    badge: 'bg-sky-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
    ring: 'ring-sky-400/40',
    bar: 'bg-gradient-to-t from-cobalt-500 to-sky-400',
  },
  Tired: {
    gradient: 'from-slate-300 to-slate-400',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200',
    ring: 'ring-slate-400/40',
    bar: 'bg-gradient-to-t from-slate-400 to-zinc-400',
  },
  Anxious: {
    gradient: 'from-indigo-500 to-cobalt-600',
    badge: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/50 dark:text-icy-200',
    ring: 'ring-indigo-400/40',
    bar: 'bg-gradient-to-t from-indigo-500 to-blue-400',
  },
  Excited: {
    gradient: 'from-primary to-cyan-400',
    badge: 'bg-blue-100 text-blue-950 dark:bg-blue-900/50 dark:text-icy-200',
    ring: 'ring-cyan-400/40',
    bar: 'bg-gradient-to-t from-blue-500 to-cyan-400',
  },
  Lonely: {
    gradient: 'from-cobalt-400 to-ice-300',
    badge: 'bg-indigo-100 text-indigo-950 dark:bg-indigo-900/50 dark:text-icy-200',
    ring: 'ring-indigo-300/40',
    bar: 'bg-gradient-to-t from-indigo-500 to-blue-400',
  },

}

export function getMoodLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveMoodLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export function createMoodLog({ mood, note }) {
  const log = {
    id: crypto.randomUUID(),
    mood,
    note: note.trim(),
    createdAt: new Date().toISOString(),
  }
  const logs = [log, ...getMoodLogs()]
  saveMoodLogs(logs)
  return log
}

export function deleteMoodLog(id) {
  const logs = getMoodLogs().filter((l) => l.id !== id)
  saveMoodLogs(logs)
  return logs
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export function formatMoodDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function getDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function computeStreak(logs) {
  if (!logs.length) return 0

  const daySet = new Set(logs.map((l) => startOfDay(l.createdAt).toDateString()))
  let streak = 0
  const cursor = startOfDay(new Date())

  while (daySet.has(cursor.toDateString())) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function moodCounts(logs) {
  const counts = {}
  for (const log of logs) {
    counts[log.mood] = (counts[log.mood] || 0) + 1
  }
  return counts
}

function dominantMood(counts) {
  let top = null
  let max = 0
  for (const [mood, count] of Object.entries(counts)) {
    if (count > max) {
      max = count
      top = mood
    }
  }
  return top
}

export function getMostFrequentMood(logs) {
  return dominantMood(moodCounts(logs))
}

export function getWeekLogs(logs) {
  const weekAgo = startOfDay(new Date())
  weekAgo.setDate(weekAgo.getDate() - 6)
  return logs.filter((l) => startOfDay(l.createdAt) >= weekAgo)
}

export function getWeekDominantMood(logs) {
  return dominantMood(moodCounts(getWeekLogs(logs)))
}

export function getWeeklyOverview(logs) {
  const days = []
  const today = startOfDay(new Date())

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dayLogs = logs
      .filter((l) => isSameDay(l.createdAt, date))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    days.push({
      date,
      label: i === 0 ? 'Today' : getDayLabel(date),
      mood: dayLogs[0]?.mood ?? null,
    })
  }

  return days
}

export function getTodayLogs(logs) {
  const today = new Date()
  return logs.filter((l) => isSameDay(l.createdAt, today))
}

export function getMoodStats(logs) {
  return {
    total: logs.length,
    streak: computeStreak(logs),
    mostFrequent: getMostFrequentMood(logs),
    weekDominant: getWeekDominantMood(logs),
    weeklyOverview: getWeeklyOverview(logs),
  }
}
