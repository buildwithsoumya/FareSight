interface NumberInputProps {
  id: string
  label: string
  value: number | string
  onChange: (value: number | string) => void
  min?: number
  max?: number
  step?: number
  required?: boolean
  suffix?: string
  placeholder?: string
}

export default function NumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  required = false,
  suffix,
  placeholder,
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
