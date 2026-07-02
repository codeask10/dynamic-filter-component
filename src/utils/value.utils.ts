export function getNestedValue<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!path) return undefined
  let current: unknown = obj
  for (const segment of path.split('.')) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[segment]
  }
  return current as T
}
