import { NavLink } from 'react-router-dom'
import Icon, { type IconName } from '../common/Icon'
import { classNames } from '../../utils/cn'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/prediction', label: 'Predict Fare', icon: 'send' },
  { to: '/analytics', label: 'Analytics', icon: 'bar-chart' },
  { to: '/insights', label: 'Model Insights', icon: 'sparkles' },
  { to: '/about', label: 'About', icon: 'info' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={classNames(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={classNames(
          'custom-scrollbar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between px-5 pb-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <Icon name="plane" size={18} />
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight tracking-tight text-slate-900">
                FareSight
              </p>
              <p className="text-xs text-slate-500">AI Travel Analyst</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close navigation menu"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-50 font-semibold text-brand-700'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={item.icon}
                    size={18}
                    className={isActive ? 'text-brand-600' : 'text-slate-400'}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-slate-50 p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm ring-1 ring-slate-200">
                <Icon name="cpu" size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-800">
                  HistGradientBoosting
                </p>
                <p className="text-xs text-slate-500">Active model · R² 0.708</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
