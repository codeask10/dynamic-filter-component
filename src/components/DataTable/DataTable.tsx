import { useState } from 'react'
import type { ChangeEvent, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import type { DataTableProps } from '@/types'
import { DataTableBody } from './DataTableBody'

const DEFAULT_ROWS_PER_PAGE = [10, 25, 50]

export function DataTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  skeletonRowCount = 5,
  emptyMessage = 'No records found.',
  defaultPage = 0,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE,
  getRowKey,
  onRowClick,
  size = 'medium',
  stickyHeader = false,
  'aria-label': ariaLabel,
}: DataTableProps<TRow>) {
  const [page, setPage]               = useState(defaultPage)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)

  const visibleColumns = columns.filter((c) => !c.hidden)
  const pagedRows = rowsPerPage === -1
    ? rows
    : rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size={size} stickyHeader={stickyHeader} aria-label={ariaLabel}>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell key={col.key} align={col.align ?? 'left'} sx={{ width: col.width }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <DataTableBody
            columns={visibleColumns}
            rows={pagedRows}
            loading={loading}
            skeletonRowCount={skeletonRowCount}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
            onRowClick={onRowClick}
          />
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={loading ? -1 : rows.length}
        page={page}
        onPageChange={(_e: MouseEvent<HTMLButtonElement> | null, p: number) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement>) => {
          setRowsPerPage(parseInt(e.target.value, 10))
          setPage(0)
        }}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </Box>
  )
}
