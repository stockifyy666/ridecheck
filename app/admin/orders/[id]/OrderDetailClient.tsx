'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderStatus } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import {
  RiArrowLeftLine, RiMailSendLine, RiUpload2Line, RiCheckboxCircleLine,
  RiTimeLine, RiLoader4Line, RiArrowDownSLine, RiFileTextLine,
  RiCloseLine, RiStickyNoteLine, RiSaveLine, RiExternalLinkLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending:    'bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-900/20  dark:text-amber-400  dark:border-amber-800/30',
  processing: 'bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-900/20   dark:text-blue-400   dark:border-blue-800/30',
  completed:  'bg-green-50  text-green-700  border-green-200  dark:bg-green-900/20  dark:text-green-400  dark:border-green-800/30',
}
const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  pending:    <RiTimeLine size={13} />,
  processing: <RiLoader4Line size={13} />,
  completed:  <RiCheckboxCircleLine size={13} />,
}

export default function OrderDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const fetchOrder = async () => {
    setLoading(true)
    const res = await fetch(`/api/orders/${id}`)
    if (res.ok) {
      const data = await res.json()
      setOrder(data)
      setNotes(data.notes || '')
    }
    setLoading(false)
  }

  useEffect(() => { fetchOrder() }, [id])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const updateStatus = async (status: OrderStatus) => {
    setOpenDropdown(false)
    setActionLoading('status')
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { toast.success(`Status updated to ${status}`); await fetchOrder() }
    else toast.error('Failed to update status')
    setActionLoading(null)
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    if (res.ok) toast.success('Notes saved')
    else toast.error('Failed to save notes')
    setSavingNotes(false)
  }

  const uploadAndSend = async () => {
    if (!selectedFile) return
    setActionLoading('upload')
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const uploadRes = await fetch(`/api/orders/${id}/upload-report`, { method: 'POST', body: formData })
      if (!uploadRes.ok) { const e = await uploadRes.json(); throw new Error(e.error) }
      const sendRes = await fetch(`/api/orders/${id}/send-report`, { method: 'POST' })
      if (!sendRes.ok) { const e = await sendRes.json(); throw new Error(e.error) }
      toast.success('Report uploaded and sent!')
      setSelectedFile(null)
      await fetchOrder()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
    setActionLoading(null)
  }

  const sendExisting = async () => {
    setActionLoading('send')
    const res = await fetch(`/api/orders/${id}/send-report`, { method: 'POST' })
    if (res.ok) { toast.success('Report sent!'); await fetchOrder() }
    else { const d = await res.json(); toast.error(d.error || 'Failed to send') }
    setActionLoading(null)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={28} className="animate-spin text-slate-400" />
    </div>
  )

  if (!order) return (
    <div className="p-6 text-center text-slate-400">Order not found.</div>
  )

  return (
    <div className="p-6 max-w-5xl">
      {/* Back */}
      <button
        onClick={() => router.push('/admin/orders')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <RiArrowLeftLine size={16} /> Back to Orders
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{order.full_name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{order.email} · {order.phone}</p>
        </div>
        {/* Status dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            disabled={actionLoading === 'status'}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border capitalize transition-all hover:opacity-80 ${STATUS_STYLE[order.status]}`}
          >
            {actionLoading === 'status' ? <Loader2 size={13} className="animate-spin" /> : STATUS_ICON[order.status]}
            {order.status}
            <RiArrowDownSLine size={15} className={`transition-transform ${openDropdown ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown && (
            <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-[#080c18] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              {(['pending', 'processing', 'completed'] as OrderStatus[]).map(s => (
                <button key={s} onClick={() => updateStatus(s)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium capitalize hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${order.status === s ? 'text-[#c4953a]' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {STATUS_ICON[s]} {s}
                  {order.status === s && <RiCheckboxCircleLine size={13} className="ml-auto text-[#c4953a]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left col — order info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order details card */}
          <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Order Details</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                { label: 'VIN', value: <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded font-bold tracking-wide text-slate-800 dark:text-slate-200">{order.vin}</span> },
                { label: 'Package', value: order.package_name },
                { label: 'Price', value: <span className="font-bold text-slate-900 dark:text-white">${order.package_price}</span> },
                { label: 'Order ID', value: <span className="font-mono text-xs text-slate-400">{order.id}</span> },
                { label: 'Placed', value: new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) },
                { label: 'Last Updated', value: new Date(order.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</dt>
                  <dd className="text-sm text-slate-700 dark:text-slate-300">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Report / Email card */}
          <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Report & Email</h2>

            {/* Email log */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 dark:bg-white/5 rounded-lg">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Emails sent</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{order.email_sent_count || 0}</p>
              </div>
              {order.email_sent_at && (
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Last sent</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Date(order.email_sent_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              )}
              {order.report_url && (
                <a href={order.report_url} target="_blank" rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 text-xs text-[#c4953a] hover:underline font-medium"
                >
                  <RiExternalLinkLine size={13} /> View report
                </a>
              )}
            </div>

            {/* Upload & send */}
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt" className="hidden"
              onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]) }} />

            {selectedFile && (
              <div className="flex items-center gap-2 mb-3 bg-[#c4953a]/5 border border-[#c4953a]/20 rounded-lg px-3 py-2">
                <RiFileTextLine size={14} className="text-[#c4953a] shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{selectedFile.name}</span>
                <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-red-500"><RiCloseLine size={14} /></button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {order.report_url && !selectedFile ? (
                <>
                  <button onClick={sendExisting} disabled={actionLoading === 'send'}
                    className="inline-flex items-center gap-1.5 text-sm bg-[#c4953a] hover:bg-[#b8872e] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 transition-colors"
                  >
                    {actionLoading === 'send' ? <Loader2 size={13} className="animate-spin" /> : <RiMailSendLine size={13} />}
                    Resend Report Email
                  </button>
                  <button onClick={() => fileRef.current?.click()}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg transition-colors"
                  >
                    Replace File
                  </button>
                </>
              ) : selectedFile ? (
                <button onClick={uploadAndSend} disabled={actionLoading === 'upload'}
                  className="inline-flex items-center gap-1.5 text-sm bg-[#c4953a] hover:bg-[#b8872e] text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60 transition-colors"
                >
                  {actionLoading === 'upload' ? <Loader2 size={13} className="animate-spin" /> : <RiMailSendLine size={13} />}
                  Upload & Send Email
                </button>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 px-4 py-2 rounded-lg transition-colors"
                >
                  <RiUpload2Line size={13} /> Upload Report File
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right col — notes */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <RiStickyNoteLine size={15} className="text-[#c4953a]" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Internal Notes</h2>
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add a note about this order (e.g. customer called, special request...)"
              rows={8}
              className="w-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-[#c4953a] resize-none transition-colors"
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 px-4 py-2 rounded-lg font-semibold disabled:opacity-60 transition-colors"
            >
              {savingNotes ? <Loader2 size={13} className="animate-spin" /> : <RiSaveLine size={13} />}
              Save Notes
            </button>
          </div>

          {/* Quick info */}
          <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Customer</h2>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Email</p>
                <a href={`mailto:${order.email}`} className="text-sm text-[#c4953a] hover:underline">{order.email}</a>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Phone</p>
                <a href={`tel:${order.phone}`} className="text-sm text-slate-700 dark:text-slate-300 hover:text-[#c4953a]">{order.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
