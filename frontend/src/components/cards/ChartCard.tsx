import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <section className={`card p-5 ${className ?? ''}`}>
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </header>
      <div className="h-64">{children}</div>
    </section>
  )
}
