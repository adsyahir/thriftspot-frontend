export type DayHours = false | [string, string]

export type OperatingHours = {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export type DayKey = keyof OperatingHours

export interface SocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  whatsapp?: string
}

export interface ShopRequest {
  name: string
  description: string
  state: string
  location_type: 'google_maps' | 'coordinates'
  place_id?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  phone_number: string
  email: string
  social_links?: SocialLinks
  operating_hours: OperatingHours
}

export interface Shop extends ShopRequest {
  id: number
  created_at: string
}
