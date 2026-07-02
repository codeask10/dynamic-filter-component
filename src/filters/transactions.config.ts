import type { FilterSchema } from '@/types'
import { field } from './field'

export const transactionFilterConfig: FilterSchema = {
  entity: 'Transactions',
  fields: [
    field.text({
      key: 'id',
      label: 'Transaction ID',
      operators: ['equals', 'contains'],
    }),

    field.number({
      key: 'amount',
      label: 'Amount',
      rendererKey: 'currency',
      validation: [
        { type: 'min', value: 0, message: 'Amount must be non-negative' },
      ],
    }),

    field.select({
      key: 'currency',
      label: 'Currency',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
        { label: 'GBP', value: 'gbp' },
      ],
    }),

    field.select({
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Pending',   value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed',    value: 'failed' },
        { label: 'Refunded',  value: 'refunded' },
      ],
    }),

    field.select({
      key: 'type',
      label: 'Type',
      options: [
        { label: 'Credit', value: 'credit' },
        { label: 'Debit',  value: 'debit' },
      ],
    }),

    field.date({
      key: 'date',
      label: 'Transaction Date',
    }),
  ],
}
