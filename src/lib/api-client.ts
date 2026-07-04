import Axios, { type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { paths } from '@/config/paths'
import { useNotifications } from '@/features/notifications/stores/notifications-store'

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  config.headers = config.headers ?? {}
  config.headers.Accept = 'application/json'
  return config
}

export const api = Axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
})

api.interceptors.request.use(authRequestInterceptor)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message

    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    })

    if (error.response?.status === 401) {
      const redirectTo = `${window.location.pathname}${window.location.search}`
      window.location.href = paths.auth.login.getHref(redirectTo)
    }

    return Promise.reject(error)
  },
)
