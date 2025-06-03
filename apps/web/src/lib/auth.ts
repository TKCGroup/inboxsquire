// Re-export client-side auth utilities
export { useAuth, type AuthContextType } from './auth-client'

// Re-export server-side auth utilities  
export { getServerSession, getServerUser, withAuth } from './auth-server' 