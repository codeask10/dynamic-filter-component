import type { ReactNode } from 'react'

// ── Filter domain ────────────────────────────────────────────────────────────

export type FieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multi-select'

export type Operator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'between'
  | 'in'
  | 'not_in'
  | 'today'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_3_months'
  | 'this_year'

export interface Option {
  label: string
  value: string | number
  disabled?: boolean
  meta?: Record<string, unknown>
}

export type ValidationRule =
  | { type: 'required'; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'pattern'; regex: RegExp; message?: string }
  | { type: 'custom'; validate: (value: unknown) => boolean | string; message?: string }

export type RendererKey =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multi-select'

interface FilterFieldConfigBase {
  key: string
  label: string
  operators: Operator[]
  validation?: ValidationRule[]
  placeholder?: string
  rendererKey?: RendererKey
}

type ScalarFieldConfig = FilterFieldConfigBase & {
  type: Exclude<FieldType, 'select' | 'multi-select'>
  options?: never
}

type ChoiceFieldConfig = FilterFieldConfigBase & {
  type: 'select' | 'multi-select'
  options: Option[]
}

export type FilterFieldConfig = ScalarFieldConfig | ChoiceFieldConfig

export interface FilterSchema {
  entity: string
  fields: FilterFieldConfig[]
}

export type LogicalOperator = 'AND' | 'OR'

export interface FilterCondition {
  id: string
  field: string
  operator: Operator
  /** Type varies by FieldType: string | number | boolean | (string|number)[] */
  value: unknown
}

export interface FilterGroup {
  id: string
  logicalOperator: LogicalOperator
  conditions: FilterCondition[]
}

export interface FilterState {
  logicalOperator: LogicalOperator
  groups: FilterGroup[]
}

// ── Table domain ─────────────────────────────────────────────────────────────

/** One column in a data table. Generic over TRow so `key` and `render` are fully typed. */
export interface TableColumn<TRow extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof TRow & string
  label: string
  type: FieldType
  hidden?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (row: TRow) => ReactNode
}

export interface DataTableProps<TRow extends Record<string, unknown>> {
  columns: TableColumn<TRow>[]
  rows: TRow[]
  loading?: boolean
  skeletonRowCount?: number
  emptyMessage?: string
  defaultPage?: number
  defaultRowsPerPage?: number
  rowsPerPageOptions?: number[]
  getRowKey?: (row: TRow, index: number) => string | number
  onRowClick?: (row: TRow) => void
  size?: 'small' | 'medium'
  stickyHeader?: boolean
  'aria-label'?: string
}
