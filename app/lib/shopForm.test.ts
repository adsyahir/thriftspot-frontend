import { describe, expect, it } from 'vitest'
import { emptyShopForm, mapsUrl, toShopPayload } from './shopForm'
import type { Shop } from '~/types/shop'

const shop: Shop = { ...emptyShopForm(), id: 1, created_at: '2026-01-01' }

describe('toShopPayload', () => {
  it('drops address when location type is coordinates', () => {
    expect(toShopPayload({ ...emptyShopForm(), location_type: 'coordinates', address: 'x' }).address).toBeUndefined()
  })

  it('drops latitude when location type is google_maps', () => {
    expect(toShopPayload({ ...emptyShopForm(), location_type: 'google_maps', latitude: 1 }).latitude).toBeUndefined()
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
