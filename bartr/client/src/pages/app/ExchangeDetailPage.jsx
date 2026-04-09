import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Send, AlertCircle, ArrowLeft, CheckCircle2, XCircle,
  Clock, Zap, Star, ShieldAlert, MessageCircle, Check,
} from 'lucide-react'
import { exchangesApi, reviewsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import {
  Avatar, Card, Spinner, Button, Badge, Stars,
} from '../../components/shared.jsx'
import { timeAgo, exchangeStatusColor, exchangeStatusLabel, extractError } from '../../utils/helpers.js'

// ─── Reveal ──────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.12 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Status steps ─────────────────────────────────────────────────────────────
const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED']

const STATUS_META = {
  PENDING:     { icon: Clock,        color: 'text-amber-500',  bg: 'bg-amber-50',   label: 'Pending' },
  ACCEPTED:    { icon: Check,        color: 'text-blue-500',   bg: 'bg-blue-50',    label: 'Accepted' },
  IN_PROGRESS: { icon: Zap,          color: 'text-violet-500', bg: 'bg-violet-50',  label: 'In Progress' },
  COMPLETED:   { icon: CheckCircle2, color: 'text-emerald-500',bg: 'bg-emerald-50', label: 'Completed' },
  CANCELLED:   { icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-50',     label: 'Cancelled' },
  DISPUTED:    { icon: ShieldAlert,  color: 'text-orange-500', bg: 'bg-orange-50',  label: 'Disputed' },
}

function StatusTimeline({ status }) {
  const idx = STATUS_STEPS.indexOf(status)
  const meta = STATUS_META[status] || STATUS_META.PENDING

  if (status === 'CANCELLED' || status === 'DISPUTED') {
    const Icon = meta.icon
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold font-sora px-3 py-1.5 rounded-full ${meta.bg} ${meta.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {meta.label}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {STATUS_STEPS.map((s, i) => {
        const m = STATUS_META[s]
        const done = i <= idx
        const Icon = m.icon
        return (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${done ? `${m.bg} ${m.color}` : 'bg-gray-100 text-gray-300'}`}
              title={m.label}
            >
              <Icon className="w-3 h-3" />
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-5 rounded-full transition-all duration-500 ${i < idx ? 'bg-emerald-300' : 'bg-gray-150'}`} />
            )}
          </div>
        )
      })}
      <span className={`ml-1 text-xs font-semibold font-sora ${meta.color}`}>
        {meta.label}
      </span>
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────
function ReviewModal({ exchange, userId, onClose }) {
  const qc = useQueryClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const revieweeId = exchange.offerer_id === userId ? exchange.requester_id : exchange.offerer_id

  const mutation = useMutation({
    mutationFn: () => reviewsApi.submit({ exchange_id: exchange.id, reviewee_id: revieweeId, rating, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.EXCHANGE(exchange.id) })
      onClose()
    },
  })

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-7 max-w-md w-full border border-gray-100"
        style={{ boxShadow: '0 24px 64px -12px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h3 className="font-sora font-bold text-gray-900 text-lg leading-tight">Leave a review</h3>
            <p className="text-xs text-gray-400 font-dm">How was your skill exchange?</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-1.5 mb-5">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-100'}`}
              />
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience (optional)…"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-yellow-300 resize-none mb-5 bg-gray-50/60 placeholder:text-gray-300"
        />

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            className="flex-1"
          >
            Submit review
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Skill Chip ───────────────────────────────────────────────────────────────
function SkillChip({ label, variant = 'green' }) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue:  'bg-blue-50 text-blue-700 border-blue-100',
  }
  return (
    <span className={`inline-flex items-center text-xs font-sora font-semibold px-2.5 py-1 rounded-xl border ${colors[variant]}`}>
      {label}
    </span>
  )
}

// ─── Action Buttons ───────────────────────────────────────────────────────────
function ActionBar({ exchange, isOfferer, actionMutation, onReview }) {
  const pending = actionMutation.isPending
  const act = (action) => actionMutation.mutate({ action })

  const myConfirmed = isOfferer ? exchange.offerer_confirmed : exchange.requester_confirmed

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {exchange.status === 'PENDING' && !isOfferer && (
        <>
          <Button
            variant="primary" size="sm"
            onClick={() => act('accept')} loading={pending}
            className="gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Accept
          </Button>
          <Button
            variant="danger" size="sm"
            onClick={() => act('decline')} loading={pending}
            className="gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" /> Decline
          </Button>
        </>
      )}

      {['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status) && (
        <>
          <Button
            variant={myConfirmed ? 'ghost' : 'primary'} size="sm"
            onClick={() => act('complete')} loading={pending}
            className="gap-1.5"
            disabled={myConfirmed}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {myConfirmed ? 'Confirmed ✓' : 'Mark complete'}
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => act('cancel')}
            className="gap-1.5 text-gray-500"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </Button>
          <Button
            variant="ghost" size="sm"
            onClick={() => act('dispute')}
            className="gap-1.5 text-red-500 hover:bg-red-50"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Dispute
          </Button>
        </>
      )}

      {exchange.status === 'COMPLETED' && !exchange.reviews?.some(r => r.reviewer_id === exchange.offerer_id) && (
        <Button
          variant="yellow" size="sm"
          onClick={onReview}
          className="gap-1.5"
        >
          <Star className="w-3.5 h-3.5 fill-current" /> Leave review
        </Button>
      )}
    </div>
  )
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }) {
  return (
    <div className={`flex gap-2 group ${isMine ? 'flex-row-reverse' : ''}`}>
      {!isMine && (
        <Avatar
          src={msg.sender?.avatar_url}
          name={msg.sender?.full_name}
          size="xs"
          className="mt-auto mb-0.5 shrink-0"
        />
      )}
      <div className={`max-w-[72%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm font-dm leading-relaxed transition-all ${
            isMine
              ? 'bg-bartr-dark text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-900 rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>
        <p className="text-[10px] text-gray-400 font-dm mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {timeAgo(msg.created_at)}
        </p>
      </div>
    </div>
  )
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator({ name }) {
  return (
    <div className="flex gap-2 items-end">
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 font-dm mb-2">{name} is typing…</span>
    </div>
  )
}

// ─── ExchangeDetailPage ───────────────────────────────────────────────────────
export default function ExchangeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { socket, joinExchangeRoom, leaveExchangeRoom, emitTypingStart, emitTypingStop, isOnline } = useSocket()
  const qc = useQueryClient()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [input, setInput] = useState('')
  const [liveMessages, setLiveMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const typingTimer = useRef(null)

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: exchange, isLoading } = useQuery({
    queryKey: QUERY_KEYS.EXCHANGE(id),
    queryFn: () => exchangesApi.get(id).then(r => r.data.data.exchange),
  })

  const { data: msgData } = useQuery({
    queryKey: QUERY_KEYS.MESSAGES(id),
    queryFn: () => exchangesApi.getMessages(id, { limit: 100 }).then(r => r.data.data),
    enabled: !!exchange,
  })
  const historyMessages = msgData || []

  // ── Socket ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!exchange) return
    joinExchangeRoom(id)
    return () => leaveExchangeRoom(id)
  }, [id, exchange, joinExchangeRoom, leaveExchangeRoom])

  useEffect(() => {
    if (!socket) return
    const onMessage = ({ message }) => {
      setLiveMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    const onTypingStart = ({ userId: uid, full_name }) => {
      if (uid !== user?.id) setTypingUsers(prev => [...new Set([...prev, full_name])])
    }
    const onTypingStop = ({ userId: uid }) => {
      setTypingUsers(prev => prev.slice(1))
    }
    socket.on('exchange:new_message', onMessage)
    socket.on('typing_start', onTypingStart)
    socket.on('typing_stop', onTypingStop)
    return () => {
      socket.off('exchange:new_message', onMessage)
      socket.off('typing_start', onTypingStart)
      socket.off('typing_stop', onTypingStop)
    }
  }, [socket, user?.id])

  useEffect(() => {
    if (exchange) exchangesApi.markMessagesRead(id).catch(() => {})
  }, [id, exchange])

  useEffect(() => { messagesEndRef.current?.scrollIntoView() }, [historyMessages])

  const allMessages = [
    ...historyMessages,
    ...liveMessages.filter(m => !historyMessages.some(h => h.id === m.id)),
  ]

  // ── Mutations ──────────────────────────────────────────────────────────────
  const sendMutation = useMutation({
    mutationFn: (content) => exchangesApi.sendMessage(id, content),
  })

  const actionMutation = useMutation({
    mutationFn: ({ action }) => ({
      accept:  () => exchangesApi.accept(id),
      decline: () => exchangesApi.decline(id),
      complete:() => exchangesApi.complete(id),
      cancel:  () => exchangesApi.cancel(id),
      dispute: () => exchangesApi.dispute(id),
    }[action]()),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.EXCHANGE(id) }),
  })

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const content = input.trim()
    if (!content) return
    setInput('')
    emitTypingStop(id)
    clearTimeout(typingTimer.current)
    setLiveMessages(prev => [...prev, {
      id: `opt-${Date.now()}`,
      sender_id: user?.id,
      sender: user,
      content,
      created_at: new Date().toISOString(),
    }])
    sendMutation.mutate(content)
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [input, id, user, emitTypingStop, sendMutation])

  const handleInputChange = (e) => {
    setInput(e.target.value)
    emitTypingStart(id)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => emitTypingStop(id), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="flex justify-center py-24">
      <Spinner size="lg" />
    </div>
  )
  if (!exchange) return (
    <div className="text-center py-24">
      <p className="text-gray-400 font-dm">Exchange not found.</p>
    </div>
  )

  const isOfferer = exchange.offerer_id === user?.id
  const partner = isOfferer ? exchange.requester : exchange.offerer
  const mySkill = isOfferer ? exchange.offered_skill : exchange.requested_skill
  const theirSkill = isOfferer ? exchange.requested_skill : exchange.offered_skill
  const canChat = ['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status)
  const isCompleted = exchange.status === 'COMPLETED'
  const hasReviewed = exchange.reviews?.some(r => r.reviewer_id === user?.id)
  const partnerOnline = isOnline(partner?.id)

  return (
    <div className="max-w-4xl mx-auto pb-8">

      {/* Back nav */}
      <Reveal delay={0}>
        <button
          onClick={() => navigate('/exchanges')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 font-dm mb-5 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to exchanges
        </button>
      </Reveal>

      {/* ── Exchange Header Card ─────────────────────────────────────────── */}
      <Reveal delay={60}>
        <Card className="p-5 mb-4 border border-gray-100 hover:-translate-y-0 rounded-3xl overflow-hidden">

          {/* Subtle top accent strip matching status */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 ${
            exchange.status === 'COMPLETED'   ? 'bg-emerald-200' :
            exchange.status === 'IN_PROGRESS' ? 'bg-violet-200' :
            exchange.status === 'ACCEPTED'    ? 'bg-blue-200' :
            exchange.status === 'CANCELLED'   ? 'bg-red-200' :
            exchange.status === 'DISPUTED'    ? 'bg-orange-200' :
            'bg-amber-200'
          }`} />

          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Partner info */}
            <div className="flex items-center gap-3">
              <Avatar
                src={partner.avatar_url}
                name={partner.full_name}
                size="md"
                online={partnerOnline}
              />
              <div>
                <p className="font-sora font-bold text-gray-900 leading-tight">{partner.full_name}</p>
                <p className="text-xs text-gray-400 font-dm mt-0.5">{partner.university}</p>
                <p className={`text-[10px] font-dm mt-1 ${partnerOnline ? 'text-emerald-500' : 'text-gray-300'}`}>
                  {partnerOnline ? '● Online now' : '● Offline'}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col items-end gap-2">
              <StatusTimeline status={exchange.status} />
              <p className="text-[10px] text-gray-300 font-dm">
                Started {timeAgo(exchange.created_at)}
              </p>
            </div>
          </div>

          {/* Skill swap row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <SkillChip label={mySkill?.title} variant="green" />
            <div className="flex items-center gap-0.5 text-gray-300">
              <div className="w-8 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-dm px-1">↔</span>
              <div className="w-8 h-px bg-gray-200" />
            </div>
            <SkillChip label={theirSkill?.title} variant="blue" />
          </div>

          {/* Actions */}
          <ActionBar
            exchange={exchange}
            isOfferer={isOfferer}
            actionMutation={actionMutation}
            onReview={() => setShowReview(true)}
          />
        </Card>
      </Reveal>

      {/* ── Chat Card ───────────────────────────────────────────────────── */}
      <Reveal delay={120}>
        <Card className="flex flex-col rounded-3xl border border-gray-100 overflow-hidden" style={{ height: '500px' }}>

          {/* Chat Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 bg-gray-50/60 shrink-0">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-sora font-semibold text-gray-700">Messages</span>
            {allMessages.length > 0 && (
              <span className="ml-auto text-xs text-gray-300 font-dm">{allMessages.length} messages</span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {allMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-dm text-center max-w-xs">
                  {canChat
                    ? 'No messages yet. Say hello!'
                    : 'The exchange must be accepted before you can chat.'}
                </p>
              </div>
            )}

            {allMessages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMine={msg.sender_id === user?.id}
              />
            ))}

            {typingUsers.length > 0 && <TypingIndicator name={typingUsers[0]} />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-gray-100 bg-white px-3 py-3 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={!canChat}
              placeholder={canChat ? 'Type a message… (Enter to send)' : 'Accept the exchange to start chatting'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all placeholder:text-gray-300"
            />
            <button
              onClick={handleSend}
              disabled={!canChat || !input.trim()}
              className="w-10 h-10 bg-bartr-dark text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </Reveal>

      {/* Review Modal */}
      {showReview && (
        <ReviewModal
          exchange={exchange}
          userId={user?.id}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  )
}