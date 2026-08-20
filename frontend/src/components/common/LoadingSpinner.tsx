interface LoadingSpinnerProps {
  label?: string
}

export default function LoadingSpinner({ label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-brand-500"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
