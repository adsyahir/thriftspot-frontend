export function formatPrice(value: string | number): string {
  const amount = Number(value)

  return `RM ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
