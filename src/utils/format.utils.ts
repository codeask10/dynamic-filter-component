// Cached to avoid the ~10-50× construction cost of new Intl.NumberFormat per call.
const formatterCache = new Map<string, Intl.NumberFormat | null>()

function getFormatter(currency: string, locale: string): Intl.NumberFormat | null {
  const key = `${locale}:${currency}`
  if (formatterCache.has(key)) return formatterCache.get(key) ?? null
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    formatterCache.set(key, formatter)
    return formatter
  } catch {
    formatterCache.set(key, null)
    return null
  }
}

export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  if (!Number.isFinite(amount)) return '—'
  const formatter = getFormatter(currency, locale)
  return formatter ? formatter.format(amount) : amount.toFixed(2)
}
