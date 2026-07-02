import type { FilterCondition, FilterFieldConfig } from '@/types'

export interface ValueInputProps {
  field: FilterFieldConfig
  condition: FilterCondition
  onChange: (value: unknown) => void
  error?: string | null
}
