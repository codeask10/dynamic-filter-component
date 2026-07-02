import type { FilterSchema } from '@/types'
import { field } from './field'

export const userFilterConfig: FilterSchema = {
  entity: 'Users',
  fields: [
    field.text({
      key: 'name',
      label: 'Full Name',
      placeholder: 'e.g. Jane Smith',
    }),

    field.text({
      key: 'email',
      label: 'Email Address',
      operators: ['equals', 'contains', 'ends_with'],
      placeholder: 'e.g. user@example.com',
    }),

    field.select({
      key: 'role',
      label: 'Role',
      options: [
        { label: 'Admin',  value: 'admin' },
        { label: 'Member', value: 'member' },
        { label: 'Viewer', value: 'viewer' },
      ],
    }),

    field.select({
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active',   value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending',  value: 'pending' },
      ],
    }),

    field.date({
      key: 'created_at',
      label: 'Created At',
    }),
  ],
}
