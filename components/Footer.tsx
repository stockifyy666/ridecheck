import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#080c18] text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="42" cy="42" r="34" fill="white" stroke="#c4953a" strokeWidth="5"/>
              <path d="M24 42 L37 55 L60 26" stroke="#c4953a" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="68" y1="68" x2="90" y2="90" stroke="#1a2540" strokeWidth="12" strokeLinecap="round"/>
              <line x1="68" y1="68" x2="90" y2="90" stroke="#c4953a" strokeWidth="6" strokeLinecap="round"/>
            </svg>
            <span className="font-black text-xl tracking-tight">
              <span className="text-white">Ride</span><span className="text-[#c4953a]">Checks</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-slate-400">
            Professional vehicle history reporting platform. Get transparent insights and make informed decisions with our comprehensive VIN lookup service.
          </p>
          <p className="text-xs mt-4 text-slate-500">support@ridechecks.com</p>
        </div>

        <div>
          <p className="text-white font-semibold text-sm mb-4">Quick Links</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-[#c4953a] transition-colors">Home</Link></li>
            <li><Link href="/vin-check" className="hover:text-[#c4953a] transition-colors">VIN Check</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[#c4953a] transition-colors">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-[#c4953a] transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white font-semibold text-sm mb-4">Policies</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/privacy" className="hover:text-[#c4953a] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund" className="hover:text-[#c4953a] transition-colors">Refund Policy</Link></li>
            <li><Link href="/faq" className="hover:text-[#c4953a] transition-colors">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-[#c4953a] transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} RideChecks. All rights reserved.
      </div>
    </footer>
  )
}
