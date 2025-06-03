import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { APIResponse } from '@/lib/types/forms'
import { supabase } from '@/lib/supabase'

// GET /api/forms/templates - List available form templates
export async function GET() {
  try {
    const { data: templates, error } = await supabase
      .from('form_templates')
      .select('*')
      .eq('is_public', true)
      .order('name')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ templates })
  } catch (err) {
    console.error('Templates API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Prepare template data
    const templateData = {
      name: body.name,
      description: body.description,
      category: body.category,
      template_data: body.templateData,
      created_by: user.id
    }

    // Insert template
    const { data: template, error: insertError } = await supabase
      .from('form_templates')
      .insert(templateData)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating template:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to create template' },
        { status: 500 }
      )
    }

    const response: APIResponse = {
      success: true,
      data: template,
      message: 'Template created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/forms/templates:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 