'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderStatus } from '@/lib/types'
import { Loader2, RefreshCw, Send, Upload, CheckCircle, Clock, Zap, FileText, X } from 'lucide-react'
import { RiLogoutBoxLine } from 'react-icons/ri'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
}

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock size={12} />,
  processing: <Zap size={12} />,
  completed: <CheckCircle size={12} />,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

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

  const updateStatus = async (id: string, status: OrderStatus) => {
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

  const handleFileSelect = (id: string, file: File) => {
    setSelectedFiles(prev => ({ ...prev, [id]: file }))
    setUploadProgress(prev => ({ ...prev, [id]: '' }))
  }

  const uploadAndSend = async (order: Order) => {
    const file = selectedFiles[order.id]
    if (!file) return

    setActionLoading(`upload-${order.id}`)
    setUploadProgress(prev => ({ ...prev, [order.id]: 'Uploading file...' }))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch(`/api/orders/${order.id}/upload-report`, {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'Upload failed')
      }

      setUploadProgress(prev => ({ ...prev, [order.id]: 'Sending email...' }))

      const sendRes = await fetch(`/api/orders/${order.id}/send-report`, { method: 'POST' })
      if (!sendRes.ok) {
        const err = await sendRes.json()
        throw new Error(err.error || 'Email send failed')
      }

      setUploadProgress(prev => ({ ...prev, [order.id]: 'Done!' }))
      toast.success('Report uploaded and sent successfully!')
      setSelectedFiles(prev => { const n = { ...prev }; delete n[order.id]; return n })
      await fetchOrders()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(msg)
      setUploadProgress(prev => ({ ...prev, [order.id]: '' }))
    }

    setActionLoading(null)
  }

  const sendExistingReport = async (id: string) => {
    setActionLoading(`send-${id}`)
    const res = await fetch(`/api/orders/${id}/send-report`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Failed to send report')
    } else {
      toast.success('Report sent successfully!')
      await fetchOrders()
    }
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navbar */}
      <div className="bg-[#080c18] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#c4953a"/>
            <path d="M6 16 Q9 10 16 10 Q23 10 26 16 Q23 22 16 22 Q9 22 6 16Z" fill="none" stroke="white" strokeWidth="1.5"/>
            <circle cx="16" cy="16" r="3.5" fill="white"/>
            <path d="M10 13 L22 13" stroke="white" strokeWidth="1" opacity="0.5"/>
            <path d="M8 19 L24 19" stroke="white" strokeWidth="1" opacity="0.5"/>
          </svg>
          <span className="font-bold text-white text-lg">Ride<span className="text-[#c4953a]">Checks</span></span>
          <span className="ml-2 text-xs bg-white/10 text-slate-400 px-2 py-0.5 rounded font-medium">Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchOrders} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg">
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={async () => {
              await fetch('/api/admin/logout', { method: 'POST' })
              toast.success('Logged out')
              router.push('/admin/login')
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
          >
            <RiLogoutBoxLine size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['all', 'pending', 'processing', 'completed'] as const).map(s => (
            <div key={s} className={`rounded-xl p-4 border cursor-pointer transition-all ${filter === s ? 'border-[#c4953a] bg-[#c4953a]/5' : 'border-slate-200 bg-white hover:border-[#c4953a]/30'}`} onClick={() => setFilter(s)}>
              <p className="text-2xl font-bold text-slate-900">{counts[s]}</p>
              <p className="text-xs text-slate-500 capitalize mt-0.5">{s === 'all' ? 'Total orders' : `${s} orders`}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900">Orders</h1>
          <span className="text-xs text-slate-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400 text-sm bg-white border border-slate-200 rounded-2xl">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            No orders found.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-[#c4953a]/20 transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900">{order.full_name}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[order.status]}`}>
                        {STATUS_ICONS[order.status]} {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{order.email} · {order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-lg">${order.package_price}</p>
                    <p className="text-xs text-slate-400">{order.package_name}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mb-4 p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">VIN</p>
                    <p className="font-mono text-sm font-bold text-slate-800">{order.vin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Order ID</p>
                    <p className="text-xs text-slate-500 font-mono">{order.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Placed</p>
                    <p className="text-xs text-slate-600">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Status changer */}
                <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-100">
                  <span className="text-xs text-slate-500 self-center mr-1 font-medium">Change status:</span>
                  {(['pending', 'processing', 'completed'] as OrderStatus[]).map(s => (
                    <button
                      key={s}
                      disabled={order.status === s || actionLoading === `status-${order.id}`}
                      onClick={() => updateStatus(order.id, s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors border disabled:opacity-40 ${
                        order.status === s ? STATUS_COLORS[s] + ' cursor-default' : 'bg-white border-slate-200 text-slate-600 hover:border-[#c4953a]/40 hover:text-[#c4953a]'
                      }`}
                    >
                      {actionLoading === `status-${order.id}` ? <Loader2 size={12} className="animate-spin" /> : s}
                    </button>
                  ))}
                </div>

                {/* Report send section */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-3">Send Report to Client</p>

                  {order.report_url && !selectedFiles[order.id] ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={12} /> Report file ready
                      </span>
                      <a href={order.report_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#c4953a] underline truncate max-w-xs">
                        View report
                      </a>
                      <button
                        onClick={() => sendExistingReport(order.id)}
                        disabled={actionLoading === `send-${order.id}`}
                        className="flex items-center gap-1.5 bg-[#c4953a] hover:bg-[#b8872e] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                      >
                        {actionLoading === `send-${order.id}` ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        Send Report Email
                      </button>
                      <button
                        onClick={() => fileInputRefs.current[order.id]?.click()}
                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                      >
                        Replace file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedFiles[order.id] ? (
                        <div className="flex items-center gap-3 p-3 bg-[#c4953a]/5 border border-[#c4953a]/20 rounded-lg">
                          <FileText size={16} className="text-[#c4953a] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">{selectedFiles[order.id].name}</p>
                            <p className="text-xs text-slate-400">{(selectedFiles[order.id].size / 1024).toFixed(0)} KB</p>
                          </div>
                          {uploadProgress[order.id] && (
                            <span className="text-xs text-[#c4953a] font-medium">{uploadProgress[order.id]}</span>
                          )}
                          <button onClick={() => setSelectedFiles(prev => { const n = { ...prev }; delete n[order.id]; return n })} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRefs.current[order.id]?.click()}
                          className="border-2 border-dashed border-slate-200 hover:border-[#c4953a]/40 rounded-xl p-5 text-center cursor-pointer transition-colors group"
                        >
                          <Upload size={20} className="mx-auto mb-2 text-slate-300 group-hover:text-[#c4953a] transition-colors" />
                          <p className="text-xs font-semibold text-slate-500 group-hover:text-[#c4953a] transition-colors">Click to choose report file</p>
                          <p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, or any file up to 10MB</p>
                        </div>
                      )}

                      <input
                        ref={el => { fileInputRefs.current[order.id] = el }}
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt"
                        className="hidden"
                        onChange={e => e.target.files?.[0] && handleFileSelect(order.id, e.target.files[0])}
                      />

                      {selectedFiles[order.id] && (
                        <button
                          onClick={() => uploadAndSend(order)}
                          disabled={actionLoading === `upload-${order.id}`}
                          className="flex items-center gap-1.5 bg-[#c4953a] hover:bg-[#b8872e] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
                        >
                          {actionLoading === `upload-${order.id}` ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                          Upload & Send Report Email
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
