import Chip from '@mui/material/Chip'
import { PageView } from '@/components/PageView'
import { userFilterConfig } from '@/filters'
import type { TableColumn } from '@/types'
import type { User } from '@/api/types'
import { USERS } from '@/data/users'

type Row = User & Record<string, unknown>

const ROLE_COLOR: Record<User['role'], 'primary' | 'info' | 'default'> = {
  admin: 'primary', member: 'info', viewer: 'default',
}
const STATUS_COLOR: Record<User['status'], 'success' | 'warning' | 'default'> = {
  active: 'success', pending: 'warning', inactive: 'default',
}

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name',       label: 'Name',    type: 'string' },
  { key: 'email',      label: 'Email',   type: 'string' },
  { key: 'role',       label: 'Role',    type: 'select',
    render: (row) => (
      <Chip label={row.role} size="small" color={ROLE_COLOR[row.role]} variant="outlined"
        sx={{ textTransform: 'capitalize' }} />
    ),
  },
  { key: 'status',     label: 'Status',  type: 'select',
    render: (row) => (
      <Chip label={row.status} size="small" color={STATUS_COLOR[row.status]}
        sx={{ textTransform: 'capitalize' }} />
    ),
  },
  { key: 'created_at', label: 'Created', type: 'date' },
]

const DATA = USERS as unknown as Row[]

export function UsersPage() {
  return (
    <PageView
      title="Users"
      data={DATA}
      schema={userFilterConfig}
      columns={COLUMNS}
      getRowKey={(row) => row.id as string}
    />
  )
}
