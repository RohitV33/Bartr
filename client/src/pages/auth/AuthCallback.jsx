import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Spinner } from '../../components/shared.jsx'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const onboarding = searchParams.get('onboarding') === 'true'

    if (token) {
      localStorage.setItem('bartr_token', token)
      refreshUser()
      
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate(onboarding ? '/onboarding' : '/dashboard', { replace: true })
      }, 100)
    } else {
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate, refreshUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bartr-bg">
      <div className="text-center">
        <Spinner size="lg" className="mb-4 mx-auto" />
        <p className="text-bartr-muted font-dm">Completing sign in...</p>
      </div>
    </div>
  )
}
