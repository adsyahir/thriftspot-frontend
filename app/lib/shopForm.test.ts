import { describe, expect, it } from 'vitest'
import { emptyShopForm, mapsUrl, toShopPayload } from './shopForm'
import type { Shop } from '~/types/shop'

const shop: Shop = { ...emptyShopForm(), id: 1, created_at: '2026-01-01' }

describe('toShopPayload', () => {
  it('sends null address and place id when location type is coordinates', () => {
    const payload = toShopPayload({ ...emptyShopForm(), location_type: 'coordinates', address: 'x', place_id: 'P' })
    expect(payload.address).toBeNull()
    expect(payload.place_id).toBeNull()
  })

  it('sends null coordinates when location type is google_maps', () => {
    const payload = toShopPayload({ ...emptyShopForm(), location_type: 'google_maps', latitude: 1, longitude: 2 })
    expect(payload.latitude).toBeNull()
    expect(payload.longitude).toBeNull()
  })

  it('sends null place id when it was cleared', () => {
    expect(toShopPayload({ ...emptyShopForm(), place_id: '' }).place_id).toBeNull()
  })

  it('does not send server-only fields', () => {
    const payload = toShopPayload({ ...emptyShopForm(), id: 5, created_at: 'x' } as any) as any
    expect(payload.id).toBeUndefined()
    expect(payload.created_at).toBeUndefined()
  })

  it('drops blank social links', () => {
    expect(toShopPayload(emptyShopForm()).social_links).toEqual({})
  })
})

describe('mapsUrl', () => {
  it('links coordinates', () => {
    expect(mapsUrl({ ...shop, latitude: 3.1, longitude: 101.6, location_type: 'coordinates' }))
      .toBe('https://www.google.com/maps/search/?api=1&query=3.1,101.6')
  })

  it('links an address with its place id', () => {
    expect(mapsUrl({ ...shop, address: 'Jalan A', place_id: 'P1', location_type: 'google_maps' }))
      .toBe('https://www.google.com/maps/search/?api=1&query=Jalan%20A&query_place_id=P1')
  })
})
