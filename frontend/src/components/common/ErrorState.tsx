import Icon from './Icon'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  title = 'Unable to load data',
  message = 'Something went wrong while fetching the data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="card flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <Icon name="alert-circle" size={24} />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
          {message}
        </p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          <Icon name="refresh-cw" size={16} />
          Try again
        </button>
      )}
    </div>
  )
}
