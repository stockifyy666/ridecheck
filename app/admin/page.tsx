import { createClient } from '@supabase/supabase-js'
import { RiFileListLine, RiTimeLine, RiLoader4Line, RiCheckLine } from 'react-icons/ri'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from('orders').select('status, created_at, package_price, full_name')
    if (!data) return null

    const total = data.length
    const pending = data.filter(o => o.status === 'pending').length
    const processing = data.filter(o => o.status === 'processing').length
    const completed = data.filter(o => o.status === 'completed').length
    const revenue = data.reduce((sum, o) => sum + (Number(o.package_price) || 0), 0)
    const recent = data
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    return { total, pending, processing, completed, revenue, recent }
  } catch {
    return null
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const cards = [
    {
      label: 'Total Orders', value: stats?.total ?? '—', icon: RiFileListLine,
      light: 'bg-blue-50 text-blue-600 border-blue-100',
      dark: 'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
    },
    {
      label: 'Pending', value: stats?.pending ?? '—', icon: RiTimeLine,
      light: 'bg-amber-50 text-amber-600 border-amber-100',
      dark: 'dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    },
    {
      label: 'Processing', value: stats?.processing ?? '—', icon: RiLoader4Line,
      light: 'bg-purple-50 text-purple-600 border-purple-100',
      dark: 'dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30',
    },
    {
      label: 'Completed', value: stats?.completed ?? '—', icon: RiCheckLine,
      light: 'bg-green-50 text-green-600 border-green-100',
      dark: 'dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Overview of your RideChecks platform</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, light, dark }) => (
          <div key={label} className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border mb-3 ${light} ${dark}`}>
              <Icon size={17} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue + Recent */}
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-[#c4953a]">${stats?.revenue?.toFixed(2) ?? '0.00'}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All orders combined</p>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-[#c4953a] hover:underline">View all →</Link>
          </div>
          {stats?.recent?.length ? (
            <div className="space-y-2.5">
              {stats.recent.map((o: Record<string, unknown>, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{String(o.full_name ?? '—')}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(String(o.created_at)).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                    o.status === 'completed'
                      ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : o.status === 'processing'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>{String(o.status)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
