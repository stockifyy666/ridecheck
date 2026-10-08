'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/types'

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="max-w-3xl mx-auto px-4 py-20">
      <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">FAQ</p>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Questions, answered.</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Support replies in about 10 minutes.</p>

      <div className="divide-y divide-slate-200 dark:divide-white/10 border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {item.q}
              <ChevronDown
                size={16}
                className={`text-slate-400 shrink-0 ml-4 transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
