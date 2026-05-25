const STORAGE_KEY = 'scribespace-journal-entries'

export const MOODS = ['Calm', 'Happy', 'Anxious', 'Focused', 'Tired', 'Emotional']

export function getEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function createEntry({ title, mood, content }) {
  const entry = {
    id: crypto.randomUUID(),
    title: title.trim(),
    mood,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  }
  const entries = [entry, ...getEntries()]
  saveEntries(entries)
  return entry
}

export function deleteEntry(id) {
  const entries = getEntries().filter((e) => e.id !== id)
  saveEntries(entries)
  return entries
}

export function formatEntryDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
