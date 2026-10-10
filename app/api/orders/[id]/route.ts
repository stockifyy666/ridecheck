import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const VALID_STATUSES = new Set(['pending', 'processing', 'completed'])

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!/^[0-9a-f-]{36}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }
    const body = await req.json()
    const { status, report_url, notes } = body
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (status !== undefined) {
      if (!VALID_STATUSES.has(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      updates.status = status
    }
    if (report_url !== undefined) updates.report_url = report_url
    if (notes !== undefined) updates.notes = notes
    const { data, error } = await getAdmin().from('orders').update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await getAdmin().from('orders').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}
