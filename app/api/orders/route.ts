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

const ALLOWED_FIELDS = new Set(['full_name', 'email', 'phone', 'vin', 'package_name', 'package_price'])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { full_name, email, phone, vin, package_name, package_price } = body

    // Validate required fields
    if (!full_name || !email || !phone || !vin || !package_name || !package_price) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Basic input validation
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (typeof vin !== 'string' || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin.trim())) {
      return NextResponse.json({ error: 'Invalid VIN — must be 17 characters' }, { status: 400 })
    }
    if (typeof package_price !== 'number' || package_price <= 0 || package_price > 10000) {
      return NextResponse.json({ error: 'Invalid package price' }, { status: 400 })
    }

    // Sanitize: only allow expected fields
    const sanitized = Object.fromEntries(
      Object.entries(body).filter(([k]) => ALLOWED_FIELDS.has(k))
    )

    const db = getAdmin()
    const { data: order, error: dbError } = await db
      .from('orders')
      .insert({
        ...sanitized,
        vin: vin.trim().toUpperCase(),
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) throw dbError

    // Confirmation email to customer
    await resend.emails.send({
      from: 'RideChecks <onboarding@resend.dev>',
      to: email,
      subject: `Your RideChecks Order Confirmation — ${package_name} Report`,
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
            <h2 style="color:#0f172a;margin:0 0 8px;font-size:22px;">Order Received!</h2>
            <p style="color:#475569;margin:0 0 24px;font-size:15px;">Hi ${full_name}, we've received your order and our team is now preparing your vehicle history report.</p>
            <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:24px;">
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">VIN</td><td style="padding:8px 0;font-weight:700;font-family:monospace;border-bottom:1px solid #f1f5f9;">${vin.trim().toUpperCase()}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Package</td><td style="padding:8px 0;font-weight:600;border-bottom:1px solid #f1f5f9;">${package_name}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Amount Paid</td><td style="padding:8px 0;font-weight:700;color:#c4953a;border-bottom:1px solid #f1f5f9;">$${package_price}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Status</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;"><span style="background:#fef9c3;color:#854d0e;padding:3px 10px;border-radius:20px;font-weight:600;font-size:12px;">Pending</span></td></tr>
                <tr><td style="padding:8px 0;color:#64748b;">Order ID</td><td style="padding:8px 0;color:#94a3b8;font-size:11px;font-family:monospace;">${order.id}</td></tr>
              </table>
            </div>
            <p style="color:#64748b;font-size:13px;margin:0;">You'll receive your completed report to this email address once it's ready. If you have questions, reply to this email.</p>
          </div>
        </div>
      `,
    })

    // Notification email to admin
    await resend.emails.send({
      from: 'RideChecks <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
      subject: `New Order — ${package_name} — VIN: ${vin.trim().toUpperCase()}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 16px;color:#0f172a;">New Order Received</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr style="background:#f8fafc;"><td style="padding:10px 16px;color:#64748b;width:140px;border-bottom:1px solid #e5e7eb;">Name</td><td style="padding:10px 16px;font-weight:600;border-bottom:1px solid #e5e7eb;">${full_name}</td></tr>
            <tr><td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">${email}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e5e7eb;">Phone</td><td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">${phone}</td></tr>
            <tr><td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e5e7eb;">VIN</td><td style="padding:10px 16px;font-family:monospace;font-weight:700;border-bottom:1px solid #e5e7eb;">${vin.trim().toUpperCase()}</td></tr>
            <tr style="background:#f8fafc;"><td style="padding:10px 16px;color:#64748b;border-bottom:1px solid #e5e7eb;">Package</td><td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">${package_name} — $${package_price}</td></tr>
            <tr><td style="padding:10px 16px;color:#64748b;">Order ID</td><td style="padding:10px 16px;font-size:11px;color:#94a3b8;font-family:monospace;">${order.id}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="display:inline-block;margin-top:20px;background:#c4953a;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">View in Admin Portal →</a>
        </div>
      `,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    console.error('ORDER ERROR:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Failed to place order', detail: message }, { status: 500 })
  }
}
