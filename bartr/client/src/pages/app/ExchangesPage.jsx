import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Clock, Zap, CheckCircle2, XCircle,
  ShieldAlert, RefreshCcw, HandshakeIcon, ChevronRight,
} from 'lucide-react'
import { exchangesApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import {
  Avatar, Card, Spinner, EmptyState, Button, PageHeader, Badge,
} from '../../components/shared.jsx'
import { timeAgo, exchangeStatusColor, exchangeStatusLabel } from '../../utils/helpers.js'

// ─── Reveal ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META = {
  PENDING:     { icon: Clock,        dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  ACCEPTED:    { icon: CheckCircle2, dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700 border-blue-100' },
  IN_PROGRESS: { icon: Zap,          dot: 'bg-violet-400',  badge: 'bg-violet-50 text-violet-700 border-violet-100' },
  COMPLETED:   { icon: CheckCircle2, dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  CANCELLED:   { icon: XCircle,      dot: 'bg-red-300',     badge: 'bg-red-50 text-red-500 border-red-100' },
  DISPUTED:    { icon: ShieldAlert,  dot: 'bg-orange-400',  badge: 'bg-orange-50 text-orange-700 border-orange-100' },
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'PENDING' },
  { label: 'Active',    value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold font-sora px-2 py-0.5 rounded-full border ${meta.badge}`}>
      <Icon className="w-2.5 h-2.5" />
      {exchangeStatusLabel(status)}
    </span>
  )
}

// ─── SkillPill ────────────────────────────────────────────────────────────────
function SkillPill({ label, variant }) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700',
    blue:  'bg-blue-50 text-blue-700',
  }
  return (
    <span className={`text-[11px] font-dm font-medium px-2 py-0.5 rounded-lg truncate max-w-[110px] ${colors[variant]}`}>
      {label}
    </span>
  )
}

// ─── ExchangeRow ─────────────────────────────────────────────────────────────
function ExchangeRow({ ex, isOfferer, onClick, delay }) {
  const partner    = isOfferer ? ex.requester  : ex.offerer
  const mySkill    = isOfferer ? ex.offered_skill   : ex.requested_skill
  const theirSkill = isOfferer ? ex.requested_skill : ex.offered_skill
  const unread     = ex._count?.messages ?? 0
  const meta       = STATUS_META[ex.status] || STATUS_META.PENDING

  return (
    <Reveal delay={delay}>
      <Card
        hover
        onClick={onClick}
        className="p-4 cursor-pointer group border border-gray-100 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
      >
        {/* Left status stripe */}
        <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${meta.dot}`} />

        <div className="flex items-center gap-3 pl-3">
          {/* Avatar */}
          <div className="shrink-0">
            <Avatar src={partner.avatar_url} name={partner.full_name} size="md" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold font-sora text-gray-900 truncate">{partner.full_name}</p>
              <StatusBadge status={ex.status} />
              {unread > 0 && (
                <span className="shrink-0 bg-bartr-dark text-white text-[10px] font-bold font-sora px-1.5 py-0.5 rounded-full leading-none">
                  {unread}
                </span>
              )}
            </div>

            {/* Skill swap */}
            <div className="flex items-center gap-1.5">
              <SkillPill label={mySkill?.title} variant="green" />
              <ArrowRight className="w-3 h-3 text-gray-300 shrink-0" />
              <SkillPill label={theirSkill?.title} variant="blue" />
            </div>
          </div>

          {/* Right: time + chevron */}
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            <p className="text-[11px] text-gray-400 font-dm">{timeAgo(ex.updated_at)}</p>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Card>
    </Reveal>
  )
}

// ─── ExchangesPage ────────────────────────────────────────────────────────────
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
    <div>
      <Reveal delay={0}>
        <PageHeader
          title="My Exchanges"
          subtitle="Track all your skill exchange proposals and sessions"
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/browse')}>
              Browse skills
            </Button>
          }
        />
      </Reveal>

      {/* Tab bar */}
      <Reveal delay={60}>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-6 overflow-x-auto">
          {TABS.map(tab => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setStatus(tab.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold font-sora whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-white text-bartr-dark shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </Reveal>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : exchanges.length === 0 ? (
        <Reveal delay={80}>
          <EmptyState
            icon={<HandshakeIcon className="w-8 h-8 text-gray-300" />}
            title="No exchanges yet"
            description="Browse skills and propose an exchange to get started."
            action={
              <Button variant="primary" size="sm" onClick={() => navigate('/browse')}>
                Browse skills
              </Button>
            }
          />
        </Reveal>
      ) : (
        <div className="space-y-2.5">
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
      )}
    </div>
  )
}