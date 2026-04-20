 import { Send, ArrowLeft, CheckCircle2, XCircle,
  Clock, Zap, Star, ShieldAlert, MessageCircle, Check,
  Paperclip, FileText, ExternalLink, Download,
} from 'lucide-react'
import { exchangesApi, reviewsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import { Avatar, Spinner, Stars } from '../../components/shared.jsx'
import { timeAgo, exchangeStatusLabel, extractError } from '../../utils/helpers.js'
import { aiApi } from '../../api/ai.js'
import { AiAssistButton, AiResultCard } from '../../components/ai/AiAssistButton.jsx'


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
  PENDING:     { icon: Clock,        color:'text-amber-500',   bg:'bg-amber-50',    bar:'bg-amber-400',   label:'Pending' },
  ACCEPTED:    { icon: Check,        color:'text-blue-500',    bg:'bg-blue-50',     bar:'bg-blue-400',    label:'Accepted' },
  IN_PROGRESS: { icon: Zap,          color:'text-violet-500',  bg:'bg-violet-50',   bar:'bg-violet-400',  label:'In Progress' },
  COMPLETED:   { icon: CheckCircle2, color:'text-emerald-500', bg:'bg-emerald-50',  bar:'bg-emerald-400', label:'Completed' },
  CANCELLED:   { icon: XCircle,      color:'text-red-400',     bg:'bg-red-50',      bar:'bg-red-400',     label:'Cancelled' },
  DISPUTED:    { icon: ShieldAlert,  color:'text-orange-500',  bg:'bg-orange-50',   bar:'bg-orange-400',  label:'Disputed' },
}

