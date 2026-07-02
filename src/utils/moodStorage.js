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
  // Mood badges (light + dark readable) — keep existing dark theme.
  Happy: {
    // Yellow
    gradient: 'from-yellow-400 to-amber-300',
    badge: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/45 dark:text-yellow-200',
    ring: 'ring-yellow-400/55',
    bar: 'bg-gradient-to-t from-yellow-500 to-amber-400',
  },
  Calm: {
    // Blue
    gradient: 'from-blue-500 to-indigo-300',
    badge: 'bg-blue-100 text-blue-900 dark:bg-blue-900/45 dark:text-blue-200',
    ring: 'ring-blue-400/55',
    bar: 'bg-gradient-to-t from-blue-500 to-indigo-400',
  },
  Focused: {
    // Indigo
    gradient: 'from-indigo-500 to-blue-400',
    badge: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/45 dark:text-indigo-200',
    ring: 'ring-indigo-400/55',
    bar: 'bg-gradient-to-t from-indigo-500 to-blue-400',
  },
  Emotional: {
    // Pink
    gradient: 'from-pink-500 to-purple-400',
    badge: 'bg-pink-100 text-pink-900 dark:bg-pink-900/45 dark:text-pink-200',
    ring: 'ring-pink-400/55',
    bar: 'bg-gradient-to-t from-pink-500 to-purple-400',
  },
  Tired: {
    // Gray
    gradient: 'from-gray-400 to-slate-400',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800/55 dark:text-slate-200',
    ring: 'ring-slate-400/45',
    bar: 'bg-gradient-to-t from-slate-500 to-zinc-400',
  },
  Anxious: {
    // Orange
    gradient: 'from-orange-500 to-yellow-400',
    badge: 'bg-orange-100 text-orange-900 dark:bg-orange-900/45 dark:text-orange-200',
    ring: 'ring-orange-400/55',
    bar: 'bg-gradient-to-t from-orange-500 to-amber-400',
  },
  Excited: {
    // Purple
    gradient: 'from-purple-500 to-fuchsia-400',
    badge: 'bg-purple-100 text-purple-900 dark:bg-purple-900/45 dark:text-purple-200',
    ring: 'ring-purple-400/55',
    bar: 'bg-gradient-to-t from-purple-500 to-fuchsia-400',
  },
  Lonely: {
    // Cyan
    gradient: 'from-cyan-500 to-teal-300',
    badge: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900/45 dark:text-cyan-200',
    ring: 'ring-cyan-400/55',
    bar: 'bg-gradient-to-t from-cyan-500 to-teal-400',
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
