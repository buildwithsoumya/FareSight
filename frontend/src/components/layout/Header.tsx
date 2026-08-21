import { useApiHealth } from '../../hooks/useApiHealth'
import Icon from '../common/Icon'
import { classNames } from '../../utils/cn'

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick: () => void
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
  const apiOnline = useApiHealth()

  const status =
    apiOnline === null
      ? { dot: 'bg-slate-300', text: 'text-slate-500', label: 'Checking API…' }
      : apiOnline
        ? { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'API Online' }
        : { dot: 'bg-red-500', text: 'text-red-600', label: 'API Offline' }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" size={20} />
        </button>
        <div>
          <h1 className="text-[15px] font-semibold leading-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div
        className={classNames(
          'flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 shadow-sm',
          apiOnline === null
            ? 'border-slate-200'
            : apiOnline
              ? 'border-emerald-200'
              : 'border-red-200',
        )}
        role="status"
        aria-live="polite"
        aria-label={status.label}
      >
        <span className={classNames('h-2 w-2 rounded-full', status.dot)}>
          {apiOnline === true && (
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400" />
          )}
        </span>
        <span className={classNames('text-xs font-medium', status.text)}>
          {status.label}
        </span>
      </div>
    </header>
  )
}
