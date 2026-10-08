import Link from 'next/link'
import Image from 'next/image'
import { Shield, FileSearch, Gauge, AlertTriangle, Lock, Cpu, ArrowRight, Check } from 'lucide-react'
import FaqSection from '@/components/FaqSection'
import VinSearchBar from '@/components/VinSearchBar'

const STATS = [
  { value: '4.8/5', label: 'Customer rating' },
  { value: '1M+', label: 'VIN checks run' },
  { value: '500M+', label: 'Vehicle records' },
  { value: '100+', label: 'Data sources' },
]

const FEATURES = [
  { icon: AlertTriangle, title: 'Accident history', desc: 'Reported collisions, structural damage and airbag deployment, with dates and severity where available.' },
  { icon: FileSearch, title: 'Title & ownership', desc: 'Title brands such as salvage, flood or rebuilt, plus how many owners the vehicle has had and in which states.' },
  { icon: Gauge, title: 'Mileage history', desc: 'Odometer readings over time so you can spot rollbacks, gaps and readings that don\'t add up.' },
  { icon: Lock, title: 'Theft records', desc: 'Cross-checked against active theft and recovery databases before you hand over any money.' },
  { icon: Cpu, title: 'Vehicle specifications', desc: 'Decoded engine, drivetrain, trim, factory options and original equipment straight from the VIN.' },
  { icon: Shield, title: 'Recall & safety info', desc: 'Open manufacturer recalls, safety ratings and documented service events tied to the vehicle.' },
]

const TESTIMONIALS = [
  { quote: 'The report showed an odometer gap the seller never mentioned. I walked away and found a cleaner car two days later.', name: 'Michael R.', role: 'Private buyer · Ohio' },
  { quote: 'I run a small independent lot. Checking every trade-in before I price it has saved me from two rebuilt titles this year.', name: 'Elena Duarte', role: 'Dealer · Texas' },
  { quote: 'Clear layout, no upsell noise. I understood the accident record and what it meant for value in about a minute.', name: 'Priya Raman', role: 'First-time buyer · Ontario' },
]

