import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Trash2, Sparkles } from 'lucide-react'
import { notificationsApi } from '../../api/endpoints.js'
import { QUERY_KEYS } from '../../store/queryClient.js'
import { Spinner } from '../../components/shared.jsx'
import { timeAgo } from '../../utils/helpers.js'
import { useEffect, useRef, useState } from 'react'


/* ─── Reveal ─────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const [v, setV] = useState(false); const ref = useRef()
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect()}},{threshold:.06})
    if(ref.current) io.observe(ref.current); return()=>io.disconnect()
  },[])
  return <div ref={ref} className={className} style={{transitionDelay:`${delay}ms`,opacity:v?1:0,transform:v?'translateY(0)':'translateY(20px)',transition:'opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1)'}}>{children}</div>
}

const NOTIF_META = {
  MATCH:    { icon:'⚡', bg:'bg-amber-100', text:'text-amber-700',  border:'border-amber-100' },
  MESSAGE:  { icon:'💬', bg:'bg-blue-100',  text:'text-blue-700',   border:'border-blue-100' },
  REVIEW:   { icon:'⭐', bg:'bg-yellow-100',text:'text-yellow-700', border:'border-yellow-100' },
  EXCHANGE: { icon:'🤝', bg:'bg-emerald-100',text:'text-emerald-700',border:'border-emerald-100' },
  SYSTEM:   { icon:'📢', bg:'bg-gray-100',  text:'text-gray-700',   border:'border-gray-100' },
}

/* ─── Hero ───────────────────────────────────────────────────────────────────── */
function NotificationsHero({ scrollY, hasUnread, onMarkAll, loading }) {
  const scale = Math.max(1 - scrollY * 0.0003, 0.94)
  const opacity = Math.max(1 - scrollY * 0.004, 0)
  return (
    <div style={{transform:`scale(${scale})`,opacity,transformOrigin:'top center'}} className="relative overflow-hidden rounded-[2rem] mb-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-transparent" />
        <div className="absolute inset-0 opacity-15 dark:opacity-30" style={{backgroundImage:'radial-gradient(var(--border) 1px,transparent 1px)',backgroundSize:'22px 22px'}} />
      </div>
      <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20" style={{background:'radial-gradient(circle,#3b82f6,transparent 70%)',transform:'translate(30%,30%)'}} />

      <div className="relative px-8 py-10 flex items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-400/20 text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-400/20 mb-4">
            <Bell className="w-3 h-3" /> Activity
          </div>
          <h1 className="text-3xl font-black text-white mb-2" style={{fontFamily:"'Sora',sans-serif"}}>Notifications</h1>
          <p className="text-gray-300 text-sm" style={{fontFamily:"'DM Sans',sans-serif"}}>Stay up to date with your skill exchanges</p>
        </div>
        {hasUnread && (
          <button
            onClick={onMarkAll}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm font-bold px-4 py-2.5 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            style={{fontFamily:"'Sora',sans-serif"}}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark all read
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Notification Item ─────────────────────────────────────────────────────── */
function NotifItem({ n, onClick, onDelete, delay }) {
  const meta = NOTIF_META[n.type] || NOTIF_META.SYSTEM
  const [hov, setHov] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (e) => {
    e.stopPropagation()
    setDeleting(true)
    setTimeout(() => onDelete(n.id), 300)
  }

  return (
    <Reveal delay={delay}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ opacity: deleting ? 0 : 1, transform: deleting ? 'translateX(40px)' : 'none', transition: 'opacity .3s ease, transform .3s ease' }}
        className={`relative bg-white rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
          ${!n.is_read ? 'border-amber-200' : 'border-gray-100'}
          ${hov ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}`}
      >
        {/* Unread left bar */}
        {!n.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl" />}

        {/* Unread bg tint */}
        {!n.is_read && <div className="absolute inset-0 bg-amber-50/50 pointer-events-none" />}

        <div className="flex items-start gap-4 p-4 pl-5 relative">
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${meta.bg} ${meta.border}`}>
            {meta.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-black mb-0.5 ${!n.is_read ? 'text-gray-900' : 'text-gray-700'}`} style={{fontFamily:"'Sora',sans-serif"}}>{n.title}</p>
            <p className="text-xs text-gray-500 leading-relaxed" style={{fontFamily:"'DM Sans',sans-serif"}}>{n.body}</p>
            <p className="text-xs text-gray-400 mt-1.5" style={{fontFamily:"'DM Sans',sans-serif"}}>{timeAgo(n.created_at)}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!n.is_read && <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-200" />}
            <button
              onClick={handleDelete}
              className="p-1.5 text-gray-200 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS({ limit: 50 }),
    queryFn: () => notificationsApi.list({ limit: 50 }).then(r => r.data),
  })

  const notifications = data?.data || []
  const hasUnread = notifications.some(n => !n.is_read)
  const unreadCount = notifications.filter(n => !n.is_read).length

   const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS({ limit: 50 }) })
    },
  })

  const markOneMutation = useMutation({
    mutationFn: (id) => notificationsApi.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS({ limit: 50 }) })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications'] })
      qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS({ limit: 50 }) })
    },
  })

  const handleClick = (n) => {
    if (!n.is_read) markOneMutation.mutate(n.id)
    if (n.link) navigate(n.link)
  }

  return (
    <div>
      
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      <NotificationsHero
        scrollY={scrollY}
        hasUnread={hasUnread}
        onMarkAll={() => markAllMutation.mutate()}
        loading={markAllMutation.isPending}
      />

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <Reveal>
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <Bell className="w-10 h-10 text-blue-200" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2" style={{fontFamily:"'Sora',sans-serif"}}>All caught up! 🎉</h3>
            <p className="text-gray-500" style={{fontFamily:"'DM Sans',sans-serif"}}>No notifications yet. Start exchanging skills to get updates.</p>
          </div>
        </Reveal>
      ) : (
        <>
          {unreadCount > 0 && (
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm font-bold text-gray-600" style={{fontFamily:"'Sora',sans-serif"}}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </Reveal>
          )}

          <div className="space-y-2.5">
            {notifications.map((n, i) => (
              <NotifItem
                key={n.id}
                n={n}
                onClick={() => handleClick(n)}
                onDelete={(id) => deleteMutation.mutate(id)}
                delay={i * 40}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}