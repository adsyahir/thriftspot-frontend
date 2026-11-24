export interface Analytics {
  totals: {
    shops: number
    items: number
    active_items: number
    sold_items: number
    views: number
  }
  daily: { date: string; views: number }[]
  top_items: { id: number; name: string; views: number }[]
}
