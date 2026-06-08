import axios, { type AxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth.store'
import { parseApiError } from './errors'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user
  if (user) {
    config.headers.Authorization = `Bearer demo-token-${user.id}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = parseApiError(error)
    if (appError.isUnauthorized) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(appError)
  },
)

/** Typed GET helper — unwraps response data */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.get<T>(url, config)
  return data
}

/** Typed POST helper */
export async function apiPost<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.post<T>(url, body, config)
  return data
}

/** Typed PUT helper */
export async function apiPut<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.put<T>(url, body, config)
  return data
}

/** Typed DELETE helper */
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const { data } = await apiClient.delete<T>(url, config)
  return data
}
