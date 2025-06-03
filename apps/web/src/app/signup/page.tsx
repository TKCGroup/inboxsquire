import AuthLayout from '@/components/auth/AuthLayout'
import AuthForm from '@/components/auth/AuthForm'

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
    </AuthLayout>
  )
} 