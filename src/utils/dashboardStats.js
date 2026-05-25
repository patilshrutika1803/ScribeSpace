import { getEntries } from './journalStorage'
import { getMoodLogs, getMoodStats, getTodayLogs } from './moodStorage'
import { getSessions, getFocusStats, getWeekLogs, getRandomQuote } from './focusStorage'

const GREETINGS = {
  morning: 'A gentle morning awaits your attention.',
  afternoon: 'Take a soft pause — you are allowed to breathe.',
  evening: 'The evening is a quiet place to return to yourself.',
  night: 'Rest is part of progress. You are doing enough.',
}

export function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { label: 'Good morning', tone: GREETINGS.morning }
  if (hour < 18) return { label: 'Good afternoon', tone: GREETINGS.afternoon }
  if (hour < 22) return { label: 'Good evening', tone: GREETINGS.evening }
  return { label: 'Good night', tone: GREETINGS.night }
}

export function getDashboardInsights() {
  const journals = getEntries()
  const moods = getMoodLogs()
  const moodStats = getMoodStats(moods)
  const todayMoods = getTodayLogs(moods)
  const focusSessions = getSessions()
  const focusStats = getFocusStats(focusSessions)
  const weekFocus = getWeekLogs(focusSessions)
  const weekFocusMinutes = weekFocus
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.duration, 0)

  const latest = journals[0]

  return {
    journalCount: journals.length,
    latestJournal: latest
      ? {
          title: latest.title,
          preview: latest.content.slice(0, 120) + (latest.content.length > 120 ? '…' : ''),
          mood: latest.mood,
        }
      : null,
    moodStreak: moodStats.streak,
    todayMood: todayMoods[0]?.mood ?? null,
    focusWeekMinutes: weekFocusMinutes,
    focusWeekHours: (weekFocusMinutes / 60).toFixed(1),
    focusStreak: focusStats.streak,
    quote: getRandomQuote(),
    greeting: getTimeGreeting(),
  }
}
