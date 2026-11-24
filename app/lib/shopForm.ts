import type { DayKey, Shop, ShopRequest, SocialLinks } from '~/types/shop'

export const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
]

export function emptyShopForm(): ShopRequest {
  return {
    name: '',
    description: '',
    state: '',
    location_type: 'google_maps',
    place_id: '',
    address: '',
    latitude: null,
    longitude: null,
    phone_number: '',
    email: '',
    social_links: { instagram: '', facebook: '', twitter: '', tiktok: '', whatsapp: '' },
    operating_hours: {
      monday: ['09:00', '18:00'],
      tuesday: ['09:00', '18:00'],
      wednesday: ['09:00', '18:00'],
      thursday: ['09:00', '18:00'],
      friday: ['09:00', '18:00'],
      saturday: ['09:00', '18:00'],
      sunday: false,
    },
  }
}

export function toShopPayload(form: ShopRequest): ShopRequest {
  const payload: ShopRequest = JSON.parse(JSON.stringify(form))

  if (payload.location_type === 'coordinates') {
    delete payload.address
    delete payload.place_id
  } else {
    delete payload.latitude
    delete payload.longitude
    if (!payload.place_id) delete payload.place_id
  }

  const links: SocialLinks = {}
  for (const [key, value] of Object.entries(payload.social_links ?? {})) {
    if (typeof value === 'string' && value.trim() !== '') {
      links[key as keyof SocialLinks] = value.trim()
    }
  }
  payload.social_links = links

  return payload
}

export function mapsUrl(shop: Shop): string {
  const base = 'https://www.google.com/maps/search/?api=1&query='

  if (shop.location_type === 'coordinates') {
    return `${base}${shop.latitude},${shop.longitude}`
  }

  const query = `${base}${encodeURIComponent(shop.address ?? '')}`

  return shop.place_id ? `${query}&query_place_id=${encodeURIComponent(shop.place_id)}` : query
}
