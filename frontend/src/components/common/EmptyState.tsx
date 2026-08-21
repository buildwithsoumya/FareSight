import Icon from './Icon'

interface EmptyStateProps {
  title?: string
  message?: string
}

export default function EmptyState({
  title = 'No data available',
  message = 'There is nothing to display for the current selection.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon name="inbox" size={24} />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
          {message}
        </p>
      </div>
    </div>
  )
}
