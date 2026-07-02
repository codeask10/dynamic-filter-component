import type { FilterCondition, FilterFieldConfig, FilterGroup } from '@/types'

export function createCondition(fields: readonly FilterFieldConfig[]): FilterCondition {
  const first = fields[0]
  return {
    id:       crypto.randomUUID(),
    field:    first?.key       ?? '',
    operator: first?.operators[0] ?? 'equals',
    value:    '',
  }
}

export function createGroup(fields: readonly FilterFieldConfig[]): FilterGroup {
  return {
    id:              crypto.randomUUID(),
    logicalOperator: 'AND',
    conditions:      fields.length > 0 ? [createCondition(fields)] : [],
  }
}