const REPORT_ITEMS = [
  'Avoid hidden damage',
  'Identify suspicious mileage',
  'Check title and theft records',
  'Make confident buying decisions',
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#faf8f4] dark:bg-[#080c18] text-slate-900 dark:text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 dark:opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #c4953a 0%, transparent 60%), radial-gradient(circle at 80% 20%, #c4953a 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-2 bg-[#c4953a]/10 border border-[#c4953a]/30 text-[#c4953a] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-[#c4953a] rounded-full" />
              100+ trusted data sources
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Know the history<br />
              <span className="text-[#c4953a]">before you buy</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-md mb-8 leading-relaxed">
              Check any vehicle by VIN and uncover important vehicle history, specifications, and potential red flags before you buy.
            </p>
            <VinSearchBar dark />
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-600">
              <Link href="/vin-check" className="underline hover:text-[#c4953a] transition-colors">Where can I find my VIN?</Link>
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-[#c4953a]/15 rounded-3xl blur-3xl scale-90" />
              <div className="relative rounded-2xl overflow-hidden border border-[#c4953a]/20 aspect-[4/3]">
                <Image
                  src="/hero-car.jpg"
                  alt="Luxury vehicle — RideChecks vehicle history reports"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c18]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#080c18]/80 border border-[#c4953a]/40 text-[#c4953a] text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 bg-[#c4953a] rounded-full" />
                    100+ trusted data sources
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0e1628]">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Trusted by drivers, buyers & automotive professionals
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">WHAT YOU GET</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10">Everything you need to know before buying a car.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="border border-slate-200 dark:border-white/10 rounded-xl p-5 hover:border-[#c4953a]/30 hover:shadow-sm dark:hover:border-[#c4953a]/40 transition-all group bg-white dark:bg-[#0e1628]">
              <div className="w-9 h-9 bg-[#c4953a]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#c4953a]/20 transition-colors">
                <f.icon size={18} className="text-[#c4953a]" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#faf8f4] dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">HOW IT WORKS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10">Three simple steps to check a vehicle.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Enter the VIN', desc: 'Type or paste the 17-character VIN from the windshield plate, doorframe label or registration.' },
              { n: '02', title: 'Select your package', desc: 'Choose the report package and delivery option that best suits your needs.' },
              { n: '03', title: 'Receive your report', desc: 'Your completed report will be delivered to your email once it\'s ready.' },
            ].map(step => (
              <div key={step.n} className="flex gap-4">
                <span className="text-4xl font-black text-[#c4953a]/20">{step.n}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">WHAT YOUR REPORT CAN COVER</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Get the information you need before you buy.</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-lg">A vehicle history report can help you understand a vehicle's recorded history, specifications, and potential risks before making a purchase.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            {REPORT_ITEMS.map(item => (
              <div key={item} className="flex items-center gap-3 mb-3">
                <span className="w-5 h-5 bg-[#c4953a] rounded-full flex items-center justify-center shrink-0">
                  <Check size={11} color="white" strokeWidth={3} />
                </span>
                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</span>
              </div>
            ))}
            <Link href="/vin-check" className="mt-6 inline-flex items-center gap-2 bg-[#c4953a] hover:bg-[#b8872e] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              Check a VIN <ArrowRight size={15} />
            </Link>
          </div>

          <div className="border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm bg-white dark:bg-[#0e1628]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Vehicle History Report</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Generated 21 Aug 2026</p>
            </div>
            <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3">
              <Image src="/report-car.jpg" alt="2021 Honda CR-V" fill className="object-cover" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">2021 Honda CR-V EX-L AWD</h3>
            <p className="text-xs text-slate-400 font-mono mb-3">2HKRW2H8XMH512094</p>
            <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> No critical issues found
            </span>
            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {[
                ['Accidents reported', '1 minor (2022)', 'text-amber-600 dark:text-amber-400'],
                ['Last odometer reading', '84,120 mi — consistent', 'text-green-600 dark:text-green-400'],
                ['Title status', 'Clean · No brands', 'text-green-600 dark:text-green-400'],
                ['Theft records', 'No active theft record', 'text-green-600 dark:text-green-400'],
                ['Service history', '14 documented events', 'text-slate-800 dark:text-slate-200'],
                ['Previous owners', '2 (personal use)', 'text-slate-800 dark:text-slate-200'],
              ].map(([k, v, cls]) => (
                <div key={k} className="flex justify-between py-2.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{k}</span>
                  <span className={`text-xs font-semibold ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats dark — stays dark in both modes (brand section) */}
      <section className="bg-[#080c18] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #c4953a 0%, transparent 60%)' }} />
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Powerful vehicle data.</h2>
          <p className="text-slate-400 mb-10">One simple VIN check.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ['50M+', 'Vehicle records'],
              ['100+', 'Data sources'],
              ['17', 'VIN characters decoded'],
              ['24/7', 'Access to reports'],
            ].map(([v, l]) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-2xl font-bold text-[#c4953a]">{v}</p>
                <p className="text-sm text-slate-400 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before You Buy */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
            <Image src="/inspect.jpg" alt="Buyer inspecting a vehicle before purchase" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c18]/40 to-transparent" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2">BEFORE YOU BUY</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">A few minutes of research can save you thousands.</h2>
            <div className="space-y-3 mb-6">
              {['Avoid hidden damage', 'Identify suspicious mileage', 'Check title and theft records', 'Make confident buying decisions'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-[#c4953a] rounded-full flex items-center justify-center shrink-0">
                    <Check size={11} color="white" strokeWidth={3} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/vin-check" className="inline-flex items-center gap-2 bg-[#c4953a] hover:bg-[#b8872e] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">
              Check a VIN <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <p className="text-xs font-bold tracking-widest text-[#c4953a] uppercase mb-2 text-center">REVIEWS</p>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Drivers check VINs before they buy.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="border border-slate-200 dark:border-white/10 rounded-xl p-6 hover:border-[#c4953a]/30 dark:hover:border-[#c4953a]/40 transition-colors bg-white dark:bg-[#0e1628]">
              <div className="flex gap-0.5 mb-3">
                {Array(5).fill(0).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#c4953a"><path d="M7 1l1.55 3.14L12 4.63l-2.5 2.43.59 3.44L7 8.77l-3.09 1.73.59-3.44L2 4.63l3.45-.49z"/></svg>
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqSection />
    </>
  )
}
