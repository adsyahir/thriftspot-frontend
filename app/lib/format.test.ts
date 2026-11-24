import { describe, expect, it } from 'vitest'
import { formatPrice, safeHttpUrl } from './format'

describe('formatPrice', () => {
  it('formats a numeric string as RM with two decimals', () => {
    expect(formatPrice('45')).toBe('RM 45.00')
  })

  it('adds thousands separators', () => {
    expect(formatPrice(1234.5)).toBe('RM 1,234.50')
  })
})

describe('safeHttpUrl', () => {
  it('keeps http and https links', () => {
    expect(safeHttpUrl('https://instagram.com/a')).toBe('https://instagram.com/a')
    expect(safeHttpUrl('http://example.com')).toBe('http://example.com')
  })

  it('rejects other schemes and junk', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('data:text/html,hi')).toBeNull()
    expect(safeHttpUrl('not a url')).toBeNull()
    expect(safeHttpUrl(undefined)).toBeNull()
  })
})
