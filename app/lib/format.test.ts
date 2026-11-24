import { describe, expect, it } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats a numeric string as RM with two decimals', () => {
    expect(formatPrice('45')).toBe('RM 45.00')
  })

  it('adds thousands separators', () => {
    expect(formatPrice(1234.5)).toBe('RM 1,234.50')
  })
})
