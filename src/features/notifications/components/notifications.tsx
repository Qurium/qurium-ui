import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

import { cn } from '@/utils/cn'

import { useNotifications } from '../stores/notifications-store'
import type { Notification } from '../types'

const CONFIG: Record<
  Notification['type'],
  { icon: React.ReactNode; bar: string; title: string }
> = {
  info: {
    icon: <Info size={16} aria-hidden />,
    bar: 'bg-blue',
    title: 'text-blue',
  },
  success: {
    icon: <CheckCircle size={16} aria-hidden />,
    bar: 'bg-accent',
    title: 'text-accent',
  },
  warning: {
    icon: <AlertTriangle size={16} aria-hidden />,
    bar: 'bg-amber',
    title: 'text-amber',
  },
  error: {
    icon: <AlertCircle size={16} aria-hidden />,
    bar: 'bg-red-400',
    title: 'text-red-400',
  },
}

const NotificationItem = ({
  notification,
  onDismiss,
}: {
  notification: Notification
  onDismiss: () => void
}) => {
  const config = CONFIG[notification.type]
  const [leaving, setLeaving] = useState(false)

  const startDismiss = useCallback(() => setLeaving(true), [])

  useEffect(() => {
    if (!notification.duration) return
    const timer = setTimeout(startDismiss, notification.duration)
    return () => clearTimeout(timer)
  }, [notification.duration, startDismiss])

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-80 overflow-hidden rounded-lg border border-edge-2 bg-surface shadow-xl',
        leaving
          ? 'animate-out fade-out-0 slide-out-to-right-4 duration-200'
          : 'animate-in fade-in-0 slide-in-from-right-4 duration-300',
      )}
      onAnimationEnd={() => leaving && onDismiss()}
    >
      <div className={cn('w-1 shrink-0', config.bar)} />
      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <span className={cn('mt-0.5 shrink-0', config.title)}>
          {config.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn('text-xs font-semibold', config.title)}>
            {notification.title}
          </p>
          {notification.message && (
            <p className="mt-0.5 whitespace-pre-line text-[11px] leading-relaxed text-ink-faint">
              {notification.message}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={startDismiss}
          className="mt-0.5 shrink-0 text-ink-muted hover:text-ink-faint focus:outline-none"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col items-end gap-2"
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => dismissNotification(notification.id)}
        />
      ))}
    </div>
  )
}
