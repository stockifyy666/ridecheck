import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const validEmail = process.env.ADMIN_EMAIL
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  if (email !== validEmail) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  // Check Supabase override first, fall back to .env
  let validPassword = process.env.ADMIN_PASSWORD
  try {
    const { data } = await getAdmin()
      .from('admin_config')
      .select('value')
      .eq('key', 'admin_password')
      .single()
    if (data?.value) validPassword = data.value
  } catch {
    // table may not exist yet — fall back to .env
  }

  if (password !== validPassword) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_session', secret!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return res
}
