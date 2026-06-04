import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Check, Loader2, Search, Sparkles, Trash2 } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import {
  bodyText,
  btnGradient,
  card,
  cardSoft,
  headingDisplay,
  heroSection,
  input,
  label,
  pageShell,
  subheading,
} from '../constants/ui'
import { MOODS, formatEntryDate } from '../utils/journalStorage'
import { api } from '../utils/api'


const moodStyles = {
  Calm: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
  Happy: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  Anxious: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  Focused: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  Tired: 'bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  Emotional: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
}

const textareaClass =
  'min-h-[140px] w-full resize-y rounded-xl border border-stone-300 bg-white/90 px-4 py-3 text-zinc-900 placeholder:text-slate-400 backdrop-blur-sm transition-all duration-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/25 dark:border-white/15 dark:bg-zinc-950/50 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-violet-400 dark:focus:ring-violet-400/25'

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [title, setTitle] = useState('')
  const [mood, setMood] = useState('Calm')
  const [content, setContent] = useState('')

  const [search, setSearch] = useState('')
  const [selectedMood, setSelectedMood] = useState('All Moods')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [loadingEntries, setLoadingEntries] = useState(false)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadEntries() {
      setLoadingEntries(true)
      setFetchError('')

      try {
        const fetched = await api.getJournalEntries({
          search,
          mood: selectedMood,
        })

        // Map MongoDB `_id` to the `id` property expected by the existing UI.
        const mapped = (fetched || []).map((entry) => ({
          ...entry,
          id: entry._id,
        }))

        if (!cancelled) setEntries(mapped)
      } catch (err) {
        if (!cancelled) {
          setEntries([])
          setFetchError(err?.message || 'Failed to load journal entries')
        }
      } finally {
        if (!cancelled) setLoadingEntries(false)
      }
    }

    loadEntries()

    return () => {
      cancelled = true
    }
  }, [search, selectedMood])

  const filtered = useMemo(() => entries, [entries])


  const handleSave = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSaving(true)
    setTimeout(async () => {
      try {
        const created = await api.createJournalEntry({
          title,
          mood,
          content,
        })

        const entry = {
          ...created,
          id: created?._id,
        }

        setEntries((prev) => [entry, ...prev])
        setTitle('')
        setMood('Calm')
        setContent('')
      } finally {
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2200)
      }
    }, 600)
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteJournalEntry(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      // Keep UI unchanged; just fail gracefully.
    }
  }


  return (
    <div className={pageShell}>
      {/* 1. Journal Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={heroSection}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className={subheading}>Your journal</p>
              <h1 className={`${headingDisplay} mt-1`}>Reflections & moments</h1>
              <p className={`mt-2 max-w-xl ${bodyText}`}>
                Capture how you feel. Entries are saved privately on this device.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← Back to dashboard
          </Link>
        </div>
      </motion.header>

      {/* 5. Search + Mood Filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your journal..."
              className={`${input} pl-12`}
            />
          </div>

          {/* Mood dropdown */}
          <div className="flex flex-col gap-2">
            <label htmlFor="journal-mood-filter" className={label}>
              Mood
            </label>
            <select
              id="journal-mood-filter"
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className={`${input} pr-10 appearance-none bg-white/90 dark:bg-zinc-950/50`}
            >
              <option value="All Moods">All Moods</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>


      <div className="grid gap-8 lg:grid-cols-5">
        {/* 2. New Entry Form + 3. Mood Selector */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form
            onSubmit={handleSave}
            className={`${cardSoft} transition-shadow duration-300 hover:shadow-xl`}
          >
            <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-stone-50">
              New entry
            </h2>

            <div className="mb-5">
              <label htmlFor="journal-title" className={label}>
                Title
              </label>
              <input
                id="journal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give this moment a name"
                className={input}
                required
              />
            </div>

            <div className="mb-5">
              <span className={label}>Mood</span>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                      mood === m
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md ring-2 ring-violet-400/40'
                        : 'border border-stone-200 bg-white text-slate-600 hover:border-violet-300 dark:border-white/10 dark:bg-zinc-800 dark:text-stone-400'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="journal-content" className={label}>
                Content
              </label>
              <textarea
                id="journal-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely. No one else will see this on this device unless you share it."
                className={textareaClass}
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className={`${btnGradient} w-full ${saved ? 'ring-2 ring-emerald-400/50' : ''}`}
              whileTap={{ scale: 0.98 }}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Save entry
                </>
              )}
            </motion.button>
          </form>
        </motion.section>

        {/* 4. Entries Grid */}
        <section className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-stone-50">
            Your entries ({filtered.length})
          </h2>

          {fetchError ? (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200">
              {fetchError}
            </div>
          ) : null}

          {loadingEntries ? (
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-300">Loading…</div>
          ) : null}

          {filtered.length === 0 && !loadingEntries ? (
            <EmptyState
              icon={BookOpen}
              title={
                entries.length === 0
                  ? 'Your journal is waiting.'
                  : 'No journal entries match your search.'
              }
              description={
                entries.length === 0
                  ? 'When words find you, this space will hold them gently.'
                  : 'Try a softer keyword or clear the filters.'
              }
            />
          ) : (

            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((entry, index) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`${card} group flex flex-col hover:-translate-y-0.5`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${moodStyles[entry.mood] || moodStyles.Calm}`}
                    >
                      {entry.mood}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-900/30 dark:hover:text-rose-300"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-stone-50">
                    {entry.title}
                  </h3>
                  <p className={`mt-2 flex-1 text-sm leading-relaxed line-clamp-4 ${bodyText}`}>
                    {entry.content}
                  </p>
                  <p className="mt-4 text-xs text-slate-500 dark:text-stone-500">
                    {formatEntryDate(entry.createdAt)}
                  </p>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
