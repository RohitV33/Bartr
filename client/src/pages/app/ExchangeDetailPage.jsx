import { PaperPlaneTilt, ArrowLeft, CheckCircle, XCircle, Clock, Lightning, Star, ShieldWarning, ChatText, Check, Paperclip, FileText, ArrowSquareOut, DownloadSimple } from '@phosphor-icons/react'
import { exchangesApi, reviewsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import { Avatar, Spinner, Stars } from '../../components/shared.jsx'
import { timeAgo, exchangeStatusLabel, extractError } from '../../utils/helpers.js'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton, AiResultCard } from '../../components/ai/AiAssistButton.jsx'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.08})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(18px)',transition:'opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

/* ─── Status config ──────────────────────────────────────────────────────────── */
const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED']
const STATUS_META = {
  PENDING:     { icon: Clock,        color:'text-bartr-text',   bg:'bg-bartr-surface border-2 border-bartr-border',    bar:'bg-bartr-border',   label:'Pending' },
  ACCEPTED:    { icon: Check,        color:'text-bartr-text',   bg:'bg-bartr-surface border-2 border-bartr-border',    bar:'bg-bartr-text',    label:'Accepted' },
  IN_PROGRESS: { icon: Lightning,          color:'text-bartr-bg',     bg:'bg-bartr-text border-2 border-bartr-border',      bar:'bg-bartr-text',  label:'In Progress' },
  COMPLETED:   { icon: CheckCircle, color:'text-bartr-text',   bg:'bg-bartr-surface border-2 border-bartr-border shadow-[2px_2px_0px_var(--border)]',  bar:'bg-bartr-text', label:'Completed' },
  CANCELLED:   { icon: XCircle,      color:'text-bartr-muted',  bg:'bg-bartr-bg border border-bartr-border',      bar:'bg-bartr-border',     label:'Cancelled' },
  DISPUTED:    { icon: ShieldWarning,  color:'text-red-500',      bg:'bg-red-500/10 border-2 border-red-500',    bar:'bg-red-500',  label:'Disputed' },
}

