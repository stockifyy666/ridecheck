'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Order, OrderStatus } from '@/lib/types'
import { Loader2 } from 'lucide-react'
import {
  RiRefreshLine, RiUpload2Line, RiMailSendLine,
  RiCheckboxCircleLine, RiTimeLine, RiLoader4Line,
  RiFileTextLine, RiCloseLine, RiArrowDownSLine,
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const TABS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Orders' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed', label: 'Completed' },
]

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending:    'bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-900/20  dark:text-amber-400  dark:border-amber-800/30',
  processing: 'bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-900/20   dark:text-blue-400   dark:border-blue-800/30',
  completed:  'bg-green-50  text-green-700  border-green-200  dark:bg-green-900/20  dark:text-green-400  dark:border-green-800/30',
}

const STATUS_ICON: Record<OrderStatus, React.ReactNode> = {
  pending:    <RiTimeLine size={12} />,
  processing: <RiLoader4Line size={12} />,
  completed:  <RiCheckboxCircleLine size={12} />,
}

type UploadState = 'idle' | 'uploaded' | 'sent'

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [uploadState, setUploadState] = useState<Record<string, UploadState>>({})
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders/list')
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      setOrders([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown]
        if (ref && !ref.contains(e.target as Node)) setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openDropdown])

  const updateStatus = async (id: string, status: OrderStatus) => {
    setOpenDropdown(null)
    setActionLoading(`status-${id}`)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) toast.success(`Status updated to ${status}`)
    else toast.error('Failed to update status')
    await fetchOrders()
    setActionLoading(null)
  }

  const uploadAndSend = async (order: Order) => {
    const file = selectedFiles[order.id]
    if (!file) return
    setActionLoading(`upload-${order.id}`)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await fetch(`/api/orders/${order.id}/upload-report`, { method: 'POST', body: formData })
      if (!uploadRes.ok) { const err = await uploadRes.json(); throw new Error(err.error || 'Upload failed') }
      setUploadState(prev => ({ ...prev, [order.id]: 'uploaded' }))
      const sendRes = await fetch(`/api/orders/${order.id}/send-report`, { method: 'POST' })
      if (!sendRes.ok) { const err = await sendRes.json(); throw new Error(err.error || 'Email send failed') }
      setUploadState(prev => ({ ...prev, [order.id]: 'sent' }))
      toast.success('Report uploaded and sent successfully!')
      setSelectedFiles(prev => { const n = { ...prev }; delete n[order.id]; return n })
      await fetchOrders()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setUploadState(prev => ({ ...prev, [order.id]: 'idle' }))
    }
    setActionLoading(null)
  }

  const sendExistingReport = async (id: string) => {
    setActionLoading(`send-${id}`)
    const res = await fetch(`/api/orders/${id}/send-report`, { method: 'POST' })
    if (!res.ok) { const data = await res.json(); toast.error(data.error || 'Failed to send report') }
    else { setUploadState(prev => ({ ...prev, [id]: 'sent' })); toast.success('Report sent!'); await fetchOrders() }
    setActionLoading(null)
  }

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab)
  const counts: Record<string, number> = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage vehicle history report orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 px-3 py-2 rounded-lg hover:border-slate-300 dark:hover:border-white/20 transition-colors"
        >
          <RiRefreshLine size={15} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl mb-5 w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              tab === key
                ? 'bg-white dark:bg-[#0e1628] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              tab === key
                ? 'bg-[#c4953a]/15 text-[#c4953a]'
                : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
            }`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 size={24} className="animate-spin text-slate-300 dark:text-slate-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <RiFileTextLine size={36} className="mb-3 opacity-30" />
            <p className="text-sm">No {tab === 'all' ? '' : tab} orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                  {['Customer','VIN','Package','Price','Status','Date','Report'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{order.full_name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{order.email}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{order.phone}</p>
                    </td>

                    {/* VIN */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 px-2 py-1 rounded font-bold tracking-wide">
                        {order.vin}
                      </span>
                    </td>

                    {/* Package */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{order.package_name}</span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">${order.package_price}</span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-5 py-4">
                      <div className="relative" ref={el => { dropdownRefs.current[order.id] = el }}>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                          disabled={actionLoading === `status-${order.id}`}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border capitalize transition-all hover:opacity-80 disabled:opacity-50 ${STATUS_STYLE[order.status]}`}
                        >
                          {actionLoading === `status-${order.id}` ? <Loader2 size={11} className="animate-spin" /> : STATUS_ICON[order.status]}
                          {order.status}
                          <RiArrowDownSLine size={13} className={`transition-transform ${openDropdown === order.id ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdown === order.id && (
                          <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#080c18] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                            {(['pending', 'processing', 'completed'] as OrderStatus[]).map(s => (
                              <button
                                key={s}
                                onClick={() => updateStatus(order.id, s)}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium capitalize hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                                  order.status === s ? 'text-[#c4953a] bg-[#c4953a]/5' : 'text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {STATUS_ICON[s]}
                                {s}
                                {order.status === s && <RiCheckboxCircleLine size={12} className="ml-auto text-[#c4953a]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="text-xs text-slate-700 dark:text-slate-300">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>

                    {/* Report */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(uploadState[order.id] === 'uploaded' || uploadState[order.id] === 'sent' || order.report_url) && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30 px-2 py-0.5 rounded-full font-semibold">
                              <RiUpload2Line size={10} /> Uploaded
                            </span>
                          )}
                          {uploadState[order.id] === 'sent' && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 px-2 py-0.5 rounded-full font-semibold">
                              <RiMailSendLine size={10} /> Email Sent
                            </span>
                          )}
                        </div>

                        <input
                          ref={el => { fileInputRefs.current[order.id] = el }}
                          type="file"
                          accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt"
                          className="hidden"
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setSelectedFiles(prev => ({ ...prev, [order.id]: file }))
                              setUploadState(prev => ({ ...prev, [order.id]: 'idle' }))
                            }
                          }}
                        />

                        {selectedFiles[order.id] && (
                          <div className="flex items-center gap-1.5 bg-[#c4953a]/5 border border-[#c4953a]/20 rounded-lg px-2 py-1.5 max-w-[160px]">
                            <RiFileTextLine size={12} className="text-[#c4953a] shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{selectedFiles[order.id].name}</span>
                            <button
                              onClick={() => setSelectedFiles(prev => { const n = { ...prev }; delete n[order.id]; return n })}
                              className="text-slate-400 hover:text-red-500 shrink-0"
                            >
                              <RiCloseLine size={12} />
                            </button>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                          {order.report_url && !selectedFiles[order.id] ? (
                            <>
                              <button
                                onClick={() => sendExistingReport(order.id)}
                                disabled={actionLoading === `send-${order.id}`}
                                className="inline-flex items-center gap-1 text-xs bg-[#c4953a] hover:bg-[#b8872e] text-white px-2.5 py-1.5 rounded-lg font-semibold disabled:opacity-60 transition-colors"
                              >
                                {actionLoading === `send-${order.id}` ? <Loader2 size={11} className="animate-spin" /> : <RiMailSendLine size={11} />}
                                Resend Email
                              </button>
                              <button
                                onClick={() => fileInputRefs.current[order.id]?.click()}
                                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline py-1.5"
                              >
                                Replace
                              </button>
                            </>
                          ) : selectedFiles[order.id] ? (
                            <button
                              onClick={() => uploadAndSend(order)}
                              disabled={actionLoading === `upload-${order.id}`}
                              className="inline-flex items-center gap-1 text-xs bg-[#c4953a] hover:bg-[#b8872e] text-white px-2.5 py-1.5 rounded-lg font-semibold disabled:opacity-60 transition-colors"
                            >
                              {actionLoading === `upload-${order.id}` ? <Loader2 size={11} className="animate-spin" /> : <RiMailSendLine size={11} />}
                              Upload & Send
                            </button>
                          ) : (
                            <button
                              onClick={() => fileInputRefs.current[order.id]?.click()}
                              className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                            >
                              <RiUpload2Line size={11} /> Upload File
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
