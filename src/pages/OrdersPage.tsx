import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { PageView } from '@/components/PageView'
import { orderFilterConfig } from '@/filters'
import { formatCurrency } from '@/utils'
import type { TableColumn } from '@/types'
import type { Order } from '@/api/types'
import { ORDERS } from '@/data/orders'

type Row = Order & Record<string, unknown>

const STATUS_COLOR: Record<Order['status'], 'success' | 'info' | 'primary' | 'default' | 'error'> = {
  delivered: 'success', shipped: 'info', confirmed: 'primary', draft: 'default', cancelled: 'error',
}

const COLUMNS: TableColumn<Row>[] = [
  { key: 'order_number', label: 'Order #',   type: 'string', width: 160 },
  { key: 'customer',     label: 'Customer',  type: 'string' },
  { key: 'status',       label: 'Status',    type: 'select',
    render: (row) => (
      <Chip label={row.status as string} size="small"
        color={STATUS_COLOR[row.status as Order['status']]}
        sx={{ textTransform: 'capitalize' }} />
    ),
  },
  { key: 'total',        label: 'Total',     type: 'number', align: 'right',
    render: (row) => (
      <Typography variant="body2" fontWeight={600} fontFamily="monospace">
        {formatCurrency(row.total as number)}
      </Typography>
    ),
  },
  { key: 'item_count',   label: 'Items',     type: 'number', align: 'right' },
  { key: 'placed_at',    label: 'Placed At', type: 'date' },
]

const DATA = ORDERS as unknown as Row[]

export function OrdersPage() {
  return (
    <PageView
      title="Orders"
      data={DATA}
      schema={orderFilterConfig}
      columns={COLUMNS}
      getRowKey={(row) => row.id as string}
    />
  )
}
