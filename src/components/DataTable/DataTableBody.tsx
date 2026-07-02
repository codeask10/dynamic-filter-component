import type { ReactNode } from 'react'
import {
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Typography,
  Stack,
  Chip,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import type { FieldType, TableColumn } from '@/types'
import { getNestedValue, parseDate } from '@/utils'

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function formatCellValue(value: unknown, type: FieldType): ReactNode {
  if (value === null || value === undefined) return '—'

  switch (type) {
    case 'boolean': {
      const flag = Boolean(value)
      return (
        <Chip
          label={flag ? 'Yes' : 'No'}
          size="small"
          color={flag ? 'success' : 'default'}
          variant="outlined"
        />
      )
    }
    case 'date': {
      const d = parseDate(value)
      return d ? DATE_FORMAT.format(d) : String(value)
    }
    case 'multi-select':
      return Array.isArray(value) ? value.join(', ') : String(value)
    default:
      return String(value)
  }
}

interface DataTableBodyProps<TRow extends Record<string, unknown>> {
  columns: TableColumn<TRow>[]
  rows: TRow[]
  loading: boolean
  skeletonRowCount: number
  emptyMessage: string
  getRowKey?: (row: TRow, index: number) => string | number
  onRowClick?: (row: TRow) => void
}

export function DataTableBody<TRow extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  skeletonRowCount,
  emptyMessage,
  getRowKey,
  onRowClick,
}: DataTableBodyProps<TRow>) {
  if (loading) {
    return (
      <TableBody>
        {Array.from({ length: skeletonRowCount }, (_, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align ?? 'left'}>
                <Skeleton variant="text" animation="wave" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length}
            align="center"
            sx={{ py: 8, border: 0, color: 'text.secondary' }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <InboxIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {rows.map((row, index) => {
        const rowKey = getRowKey ? getRowKey(row, index) : index
        return (
          <TableRow
            key={rowKey}
            hover={!!onRowClick}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align ?? 'left'}>
                {col.render
                  ? col.render(row)
                  : formatCellValue(getNestedValue(row, col.key), col.type)}
              </TableCell>
            ))}
          </TableRow>
        )
      })}
    </TableBody>
  )
}
