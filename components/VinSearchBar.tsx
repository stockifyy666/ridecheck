'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function VinSearchBar({ dark = true }: { dark?: boolean }) {
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
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 max-w-sm ${dark ? '' : 'mx-auto'}`}>
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Enter VIN number"
          value={vin}
          onChange={e => setVin(e.target.value)}
          maxLength={17}
          className={`w-full pl-9 pr-4 py-3 text-sm rounded-lg border outline-none transition
            ${dark
              ? 'bg-white/5 border-white/20 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-[#c4953a]/50 focus:border-[#c4953a]'
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]'
            }`}
        />
      </div>
      <button
        type="submit"
        className="bg-[#c4953a] hover:bg-[#b8872e] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
      >
        Check VIN
      </button>
    </form>
  )
}
