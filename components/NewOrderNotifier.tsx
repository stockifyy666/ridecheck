'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import { RiFileListLine } from 'react-icons/ri'

export default function NewOrderNotifier({ onNewOrder }: { onNewOrder?: () => void }) {
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    const channel = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          // Ignore events fired on initial subscription (within first 2s)
          if (Date.now() - mountedAt.current < 2000) return

          const order = payload.new as { full_name?: string; package_name?: string }
          const name = order.full_name ?? 'Someone'
          const pkg = order.package_name ?? 'a package'

          // Notification sound
          try {
            const ctx = new AudioContext()
            const gain = ctx.createGain()
            gain.gain.setValueAtTime(0.4, ctx.currentTime)
            gain.connect(ctx.destination)

            // Two-tone chime
            const freqs = [880, 1100]
            freqs.forEach((freq, i) => {
              const osc = ctx.createOscillator()
              osc.type = 'sine'
              osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18)
              osc.connect(gain)
              osc.start(ctx.currentTime + i * 0.18)
              osc.stop(ctx.currentTime + i * 0.18 + 0.22)
            })
          } catch {
            // AudioContext blocked — user hasn't interacted with page yet
          }

          // In-app toast
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-start gap-3 bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 shadow-xl rounded-xl px-4 py-3 max-w-xs`}>
              <div className="w-8 h-8 rounded-lg bg-[#c4953a]/10 border border-[#c4953a]/20 flex items-center justify-center shrink-0 mt-0.5">
                <RiFileListLine size={15} className="text-[#c4953a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">New Order!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {name} ordered <span className="font-medium">{pkg}</span>
                </p>
              </div>
            </div>
          ), { duration: 6000 })

          // Browser notification (when tab is not focused)
          if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
            new Notification('New RideChecks Order', {
              body: `${name} just ordered ${pkg}`,
              icon: '/favicon.ico',
            })
          }

          onNewOrder?.()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [onNewOrder])

  return null
}
