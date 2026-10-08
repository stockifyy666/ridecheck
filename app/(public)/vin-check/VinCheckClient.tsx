'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, MapPin, Car, Key, ArrowRight, ShieldCheck, Lock, CreditCard, Loader2, CheckCircle } from 'lucide-react'
import { PACKAGES } from '@/lib/types'
import FaqSection from '@/components/FaqSection'
import toast from 'react-hot-toast'

type Step = 'vin' | 'packages' | 'payment' | 'details' | 'success'

const VIN_LOCATIONS = [
  { icon: Car, title: 'Windshield plate', desc: 'Stand outside the car and look at the lower corner of the windshield on the driver\'s side.' },
  { icon: Key, title: 'Driver\'s doorframe', desc: 'Open the driver\'s door and read the compliance sticker on the B-pillar or door edge.' },
  { icon: MapPin, title: 'Under the hood', desc: 'Many vehicles stamp the VIN on the firewall, strut tower or the front of the engine block.' },
  { icon: Check, title: 'Your paperwork', desc: 'Registration, title, insurance card and service invoices all carry the full VIN.' },
]

const VIN_ANATOMY = [
  { chars: '1–3', label: 'World manufacturer identifier', desc: 'Country, maker and vehicle type' },
  { chars: '4–8', label: 'Vehicle descriptor', desc: 'Model, body style, engine and restraints' },
  { chars: '9', label: 'Check digit', desc: 'Validates the VIN is not mistyped' },
  { chars: '10', label: 'Model year', desc: 'Factory model year code' },
  { chars: '11', label: 'Assembly plant', desc: 'Where the vehicle was built' },
  { chars: '12–17', label: 'Serial number', desc: 'Unique production sequence' },
]

function MockPaymentForm({ pkg, onSuccess }: { pkg: typeof PACKAGES[0], onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Payment confirmed!')
      onSuccess()
    }, 1800)
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Lock size={16} className="text-[#c4953a]" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Secure Payment — SSL Encrypted</span>
      </div>

      <div className="bg-[#faf8f4] dark:bg-white/5 border border-[#c4953a]/20 rounded-xl p-4 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{pkg.name} Report</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Delivered in {pkg.delivery}</p>
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-white">${pkg.price}</span>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Card Number</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="4242 4242 4242 4242"
              maxLength={19}
              className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a] pr-10"
            />
            <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expiry</label>
            <input
              type="text"
              defaultValue="12/28"
              maxLength={5}
              className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">CVC</label>
            <input
              type="text"
              defaultValue="123"
              maxLength={4}
              className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name on Card</label>
          <input
            type="text"
            placeholder="John Smith"
            className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c4953a] hover:bg-[#b8872e] disabled:opacity-70 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Processing payment...</>
          ) : (
            <><Lock size={14} /> Pay ${pkg.price} — Get Report</>
          )}
        </button>
        <p className="text-xs text-center text-slate-400">
          <ShieldCheck size={11} className="inline mr-1" />
          Your payment is protected. 30-day refund policy applies.
        </p>
      </form>
    </div>
  )
}

function OrderDetailsForm({ vin, pkg, onSuccess }: { vin: string, pkg: typeof PACKAGES[0], onSuccess: (email: string, name: string) => void }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
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
          package_name: pkg.name,
          package_price: pkg.price,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      toast.success('Order placed! Check your email for confirmation.')
      onSuccess(form.email, form.full_name)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle size={15} className="text-green-600 dark:text-green-400" />
        </div>
        <span className="text-sm font-semibold text-green-700 dark:text-green-400">Payment confirmed!</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Enter your details below to receive your report.</p>

      <div className="bg-[#faf8f4] dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3 mb-5 text-xs text-slate-600 dark:text-slate-400">
        <span className="font-semibold text-slate-800 dark:text-white">{pkg.name} Report</span>
        <span className="mx-2 text-slate-300 dark:text-white/20">·</span>
        <span className="font-mono text-slate-700 dark:text-slate-300">{vin}</span>
        <span className="mx-2 text-slate-300 dark:text-white/20">·</span>
        <span className="font-bold text-[#c4953a]">${pkg.price}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
          <input
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm outline-none bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#c4953a]/30 focus:border-[#c4953a]"
          />
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c4953a] hover:bg-[#b8872e] disabled:opacity-60 text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <>Submit & Receive Report <ArrowRight size={14} /></>}
        </button>
        <p className="text-xs text-center text-slate-400">
          By submitting you agree to our <a href="/terms" className="underline">Terms of Service</a>
        </p>
      </form>
    </div>
  )
}

