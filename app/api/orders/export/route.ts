import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const { data, error } = await getAdmin()
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const headers = ['Order ID', 'Full Name', 'Email', 'Phone', 'VIN', 'Package', 'Price', 'Status', 'Email Sent', 'Email Count', 'Created At', 'Notes']
  const rows = (data || []).map(o => [
    o.id,
    o.full_name,
    o.email,
    o.phone,
    o.vin,
    o.package_name,
    o.package_price,
    o.status,
    o.email_sent_at ? new Date(o.email_sent_at).toLocaleString() : '',
    o.email_sent_count || 0,
    new Date(o.created_at).toLocaleString(),
    (o.notes || '').replace(/\n/g, ' '),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="ridechecks-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
