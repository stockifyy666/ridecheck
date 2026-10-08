'use client'
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

interface Props {
  vin: string
  selectedPackage: { id: string; name: string; price: number; delivery: string }
}

export default function OrderForm({ vin, selectedPackage }: Props) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          vin,
          package_name: selectedPackage.name,
          package_price: selectedPackage.price,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setDone(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={24} className="text-green-600" strokeWidth={2.5} />
        </div>
        <h3 className="font-bold text-slate-900 text-lg mb-2">Order Placed Successfully!</h3>
        <p className="text-sm text-slate-600">
          We've received your order for the <strong>{selectedPackage.name}</strong> report on VIN <span className="font-mono font-semibold">{vin}</span>.
        </p>
        <p className="text-sm text-slate-500 mt-2">A confirmation email has been sent to <strong>{form.email}</strong>. Your report will be delivered in {selectedPackage.delivery}.</p>
      </div>
    )
  }

  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-slate-900 text-lg">Complete your order</h3>
        <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">{selectedPackage.name} — ${selectedPackage.price}</span>
      </div>
      <p className="text-xs text-slate-400 mb-5 font-mono">VIN: {vin || 'Not entered'}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Placing order...</> : 'Place Order & Get Report'}
        </button>
        <p className="text-xs text-center text-slate-400">
          By placing this order you agree to our <a href="/terms" className="underline">Terms of Service</a>
        </p>
      </form>
    </div>
  )
}
