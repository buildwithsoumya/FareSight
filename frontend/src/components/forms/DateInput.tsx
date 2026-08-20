interface DateInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  min?: string
}

export default function DateInput({
  id,
  label,
  value,
  onChange,
  required = false,
  min,
}: DateInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type="date"
        required={required}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-800 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  )
}
