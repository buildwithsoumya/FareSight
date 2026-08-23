import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { getPageMeta } from '../../utils/pageMeta'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const meta = getPageMeta(location.pathname)

  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="animate-fade-in-up mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-slate-200 px-4 py-4 md:px-8">
          <p className="mx-auto max-w-7xl text-xs text-slate-400">
            FareSight — AI Travel Analyst
          </p>
        </footer>
      </div>
    </div>
  )
}
