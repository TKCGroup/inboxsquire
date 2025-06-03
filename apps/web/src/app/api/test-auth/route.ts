import { withAuth } from '@/lib/auth-server'

export const GET = withAuth(async (request, { user }) => {
  return Response.json({
    message: 'Authentication successful!',
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
  })
})

export const POST = withAuth(async (request, { user }) => {
  return Response.json({
    message: 'Protected POST endpoint accessed',
    user: user.email,
  })
}) 