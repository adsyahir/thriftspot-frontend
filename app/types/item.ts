export type ItemCategory = 'electronics' | 'fashion' | 'home' | 'sports'
export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair'
export type ItemStatus = 'active' | 'sold' | 'hidden'

export interface Item {
  id: number
  name: string
  description: string
  category: ItemCategory
  condition: ItemCondition
  status: ItemStatus
  price: string
  image_url: string | null
  shop?: { id: number; name: string; state: string }
  views?: number
  created_at: string
}

export interface PageMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface BrowseParams {
  search?: string
  category?: string
  state?: string
  shop_id?: number
  min_price?: number
  max_price?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  per_page?: number
}

export interface MyItemsParams {
  shop_id?: number
  status?: string
  search?: string
  page?: number
  per_page?: number
}
