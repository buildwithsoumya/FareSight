import type { ReactNode } from 'react'
import Icon, { type IconName } from '../common/Icon'

interface ChartCardProps {
  title: string
  icon?: IconName
  meta?: string
  children: ReactNode
  className?: string
  heightClass?: string
}

export default function ChartCard({
  title,
  icon = 'bar-chart',
  meta,
  children,
  className = '',
  heightClass = 'h-[350px]',
}: ChartCardProps) {
  return (
    <section className={`card flex flex-col overflow-hidden ${className}`}>
      <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="text-slate-400">
            <Icon name={icon} size={16} />
          </span>
          {title}
        </h3>
        {meta && <span className="text-xs text-slate-400">{meta}</span>}
      </header>
      <div className={`flex-1 px-5 pb-5 ${heightClass}`}>{children}</div>
    </section>
  )
}
