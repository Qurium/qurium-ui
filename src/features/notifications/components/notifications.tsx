import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

import { cn } from '@/utils/cn'

import { useNotifications } from '../stores/notifications-store'
import type { Notification } from '../types'

const icons: Record<Notification['type'], React.ReactNode> = {
  info: <Info className="size-5 text-blue-500" aria-hidden="true" />,
  success: <CheckCircle className="size-5 text-green-500" aria-hidden="true" />,
  warning: (
    <AlertTriangle className="size-5 text-yellow-500" aria-hidden="true" />
  ),
  error: <AlertCircle className="size-5 text-red-500" aria-hidden="true" />,
}

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications()

  if (notifications.length === 0) return null

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-100 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5',
            )}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">{icons[notification.type]}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
