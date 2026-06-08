import type { AxiosError } from 'axios'
import type { AppError, ApiErrorBody } from '@/types/api'

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.'

export function createAppError(partial: Partial<AppError> & { message: string }): AppError {
  return {
    status: partial.status ?? 500,
    code: partial.code,
    message: partial.message,
    details: partial.details,
    isNetworkError: partial.isNetworkError ?? false,
    isUnauthorized: partial.isUnauthorized ?? partial.status === 401,
    original: partial.original,
  }
}

/** Normalize any thrown value into a consistent AppError */
export function parseApiError(error: unknown): AppError {
  if (isAppError(error)) return error

  const axiosErr = error as AxiosError<ApiErrorBody>
  if (axiosErr?.isAxiosError) {
    const status = axiosErr.response?.status ?? 0
    const body = axiosErr.response?.data
    return createAppError({
      status: status || 500,
      code: body?.code,
      message: body?.message ?? axiosErr.message ?? DEFAULT_MESSAGE,
      details: body?.details,
      isNetworkError: !axiosErr.response,
      isUnauthorized: status === 401,
      original: error,
    })
  }

  if (error instanceof Error) {
    return createAppError({ message: error.message, status: 500, original: error })
  }

  return createAppError({ message: DEFAULT_MESSAGE, status: 500, original: error })
}

export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    'isNetworkError' in error
  )
}

export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message
}
