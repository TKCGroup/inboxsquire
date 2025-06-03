import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { TablesInsert } from '@/lib/types/database'

// POST /api/forms/public/[token]/submit - Submit form response
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    // Get request metadata
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = request.headers.get('x-session-id') || 'anonymous'
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor || realIp || 'unknown'

    // Parse request body
    const body = await request.json()
    const { responses, respondent_email, respondent_name } = body

    // Validate required fields
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        { error: 'Response data is required' },
        { status: 400 }
      )
    }

    // Get form by token to validate it exists and is active
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id, is_active, expires_at')
      .eq('token', params.token)
      .single()

    if (formError) {
      if (formError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Form not found' }, { status: 404 })
      }
      return NextResponse.json({ error: formError.message }, { status: 500 })
    }

    // Check if form is active
    if (!form.is_active) {
      return NextResponse.json({ error: 'Form is not accepting responses' }, { status: 410 })
    }

    // Check if form has expired
    if (form.expires_at) {
      const expirationDate = new Date(form.expires_at)
      if (expirationDate < new Date()) {
        return NextResponse.json({ error: 'Form has expired' }, { status: 410 })
      }
    }

    // Create response record
    const responseData: TablesInsert<'form_responses'> = {
      form_id: form.id,
      respondent_email,
      respondent_name,
      response_data: responses,
      metadata: {
        submitted_from: request.headers.get('referer') || 'direct',
        browser: userAgent
      },
      ip_address: ipAddress,
      user_agent: userAgent
    }

    const { data: response, error: responseError } = await supabase
      .from('form_responses')
      .insert(responseData)
      .select()
      .single()

    if (responseError) {
      return NextResponse.json({ error: responseError.message }, { status: 500 })
    }

    // Track completion analytics
    await supabase.from('form_analytics').insert({
      form_id: form.id,
      event_type: 'complete',
      session_id: sessionId,
      ip_address: ipAddress,
      user_agent: userAgent
    })

    return NextResponse.json({ 
      success: true,
      response_id: response.id,
      message: 'Form submitted successfully'
    }, { status: 201 })

  } catch (err) {
    console.error('Form submission error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 