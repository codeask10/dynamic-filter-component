import type { FieldType, Operator } from '@/types'

/** Default operator set for each FieldType. Entity configs can narrow this per field. */
export const OPERATOR_MAP: Record<FieldType, ReadonlyArray<Operator>> = {
  string:         ['equals', 'contains', 'starts_with', 'ends_with', 'not_contains'],
  number:         ['equals', 'greater_than', 'less_than', 'greater_than_or_equal', 'less_than_or_equal', 'between'],
  date:           ['between', 'less_than', 'greater_than', 'today', 'last_7_days', 'last_30_days', 'last_3_months', 'this_year'],
  boolean:        ['equals'],
  select:         ['equals', 'not_equals'],
  'multi-select': ['in', 'not_in'],
}

/** Operators that assert a predefined condition — they carry no user-supplied value. */
export const NO_VALUE_OPERATORS = new Set<Operator>([
  'today', 'last_7_days', 'last_30_days', 'last_3_months', 'this_year',
])

export function operatorRequiresValue(operator: Operator): boolean {
  return !NO_VALUE_OPERATORS.has(operator)
}

/** Field-type-agnostic default label for each operator. */
const BASE_LABELS: Record<Operator, string> = {
  equals:                'Equals',
  not_equals:            'Is Not',
  contains:              'Contains',
  not_contains:          'Does Not Contain',
  starts_with:           'Starts With',
  ends_with:             'Ends With',
  greater_than:          'Greater Than',
  less_than:             'Less Than',
  greater_than_or_equal: 'Greater Than or Equal',
  less_than_or_equal:    'Less Than or Equal',
  between:               'Between',
  in:                    'In',
  not_in:                'Not In',
  today:                 'Today',
  last_7_days:           'Last 7 Days',
  last_30_days:          'Last 30 Days',
  last_3_months:         'Last 3 Months',
  this_year:             'This Year',
}

/** Per-field-type label overrides, for operators that read differently depending on context. */
const LABEL_OVERRIDES: Partial<Record<FieldType, Partial<Record<Operator, string>>>> = {
  boolean: { equals: 'Is' },
  select:  { equals: 'Is' },
  date:    { less_than: 'Before', greater_than: 'After' },
}

/** Human-readable label for an operator, contextualized by field type (e.g. "Before" for date, "Less Than" for number). */
export function getOperatorLabel(operator: Operator, fieldType: FieldType): string {
  return LABEL_OVERRIDES[fieldType]?.[operator] ?? BASE_LABELS[operator]
}

/** Narrows an arbitrary string (e.g. a Select event value) to Operator. */
export function isOperatorType(value: string): value is Operator {
  return value in BASE_LABELS
}
