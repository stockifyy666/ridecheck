import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Validate UUID format to prevent injection
    if (!/^[0-9a-f-]{36}$/.test(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const db = getAdmin()

    // Verify order exists
    const { data: order, error: orderError } = await db.from('orders').select('id').eq('id', id).single()
    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 413 })
    }

    // Sanitize filename
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'pdf'
    const allowedExts = ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'txt']
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    const safeFilename = `reports/${id}/report-${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error: uploadError } = await db.storage
      .from('reports')
      .upload(safeFilename, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 })
    }

    const { data: urlData } = db.storage.from('reports').getPublicUrl(safeFilename)

    // Save URL to order
    await db.from('orders').update({
      report_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', id)

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
