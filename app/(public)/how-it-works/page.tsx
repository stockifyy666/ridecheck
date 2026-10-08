import FaqSection from '@/components/FaqSection'
import { Shield, BarChart2, Car, AlertCircle } from 'lucide-react'

const DATA_SOURCES = [
  { icon: AlertCircle, title: 'Insurance & claims', desc: 'Total-loss and damage claim records reported by carriers.' },
  { icon: Car, title: 'Auction & salvage', desc: 'Listings and sale records from salvage and wholesale auctions.' },
  { icon: Shield, title: 'Title & registration', desc: 'DMV-sourced brand, ownership and registration events.' },
  { icon: BarChart2, title: 'Manufacturer & safety', desc: 'Recall campaigns, build data and published safety ratings.' },
]

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-[#faf8f4] dark:bg-[#080c18] text-slate-900 dark:text-white py-20 text-center px-4">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">HOW IT WORKS</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Three simple steps to check a vehicle.</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">No phone calls, no waiting on a dealer. A VIN is all we need to start pulling the record.</p>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="space-y-12">
          {[
            { n: '01', title: 'Enter the VIN', desc: 'Type or paste the 17-character VIN from the windshield plate, doorframe label or registration.' },
            { n: '02', title: 'Select your package', desc: 'Choose the report package and delivery option that best suits your needs.' },
            { n: '03', title: 'Receive your report', desc: 'Your completed report will be delivered according to the timeframe shown for your selected package.' },
          ].map(s => (
            <div key={s.n} className="flex gap-8 items-start">
              <span className="text-7xl font-black text-[#c4953a]/20 leading-none">{s.n}</span>
              <div className="pt-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#faf8f4] dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">WHERE THE DATA COMES FROM</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">100+ sources, four record families.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DATA_SOURCES.map(ds => (
              <div key={ds.title} className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5 flex gap-4">
                <div className="w-10 h-10 bg-[#c4953a]/10 rounded-lg flex items-center justify-center shrink-0">
                  <ds.icon size={18} className="text-[#c4953a]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{ds.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{ds.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  )
}
