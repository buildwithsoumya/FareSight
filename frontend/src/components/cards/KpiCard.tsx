import Icon, { type IconName } from '../common/Icon'
import { classNames } from '../../utils/cn'

type Tone = 'indigo' | 'sky' | 'violet' | 'amber'

const TONE_STYLES: Record<Tone, string> = {
  indigo: 'bg-brand-50 text-brand-600',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
}

interface KpiCardProps {
  label: string
  value: string
  icon: IconName
  hint?: string
  tone?: Tone
}

export default function KpiCard({
  label,
  value,
  icon,
  hint,
  tone = 'indigo',
}: KpiCardProps) {
  return (
    <div className="card card-hover p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <p className="mt-1.5 truncate text-[22px] font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <span
          className={classNames(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
            TONE_STYLES[tone],
          )}
        >
          <Icon name={icon} size={20} />
        </span>
      </div>
    </div>
  )
}
