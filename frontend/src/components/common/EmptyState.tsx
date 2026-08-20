interface EmptyStateProps {
  title?: string
  message?: string
}

export default function EmptyState({
  title = 'No data available',
  message = 'There is nothing to display for the current selection.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="text-3xl" aria-hidden="true">
        📭
      </span>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  )
}
