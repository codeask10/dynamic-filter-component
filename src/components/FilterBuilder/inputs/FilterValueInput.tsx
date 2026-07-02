import { NO_VALUE_OPERATORS } from '@/services/operators'
import { SingleValueInput } from './SingleValueInput'
import { RangeValueInput } from './RangeValueInput'
import { ChoiceValueInput } from './ChoiceValueInput'
import type { ValueInputProps } from './types'

/** Picks the value widget from field.type (and operator, for the "between" range case). Never hardcodes a field key. */
export function FilterValueInput(props: ValueInputProps) {
  const { field, condition } = props

  if (NO_VALUE_OPERATORS.has(condition.operator)) return null
  if (field.type === 'select' || field.type === 'multi-select' || field.type === 'boolean') {
    return <ChoiceValueInput {...props} />
  }
  if (condition.operator === 'between') {
    return <RangeValueInput {...props} />
  }
  return <SingleValueInput {...props} />
}
