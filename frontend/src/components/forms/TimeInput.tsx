interface TimeInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export default function TimeInput({
  id,
  label,
  value,
  onChange,
  required = false,
}: TimeInputProps) {
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

  const fromInputValue = (v: string) => {
    if (!v) return ''
    const [h, m] = v.split(':').map(Number)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type="time"
        required={required}
        value={toInputValue(value)}
        onChange={(e) => onChange(fromInputValue(e.target.value))}
        className="field-input"
      />
    </div>
  )
}
