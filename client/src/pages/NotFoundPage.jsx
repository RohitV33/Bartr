import { Ghost, ArrowLeft } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bartr-bg flex flex-col items-center justify-center p-6 text-center font-jakarta">
      <div className="relative mb-8">
        <Ghost className="w-32 h-32 text-bartr-text animate-bounce" weight="duotone" />
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 rounded-full blur-sm" />
      </div>
      
      <h1 className="text-6xl font-black font-syne text-bartr-text mb-4">404</h1>
      <h2 className="text-xl font-bold text-bartr-text mb-2">Page Not Found</h2>
      <p className="text-bartr-muted text-sm max-w-md mb-10">
        The page you are looking for doesn't exist or has been moved to another universe.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-bartr-text text-bartr-bg px-6 py-3.5 rounded-xl font-bold hover:bg-bartr-text/90 transition-all shadow-[4px_4px_0px_var(--border)] active:translate-y-[2px] active:shadow-none"
      >
        <ArrowLeft className="w-5 h-5" weight="bold" />
        Return Home
      </button>
    </div>
  )
}
