import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Clock, Zap, CheckCircle2, XCircle,
  ShieldAlert, HandshakeIcon, ChevronRight, Sparkles,
} from 'lucide-react'
import { exchangesApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Avatar, Spinner, EmptyState } from '../../components/shared.jsx'
import { timeAgo, exchangeStatusLabel } from '../../utils/helpers.js'


/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.07})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(20px)',transition:'opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Status config ──────────────────────────────────────────────────────────── */
const STATUS_META = {
  PENDING:     { icon: Clock,        stripe:'bg-amber-400',   badge:'bg-amber-50 text-amber-700 border-amber-100',   glow:'shadow-amber-100' },
  ACCEPTED:    { icon: CheckCircle2, stripe:'bg-blue-400',    badge:'bg-blue-50 text-blue-700 border-blue-100',      glow:'shadow-blue-100' },
  IN_PROGRESS: { icon: Zap,          stripe:'bg-violet-400',  badge:'bg-violet-50 text-violet-700 border-violet-100',glow:'shadow-violet-100' },
  COMPLETED:   { icon: CheckCircle2, stripe:'bg-emerald-400', badge:'bg-emerald-50 text-emerald-700 border-emerald-100',glow:'shadow-emerald-100' },
  CANCELLED:   { icon: XCircle,      stripe:'bg-red-300',     badge:'bg-red-50 text-red-500 border-red-100',          glow:'shadow-red-50' },
  DISPUTED:    { icon: ShieldAlert,  stripe:'bg-orange-400',  badge:'bg-orange-50 text-orange-700 border-orange-100', glow:'shadow-orange-100' },
}

const TABS = [
  { label: 'All', value: '' },
  { label: '⏳ Pending', value: 'PENDING' },
  { label: '⚡ Active', value: 'IN_PROGRESS' },
  { label: '✅ Done', value: 'COMPLETED' },
  { label: '✖ Cancelled', value: 'CANCELLED' },
]

/* ─── Hero Banner ────────────────────────────────────────────────────────────── */
function ExchangesHero({ scrollY }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  return (
    <div style={{ transform:`scale(${scale})`,opacity,transformOrigin:'top center' }} className="relative overflow-hidden rounded-[2rem] mb-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-transparent dark:from-violet-900/40 dark:via-purple-900/40 dark:to-transparent" />
        <div className="absolute inset-0 opacity-15 dark:opacity-30" style={{backgroundImage:'radial-gradient(var(--border) 1px,transparent 1px)',backgroundSize:'24px 24px'}} />
      </div>
      <div className="absolute right-0 top-0 w-64 h-64 opacity-20" style={{background:'radial-gradient(circle,#8b5cf6,transparent 70%)',transform:'translate(30%,-30%)'}} />
      <div className="relative px-8 py-10">
        <div className="inline-flex items-center gap-2 bg-violet-400/20 text-violet-300 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-400/20 mb-4">
          <Sparkles className="w-3 h-3" /> Your Activity
        </div>
        <h1 className="text-3xl font-black text-white mb-2" style={{fontFamily:"'Sora',sans-serif"}}>My Exchanges</h1>
        <p className="text-gray-300 text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>Track all your skill exchange proposals and sessions</p>
      </div>
    </div>
  )
}

/* ─── Status Badge ────────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${meta.badge}`} style={{fontFamily:"'Sora',sans-serif"}}>
      <Icon className="w-2.5 h-2.5" />
      {exchangeStatusLabel(status)}
    </span>
  )
}

/* ─── Exchange Row ────────────────────────────────────────────────────────────── */
function ExchangeRow({ ex, isOfferer, onClick, delay }) {
  const partner    = isOfferer ? ex.requester  : ex.offerer
  const mySkill    = isOfferer ? ex.offered_skill   : ex.requested_skill
  const theirSkill = isOfferer ? ex.requested_skill : ex.offered_skill
  const unread     = ex._count?.messages ?? 0
  const meta       = STATUS_META[ex.status] || STATUS_META.PENDING
  const [hov, setHov] = useState(false)

  return (
    <Reveal delay={delay}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${hov ? `shadow-xl ${meta.glow} -translate-y-1` : 'border-gray-100 shadow-sm'}`}
      >
        {/* Status stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${meta.stripe} rounded-l-2xl`} />

        <div className="flex items-center gap-4 p-4 pl-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar src={partner.avatar_url} name={partner.full_name} size="md" />
            {unread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-[9px] font-black text-gray-900">{unread}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <p className="text-sm font-black text-gray-900 truncate" style={{fontFamily:"'Sora',sans-serif"}}>{partner.full_name}</p>
              <StatusBadge status={ex.status} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg truncate max-w-[120px]" style={{fontFamily:"'DM Sans',sans-serif"}}>{mySkill?.title}</span>
              <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
              <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg truncate max-w-[120px]" style={{fontFamily:"'DM Sans',sans-serif"}}>{theirSkill?.title}</span>
            </div>
          </div>

          {/* Right */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <p className="text-[11px] text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>{timeAgo(ex.updated_at)}</p>
            <ChevronRight className="w-4 h-4 text-gray-300" style={{transform:hov?'translateX(3px)':'none',transition:'transform .2s ease'}} />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function ExchangesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.EXCHANGES({ status }),
    queryFn: () => exchangesApi.list({ status, limit: 30 }).then(r => r.data),
  })

  const exchanges = data?.data || []

  return (
    <div>
 
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <ExchangesHero scrollY={scrollY} />

      {/* Tabs */}
      <Reveal delay={60}>
        <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-2xl mb-8 overflow-x-auto">
          {TABS.map(tab => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${active ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-white/60'}`}
                style={{fontFamily:"'Sora',sans-serif"}}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </Reveal>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : exchanges.length === 0 ? (
        <Reveal delay={80}>
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <HandshakeIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2" style={{fontFamily:"'Sora',sans-serif"}}>No exchanges yet</h3>
            <p className="text-gray-500 mb-6" style={{fontFamily:"'DM Sans',sans-serif"}}>Browse skills and propose an exchange to get started.</p>
            <button onClick={() => navigate('/browse')} className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-700 transition-all shadow-lg" style={{fontFamily:"'Sora',sans-serif"}}>
              Browse Skills
            </button>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <p className="text-sm text-gray-400 mb-4" style={{fontFamily:"'DM Sans',sans-serif"}}>
              <span className="text-gray-900 font-black text-lg">{exchanges.length}</span> exchange{exchanges.length !== 1 ? 's' : ''}
            </p>
          </Reveal>
          <div className="space-y-3">
            {exchanges.map((ex, i) => (
              <ExchangeRow
                key={ex.id}
                ex={ex}
                isOfferer={ex.offerer_id === user?.id}
                onClick={() => navigate(`/exchanges/${ex.id}`)}
                delay={80 + i * 40}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}