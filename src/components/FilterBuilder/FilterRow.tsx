import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import type { FilterCondition, FilterFieldConfig, Operator } from '@/types'
import { getOperatorLabel } from '@/services/operators'
import { validateCondition } from '@/services/validators'
import { FilterValueInput } from './inputs'

interface FilterRowProps {
  /** The condition being displayed. Read-only — FilterRow never mutates it. */
  condition: FilterCondition
  /** Options rendered in the field selector. */
  fields: FilterFieldConfig[]
  /**
   * Operator options for the current field.
   * Pre-derived by the parent. FilterRow never reads field.operators itself.
   */
  operators: Operator[]
  /**
   * Controls whether the value input slot is rendered.
   * Pre-derived by the parent. FilterRow never calls operatorRequiresValue.
   */
  showValue: boolean
  /** Emits the raw field key. Parent owns all cascading state updates. */
  onFieldChange: (fieldKey: string) => void
  /** Emits the raw operator string. Parent owns the value-clear side-effect. */
  onOperatorChange: (operator: string) => void
  /** Emits the new filter value. */
  onValueChange: (value: unknown) => void
  /** Signals the parent to remove this condition. */
  onRemove: () => void
}

/** [field] → [operator] → [dynamic value input] → [delete], one row on desktop, stacked on mobile. */
export function FilterRow({
  condition,
  fields,
  operators,
  showValue,
  onFieldChange,
  onOperatorChange,
  onValueChange,
  onRemove,
}: FilterRowProps) {
  const selectedField = fields.find((f) => f.key === condition.field) ?? null
  const error = selectedField ? validateCondition(condition, selectedField) : null

  return (
    <Box display="flex" gap={1.5} alignItems="center" flexWrap={{ xs: 'wrap', md: 'nowrap' }}>
      <Select
        size="small"
        displayEmpty
        value={condition.field}
        onChange={(e) => onFieldChange(e.target.value)}
        sx={{ width: { xs: '100%', md: 180 }, flexShrink: 0 }}
      >
        <MenuItem value="" disabled>Select field</MenuItem>
        {fields.map((f) => (
          <MenuItem key={f.key} value={f.key}>
            {f.label}
          </MenuItem>
        ))}
      </Select>

      {selectedField && (
        <Select
          size="small"
          value={condition.operator}
          onChange={(e) => onOperatorChange(e.target.value)}
          sx={{ width: { xs: '100%', md: 190 }, flexShrink: 0 }}
        >
          {operators.map((op) => (
            <MenuItem key={op} value={op}>
              {getOperatorLabel(op, selectedField.type)}
            </MenuItem>
          ))}
        </Select>
      )}

      {showValue && selectedField && (
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: 160 } }}>
          <FilterValueInput
            field={selectedField}
            condition={condition}
            onChange={onValueChange}
            error={error}
          />
        </Box>
      )}

      <Tooltip title="Remove filter">
        <IconButton size="small" onClick={onRemove} aria-label="Remove condition">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
