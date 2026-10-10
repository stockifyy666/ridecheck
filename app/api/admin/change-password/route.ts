import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session || session.value !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 })
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
  }

  // Get active password — Supabase override takes priority over .env
  const db = getAdmin()
  const { data: row } = await db
    .from('admin_config')
    .select('value')
    .eq('key', 'admin_password')
    .single()

  const activePassword = row?.value ?? process.env.ADMIN_PASSWORD

  if (currentPassword !== activePassword) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
  }

  // Upsert new password into Supabase
  const { error } = await db.from('admin_config').upsert(
    { key: 'admin_password', value: newPassword },
    { onConflict: 'key' }
  )
  if (error) return NextResponse.json({ error: 'Failed to save password' }, { status: 500 })

  return NextResponse.json({ success: true })
}
