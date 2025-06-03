import { User } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { createServerClient } from './supabase'

// Server-side authentication utilities
export async function getServerSession() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getServerUser() {
  const session = await getServerSession()
  return session?.user || null
}

// Middleware helper for protected routes
export function withAuth(
  handler: (request: NextRequest, context: { user: User }) => Promise<Response>
) {
  return async (request: NextRequest): Promise<Response> => {
    const session = await getServerSession()
    
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    return handler(request, { user: session.user })
  }
} 