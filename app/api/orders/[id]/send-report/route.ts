import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!/^[0-9a-f-]{36}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const db = getAdmin()
    const { data: order, error } = await db.from('orders').select('*').eq('id', id).single()
    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (!order.report_url) return NextResponse.json({ error: 'No report file uploaded yet' }, { status: 400 })

    await resend.emails.send({
      from: 'RideChecks <onboarding@resend.dev>',
      to: order.email,
      subject: `Your ${order.package_name} Vehicle History Report is Ready — RideChecks`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:0;background:#ffffff;">
          <div style="background:#080c18;padding:24px 32px;border-radius:12px 12px 0 0;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:32px;height:32px;background:#c4953a;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:900;font-size:14px;">R</span>
              </div>
              <span style="color:white;font-weight:700;font-size:18px;">Ride<span style="color:#c4953a;">Checks</span></span>
            </div>
          </div>
          <div style="padding:32px;background:#faf8f4;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
            <h2 style="color:#0f172a;margin:0 0 8px;font-size:22px;">Your Report is Ready!</h2>
            <p style="color:#475569;margin:0 0 24px;font-size:15px;">
              Hi ${order.full_name}, your <strong>${order.package_name}</strong> vehicle history report for
              VIN <strong style="font-family:monospace;color:#0f172a;">${order.vin}</strong> is now ready.
            </p>
            <div style="text-align:center;margin:24px 0;">
              <a href="${order.report_url}" style="display:inline-block;background:#c4953a;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
                Download Your Report →
              </a>
            </div>
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:16px;">
              <table style="width:100%;font-size:13px;border-collapse:collapse;">
                <tr><td style="padding:6px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">VIN</td><td style="padding:6px 0;font-family:monospace;font-weight:700;border-bottom:1px solid #f1f5f9;">${order.vin}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Package</td><td style="padding:6px 0;font-weight:600;border-bottom:1px solid #f1f5f9;">${order.package_name}</td></tr>
                <tr><td style="padding:6px 0;color:#64748b;">Order ID</td><td style="padding:6px 0;color:#94a3b8;font-size:11px;font-family:monospace;">${order.id}</td></tr>
              </table>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              If the button above doesn't work, copy and paste this link:<br/>
              <a href="${order.report_url}" style="color:#c4953a;word-break:break-all;">${order.report_url}</a>
            </p>
            <p style="color:#64748b;font-size:13px;margin-top:16px;">Thank you for choosing RideChecks! We're here to help you buy with confidence.</p>
          </div>
        </div>
      `,
    })

    await db.from('orders').update({
      status: 'completed',
      email_sent_at: new Date().toISOString(),
      email_sent_count: (order.email_sent_count || 0) + 1,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 })
  }
}
