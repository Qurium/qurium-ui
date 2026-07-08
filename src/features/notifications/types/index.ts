export type Notification = {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  /** Auto-dismiss delay in ms. Omit to require manual close. */
  duration?: number
}
