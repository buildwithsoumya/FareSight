// Formatting helpers shared across the dashboard.

export function formatINR(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactINR(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(1)} Cr`
  }
  if (Math.abs(value) >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(1)} L`
  }
  if (Math.abs(value) >= 1_000) {
    return `₹${(value / 1_000).toFixed(0)}K`
  }
  return `₹${Math.round(value)}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatAxisPrice(value: number): string {
  if (!Number.isFinite(value)) return ''
  return formatCompactINR(value)
}

export function formatHours(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const h = Math.floor(value)
  const m = Math.round((value - h) * 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
