import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { DataTable } from '@/components/DataTable'
import { FilterBuilder } from '@/components/FilterBuilder'
import { applyFilters, countActiveFilters } from '@/services/filterEngine'
import type { FilterSchema, FilterState, TableColumn } from '@/types'

interface PageViewProps<TRow extends Record<string, unknown>> {
  title: string
  data: TRow[]
  schema: FilterSchema
  columns: TableColumn<TRow>[]
  getRowKey?: (row: TRow, index: number) => string | number
}

const emptyFilterState = (): FilterState => ({
  logicalOperator: 'AND',
  groups: [{ id: crypto.randomUUID(), logicalOperator: 'AND', conditions: [] }],
})

export function PageView<TRow extends Record<string, unknown>>({
  title,
  data,
  schema,
  columns,
  getRowKey,
}: PageViewProps<TRow>) {
  const [filterState, setFilterState] = useState<FilterState>(emptyFilterState)

  const rows = useMemo(
    () => applyFilters(data, schema, filterState) as TRow[],
    [data, schema, filterState],
  )

  const activeCount = countActiveFilters(filterState)

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography variant="h5" fontWeight={700}>{title}</Typography>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} filter${activeCount > 1 ? 's' : ''} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {rows.length === data.length
            ? `${data.length} records`
            : `${rows.length} of ${data.length} records`}
        </Typography>
      </Box>

      <FilterBuilder schema={schema} value={filterState} onChange={setFilterState} />

      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={getRowKey}
        aria-label={`${title} table`}
        stickyHeader
      />
    </Box>
  )
}
