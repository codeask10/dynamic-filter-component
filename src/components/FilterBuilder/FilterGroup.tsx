import type { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import type {
  FilterGroup as FilterGroupType,
  FilterFieldConfig,
  LogicalOperator,
  Operator,
} from '@/types'
import { operatorRequiresValue, isOperatorType } from '@/services/operators'
import { FilterRow } from './FilterRow'
import { createCondition } from './utils'

interface FilterGroupProps {
  group: FilterGroupType
  fields: FilterFieldConfig[]
  onChange: (updated: FilterGroupType) => void
  onRemove?: () => void
}

export function FilterGroup({ group, fields, onChange, onRemove }: FilterGroupProps) {

  function handleFieldChange(conditionId: string, fieldKey: string) {
    const nextField = fields.find((f) => f.key === fieldKey)
    onChange({
      ...group,
      conditions: group.conditions.map((c) =>
        c.id === conditionId
          ? {
              ...c,
              field:    fieldKey,
              operator: (nextField?.operators[0] ?? 'equals') as Operator,
              value:    '',
            }
          : c,
      ),
    })
  }

  function handleOperatorChange(conditionId: string, raw: string) {
    if (!isOperatorType(raw)) return
    onChange({
      ...group,
      conditions: group.conditions.map((c) =>
        c.id === conditionId ? { ...c, operator: raw, value: '' } : c,
      ),
    })
  }

  function handleValueChange(conditionId: string, value: unknown) {
    onChange({
      ...group,
      conditions: group.conditions.map((c) =>
        c.id === conditionId ? { ...c, value } : c,
      ),
    })
  }

  function handleRemoveCondition(id: string) {
    onChange({ ...group, conditions: group.conditions.filter((c) => c.id !== id) })
  }

  function handleAddCondition() {
    onChange({ ...group, conditions: [...group.conditions, createCondition(fields)] })
  }

  function handleLogicalOperatorChange(_event: MouseEvent, next: LogicalOperator | null) {
    if (next !== null) onChange({ ...group, logicalOperator: next })
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 2 }}>

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="caption" color="text.secondary">Match</Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={group.logicalOperator}
            onChange={handleLogicalOperatorChange}
            aria-label="Logical operator"
          >
            <ToggleButton value="AND" aria-label="AND" sx={{ px: 1.5 }}>AND</ToggleButton>
            <ToggleButton value="OR"  aria-label="OR"  sx={{ px: 1.5 }}>OR</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary">of the following</Typography>
        </Box>

        {onRemove && (
          <Tooltip title="Remove group">
            <IconButton size="small" onClick={onRemove} aria-label="Remove group">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {group.conditions.length > 0 ? (
        <Stack spacing={1.5}>
          {group.conditions.map((condition) => {
            const fieldConfig = fields.find((f) => f.key === condition.field)
            const operators   = fieldConfig?.operators ?? []
            const showValue   = fieldConfig !== undefined && operatorRequiresValue(condition.operator)

            return (
              <FilterRow
                key={condition.id}
                condition={condition}
                fields={fields}
                operators={operators as Operator[]}
                showValue={showValue}
                onFieldChange={(key) => handleFieldChange(condition.id, key)}
                onOperatorChange={(op) => handleOperatorChange(condition.id, op)}
                onValueChange={(v) => handleValueChange(condition.id, v)}
                onRemove={() => handleRemoveCondition(condition.id)}
              />
            )
          })}
        </Stack>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ py: 1.5, px: 1, color: 'text.disabled' }}
        >
          <FilterAltOutlinedIcon fontSize="small" />
          <Typography variant="body2">No conditions yet — add one below.</Typography>
        </Box>
      )}

      <Button
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAddCondition}
        variant="outlined"
        disabled={fields.length === 0}
        sx={{ alignSelf: 'flex-start' }}
      >
        Add filter
      </Button>

    </Paper>
  )
}
