import { NavLink } from 'react-router-dom'
import { classNames } from '../../utils/cn'

interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊', end: true },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/prediction', label: 'Prediction', icon: '🎯' },
  { to: '/insights', label: 'Insights', icon: '💡' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={classNames(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg text-white"
            aria-hidden="true"
          >
            ✈️
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold tracking-tight text-slate-900">FareSight</p>
            <p className="text-[11px] font-medium text-slate-500">AI Travel Analyst</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Explore
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )
              }
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Project status */}
        <div className="border-t border-slate-200 px-5 py-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full bg-amber-400"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold text-slate-700">In Development</p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
              Powered by Python · FastAPI · Scikit-learn
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
