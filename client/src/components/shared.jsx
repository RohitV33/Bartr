import { forwardRef } from 'react'
import { PackageOpen } from 'lucide-react'
import { getInitials, proficiencyColor, proficiencyLabel } from '../utils/helpers.js'

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ src, name = '', size = 'md', online = false, className = '' }) => {
  const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' }
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-yellow-300 flex items-center justify-center font-sora font-bold text-bartr-dark`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-bartr-bg" />
      )}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold font-sora ${className}`}>
    {children}
  </span>
)

export const ProficiencyBadge = ({ level }) => (
  <Badge className={proficiencyColor(level)}>{proficiencyLabel(level)}</Badge>
)

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md', loading = false,
  className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-sora font-semibold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-bartr-dark text-white hover:bg-gray-800 dark:bg-yellow-300 dark:text-bartr-dark dark:hover:bg-yellow-400 shadow-sm',
    secondary: 'bg-bartr-surface text-bartr-text border border-bartr-border hover:bg-gray-50 dark:hover:bg-gray-800',
    yellow: 'bg-yellow-300 text-bartr-dark hover:bg-yellow-400 dark:bg-yellow-400 dark:hover:bg-yellow-500',
    ghost: 'text-bartr-muted hover:text-bartr-text hover:bg-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20',
  }
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false, ...props }) => (
  <div
    className={`bg-bartr-card rounded-2xl border border-bartr-border ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
)

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-bartr-text font-sora">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-bartr-surface font-dm text-bartr-text placeholder-bartr-muted/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all ${error ? 'border-red-400' : 'border-bartr-border'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-dm">{error}</p>}
  </div>
))
Input.displayName = 'Input'

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-bartr-text font-sora">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-bartr-surface font-dm text-bartr-text placeholder-bartr-muted/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all resize-none ${error ? 'border-red-400' : 'border-bartr-border'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-dm">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-bartr-text font-sora">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-bartr-surface font-dm text-bartr-text focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all ${error ? 'border-red-400' : 'border-bartr-border'} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 font-dm">{error}</p>}
  </div>
))
Select.displayName = 'Select'

// ── Stars ─────────────────────────────────────────────────────────────────────
export const Stars = ({ rating, max = 5, size = 'sm' }) => {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} className={`${sz} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size]
  return (
    <svg className={`${sz} animate-spin text-yellow-400`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 text-bartr-muted">
      {icon || <PackageOpen className="w-12 h-12" />}
    </div>
    <h3 className="font-sora font-semibold text-bartr-text text-lg mb-2">{title}</h3>
    {description && <p className="text-bartr-muted text-sm font-dm max-w-xs mb-6">{description}</p>}
    {action}
  </div>
)

// ── Skill Card ────────────────────────────────────────────────────────────────
export const SkillCard = ({ skill, onClick }) => (
  <Card hover onClick={onClick} className="p-5">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">{skill.category?.icon}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-sora ${skill.is_offering ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'}`}>
          {skill.is_offering ? 'Offering' : 'Requesting'}
        </span>
      </div>
      <ProficiencyBadge level={skill.proficiency_level} />
    </div>
    <h3 className="font-sora font-semibold text-bartr-text mb-1 line-clamp-1">{skill.title}</h3>
    <p className="text-sm text-bartr-muted font-dm line-clamp-2 mb-4">{skill.description}</p>
    {skill.user && (
      <div className="flex items-center gap-2 pt-3 border-t border-bartr-border">
        <Avatar src={skill.user.avatar_url} name={skill.user.full_name} size="sm" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-bartr-text font-sora truncate">{skill.user.full_name}</p>
          <p className="text-xs text-bartr-muted font-dm truncate">{skill.user.university || 'University'}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Stars rating={skill.user.reputation_score} />
          <span className="text-xs text-bartr-muted">{skill.user.reputation_score?.toFixed(1)}</span>
        </div>
      </div>
    )}
  </Card>
)

// ── Page Header ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-8">
    <div>
      <h1 className="font-sora text-2xl font-bold text-bartr-text">{title}</h1>
      {subtitle && <p className="text-bartr-muted font-dm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────
export const Toast = ({ toast, onDismiss }) => (
  <div className="bg-bartr-surface rounded-2xl shadow-xl border border-bartr-border p-4 max-w-xs w-full flex items-start gap-3 animate-slide-up">
    <div className="w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center text-sm shrink-0">🔔</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-bartr-text font-sora">{toast.title}</p>
      <p className="text-xs text-bartr-muted font-dm mt-0.5 line-clamp-2">{toast.body}</p>
    </div>
    <button onClick={() => onDismiss(toast.id)} className="text-bartr-muted hover:text-bartr-text shrink-0">✕</button>
  </div>
)