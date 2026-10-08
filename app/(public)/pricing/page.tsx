import Link from 'next/link'
import { Check, Shield, Clock, Star } from 'lucide-react'
import { PACKAGES } from '@/lib/types'
import FaqSection from '@/components/FaqSection'

const REPORT_CONTENTS = [
  'VIN lookups', 'Odometer rollback alert', '70+ data points', 'Insurance total loss',
  'Real ownership history', 'VIN specs & key features', 'Junk / salvage / rebuilt title',
  'NMVTIS title brands history', 'Auction sales history', 'Real car photos',
  'Lien & impound information', 'Theft records',
]

const TRUST_BADGES = [
  { icon: Star, text: 'Thousands of happy customers' },
  { icon: Shield, text: 'Money back guarantee' },
  { icon: Check, text: 'Safe checkout guaranteed' },
  { icon: Clock, text: 'Fast report delivery' },
]

export default function PricingPage() {
  return (
    <>
      <section className="bg-[#faf8f4] dark:bg-[#080c18] text-slate-900 dark:text-white py-20 text-center px-4">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">PRICING</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Choose the report that fits your needs.</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Compare our report options, features, and delivery times to find the right option for your vehicle check.</p>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`relative border rounded-2xl p-7 transition-shadow bg-white dark:bg-[#0e1628] ${pkg.highlight ? 'border-[#c4953a] shadow-xl shadow-[#c4953a]/10' : 'border-slate-200 dark:border-white/10 hover:border-[#c4953a]/30 dark:hover:border-[#c4953a]/40'}`}
            >
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4953a] text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</span>
              )}
              <p className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-1">{pkg.name}</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-0.5">${pkg.price}</p>
              <p className="text-xs text-slate-400 mb-1">per report</p>
              <p className="text-xs text-[#c4953a] font-semibold mb-5">Delivered in {pkg.delivery}</p>
              <ul className="space-y-2.5 mb-7">
                {pkg.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check size={14} className="text-[#c4953a] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/vin-check"
                className={`block text-center py-3 rounded-xl text-sm font-bold transition-colors ${
                  pkg.highlight ? 'bg-[#c4953a] hover:bg-[#b8872e] text-white' : 'bg-slate-100 dark:bg-white/5 hover:bg-[#c4953a]/10 hover:text-[#c4953a] text-slate-800 dark:text-slate-200 dark:hover:bg-[#c4953a]/10'
                }`}
              >
                Get a full report
              </Link>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {TRUST_BADGES.map(b => (
            <div key={b.text} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <b.icon size={16} className="text-[#c4953a]" />
              {b.text}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#faf8f4] dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">REPORT CONTENTS</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Maximum information in each report.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {REPORT_CONTENTS.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Check size={14} className="text-[#c4953a] shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  )
}
