interface KpiCardProps {
  label: string
  value: string
  icon: string
  hint?: string
}

export default function KpiCard({ label, value, icon, hint }: KpiCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-lg"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
    </div>
  )
}
