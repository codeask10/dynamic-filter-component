import type { FilterCondition, FilterFieldConfig, ValidationRule } from '@/types'

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

function checkRule(value: unknown, rule: ValidationRule): string | null {
  switch (rule.type) {
    case 'required':
      return isBlank(value) ? (rule.message ?? 'This field is required') : null
    case 'min': {
      const n = Number(value)
      return !Number.isNaN(n) && n < rule.value ? (rule.message ?? `Must be at least ${rule.value}`) : null
    }
    case 'max': {
      const n = Number(value)
      return !Number.isNaN(n) && n > rule.value ? (rule.message ?? `Must be at most ${rule.value}`) : null
    }
    case 'minLength':
      return typeof value === 'string' && value.length < rule.value
        ? (rule.message ?? `Must be at least ${rule.value} characters`)
        : null
    case 'maxLength':
      return typeof value === 'string' && value.length > rule.value
        ? (rule.message ?? `Must be at most ${rule.value} characters`)
        : null
    case 'pattern':
      return typeof value === 'string' && !rule.regex.test(value) ? (rule.message ?? 'Invalid format') : null
    case 'custom': {
      const result = rule.validate(value)
      if (result === true) return null
      return typeof result === 'string' ? result : (rule.message ?? 'Invalid value')
    }
  }
}

/** Runs `field.validation` against a condition's value(s). Returns the first error message, or null if valid. */
export function validateCondition(condition: FilterCondition, field: FilterFieldConfig): string | null {
  if (!field.validation || field.validation.length === 0 || isBlank(condition.value)) return null

  const values = Array.isArray(condition.value) ? condition.value : [condition.value]
  for (const value of values) {
    for (const rule of field.validation) {
      const error = checkRule(value, rule)
      if (error) return error
    }
  }
  return null
}
