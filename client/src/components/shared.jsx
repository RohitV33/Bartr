import { forwardRef } from 'react'
import { Package, Star, CaretRight } from '@phosphor-icons/react'
import { getInitials, proficiencyColor, proficiencyLabel } from '../utils/helpers.js'

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ src, name = '', size = 'md', online = false, className = '' }) => {
  const sizes = { 
    xs: 'w-6 h-6 text-[10px]', 
    sm: 'w-8 h-8 text-xs', 
    md: 'w-10 h-10 text-sm', 
    lg: 'w-14 h-14 text-base', 
    xl: 'w-20 h-20 text-xl' 
  }
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-[#0B0B0A]/5 border border-[#0B0B0A]/8 flex items-center justify-center font-syne font-extrabold text-[#0B0B0A]`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#10B981] border-2 border-[#F7F7F5] rounded-full shadow-sm" />
      )}
    </div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-jakarta border ${className}`}>
    {children}
  </span>
)

export const ProficiencyBadge = ({ level }) => {
  const colors = {
    BEGINNER: 'bg-[#0B0B0A]/5 text-[#0B0B0A]/60 border-transparent',
    INTERMEDIATE: 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent',
    EXPERT: 'bg-[#10B981]/10 text-[#10B981] border-transparent'
  }
  return (
    <Badge className={colors[level] || 'bg-[#0B0B0A]/5 text-[#0B0B0A]/60 border-transparent'}>
      {proficiencyLabel(level)}
    </Badge>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md', loading = false,
  className = '', disabled, ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-jakarta font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed select-none'
  const variants = {
    primary: 'bg-[#6D28D9] text-[#F7F7F5] hover:bg-[#5B21B6] rounded-full shadow-md shadow-[#6D28D9]/10 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-transparent text-[#0B0B0A] border border-[#0B0B0A]/10 hover:bg-[#0B0B0A]/5 rounded-full hover:scale-[1.02] active:scale-[0.98]',
    yellow: 'bg-[#0B0B0A] text-[#F7F7F5] hover:bg-[#0B0B0A]/90 rounded-full hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'text-[#0B0B0A]/60 hover:text-[#0B0B0A] hover:bg-[#0B0B0A]/5 rounded-full',
    danger: 'bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-full',
  }
  const sizes = {
    xs: 'px-3 py-1.5 text-[10px] tracking-wider uppercase',
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-2.5 text-xs tracking-wider uppercase',
    lg: 'px-8 py-3.5 text-sm tracking-wider uppercase',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin text-current" fill="none" viewBox="0 0 24 24">
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
    className={`bg-white border border-[#0B0B0A]/8 rounded-2xl shadow-[0_4px_20px_rgba(11,11,10,0.01)] transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(11,11,10,0.04)] hover:border-[#6D28D9]/25 cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
)

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-bold text-[#0B0B0A]/50 font-syne uppercase tracking-widest">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-4 py-3 rounded-xl border text-sm bg-white font-jakarta text-[#0B0B0A] placeholder-[#0B0B0A]/30 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#0B0B0A]/10'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-jakarta mt-0.5">{error}</p>}
  </div>
))
Input.displayName = 'Input'

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-bold text-[#0B0B0A]/50 font-syne uppercase tracking-widest">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full px-4 py-3 rounded-xl border text-sm bg-white font-jakarta text-[#0B0B0A] placeholder-[#0B0B0A]/30 focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all resize-none ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#0B0B0A]/10'} ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-jakarta mt-0.5">{error}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = forwardRef(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-bold text-[#0B0B0A]/50 font-syne uppercase tracking-widest">{label}</label>}
    <select
      ref={ref}
      className={`w-full px-4 py-3 rounded-xl border text-sm bg-white font-jakarta text-[#0B0B0A] focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:border-[#6D28D9] transition-all appearance-none ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#0B0B0A]/10'} ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 font-jakarta mt-0.5">{error}</p>}
  </div>
))
Select.displayName = 'Select'

// ── Stars ─────────────────────────────────────────────────────────────────────
export const Stars = ({ rating, max = 5, size = 'sm' }) => {
  const sz = size === 'sm' ? 'w-3 h-3' : 'w-4.5 h-4.5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star 
          key={i} 
          className={`${sz} ${i < Math.round(rating) ? 'text-[#6D28D9] fill-[#6D28D9]' : 'text-[#0B0B0A]/15'}`} 
        />
      ))}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size]
  return (
    <svg className={`${sz} animate-spin text-[#6D28D9]`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-[#0B0B0A]/8 rounded-3xl p-8 max-w-md mx-auto shadow-[0_4px_20px_rgba(11,11,10,0.01)]">
    <div className="mb-4 text-[#6D28D9] bg-[#6D28D9]/5 w-16 h-16 rounded-full flex items-center justify-center">
      {icon || <Package className="w-8 h-8" />}
    </div>
    <h3 className="font-syne font-bold text-[#0B0B0A] text-lg mb-2">{title}</h3>
    {description && <p className="text-[#0B0B0A]/60 text-xs sm:text-sm font-jakarta mb-6 max-w-xs leading-relaxed">{description}</p>}
    {action}
  </div>
)

// ── Skill Card ────────────────────────────────────────────────────────────────
export const SkillCard = ({ skill, onClick, layout = 'card' }) => {
  if (layout === 'row') {
    return (
      <div 
        onClick={onClick}
        className="w-full bg-white border border-[#0B0B0A]/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:border-[#6D28D9]/25 hover:shadow-md group shadow-[0_2px_15px_rgba(11,11,10,0.01)]"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-base bg-[#0B0B0A]/5 w-10 h-10 rounded-xl flex items-center justify-center border border-[#0B0B0A]/5 shrink-0">
            {skill.category?.icon}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${skill.is_offering ? 'bg-[#0B0B0A] text-[#F7F7F5] border-[#0B0B0A]' : 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent'}`}>
                {skill.is_offering ? 'Offering' : 'Requesting'}
              </span>
              <ProficiencyBadge level={skill.proficiency_level} />
            </div>
            <h3 className="font-syne font-bold text-[#0B0B0A] text-base group-hover:text-[#6D28D9] transition-colors truncate">
              {skill.title}
            </h3>
            <p className="text-xs text-[#0B0B0A]/40 font-jakarta line-clamp-1 leading-relaxed mt-0.5">
              {skill.description}
            </p>
          </div>
        </div>

        {skill.user && (
          <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-[#0B0B0A]/5 pt-3 md:pt-0">
            <div className="flex items-center gap-2">
              <Avatar src={skill.user.avatar_url} name={skill.user.full_name} size="sm" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#0B0B0A] font-syne">{skill.user.full_name}</p>
                <p className="text-[9px] text-[#0B0B0A]/40 font-jakarta truncate max-w-[120px]">{skill.user.university || 'University'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-[#6D28D9]/5 px-2.5 py-1 rounded-md">
              <Star className="w-3 h-3 fill-[#6D28D9] text-[#6D28D9]" />
              <span className="text-[10px] font-bold text-[#6D28D9] font-syne">
                {skill.user.reputation_score?.toFixed(1) || '0.0'}
              </span>
            </div>

            <span className="hidden md:flex w-7 h-7 rounded-full bg-[#0B0B0A]/3 group-hover:bg-[#6D28D9] text-[#0B0B0A] group-hover:text-white items-center justify-center transition-all duration-300">
              <CaretRight className="w-4 h-4" />
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card hover onClick={onClick} className="p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm bg-[#0B0B0A]/5 w-8 h-8 rounded-lg flex items-center justify-center border border-[#0B0B0A]/5">
            {skill.category?.icon}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${skill.is_offering ? 'bg-[#0B0B0A] text-[#F7F7F5] border-[#0B0B0A]' : 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent'}`}>
            {skill.is_offering ? 'Offering' : 'Requesting'}
          </span>
        </div>
        <ProficiencyBadge level={skill.proficiency_level} />
      </div>
      
      <h3 className="font-syne font-bold text-[#0B0B0A] text-base mb-2 line-clamp-1 group-hover:text-[#6D28D9] transition-colors">
        {skill.title}
      </h3>
      <p className="text-xs text-[#0B0B0A]/60 font-jakarta line-clamp-2 mb-6 leading-relaxed">
        {skill.description}
      </p>
      
      {skill.user && (
        <div className="flex items-center gap-2 pt-4 border-t border-[#0B0B0A]/5">
          <Avatar src={skill.user.avatar_url} name={skill.user.full_name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-[#0B0B0A] font-syne truncate">{skill.user.full_name}</p>
            <p className="text-[9px] text-[#0B0B0A]/40 font-jakarta truncate">{skill.user.university || 'University'}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-[#6D28D9]/5 px-2 py-1 rounded-md">
            <Star className="w-3 h-3 fill-[#6D28D9] text-[#6D28D9]" />
            <span className="text-[10px] font-bold text-[#6D28D9] font-syne">
              {skill.user.reputation_score?.toFixed(1) || '0.0'}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}

// ── Page Header ───────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#0B0B0A]/5">
    <div className="space-y-1">
      <h1 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-[#0B0B0A]">{title}</h1>
      {subtitle && <p className="text-[#0B0B0A]/50 font-jakarta text-xs sm:text-sm font-medium">{subtitle}</p>}
    </div>
    {action}
  </div>
)

// ── Toast ─────────────────────────────────────────────────────────────────────
export const Toast = ({ toast, onDismiss }) => (
  <div className="bg-white rounded-2xl shadow-xl border border-[#0B0B0A]/8 p-4 max-w-xs w-full flex items-start gap-3 animate-slide-up">
    <div className="w-8 h-8 rounded-full bg-[#6D28D9]/10 text-[#6D28D9] flex items-center justify-center text-xs shrink-0 font-bold">🔔</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-[#0B0B0A] font-syne">{toast.title}</p>
      <p className="text-[10px] text-[#0B0B0A]/60 font-jakarta mt-0.5 line-clamp-2 leading-relaxed">{toast.body}</p>
    </div>
    <button onClick={() => onDismiss(toast.id)} className="text-[#0B0B0A]/40 hover:text-[#0B0B0A] font-bold shrink-0 text-xs">✕</button>
  </div>
)