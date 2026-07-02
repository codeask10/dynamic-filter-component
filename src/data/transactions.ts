import type { Transaction } from '@/api/types'
import db from '../../mock/db.json'

export const TRANSACTIONS = db.transactions as unknown as Transaction[]
