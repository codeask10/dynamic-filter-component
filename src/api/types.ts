export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
}

export interface Transaction {
  id: string
  amount: number
  currency: 'usd' | 'eur' | 'gbp'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  type: 'credit' | 'debit'
  date: string
}

export interface Order {
  id: string
  order_number: string
  customer: string
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  item_count: number
  placed_at: string
}

export type SortOrder = 'asc' | 'desc'

export interface ListParams {
  _sort?: string
  _order?: SortOrder
  [key: string]: string | number | boolean | undefined
}

export interface PaginationParams extends ListParams {
  _page: number
  _per_page: number
}

/** Shape returned by json-server v1 when _page + _per_page are supplied. */
export interface PaginatedResponse<T> {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: T[]
}
