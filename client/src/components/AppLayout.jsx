import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LayoutDashboard, Search, ArrowLeftRight, Bell, User, Plus, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { notificationsApi } from '../api/endpoints.js'
import { QUERY_KEYS } from '../store/queryClient.js'
import { Avatar, Toast } from './shared.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useNavigate, NavLink } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/browse', icon: Search, label: 'Browse' },
  { to: '/exchanges', icon: ArrowLeftRight, label: 'Exchanges' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
]

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const { toasts, dismissToast } = useNotifications()
  const { socket } = useSocket()
  const qc = useQueryClient()
  const navigate = useNavigate()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const clickHandler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', clickHandler)
    return () => document.removeEventListener('mousedown', clickHandler)
  }, [])

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return
    const onNewNotif = () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS({ page: 1, limit: 1 }) })
    }
    socket.on('notification:new', onNewNotif)
    return () => { socket.off('notification:new', onNewNotif) }
  }, [socket, qc])

  const { data: notifData } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS({ page: 1, limit: 1 }),
    queryFn: () => notificationsApi.list({ limit: 1 }).then(r => r.data),
    enabled: !!user,
    refetchInterval: 30_000,
  })

  const unread = notifData?.pagination?.total ?? 0

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0B0B0A] flex flex-col portfolio-theme">
      
      {/* ── Sticky Top Header Shell ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#0B0B0A]/5 h-16 flex items-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-2.5 font-syne font-bold text-lg text-[#0B0B0A] focus:outline-none"
          >
            <span className="w-8 h-8 bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-sm rounded-full">
              B
            </span>
            <span>Bartr</span>
          </button>

          {/* Central Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-jakarta border transition-all ${
                    isActive 
                      ? 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent' 
                      : 'text-[#0B0B0A]/60 border-transparent hover:bg-[#0B0B0A]/5 hover:text-[#0B0B0A]'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {label === 'Notifications' && unread > 0 && (
                  <span className="ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6D28D9] text-white">
                    {unread}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={() => navigate('/skills/new')}
              className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold px-4 py-2.5 rounded-full border border-transparent flex items-center gap-1.5 shadow-md shadow-[#6D28D9]/10 transition-transform hover:scale-[1.02] active:scale-[0.98] font-jakarta"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post Skill</span>
            </button>

            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#0B0B0A]/5 transition-colors focus:outline-none"
              >
                <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
                <ChevronDown className="w-3.5 h-3.5 text-[#0B0B0A]/40" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#0B0B0A]/8 rounded-2xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#0B0B0A]/5">
                    <p className="text-xs font-bold text-[#0B0B0A] truncate">{user?.full_name}</p>
                    <p className="text-[9px] text-[#0B0B0A]/40 font-medium truncate">@{user?.username}</p>
                  </div>
                  
                  <button
                    onClick={() => { navigate(`/profile/${user?.username}`); setUserDropdownOpen(false) }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#0B0B0A]/70 hover:text-[#0B0B0A] hover:bg-[#0B0B0A]/5 flex items-center gap-2 transition-colors font-jakarta"
                  >
                    <User className="w-3.5 h-3.5" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-500/5 flex items-center gap-2 transition-colors font-jakarta border-t border-[#0B0B0A]/5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile burger */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)} 
              className="md:hidden p-2 rounded-full hover:bg-[#0B0B0A]/5 text-[#0B0B0A]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute inset-0 bg-[#0B0B0A]/20 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 right-0 bottom-0 w-64 bg-white border-l border-[#0B0B0A]/5 flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-[#0B0B0A]/5">
            <button onClick={() => { navigate('/dashboard'); setMobileOpen(false) }} className="flex items-center gap-2 font-syne font-bold text-base text-[#0B0B0A]">
              <span className="w-6 h-6 bg-[#0B0B0A] text-[#F7F7F5] flex items-center justify-center font-syne font-extrabold text-[10px] rounded-full">B</span>
              <span>Bartr</span>
            </button>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-full hover:bg-[#0B0B0A]/5 text-[#0B0B0A]">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {NAV_LINKS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-bold font-jakarta border transition-all ${
                    isActive 
                      ? 'bg-[#6D28D9]/10 text-[#6D28D9] border-transparent' 
                      : 'text-[#0B0B0A]/60 border-transparent hover:bg-[#0B0B0A]/5 hover:text-[#0B0B0A]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {label === 'Notifications' && unread > 0 && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6D28D9] text-white">
                        {unread}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-[#0B0B0A]/5 space-y-1">
            <div className="flex items-center justify-between px-4 py-2.5 mb-1">
              <span className="text-xs font-bold text-[#0B0B0A]/40 font-jakarta">Theme</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => { navigate(`/profile/${user?.username}`); setMobileOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold font-jakarta text-[#0B0B0A]/60 hover:text-[#0B0B0A] hover:bg-[#0B0B0A]/5 transition-all"
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold font-jakarta text-red-600 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content (no sidebar left margin, top margin for sticky header) ── */}
      <main className="flex-1 w-full pt-16 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-10">
          {children}
        </div>
      </main>

      {/* ── Toast stack ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>
    </div>
  )
}

// ── Protected Route ────────────────────────────────────────────────────────────
import { Navigate } from 'react-router-dom'
import { Spinner } from './shared.jsx'

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
      <Spinner size="lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!user.onboarding_done) return <Navigate to="/onboarding" replace />
  return children
}

export const OnboardingRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
      <Spinner size="lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (user.onboarding_done) return <Navigate to="/dashboard" replace />
  return children
}

export const GuestRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
      <Spinner size="lg" />
    </div>
  )
  if (user) return <Navigate to={user.onboarding_done ? '/dashboard' : '/onboarding'} replace />
  return children
}
