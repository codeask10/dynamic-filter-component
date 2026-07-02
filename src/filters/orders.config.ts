import type { FilterSchema } from '@/types'
import { field } from './field'

export const orderFilterConfig: FilterSchema = {
  entity: 'Orders',
  fields: [
    field.text({
      key: 'order_number',
      label: 'Order Number',
      operators: ['equals', 'contains'],
    }),

    field.text({
      key: 'customer',
      label: 'Customer',
      operators: ['equals', 'contains', 'starts_with'],
    }),

    field.select({
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipped',   value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    }),

    field.number({
      key: 'total',
      label: 'Order Total',
      rendererKey: 'currency',
      validation: [
        { type: 'min', value: 0, message: 'Total must be non-negative' },
      ],
    }),

    field.number({
      key: 'item_count',
      label: 'Item Count',
      operators: ['equals', 'greater_than', 'less_than'],
      validation: [
        { type: 'min', value: 1, message: 'Must have at least one item' },
      ],
    }),

    field.date({
      key: 'placed_at',
      label: 'Placed At',
    }),
  ],
}
