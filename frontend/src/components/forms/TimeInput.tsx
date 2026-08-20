interface TimeInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

/**
 * Time input that accepts 12-hour format strings like "10:30 AM".
 * Converts to/from a native datetime-local-friendly value in the UI
 * while storing the 12-hour string the backend expects.
 */
export default function TimeInput({
  id,
  label,
  value,
  onChange,
  required = false,
}: TimeInputProps) {
  // Convert "10:30 AM" -> "10:30" for the <input type="time"> (24h display)
  const toInputValue = (v: string) => {
    const match = v.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
    if (!match) return ''
    let hour = parseInt(match[1], 10)
    const minute = match[2]
    const suffix = match[3]?.toUpperCase()
    if (suffix === 'PM' && hour < 12) hour += 12
    if (suffix === 'AM' && hour === 12) hour = 0
    return `${String(hour).padStart(2, '0')}:${minute}`
  }

  // Convert "10:30" -> "10:30 AM"
  const fromInputValue = (v: string) => {
    if (!v) return ''
    const [h, m] = v.split(':').map(Number)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type="time"
        required={required}
        value={toInputValue(value)}
        onChange={(e) => onChange(fromInputValue(e.target.value))}
        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  )
}
