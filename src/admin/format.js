export function formatDate(isoDate) {
  if (!isoDate) return '—'
  try {
    const d = new Date(isoDate)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
  } catch {
    return String(isoDate)
  }
}

export function formatRelative(isoDate) {
  if (!isoDate) return '—'
  const then = new Date(isoDate).getTime()
  const now = Date.now()
  const diffMs = now - then
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`
}

