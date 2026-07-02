import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { PageView } from '@/components/PageView'
import { transactionFilterConfig } from '@/filters'
import { formatCurrency } from '@/utils'
import type { TableColumn } from '@/types'
import type { Transaction } from '@/api/types'
import { TRANSACTIONS } from '@/data/transactions'

type Row = Transaction & Record<string, unknown>

const STATUS_COLOR: Record<Transaction['status'], 'success' | 'warning' | 'error' | 'secondary'> = {
  completed: 'success', pending: 'warning', failed: 'error', refunded: 'secondary',
}
const TYPE_COLOR: Record<Transaction['type'], 'success' | 'error'> = {
  credit: 'success', debit: 'error',
}

const COLUMNS: TableColumn<Row>[] = [
  { key: 'id',       label: 'ID',       type: 'string', width: 120 },
  { key: 'amount',   label: 'Amount',   type: 'number', align: 'right',
    render: (row) => (
      <Typography variant="body2" fontWeight={600} fontFamily="monospace">
        {formatCurrency(row.amount as number, (row.currency as string).toUpperCase())}
      </Typography>
    ),
  },
  { key: 'currency', label: 'Currency', type: 'select',
    render: (row) => (
      <Chip label={(row.currency as string).toUpperCase()} size="small" variant="outlined" />
    ),
  },
  { key: 'status',   label: 'Status',   type: 'select',
    render: (row) => (
      <Chip label={row.status as string} size="small"
        color={STATUS_COLOR[row.status as Transaction['status']]}
        sx={{ textTransform: 'capitalize' }} />
    ),
  },
  { key: 'type',     label: 'Type',     type: 'select',
    render: (row) => (
      <Chip label={row.type as string} size="small" variant="outlined"
        color={TYPE_COLOR[row.type as Transaction['type']]}
        sx={{ textTransform: 'capitalize' }} />
    ),
  },
  { key: 'date',     label: 'Date',     type: 'date' },
]

const DATA = TRANSACTIONS as unknown as Row[]

export function TransactionsPage() {
  return (
    <PageView
      title="Transactions"
      data={DATA}
      schema={transactionFilterConfig}
      columns={COLUMNS}
      getRowKey={(row) => row.id as string}
    />
  )
}
