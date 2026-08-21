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

export function parseDurationToMinutes(value: string): number | null {
  const text = value.trim().toLowerCase()
  if (!text) return null

  const hm = text.match(/^(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+)\s*m)?$/)
  if (hm && (hm[1] !== undefined || hm[2] !== undefined)) {
    const hours = hm[1] !== undefined ? parseFloat(hm[1]) : 0
    const minutes = hm[2] !== undefined ? parseInt(hm[2], 10) : 0
    const total = hours * 60 + minutes
    return total > 0 ? total : null
  }

  const min = text.match(/^(\d+(?:\.\d+)?)\s*(?:min|minutes?)$/)
  if (min) {
    const total = parseFloat(min[1])
    return Number.isFinite(total) && total > 0 ? total : null
  }

  const decimalHours = Number(text)
  if (Number.isFinite(decimalHours) && decimalHours > 0) {
    return decimalHours * 60
  }

  return null
}

export function formatMinutesToDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// "10:30 AM" | "07:05" -> minutes since midnight (null when unparseable)
export function timeToMinutes(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return null
  let hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  const suffix = match[3]?.toUpperCase()
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  if (suffix === 'PM' && hour < 12) hour += 12
  if (suffix === 'AM' && hour === 12) hour = 0
  return hour * 60 + minute
}

// Minutes since midnight -> "10:30 AM" (12-hour, matching the backend format)
export function minutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const h24 = Math.floor(normalized / 60)
  const m = Math.floor(normalized % 60)
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
}
