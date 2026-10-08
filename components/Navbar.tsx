'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#080c18] border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2.5">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="42" cy="42" r="34" fill="white" stroke="#c4953a" strokeWidth="5"/>
              <path d="M24 42 L37 55 L60 26" stroke="#c4953a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="68" y1="68" x2="90" y2="90" stroke="#1a2540" strokeWidth="12" strokeLinecap="round"/>
              <line x1="68" y1="68" x2="90" y2="90" stroke="#c4953a" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <span className="font-black text-xl tracking-tight">
              <span className="text-slate-900 dark:text-white">Ride</span><span className="text-[#c4953a]">Checks</span>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#c4953a] dark:hover:text-[#c4953a] transition-colors">Home</Link>
          <Link href="/vin-check" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#c4953a] dark:hover:text-[#c4953a] transition-colors">VIN Check</Link>
          <Link href="/how-it-works" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#c4953a] dark:hover:text-[#c4953a] transition-colors">How it works</Link>
          <Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-300 hover:text-[#c4953a] dark:hover:text-[#c4953a] transition-colors">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/vin-check"
            className="bg-[#c4953a] hover:bg-[#b8872e] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
          >
            Get Report
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 text-slate-700 dark:text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#080c18] px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm text-slate-700 dark:text-slate-300" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/vin-check" className="text-sm text-slate-700 dark:text-slate-300" onClick={() => setOpen(false)}>VIN Check</Link>
          <Link href="/how-it-works" className="text-sm text-slate-700 dark:text-slate-300" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/pricing" className="text-sm text-slate-700 dark:text-slate-300" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/vin-check" className="bg-[#c4953a] text-white text-sm font-bold px-4 py-2 rounded-lg text-center" onClick={() => setOpen(false)}>Get Report</Link>
        </div>
      )}
    </header>
  )
}