/* ─── Status Timeline ────────────────────────────────────────────────────────── */
function StatusTimeline({ status }) {
  const idx = STATUS_STEPS.indexOf(status)
  const meta = STATUS_META[status] || STATUS_META.PENDING

  if (status === 'CANCELLED' || status === 'DISPUTED') {
    const Icon = meta.icon
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${meta.bg} ${meta.color}`} style={{fontFamily:"'Sora',sans-serif"}}>
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
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${done ? `${m.bg} ${m.color}` : 'bg-gray-100 text-gray-300'}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            {i < STATUS_STEPS.length - 1 && <div className={`h-0.5 w-6 rounded-full transition-all duration-500 ${i < idx ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
      <span className={`ml-1 text-xs font-bold ${meta.color}`} style={{fontFamily:"'Sora',sans-serif"}}>{meta.label}</span>
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
        className="bg-white rounded-3xl p-7 max-w-md w-full"
        style={{boxShadow:'0 32px 80px rgba(0,0,0,0.2)',animation:'modalIn .4s cubic-bezier(.34,1.56,.64,1)'}}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-lg" style={{fontFamily:"'Sora',sans-serif"}}>Leave a Review</h3>
            <p className="text-xs text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>How was your skill exchange?</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} className="transition-all hover:scale-110 active:scale-95 focus:outline-none">
              <Star className={`w-9 h-9 transition-all duration-150 ${n <= rating ? 'text-amber-400 fill-amber-400 scale-110' : 'text-gray-200 fill-gray-100'}`} />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience (optional)…"
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-amber-400 resize-none mb-5 transition-all"
          style={{fontFamily:"'DM Sans',sans-serif"}}
        />

        {errorMsg && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-600 hover:border-gray-400 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            Cancel
          </button>
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex-1 py-3 rounded-2xl bg-amber-400 text-gray-900 text-sm font-bold hover:bg-amber-300 transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
            style={{fontFamily:"'Sora',sans-serif"}}
          >
            {mutation.isPending ? <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" /> : '⭐ Submit Review'}
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
        <div className={`rounded-2xl text-sm leading-relaxed transition-all shadow-sm ${
          isMine
            ? 'bg-gray-900 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
        } ${isFile ? 'p-1' : 'px-4 py-2.5'}`} style={{fontFamily:"'DM Sans',sans-serif"}}>
          
          {isImage ? (
            <a href={msg.file_url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-white/10">
              <img src={msg.file_url} alt="Attached" className="max-w-full h-auto max-h-60 object-cover hover:scale-105 transition-transform duration-500" />
            </a>
          ) : isFile ? (
            <a href={msg.file_url} target="_blank" rel="noreferrer" 
               className={`flex items-center gap-3 px-4 py-3 rounded-xl border group/file transition-all ${isMine ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isMine ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-500'}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-xs font-bold truncate ${isMine ? 'text-white' : 'text-gray-900'}`}>{msg.file_url.split('/').pop().split('?')[0] || 'Attachment'}</p>
                <p className={`text-[10px] ${isMine ? 'text-white/60' : 'text-gray-400'}`}>Click to view file</p>
              </div>
              <Download className={`w-4 h-4 shrink-0 opacity-40 group-hover/file:opacity-100 transition-opacity ${isMine ? 'text-white' : 'text-gray-900'}`} />
            </a>
          ) : (
            msg.content
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{fontFamily:"'DM Sans',sans-serif"}}>
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
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:`${i*.15}s`}} />)}
      </div>
      <span className="text-xs text-gray-400 mb-2" style={{fontFamily:"'DM Sans',sans-serif"}}>{name} is typing…</span>
    </div>
  )
}

/* ─── Action Bar ─────────────────────────────────────────────────────────────── */
function ActionBar({ exchange, isOfferer, actionMutation, onReview }) {
  const pending = actionMutation.isPending
  const act = (action) => actionMutation.mutate({ action })
  const myConfirmed = isOfferer ? exchange.offerer_confirmed : exchange.requester_confirmed

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {exchange.status === 'PENDING' && !isOfferer && (
        <>
          <button onClick={() => act('accept')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Accept
          </button>
          <button onClick={() => act('decline')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 border border-red-100 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            <XCircle className="w-3.5 h-3.5" /> Decline
          </button>
        </>
      )}
      {['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status) && (
        <>
          <button onClick={() => act('complete')} disabled={pending || myConfirmed}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${myConfirmed ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-gray-700'}`} style={{fontFamily:"'Sora',sans-serif"}}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {myConfirmed ? 'Confirmed ✓' : 'Mark Complete'}
          </button>
          <button onClick={() => act('cancel')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 text-xs font-bold hover:bg-gray-100 border border-gray-200 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
          <button onClick={() => act('dispute')} disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 border border-red-100 transition-all" style={{fontFamily:"'Sora',sans-serif"}}>
            <ShieldAlert className="w-3.5 h-3.5" /> Dispute
          </button>
        </>
      )}
      {exchange.status === 'COMPLETED' && !exchange.reviews?.some(r => r.reviewer_id === exchange.offerer_id) && (
        <button onClick={onReview}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-gray-900 text-xs font-bold hover:bg-amber-300 transition-all shadow-md shadow-amber-200" style={{fontFamily:"'Sora',sans-serif"}}>
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
      setLiveMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    
    // Add optimistic message
    const tempId = `opt-${Date.now()}`
    setLiveMessages(prev => [...prev, { 
      id: tempId, 
      sender_id: user?.id, 
      sender: user, 
      content: text || (message_type === 'FILE' ? 'Sent a file' : ''), 
      file_url,
      message_type,
      created_at: new Date().toISOString() 
    }])
    
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
  if (!exchange) return <div className="text-center py-24"><p className="text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>Exchange not found.</p></div>

  const isOfferer = exchange.offerer_id === user?.id
  const partner = isOfferer ? exchange.requester : exchange.offerer
  const mySkill = isOfferer ? exchange.offered_skill : exchange.requested_skill
  const theirSkill = isOfferer ? exchange.requested_skill : exchange.offered_skill
  const canChat = ['ACCEPTED', 'IN_PROGRESS'].includes(exchange.status)
  const partnerOnline = isOnline(partner?.id)
  const statusMeta = STATUS_META[exchange.status] || STATUS_META.PENDING

  return (
    <div className="max-w-4xl mx-auto pb-8" >
    
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Back */}
      <Reveal delay={0}>
        <button onClick={() => navigate('/exchanges')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors group" style={{fontFamily:"'DM Sans',sans-serif"}}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back to exchanges
        </button>
      </Reveal>

      {/* Exchange Header */}
      <Reveal delay={60}>
        <div className="relative bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {/* Top accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 ${statusMeta.bar}`} />

          <div className="p-6 pt-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Partner info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${partnerOnline ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}`} />
                  <Avatar src={partner.avatar_url} name={partner.full_name} size="md" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${partnerOnline ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-base" style={{fontFamily:"'Sora',sans-serif"}}>{partner.full_name}</p>
                  <p className="text-xs text-gray-400 mb-1" style={{fontFamily:"'DM Sans',sans-serif"}}>{partner.university}</p>
                  <p className={`text-[10px] font-bold ${partnerOnline ? 'text-emerald-500' : 'text-gray-300'}`} style={{fontFamily:"'Sora',sans-serif"}}>
                    {partnerOnline ? '● Online now' : '● Offline'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusTimeline status={exchange.status} />
                <p className="text-[10px] text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>Started {timeAgo(exchange.created_at)}</p>
              </div>
            </div>

            {/* Skill swap */}
            <div className="flex items-center gap-3 mt-5 flex-wrap">
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100" style={{fontFamily:"'Sora',sans-serif"}}>{mySkill?.title}</span>
              <div className="flex items-center gap-1 text-gray-300">
                <div className="w-6 h-px bg-gray-300" />
                <span className="text-sm">↔</span>
                <div className="w-6 h-px bg-gray-300" />
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100" style={{fontFamily:"'Sora',sans-serif"}}>{theirSkill?.title}</span>
            </div>

            <ActionBar exchange={exchange} isOfferer={isOfferer} actionMutation={actionMutation} onReview={() => setShowReview(true)} />
          </div>
        </div>
      </Reveal>

      {/* Chat Card */}
      <Reveal delay={120}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col" style={{height:520}}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 shrink-0">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900" style={{fontFamily:"'Sora',sans-serif"}}>Messages</p>
              {allMessages.length > 0 && <p className="text-[10px] text-gray-400" style={{fontFamily:"'DM Sans',sans-serif"}}>{allMessages.length} messages</p>}
            </div>
            {canChat && (
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-600 font-bold" style={{fontFamily:"'Sora',sans-serif"}}>Live</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scroll-smooth">
            {allMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-gray-200" />
                </div>
                <p className="text-sm text-gray-400 text-center max-w-xs" style={{fontFamily:"'DM Sans',sans-serif"}}>
                  {canChat ? 'No messages yet. Say hello! 👋' : 'The exchange must be accepted before you can chat.'}
                </p>
              </div>
            )}

            {allMessages.map(msg => <MessageBubble key={msg.id} msg={msg} isMine={msg.sender_id === user?.id} />)}
            {typingUsers.length > 0 && <TypingIndicator name={typingUsers[0]} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 bg-white px-4 py-3 flex gap-2.5 shrink-0 relative">
            
            {/* AI Coach Suggestion Popup */}
            {aiCoachSuggestion && (
              <div className="absolute bottom-full left-0 right-0 p-4 pb-2 z-10">
                <AiResultCard 
                  title="✨ AI Exchange Coach"
                  content={
                    <div>
                      <p className="mb-3">{aiCoachSuggestion}</p>
                      <button onClick={useAiSuggestion} className="bg-amber-400 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-amber-300 transition-colors">
                        Use Suggestion
                      </button>
                    </div>
                  } 
                  onClose={() => setAiCoachSuggestion(null)}
                  className="shadow-xl shadow-amber-900/10"
                />
              </div>
            )}

            <div className="flex-1 flex bg-white rounded-2xl border-2 border-gray-200 focus-within:border-amber-400 focus-within:bg-white transition-all overflow-hidden items-center group/input">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleFileClick}
                disabled={!canChat || fileUploading}
                className="pl-3.5 pr-2 py-2 hover:text-amber-500 text-gray-400 transition-colors disabled:opacity-30"
              >
                {fileUploading ? (
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={!canChat}
                placeholder={canChat ? 'Type a message… (Enter to send)' : 'Accept the exchange to start chatting'}
                className="flex-1 pr-4 py-3 text-sm focus:outline-none bg-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
            <button
              onClick={handleTextSend}
              disabled={!canChat || !input.trim()}
              className="w-11 h-11 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90 shrink-0 shadow-lg shadow-gray-900/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>

      {showReview && <ReviewModal exchange={exchange} userId={user?.id} onClose={() => setShowReview(false)} />}
    </div>
  )
}