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

type ApiErrorBody = {
  title?: string
  message?: string
  violations?: { field: string; message: string }[]
}

function extractErrorMessage(error: unknown): {
  title: string
  message: string
} {
  const body: ApiErrorBody =
    (error as { response?: { data?: ApiErrorBody } })?.response?.data ?? {}

  if (body.violations?.length) {
    return {
      title: body.title ?? 'Validation error',
      message: body.violations.map((v) => v.message).join('\n'),
    }
  }

  return {
    title: 'Error',
    message:
      body.message ??
      (error as { message?: string })?.message ??
      'Something went wrong',
  }
}

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { title, message } = extractErrorMessage(error)

    useNotifications.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 6000,
    })

    return Promise.reject(error)
  },
)
