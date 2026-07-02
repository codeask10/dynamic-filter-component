import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import type { FilterGroup as FilterGroupType, FilterSchema, FilterState } from '@/types'
import { countActiveFilters } from '@/services/filterEngine'
import { FilterGroup } from './FilterGroup'
import { createGroup } from './utils'

interface FilterBuilderProps {
  /** Describes which fields are filterable for a given entity. */
  schema: FilterSchema
  /** Current filter state (controlled). */
  value: FilterState
  /** Invoked with the next state on every user interaction. */
  onChange: (state: FilterState) => void
}

/** Schema-driven, entity-agnostic filter builder. Knows nothing about Users, Transactions, etc. */
export function FilterBuilder({ schema, value, onChange }: FilterBuilderProps) {
  function handleGroupChange(updated: FilterGroupType) {
    onChange({
      ...value,
      groups: value.groups.map((g) => (g.id === updated.id ? updated : g)),
    })
  }

  function handleRemoveGroup(id: string) {
    onChange({ ...value, groups: value.groups.filter((g) => g.id !== id) })
  }

  function handleAddGroup() {
    onChange({ ...value, groups: [...value.groups, createGroup(schema.fields)] })
  }

  function handleClearAll() {
    onChange({
      logicalOperator: 'AND',
      groups: [createGroup(schema.fields)],
    })
  }

  const activeCount = countActiveFilters(value)

  if (schema.fields.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center', color: 'text.disabled' }}>
        <Typography variant="body2">No filterable fields configured for {schema.entity}.</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" color="text.secondary">
          {schema.entity} filters
        </Typography>

        {activeCount > 0 && (
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
            {activeCount} active
          </Typography>
        )}
      </Box>

      <Stack spacing={1.5}>
        {value.groups.map((group) => (
          <FilterGroup
            key={group.id}
            group={group}
            fields={schema.fields}
            onChange={handleGroupChange}
            onRemove={value.groups.length > 1 ? () => handleRemoveGroup(group.id) : undefined}
          />
        ))}
      </Stack>

      <Divider />

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Button size="small" startIcon={<AddIcon />} onClick={handleAddGroup} variant="text">
          Add group
        </Button>

        <Button
          size="small"
          startIcon={<ClearAllIcon />}
          onClick={handleClearAll}
          color="error"
          variant="text"
          disabled={activeCount === 0}
        >
          Clear all
        </Button>
      </Box>
    </Stack>
  )
}
