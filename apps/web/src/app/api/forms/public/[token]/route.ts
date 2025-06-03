import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/forms/public/[token] - Get public form by token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Track form view
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = request.headers.get('x-session-id') || 'anonymous'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor || realIp || 'unknown'

    // Get form by token
    const { data: form, error } = await supabase
      .from('forms')
      .select(`
        id,
        title,
        description,
        questions,
        branding,
        settings,
        expires_at,
        is_active
      `)
      .eq('token', params.token)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check if form has expired
    if (form.expires_at) {
      const expirationDate = new Date(form.expires_at)
      if (expirationDate < new Date()) {
        return NextResponse.json({ error: 'Form has expired' }, { status: 410 })
      }
    }

    // Track form view analytics
    await supabase.from('form_analytics').insert({
      form_id: form.id,
      event_type: 'view',
      session_id: sessionId,
      ip_address: ipAddress,
      user_agent: userAgent
    })

    // Return public form data
    const publicForm = {
      id: form.id,
      title: form.title,
      description: form.description,
      questions: form.questions,
      branding: form.branding || {},
      settings: form.settings || {},
      expires_at: form.expires_at
    }

    return NextResponse.json({ form: publicForm })
  } catch (err) {
    console.error('Public form API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 