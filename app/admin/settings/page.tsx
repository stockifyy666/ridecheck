'use client'
import { useState, useRef } from 'react'
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine, RiCheckLine } from 'react-icons/ri'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function PasswordInput({
  label, value, onChange, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [show, setShow] = useState(false)
  const [readOnly, setReadOnly] = useState(true)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <RiLockPasswordLine size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          value={value}
          readOnly={readOnly}
          onFocus={() => setReadOnly(false)}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none focus:border-[#c4953a] transition-colors"
        />
        <button
          type="button"
          onClick={() => { setShow(p => !p); ref.current?.focus() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          {show ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
        </button>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!current) { toast.error('Enter your current password'); return }
    if (next.length < 8) { toast.error('New password must be at least 8 characters'); return }
    if (next !== confirm) { toast.error('New passwords do not match'); return }
    setLoading(true)
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    })
    const data = await res.json()
    if (res.ok) {
      toast.success('Password updated successfully')
      setCurrent(''); setNext(''); setConfirm('')
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } else {
      toast.error(data.error || 'Failed to update password')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage your admin panel configuration</p>
      </div>

      <div className="bg-white dark:bg-[#0e1628] border border-slate-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#c4953a]/10 border border-[#c4953a]/20 flex items-center justify-center">
            <RiLockPasswordLine size={15} className="text-[#c4953a]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Change Password</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Update your admin login password</p>
          </div>
        </div>

        {/* Hidden dummy inputs — trick browser autofill away from real fields */}
        <input type="text" className="hidden" aria-hidden />
        <input type="password" className="hidden" aria-hidden />

        <form onSubmit={submit} className="space-y-4">
          <PasswordInput label="Current Password" value={current} onChange={setCurrent} placeholder="Enter current password" />
          <PasswordInput label="New Password" value={next} onChange={setNext} placeholder="Min. 8 characters" />
          <PasswordInput label="Confirm New Password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />

          {next && confirm && next !== confirm && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}

          <button
            type="submit"
            disabled={loading || !current || !next || !confirm || next !== confirm}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#c4953a] hover:bg-[#b8872e] text-white font-semibold text-sm py-2.5 rounded-xl disabled:opacity-50 transition-colors mt-1"
          >
            {loading
              ? <Loader2 size={15} className="animate-spin" />
              : done
              ? <><RiCheckLine size={15} /> Password Updated</>
              : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
