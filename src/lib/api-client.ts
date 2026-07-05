import Axios, { type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { useNotifications } from '@/features/notifications/stores/notifications-store'

function requestInterceptor(config: InternalAxiosRequestConfig) {
  config.headers = config.headers ?? {}
  config.headers.Accept = 'application/json'
  return config
}

export const api = Axios.create({
  baseURL: env.API_URL,
})

api.interceptors.request.use(requestInterceptor)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message

    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    })

    return Promise.reject(error)
  },
)
