import type { User } from '@/api/types'
import db from '../../mock/db.json'

export const USERS = db.users as unknown as User[]
