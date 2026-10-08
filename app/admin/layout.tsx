'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  RiDashboardLine, RiFileListLine, RiLogoutBoxLine,
  RiMenuLine, RiCloseLine, RiShieldCheckLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import ThemeToggle from '@/components/ThemeToggle'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: RiDashboardLine },
  { href: '/admin/orders', label: 'Orders', icon: RiFileListLine },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    toast.success('Logged out')
    router.push('/admin/login')
  }

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-[#080c18] border-r border-slate-200 dark:border-white/10">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="42" cy="42" r="34" fill="white" stroke="#c4953a" strokeWidth="5"/>
            <path d="M24 42 L37 55 L60 26" stroke="#c4953a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="68" y1="68" x2="90" y2="90" stroke="#1a2540" strokeWidth="12" strokeLinecap="round"/>
            <line x1="68" y1="68" x2="90" y2="90" stroke="#c4953a" strokeWidth="6" strokeLinecap="round"/>
          </svg>
          <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
            Ride<span className="text-[#c4953a]">Checks</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden">
            <RiCloseLine size={20} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <RiShieldCheckLine size={13} className="text-[#c4953a]" />
          <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">Admin Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#c4953a]/10 text-[#c4953a] border border-[#c4953a]/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/5 transition-all w-full"
        >
          <RiLogoutBoxLine size={17} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (pathname === '/admin/login') return <>{children}</>

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a0f1e] overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col w-56 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-56 flex flex-col">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-[#0e1628] border-b border-slate-200 dark:border-white/10 px-5 py-3.5 flex items-center justify-between shrink-0">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1"
            onClick={() => setMobileOpen(true)}
          >
            <RiMenuLine size={20} />
          </button>
          <div className="text-sm text-slate-500 dark:text-slate-400 lg:ml-0 ml-2">
            Welcome back, <span className="font-semibold text-slate-800 dark:text-white">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-[#c4953a]/15 border border-[#c4953a]/30 flex items-center justify-center">
              <RiShieldCheckLine size={15} className="text-[#c4953a]" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