/* ─── Status Timeline ────────────────────────────────────────────────────────── */
function StatusTimeline({ status }) {
  const idx = STATUS_STEPS.indexOf(status)
  const meta = STATUS_META[status] || STATUS_META.PENDING

  if (status === 'CANCELLED' || status === 'DISPUTED') {
    const Icon = meta.icon
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2 ${meta.bg} ${meta.color}`} style={{fontFamily:"'Sora',sans-serif"}}>
        <Icon className="w-3.5 h-3.5" /> {meta.label}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {STATUS_STEPS.map((s, i) => {
        const m = STATUS_META[s]; const done = i <= idx; const Icon = m.icon
        return (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${done ? 'bg-bartr-text text-bartr-bg border-bartr-border' : 'bg-bartr-surface text-bartr-muted border-bartr-border'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            {i < STATUS_STEPS.length - 1 && <div className={`h-0.5 w-6 rounded-full transition-all duration-500 ${i < idx ? 'bg-bartr-text' : 'bg-bartr-border'}`} />}
          </div>
        )
      })}
      <span className={`ml-1 text-xs font-bold text-bartr-text`} style={{fontFamily:"'Sora',sans-serif"}}>{meta.label}</span>
    </div>
  )
}

/* ─── Review Modal ───────────────────────────────────────────────────────────── */
function ReviewModal({ exchange, userId, onClose }) {
  const qc = useQueryClient()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const revieweeId = exchange.offerer_id === userId ? exchange.requester_id : exchange.offerer_id

  const mutation = useMutation({
    mutationFn: () => reviewsApi.submit({ exchange_id: exchange.id, reviewee_id: revieweeId, rating, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QUERY_KEYS.EXCHANGE(exchange.id) }); onClose() },
    onError: () => {},
  })

  const errorMsg = mutation.error?.response?.data?.message ?? null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-bartr-surface border-2 border-bartr-border rounded-3xl p-7 max-w-md w-full"
        style={{boxShadow:'6px 6px 0px var(--border)', animation:'modalIn .3s cubic-bezier(.34,1.56,.64,1)'}}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-bartr-text/10 border-2 border-bartr-border flex items-center justify-center">
            <Star className="w-6 h-6 text-bartr-text fill-bartr-text" />
          </div>
          <div>
            <h3 className="font-black text-bartr-text text-lg" style={{fontFamily:"'Sora',sans-serif"}}>Leave a Review</h3>
            <p className="text-xs text-bartr-muted font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>How was your skill exchange?</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} className="transition-all hover:scale-110 active:scale-95 focus:outline-none">
              <Star className={`w-9 h-9 transition-all duration-150 ${n <= rating ? 'text-bartr-text fill-bartr-text scale-110' : 'text-bartr-muted fill-transparent border-bartr-border'}`} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience (optional)…"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-bartr-bg border-2 border-bartr-border text-sm text-bartr-text focus:outline-none focus:border-bartr-text resize-none mb-5 transition-all"
          style={{fontFamily:"'DM Sans',sans-serif"}}
        />

        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-xl bg-red-500/10 border-2 border-red-500 text-red-500 text-xs font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-bartr-border text-sm font-bold text-bartr-text hover:bg-bartr-bg transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 py-3 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-sm font-bold hover:bg-bartr-text/90 transition-all shadow-[3px_3px_0px_var(--border)] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
            style={{fontFamily:"'Sora',sans-serif"}}
          >
            {mutation.isPending ? <div className="w-4 h-4 border-2 border-bartr-bg border-t-transparent rounded-full animate-spin" /> : '⭐ Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Message Bubble ─────────────────────────────────────────────────────────── */
function MessageBubble({ msg, isMine }) {
  const isFile = msg.message_type === 'FILE' && msg.file_url
  const isImage = isFile && /\.(jpg|jpeg|png|webp|gif)$/i.test(msg.file_url)

  return (
    <div className={`flex gap-2 group ${isMine ? 'flex-row-reverse' : ''}`}
      style={{animation:'msgIn .3s cubic-bezier(.34,1.56,.64,1)'}}>
      {!isMine && <Avatar src={msg.sender?.avatar_url} name={msg.sender?.full_name} size="xs" className="mt-auto mb-0.5 shrink-0" />}
      <div className={`max-w-[72%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl text-sm leading-relaxed border-2 border-bartr-border transition-all shadow-sm ${
          isMine
            ? 'bg-bartr-text text-bartr-bg rounded-tr-sm'
            : 'bg-bartr-surface text-bartr-text rounded-tl-sm'
        } ${isFile ? 'p-1' : 'px-4 py-2.5'}`} style={{fontFamily:"'DM Sans',sans-serif"}}>
          
          {isImage ? (
            <a href={msg.file_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/10">
              <img src={msg.file_url} alt="Attached" className="max-w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-500" />
            </a>
          ) : isFile ? (
            <a href={msg.file_url} target="_blank" rel="noreferrer" 
               className={`flex items-center gap-3 px-4 py-3 rounded-xl border group/file transition-all ${isMine ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-bartr-bg border-bartr-border hover:border-bartr-text'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isMine ? 'bg-white/20 text-white' : 'bg-bartr-surface text-bartr-text border border-bartr-border'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-xs font-bold truncate ${isMine ? 'text-white' : 'text-bartr-text'}`}>{msg.file_url.split('/').pop().split('?')[0] || 'Attachment'}</p>
                <p className={`text-[10px] ${isMine ? 'text-white/60' : 'text-bartr-muted'}`}>Click to view file</p>
              </div>
              <DownloadSimple className={`w-4 h-4 shrink-0 opacity-40 group-hover/file:opacity-100 transition-opacity ${isMine ? 'text-white' : 'text-bartr-text'}`} />
            </a>
          ) : (
            msg.content
          )}
        </div>
        <p className="text-[10px] text-bartr-muted mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{fontFamily:"'DM Sans',sans-serif"}}>
          {timeAgo(msg.created_at)}
        </p>
      </div>
    </div>
  )
}

