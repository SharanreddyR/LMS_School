import { env } from '@/config/env'

/**
 * Creates a service method that routes to mock or real API based on env.useMockApi.
 * This is the single swap point when connecting to a real backend.
 *
 * @example
 * const getStudents = createServiceMethod({
 *   mock: fetchStudents,
 *   api: () => apiGet<Student[]>('/students'),
 * })
 */
export function createServiceMethod<TArgs extends unknown[], TResult>(handlers: {
  mock: (...args: TArgs) => Promise<TResult>
  api: (...args: TArgs) => Promise<TResult>
}): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) =>
    env.useMockApi ? handlers.mock(...args) : handlers.api(...args)
}
