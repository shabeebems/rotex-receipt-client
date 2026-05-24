export const COMPANY_NAME = 'Rotex Resume Makers'

export function formatCurrency(amount) {
  const value = Number(amount)
  if (Number.isNaN(value)) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatCreatedAt(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return formatDate(date)
}

export function calcDiscount(actual, offer) {
  const actualNum = Number(actual) || 0
  const offerNum = Number(offer) || 0
  const saved = Math.max(0, actualNum - offerNum)
  const percent = actualNum > 0 ? Math.round((saved / actualNum) * 100) : 0
  return { saved, percent }
}