/* ─── Typing Indicator ───────────────────────────────────────────────────────── */
function TypingIndicator({ name }) {
  return (
    <div className="flex gap-2 items-end">
      <div className="bg-bartr-surface border-2 border-bartr-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-bartr-text rounded-full animate-bounce" style={{animationDelay:`${i*.15}s`}} />)}
      </div>
      <span className="text-xs text-bartr-muted mb-2 font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>{name} is typing…</span>
    </div>
  )
}

/* ─── Action Bar ─────────────────────────────────────────────────────────────── */
function ActionBar({ exchange, isOfferer, actionMutation, onReview }) {
  const pending = actionMutation.isPending
  const act = (action) => actionMutation.mutate({ action })
  const myConfirmed = isOfferer ? exchange.offerer_confirmed : exchange.requester_confirmed

  return (
    <div className="flex gap-2.5 mt-4 flex-wrap">
      {exchange.status === 'PENDING' && !isOfferer && (
        <>
          <button onClick={() => act('accept')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-xs font-bold hover:bg-bartr-text/90 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{fontFamily:"'Sora',sans-serif"}}>
            <CheckCircle className="w-3.5 h-3.5" /> Accept
          </button>
          <button onClick={() => act('decline')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border-2 border-red-500 text-xs font-bold hover:bg-red-500/20 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{fontFamily:"'Sora',sans-serif"}}>
            <XCircle className="w-3.5 h-3.5" /> Decline
          </button>
        </>
      )}
      {['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status) && (
        <>
          <button onClick={() => act('complete')} disabled={pending || myConfirmed}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 border-bartr-border transition-all ${myConfirmed ? 'bg-bartr-surface text-bartr-muted border-bartr-border cursor-default shadow-none' : 'bg-bartr-text text-bartr-bg hover:bg-bartr-text/90 shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none'}`} style={{fontFamily:"'Sora',sans-serif"}}>
            <CheckCircle className="w-3.5 h-3.5" /> {myConfirmed ? 'Confirmed ✓' : 'Mark Complete'}
          </button>
          <button onClick={() => act('cancel')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bartr-surface text-bartr-text border-2 border-bartr-border text-xs font-bold hover:bg-bartr-bg transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{fontFamily:"'Sora',sans-serif"}}>
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
          <button onClick={() => act('dispute')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border-2 border-red-500 text-xs font-bold hover:bg-red-500/20 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{fontFamily:"'Sora',sans-serif"}}>
            <ShieldWarning className="w-3.5 h-3.5" /> Dispute
          </button>
        </>
      )}
      {exchange.status === 'COMPLETED' && !exchange.reviews?.some(r => r.reviewer_id === exchange.offerer_id) && (
        <button onClick={onReview}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bartr-text text-bartr-bg border-2 border-bartr-border text-xs font-bold hover:bg-bartr-text/90 transition-all shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none" style={{fontFamily:"'Sora',sans-serif"}}>
          <Star className="w-3.5 h-3.5 fill-current" /> Leave Review
        </button>
      )}
    </div>
  )
}

/* ─── ExchangeDetailPage ─────────────────────────────────────────────────────── */
export default function ExchangeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { socket, joinExchangeRoom, leaveExchangeRoom, emitTypingStart, emitTypingStop, isOnline } = useSocket()
  const qc = useQueryClient()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const [input, setInput] = useState('')
  const [fileUploading, setFileUploading] = useState(false)
  const [liveMessages, setLiveMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [showReview, setShowReview] = useState(false)
  const typingTimer = useRef(null)

  const [aiCoachLoading, setAiCoachLoading] = useState(false)
  const [aiCoachSuggestion, setAiCoachSuggestion] = useState(null)

  const handleAiCoach = async () => {
    try {
      setAiCoachLoading(true)
      const res = await aiApi.coachExchange({ exchangeId: id })
      setAiCoachSuggestion(res.data.data.suggestion)
    } catch (err) {
      console.error(err)
    } finally {
      setAiCoachLoading(false)
    }
  }

  const useAiSuggestion = () => {
    setInput(aiCoachSuggestion)
    setAiCoachSuggestion(null)
    inputRef.current?.focus()
  }

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

  useEffect(() => {
    if (!exchange) return
    joinExchangeRoom(id)
    return () => leaveExchangeRoom(id)
  }, [id, exchange, joinExchangeRoom, leaveExchangeRoom])

  useEffect(() => {
    if (!socket) return
    const onMsg = ({ message }) => {
      // Optimistically we already added our own sent messages,
      // but for received messages or ensuring ID consistency:
      setLiveMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message])
      qc.invalidateQueries({ queryKey: QUERY_KEYS.MESSAGES(id) }) // Sync history
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
    const onTypingStart = ({ userId: uid, full_name }) => { if (uid !== user?.id) setTypingUsers(prev => [...new Set([...prev, full_name])]) }
    const onTypingStop = ({ userId: uid }) => { setTypingUsers(prev => prev.slice(1)) }
    socket.on('exchange:new_message', onMsg)
    socket.on('typing_start', onTypingStart)
    socket.on('typing_stop', onTypingStop)
    return () => { socket.off('exchange:new_message', onMsg); socket.off('typing_start', onTypingStart); socket.off('typing_stop', onTypingStop) }
  }, [socket, user?.id])

  useEffect(() => { if (exchange) exchangesApi.markMessagesRead(id).catch(() => {}) }, [id, exchange])
  useEffect(() => { messagesEndRef.current?.scrollIntoView() }, [historyMessages])

  const allMessages = [...historyMessages, ...liveMessages.filter(m => !historyMessages.some(h => h.id === m.id))]

  const sendMutation = useMutation({ mutationFn: (content) => exchangesApi.sendMessage(id, content) })

  const actionMutation = useMutation({
    mutationFn: ({ action }) => ({ accept:()=>exchangesApi.accept(id), decline:()=>exchangesApi.decline(id), complete:()=>exchangesApi.complete(id), cancel:()=>exchangesApi.cancel(id), dispute:()=>exchangesApi.dispute(id) }[action]()),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.EXCHANGE(id) }),
  })

  const handleSend = useCallback(({ content, file_url, message_type = 'TEXT' }) => {
    const text = content?.trim()
    if (!text && !file_url) return
    
    emitTypingStop(id)
    clearTimeout(typingTimer.current)
    
    socket.emit('send_message', { exchangeId: id, content: text, file_url, message_type })
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }), 50)
  }, [id, user, emitTypingStop, socket])

  const handleTextSend = () => {
    if (!input.trim()) return
    handleSend({ content: input })
    setInput('')
  }

  const handleFileClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      setFileUploading(true)
      const fd = new FormData(); fd.append('file', file)
      const res = await exchangesApi.uploadFile(id, fd)
      const { file_url } = res.data.data
      
      handleSend({ file_url, message_type: 'FILE' })
    } catch (err) {
      console.error('File upload error:', err)
      alert(extractError(err))
    } finally {
      setFileUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    emitTypingStart(id)
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => emitTypingStop(id), 2000)
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSend() } }

  if (isLoading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  if (!exchange) return <div className="text-center py-24"><p className="text-bartr-muted font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>Exchange not found.</p></div>

  const isOfferer = exchange.offerer_id === user?.id
  const partner = isOfferer ? exchange.requester : exchange.offerer
  const mySkill = isOfferer ? exchange.offered_skill : exchange.requested_skill
  const theirSkill = isOfferer ? exchange.requested_skill : exchange.offered_skill
  const canChat = ['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status)
  const partnerOnline = isOnline(partner?.id)
  const statusMeta = STATUS_META[exchange.status] || STATUS_META.PENDING

  return (
    <div className="max-w-4xl mx-auto pb-8 px-4" >
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Back */}
      <Reveal delay={0}>
        <button onClick={() => navigate('/exchanges')} className="flex items-center gap-2 text-sm text-bartr-muted hover:text-bartr-text mb-5 transition-colors group" style={{fontFamily:"'DM Sans',sans-serif"}}>
          <div className="w-7 h-7 rounded-full bg-bartr-surface border border-bartr-border flex items-center justify-center group-hover:bg-bartr-text/10 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 text-bartr-text" />
          </div>
          Back to exchanges
        </button>
      </Reveal>

      {/* Exchange Header */}
      <Reveal delay={60}>
        <div className="relative bg-bartr-surface rounded-2xl border-2 border-bartr-border shadow-[4px_4px_0px_var(--border)] overflow-hidden mb-8">
          <div className="p-6 pt-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Partner info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${partnerOnline ? 'ring-2 ring-bartr-text ring-offset-2' : ''}`} />
                  <Avatar src={partner.avatar_url} name={partner.full_name} size="md" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-bartr-bg ${partnerOnline ? 'bg-bartr-text' : 'bg-bartr-muted'}`} />
                </div>
                <div>
                  <p className="font-black text-bartr-text text-base" style={{fontFamily:"'Sora',sans-serif"}}>{partner.full_name}</p>
                  <p className="text-xs text-bartr-muted font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>{partner.university}</p>
                  <p className={`text-[10px] font-black ${partnerOnline ? 'text-bartr-text' : 'text-bartr-muted'}`} style={{fontFamily:"'Sora',sans-serif"}}>
                    {partnerOnline ? '● Online now' : '● Offline'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusTimeline status={exchange.status} />
                <p className="text-[10px] text-bartr-muted font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>Started {timeAgo(exchange.created_at)}</p>
              </div>
            </div>

            {/* Skill swap */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span className="text-xs font-black bg-bartr-text text-bartr-bg border-2 border-bartr-border px-3 py-1.5 rounded-xl" style={{fontFamily:"'Sora',sans-serif"}}>{mySkill?.title}</span>
              <div className="flex items-center gap-1 text-bartr-border">
                <div className="w-6 h-0.5 bg-bartr-border" />
                <span className="text-sm font-black">↔</span>
                <div className="w-6 h-0.5 bg-bartr-border" />
              </div>
              <span className="text-xs font-black bg-bartr-surface text-bartr-text border-2 border-bartr-border px-3 py-1.5 rounded-xl" style={{fontFamily:"'Sora',sans-serif"}}>{theirSkill?.title}</span>
            </div>

            <ActionBar exchange={exchange} isOfferer={isOfferer} actionMutation={actionMutation} onReview={() => setShowReview(true)} />
          </div>
        </div>
      </Reveal>

      {/* Chat Card */}
      <Reveal delay={120}>
        <div className="bg-bartr-surface rounded-2xl border-2 border-bartr-border shadow-[4px_4px_0px_var(--border)] overflow-hidden flex flex-col" style={{height:520}}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-bartr-border bg-bartr-bg shrink-0">
            <div className="w-8 h-8 bg-bartr-text text-bartr-bg rounded-lg flex items-center justify-center border border-bartr-border">
              <ChatText className="w-4 h-4 text-bartr-bg" />
            </div>
            <div>
              <p className="text-sm font-black text-bartr-text" style={{fontFamily:"'Sora',sans-serif"}}>Messages</p>
              {allMessages.length > 0 && <p className="text-[10px] text-bartr-muted font-bold" style={{fontFamily:"'DM Sans',sans-serif"}}>{allMessages.length} messages</p>}
            </div>
            {canChat && (
              <div className="ml-auto flex items-center gap-1.5 bg-bartr-bg border-2 border-bartr-border px-2.5 py-1 rounded-lg">
                <div className="w-2 h-2 bg-bartr-text rounded-full animate-pulse" />
                <span className="text-[10px] text-bartr-text font-black" style={{fontFamily:"'Sora',sans-serif"}}>LIVE</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
            {allMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-14 h-14 rounded-2xl bg-bartr-bg border-2 border-bartr-border flex items-center justify-center">
                  <ChatText className="w-7 h-7 text-bartr-border" />
                </div>
                <p className="text-sm text-bartr-muted text-center max-w-xs font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>
                  {canChat ? 'No messages yet. Say hello! 👋' : 'The exchange must be accepted before you can chat.'}
                </p>
              </div>
            )}

            {allMessages.map(msg => <MessageBubble key={msg.id} msg={msg} isMine={msg.sender_id === user?.id} />)}
            {typingUsers.length > 0 && <TypingIndicator name={typingUsers[0]} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-bartr-border bg-bartr-surface px-4 py-3 flex gap-2.5 shrink-0 relative">
            
            {/* AI Coach Suggestion Popup */}
            {aiCoachSuggestion && (
              <div className="absolute bottom-full left-0 right-0 p-4 pb-2 z-10">
                <AiResultCard 
                  title="✨ AI Exchange Coach"
                  content={
                    <div>
                      <p className="mb-3 font-medium text-bartr-text">{aiCoachSuggestion}</p>
                      <button onClick={useAiSuggestion} className="bg-bartr-text text-bartr-bg border-2 border-bartr-border px-3 py-1.5 rounded-lg text-xs font-bold shadow-[2px_2px_0px_var(--border)] hover:bg-bartr-text/90 transition-colors">
                        Use Suggestion
                      </button>
                    </div>
                  } 
                  onClose={() => setAiCoachSuggestion(null)}
                  className="shadow-[4px_4px_0px_var(--border)] border-2 border-bartr-border bg-bartr-surface"
                />
              </div>
            )}

            <div className="flex-1 flex bg-bartr-bg rounded-xl border-2 border-bartr-border focus-within:border-bartr-text focus-within:bg-bartr-bg transition-all overflow-hidden items-center group/input">
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={!canChat}
                placeholder={canChat ? 'Type a message… (Enter to send)' : 'Accept the exchange to start chatting'}
                className="flex-1 pr-4 py-3 text-sm focus:outline-none bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-all text-bartr-text placeholder-bartr-muted font-medium"
                style={{fontFamily:"'DM Sans',sans-serif"}}
              />
              {canChat && (
                <div className="px-2">
                  <AiAssistButton 
                    label="Coach" 
                    variant="glow"
                    isLoading={aiCoachLoading}
                    onClick={handleAiCoach}
                    className="py-1 px-3 text-[10px] rounded-lg shadow-sm border border-transparent"
                  />
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileClick}
              disabled={!canChat || fileUploading}
              className="w-11 h-11 bg-bartr-surface text-bartr-text border-2 border-bartr-border rounded-xl flex items-center justify-center hover:bg-bartr-text/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shrink-0 shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none"
              title="Attach File or Photo"
            >
              {fileUploading ? (
                <div className="w-5 h-5 border-2 border-bartr-text border-t-transparent rounded-full animate-spin" />
              ) : (
                <Paperclip className="w-5 h-5" weight="bold" />
              )}
            </button>
            
            <button
              onClick={handleTextSend}
              disabled={!canChat || !input.trim()}
              className="w-11 h-11 bg-bartr-text text-bartr-bg border-2 border-bartr-border rounded-xl flex items-center justify-center hover:bg-bartr-text/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shrink-0 shadow-[2px_2px_0px_var(--border)] active:translate-y-[1px] active:shadow-none"
            >
              <PaperPlaneTilt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {showReview && <ReviewModal exchange={exchange} userId={user?.id} onClose={() => setShowReview(false)} />}
    </div>
  )
}