export const formatDate = (date: number | string | Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date))

export const formatRelativeTime = (date: number | string | Date) => {
  const diffMs = Date.now() - new Date(date).getTime()
  const minutes = Math.round(diffMs / 60_000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.round(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}
