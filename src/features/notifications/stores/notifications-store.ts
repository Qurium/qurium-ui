import { create } from 'zustand'

import type { Notification } from '../types'

type NotificationsState = {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    set({
      notifications: [
        ...get().notifications,
        { id: crypto.randomUUID(), ...notification },
      ],
    })
  },
  dismissNotification: (id) => {
    set({
      notifications: get().notifications.filter(
        (notification) => notification.id !== id,
      ),
    })
  },
}))