function VinCheckInner() {
  const searchParams = useSearchParams()
  const [vin, setVin] = useState(searchParams.get('vin') || '')
  const [submittedVin, setSubmittedVin] = useState(searchParams.get('vin') || '')
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null)
  const [step, setStep] = useState<Step>(searchParams.get('vin') ? 'packages' : 'vin')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    const v = searchParams.get('vin')
    if (v) { setVin(v); setSubmittedVin(v); setStep('packages') }
  }, [searchParams])

  const handleVinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = vin.trim().toUpperCase()
    if (!trimmed) return
    setSubmittedVin(trimmed)
    setSelectedPkg(null)
    setStep('packages')
    setTimeout(() => document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPkg(pkgId)
    setStep('payment')
    setTimeout(() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handlePaymentSuccess = () => {
    setStep('details')
    setTimeout(() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleOrderSuccess = (email: string, name: string) => {
    setCustomerEmail(email)
    setCustomerName(name)
    setStep('success')
    setTimeout(() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const pkg = PACKAGES.find(p => p.id === selectedPkg)

  const STEPS = [
    { key: 'packages', label: 'Select Package' },
    { key: 'payment', label: 'Payment' },
    { key: 'details', label: 'Your Details' },
    { key: 'success', label: 'Confirmation' },
  ]

  const currentStepIdx = STEPS.findIndex(s => s.key === step)

  return (
    <>
      {/* Hero */}
      <section className="bg-[#faf8f4] dark:bg-[#080c18] text-slate-900 dark:text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">VIN CHECK</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Check a VIN and uncover its recorded history.</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto mb-10">
            Enter a vehicle's 17-character VIN to explore available vehicle history, specifications, and other important records.
          </p>
          <form onSubmit={handleVinSubmit} className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Enter VIN number (e.g. 1HGBH41JXMN109186)"
              value={vin}
              onChange={e => setVin(e.target.value)}
              maxLength={17}
              className="flex-1 px-4 py-3 text-sm rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#c4953a]/50 focus:border-[#c4953a]"
            />
            <button type="submit" className="bg-[#c4953a] hover:bg-[#b8872e] text-white font-bold text-sm px-8 py-3 rounded-lg transition-colors">
              Check VIN
            </button>
          </form>
        </div>
      </section>

      {/* WHERE TO LOOK */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">WHERE TO LOOK</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Four reliable places to find your VIN.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {VIN_LOCATIONS.map(loc => (
            <div key={loc.title} className="border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:border-[#c4953a]/30 transition-colors bg-white dark:bg-[#0e1628]">
              <div className="w-9 h-9 bg-[#c4953a]/10 rounded-lg flex items-center justify-center mb-3">
                <loc.icon size={18} className="text-[#c4953a]" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm">{loc.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{loc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIN ANATOMY */}
      <section className="bg-[#faf8f4] dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">VIN ANATOMY</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">What each of the 17 characters means.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {VIN_ANATOMY.map(v => (
              <div key={v.chars} className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-4">
                <span className="inline-block bg-[#c4953a] text-white text-xs font-bold px-2 py-0.5 rounded mb-2">{v.chars}</span>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{v.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Selection */}
      <section id="packages-section" className="max-w-6xl mx-auto px-4 py-16">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">SELECT PACKAGE</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Choose your report package.</h2>
        {submittedVin && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            VIN: <span className="font-mono font-semibold text-slate-800 dark:text-white">{submittedVin}</span>
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map(p => (
            <div
              key={p.id}
              className={`relative border rounded-2xl p-6 cursor-pointer transition-all bg-white dark:bg-[#0e1628] ${
                selectedPkg === p.id
                  ? 'border-[#c4953a] ring-2 ring-[#c4953a]/20 shadow-md'
                  : p.highlight
                  ? 'border-[#c4953a]/40 shadow-md'
                  : 'border-slate-200 dark:border-white/10 hover:border-[#c4953a]/30'
              }`}
              onClick={() => handleSelectPackage(p.id)}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4953a] text-white text-xs font-bold px-3 py-0.5 rounded-full">Most Popular</span>
              )}
              <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1">{p.name}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-0.5">${p.price}</p>
              <p className="text-xs text-slate-400 mb-4">Delivered in {p.delivery}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={14} className="text-[#c4953a] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  selectedPkg === p.id
                    ? 'bg-[#c4953a] text-white'
                    : 'bg-slate-100 dark:bg-white/5 hover:bg-[#c4953a]/10 hover:text-[#c4953a] text-slate-800 dark:text-slate-200 border border-transparent hover:border-[#c4953a]/30'
                }`}
              >
                {selectedPkg === p.id ? 'Selected' : 'Select & Pay'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Checkout section */}
      {(step === 'payment' || step === 'details' || step === 'success') && pkg && (
        <section id="checkout-section" className="max-w-6xl mx-auto px-4 pb-20">
          {step !== 'success' && (
            <div className="flex items-center justify-center gap-0 mb-8 max-w-md mx-auto">
              {STEPS.map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div className={`flex flex-col items-center ${idx > 0 ? 'ml-0' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                      idx < currentStepIdx ? 'bg-[#c4953a] border-[#c4953a] text-white' :
                      idx === currentStepIdx ? 'bg-white dark:bg-[#0e1628] border-[#c4953a] text-[#c4953a]' :
                      'bg-white dark:bg-[#0e1628] border-slate-200 dark:border-white/20 text-slate-400'
                    }`}>
                      {idx < currentStepIdx ? <Check size={13} /> : idx + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block ${idx === currentStepIdx ? 'text-[#c4953a]' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 sm:w-16 mx-1 transition-colors ${idx < currentStepIdx ? 'bg-[#c4953a]' : 'bg-slate-200 dark:bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 'payment' && (
            <MockPaymentForm pkg={pkg} onSuccess={handlePaymentSuccess} />
          )}

          {step === 'details' && (
            <OrderDetailsForm vin={submittedVin} pkg={pkg} onSuccess={handleOrderSuccess} />
          )}

          {step === 'success' && (
            <div className="max-w-md mx-auto border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-2">Order Placed Successfully!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Hi <strong>{customerName}</strong>, we've received your order for the <strong>{pkg.name}</strong> report.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">VIN: <span className="font-mono font-semibold text-slate-800 dark:text-white">{submittedVin}</span></p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
                A confirmation email has been sent to <strong>{customerEmail}</strong>.<br />
                Your report will be delivered in <strong>{pkg.delivery}</strong>.
              </p>
              <div className="mt-6 p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck size={13} className="inline mr-1 text-[#c4953a]" />
                Keep an eye on your inbox — we'll email you the moment your report is ready.
              </div>
            </div>
          )}
        </section>
      )}

      <FaqSection />
    </>
  )
}

export default function VinCheckClient() {
  return (
    <Suspense>
      <VinCheckInner />
    </Suspense>
  )
}
