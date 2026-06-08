/** Standard API error shape returned by the backend (or normalized from Axios) */
export interface ApiErrorBody {
  message: string
  code?: string
  status?: number
  details?: Record<string, string[]>
}

/** Application-level error with normalized fields */
export interface AppError extends ApiErrorBody {
  status: number
  isNetworkError: boolean
  isUnauthorized: boolean
  original?: unknown
}

/** Discriminated union for service-layer results (optional pattern) */
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError }
