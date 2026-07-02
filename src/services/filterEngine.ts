import type {
  FieldType,
  FilterCondition,
  FilterGroup,
  FilterSchema,
  FilterState,
  Operator,
} from '@/types'
import { getNestedValue, parseDate } from '@/utils'
import { NO_VALUE_OPERATORS } from './operators'

// ── Value comparison ─────────────────────────────────────────────────────────

type Comparison = -1 | 0 | 1

function sign(n: number): Comparison {
  return n < 0 ? -1 : n > 0 ? 1 : 0
}

function compareValues(a: unknown, b: unknown, fieldType: FieldType): Comparison {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  switch (fieldType) {
    case 'number': {
      const na = typeof a === 'number' ? a : Number(a)
      const nb = typeof b === 'number' ? b : Number(b)
      if (Number.isNaN(na) && Number.isNaN(nb)) return 0
      if (Number.isNaN(na)) return 1
      if (Number.isNaN(nb)) return -1
      return sign(na - nb)
    }
    case 'date': {
      const da = parseDate(a)
      const db = parseDate(b)
      if (da === null && db === null) return 0
      if (da === null) return 1
      if (db === null) return -1
      return sign(da.getTime() - db.getTime())
    }
    case 'boolean': {
      const ba = Boolean(a)
      const bb = Boolean(b)
      return ba === bb ? 0 : ba ? 1 : -1
    }
    case 'string':
    case 'select':
      return sign(String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }))
    case 'multi-select': {
      const arrA = Array.isArray(a) ? a : [a]
      const arrB = Array.isArray(b) ? b : [b]
      const firstCmp = String(arrA[0] ?? '').localeCompare(String(arrB[0] ?? ''), undefined, { sensitivity: 'base' })
      return firstCmp !== 0 ? sign(firstCmp) : sign(arrA.length - arrB.length)
    }
  }
}

// ── Operator evaluation ──────────────────────────────────────────────────────

function toLower(value: unknown): string {
  return value === null || value === undefined ? '' : String(value).toLowerCase()
}

function parseBetweenBounds(value: unknown): [unknown, unknown] | null {
  if (Array.isArray(value) && value.length >= 2) return [value[0], value[1]]
  if (typeof value === 'string') {
    const [low, high] = value.split(',').map((s) => s.trim())
    if (low && high) return [low, high]
  }
  return null
}

const COMPARISON_TESTS: Partial<Record<Operator, (cmp: Comparison) => boolean>> = {
  equals:                 (c) => c === 0,
  not_equals:             (c) => c !== 0,
  greater_than:           (c) => c > 0,
  less_than:              (c) => c < 0,
  greater_than_or_equal:  (c) => c >= 0,
  less_than_or_equal:     (c) => c <= 0,
}

const STRING_TESTS: Partial<Record<Operator, (value: string, needle: string) => boolean>> = {
  contains:               (v, n) => v.includes(n),
  not_contains:           (v, n) => !v.includes(n),
  starts_with:            (v, n) => v.startsWith(n),
  ends_with:              (v, n) => v.endsWith(n),
}

// Relative date windows: Today / Last 7 Days / Last 30 Days / Last 3 Months / This Year
function startOfDay(d: Date): Date { const c = new Date(d); c.setHours(0, 0, 0, 0); return c }
function endOfDay(d: Date): Date   { const c = new Date(d); c.setHours(23, 59, 59, 999); return c }
function daysAgo(n: number): Date   { const d = new Date(); d.setDate(d.getDate() - n); return d }
function monthsAgo(n: number): Date { const d = new Date(); d.setMonth(d.getMonth() - n); return d }

const RELATIVE_DATE_WINDOWS: Partial<Record<Operator, () => [Date, Date]>> = {
  today:         () => [startOfDay(new Date()), endOfDay(new Date())],
  last_7_days:   () => [startOfDay(daysAgo(7)), endOfDay(new Date())],
  last_30_days:  () => [startOfDay(daysAgo(30)), endOfDay(new Date())],
  last_3_months: () => [startOfDay(monthsAgo(3)), endOfDay(new Date())],
  this_year:     () => [startOfDay(new Date(new Date().getFullYear(), 0, 1)), endOfDay(new Date())],
}

function evaluateOperator(
  rowValue: unknown,
  operator: Operator,
  filterValue: unknown,
  fieldType: FieldType,
): boolean {
  const relativeWindow = RELATIVE_DATE_WINDOWS[operator]
  if (relativeWindow) {
    const rowDate = parseDate(rowValue)
    if (rowDate === null) return false
    const [start, end] = relativeWindow()
    return rowDate.getTime() >= start.getTime() && rowDate.getTime() <= end.getTime()
  }

  const comparisonTest = COMPARISON_TESTS[operator]
  if (comparisonTest) return comparisonTest(compareValues(rowValue, filterValue, fieldType))

  const stringTest = STRING_TESTS[operator]
  if (stringTest) return stringTest(toLower(rowValue), toLower(filterValue))

  if (operator === 'between') {
    const bounds = parseBetweenBounds(filterValue)
    if (bounds === null) return false
    const [low, high] = bounds
    return compareValues(rowValue, low, fieldType) >= 0 && compareValues(rowValue, high, fieldType) <= 0
  }

  if (operator === 'in' || operator === 'not_in') {
    const rowItems    = Array.isArray(rowValue)    ? rowValue    : [rowValue]
    const filterItems = Array.isArray(filterValue) ? filterValue : [filterValue]
    const matches = rowItems.some((rv) => filterItems.some((fv) => compareValues(rv, fv, fieldType) === 0))
    return operator === 'in' ? matches : !matches
  }

  return false
}

// ── Row / group matching ─────────────────────────────────────────────────────

function matchesCondition(
  row: Record<string, unknown>,
  condition: FilterCondition,
  fieldTypeIndex: Map<string, FieldType>,
): boolean {
  const fieldType = fieldTypeIndex.get(condition.field) ?? 'string'
  const rowValue  = getNestedValue(row, condition.field)

  // Set operators (in / not_in) evaluate the field value as a whole.
  if (condition.operator === 'in' || condition.operator === 'not_in') {
    return evaluateOperator(rowValue, condition.operator, condition.value, fieldType)
  }

  // Array-valued row fields (e.g. tags: string[]) use "match any" semantics for scalar operators.
  if (Array.isArray(rowValue)) {
    return rowValue.some((el) => evaluateOperator(el, condition.operator, condition.value, fieldType))
  }

  return evaluateOperator(rowValue, condition.operator, condition.value, fieldType)
}

function matchesGroup(
  row: Record<string, unknown>,
  group: FilterGroup,
  fieldTypeIndex: Map<string, FieldType>,
): boolean {
  const active = group.conditions.filter(isConditionComplete)
  if (active.length === 0) return true
  const test = (c: FilterCondition) => matchesCondition(row, c, fieldTypeIndex)
  return group.logicalOperator === 'AND' ? active.every(test) : active.some(test)
}

// ── Public API ────────────────────────────────────────────────────────────────

export function isConditionComplete(condition: FilterCondition): boolean {
  if (!condition.field || !condition.operator) return false
  if (NO_VALUE_OPERATORS.has(condition.operator)) return true
  return condition.value !== '' && condition.value !== null && condition.value !== undefined
}

export function countActiveFilters(state: FilterState): number {
  return state.groups.reduce(
    (sum, g) => sum + g.conditions.filter(isConditionComplete).length,
    0,
  )
}

/** Filters `dataset` against `state`, using `schema` to resolve each field's type. */
export function applyFilters<TRow extends Record<string, unknown>>(
  dataset: TRow[],
  schema: FilterSchema,
  state: FilterState,
): TRow[] {
  const fieldTypeIndex = new Map(schema.fields.map((f) => [f.key, f.type]))

  const activeGroups = state.groups.filter((group) =>
    group.conditions.some(isConditionComplete),
  )

  if (activeGroups.length === 0) return dataset.slice()

  return dataset.filter((row) => {
    const groupPasses = (group: FilterGroup) =>
      matchesGroup(row as Record<string, unknown>, group, fieldTypeIndex)
    return state.logicalOperator === 'AND'
      ? activeGroups.every(groupPasses)
      : activeGroups.some(groupPasses)
  })
}
