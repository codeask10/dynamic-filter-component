import type { Order } from '@/api/types'
import db from '../../mock/db.json'

export const ORDERS = db.orders as unknown as Order[]
