import { Sparkle, CircleNotch, X } from '@phosphor-icons/react'

export function AiAssistButton({ onClick, isLoading, label = "AI Assist", className = "", variant = "primary" }) {
  const variants = {
    primary: "bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 shadow-lg shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30 border-0",
    secondary: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20",
    glow: "bg-white dark:bg-gray-800 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] border border-amber-100 dark:border-amber-800/50"
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`group relative overflow-hidden flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {isLoading ? (
        <CircleNotch className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <Sparkle className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
      )}
      <span>{isLoading ? 'Generating…' : label}</span>
    </button>
  )
}

export function AiResultCard({ content, onClose, className = "", title = "AI Insight" }) {
  if (!content) return null
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border border-amber-200/50 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-700/30 backdrop-blur-sm shadow-inner ${className}`} style={{ animation: 'msgIn .4s cubic-bezier(.34,1.56,.64,1)' }}>
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-orange-400" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-500/20 rounded-lg shrink-0">
          <Sparkle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1" style={{fontFamily:"'Sora',sans-serif"}}>{title}</p>
          <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300" style={{fontFamily:"'DM Sans',sans-serif"}}>{content}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-md text-amber-600/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-600 dark:text-amber-400/50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
