'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function VinSearchBar() {
  const [vin, setVin] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = vin.trim().toUpperCase()
    if (trimmed.length > 0) {
      router.push(`/vin-check?vin=${trimmed}`)
    } else {
      router.push('/vin-check')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
      <div className="relative flex-1">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Enter VIN number"
          value={vin}
          onChange={e => setVin(e.target.value)}
          maxLength={17}
          className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border-2 outline-none transition-all
            bg-white dark:bg-white/5
            border-slate-200 dark:border-white/15
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            focus:border-[#c4953a] dark:focus:border-[#c4953a]
            shadow-sm dark:shadow-none"
        />
      </div>
      <button
        type="submit"
        className="bg-[#c4953a] hover:bg-[#b8872e] active:bg-[#9a7220] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors whitespace-nowrap shadow-sm"
      >
        Check VIN
      </button>
    </form>
  )
}
