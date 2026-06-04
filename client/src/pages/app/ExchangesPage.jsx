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
import { Avatar, Spinner } from '../../components/shared.jsx'
import { timeAgo, exchangeStatusLabel } from '../../utils/helpers.js'

/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(() => {
    const io = new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.07})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(15px)':'translateY(0)',transition:'opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Status config ──────────────────────────────────────────────────────────── */
const STATUS_META = {
  PENDING:     { icon: Clock,        stripe:'bg-[#0B0B0A]/20',  badge:'bg-[#0B0B0A]/5 text-[#0B0B0A]/55 border-transparent' },
  ACCEPTED:    { icon: CheckCircle2, stripe:'bg-[#6D28D9]',      badge:'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent' },
  IN_PROGRESS: { icon: Zap,          stripe:'bg-[#6D28D9]',      badge:'bg-[#6D28D9]/15 text-[#6D28D9] border-transparent' },
  COMPLETED:   { icon: CheckCircle2, stripe:'bg-[#10B981]',      badge:'bg-[#10B981]/10 text-[#10B981] border-transparent' },
  CANCELLED:   { icon: XCircle,      stripe:'bg-[#0B0B0A]/10',  badge:'bg-[#0B0B0A]/5 text-[#0B0B0A]/40 border-transparent' },
  DISPUTED:    { icon: ShieldAlert,  stripe:'bg-red-500',      badge:'bg-red-500/10 text-red-500 border-transparent' },
}

const TABS = [
  { label: 'All', value: '' },
  { label: '⏳ Pending', value: 'PENDING' },
  { label: '⚡ Active', value: 'IN_PROGRESS' },
  { label: '✅ Done', value: 'COMPLETED' },
  { label: '✖ Cancelled', value: 'CANCELLED' },
]

/* ─── Status Badge ────────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${meta.badge}`} style={{fontFamily:"'Syne',sans-serif"}}>
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

  return (
    <Reveal delay={delay}>
      <div
        onClick={onClick}
        className="relative bg-white rounded-2xl border border-[#0B0B0A]/5 transition-all duration-300 overflow-hidden cursor-pointer p-5 flex items-center justify-between gap-4 hover:border-[#6D28D9]/25 hover:shadow-md shadow-[0_2px_15px_rgba(11,11,10,0.01)] group"
      >
        {/* Status stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${meta.stripe} rounded-l-2xl`} />

        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar src={partner.avatar_url} name={partner.full_name} size="md" />
            {unread > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#6D28D9] text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white">
                <span>{unread}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <p className="text-xs sm:text-sm font-bold text-[#0B0B0A] truncate font-syne">{partner.full_name}</p>
              <StatusBadge status={ex.status} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold bg-[#0B0B0A] text-[#F7F7F5] px-2.5 py-0.5 rounded-full truncate max-w-[120px] font-jakarta">{mySkill?.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0B0B0A]/30 shrink-0" />
              <span className="text-[10px] font-bold bg-[#6D28D9]/10 text-[#6D28D9] px-2.5 py-0.5 rounded-full truncate max-w-[120px] font-jakarta">{theirSkill?.title}</span>
            </div>
          </div>
        </div>

        {/* Right Details */}
        <div className="shrink-0 flex items-center gap-3">
          <p className="text-[10px] text-[#0B0B0A]/40 font-medium font-jakarta">{timeAgo(ex.updated_at)}</p>
          <span className="w-7 h-7 rounded-full bg-[#0B0B0A]/3 group-hover:bg-[#6D28D9] text-[#0B0B0A] group-hover:text-white flex items-center justify-center transition-all duration-300">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Reveal>
  )
}

export default function ExchangesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.EXCHANGES({ status }),
    queryFn: () => exchangesApi.list({ status, limit: 30 }).then(r => r.data),
  })

  const exchanges = data?.data || []

  return (
    <div className="max-w-7xl mx-auto font-jakarta w-full">
      
      {/* Editorial Header */}
      <Reveal className="mb-10 pb-6 border-b border-[#0B0B0A]/5">
        <span className="text-[10px] font-bold text-[#6D28D9] uppercase tracking-widest block mb-2">
          Your Activity
        </span>
        <h1 className="font-syne font-bold text-3xl sm:text-5xl text-[#0B0B0A] tracking-tight mb-2">
          My Exchanges
        </h1>
        <p className="text-[#0B0B0A]/50 text-xs sm:text-sm font-medium leading-relaxed">
          Track all your skill exchange proposals, active sessions, and history.
        </p>
      </Reveal>

      {/* Tabs */}
      <Reveal delay={60}>
        <div className="flex gap-1.5 p-1 bg-white border border-[#0B0B0A]/5 rounded-full mb-8 overflow-x-auto w-max max-w-full">
          {TABS.map(tab => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold font-jakarta whitespace-nowrap transition-all duration-150 ${active ? 'bg-[#0B0B0A] text-[#F7F7F5]' : 'bg-transparent text-[#0B0B0A]/50 hover:text-[#0B0B0A] hover:bg-[#0B0B0A]/5'}`}
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
          <div className="text-center py-20 bg-white border border-[#0B0B0A]/8 rounded-3xl max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-[#6D28D9]/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <HandshakeIcon className="w-8 h-8 text-[#6D28D9]" />
            </div>
            <h3 className="text-lg font-bold text-[#0B0B0A] mb-2" style={{fontFamily:"'Syne',sans-serif"}}>No exchanges yet</h3>
            <p className="text-[#0B0B0A]/60 font-medium mb-6 text-xs sm:text-sm">Browse skills and propose an exchange to get started.</p>
            <button 
              onClick={() => navigate('/browse')} 
              className="bg-[#0B0B0A] hover:bg-[#0B0B0A]/90 text-[#F7F7F5] text-xs font-bold px-6 py-3 rounded-full shadow-sm transition-transform hover:scale-[1.02]"
              style={{fontFamily:"'Syne',sans-serif"}}
            >
              Browse Skills
            </button>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <p className="text-xs text-[#0B0B0A]/40 mb-4 font-bold uppercase tracking-wider">
              <span className="text-[#0B0B0A] font-bold text-base mr-1">{exchanges.length}</span> verified exchanges
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