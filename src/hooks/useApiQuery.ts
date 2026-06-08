import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'

type QueryFn<T> = () => Promise<T>

/**
 * Thin wrapper around useQuery with consistent defaults for service-layer calls.
 * Use in feature hooks instead of calling mock-api directly.
 */
export function useApiQuery<T>(
  queryKey: readonly unknown[],
  queryFn: QueryFn<T>,
  options?: Omit<UseQueryOptions<T, Error, T, readonly unknown[]>, 'queryKey' | 'queryFn'>,
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  })
}
