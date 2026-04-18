import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, Search, ArrowLeftRight, Bell, User, Plus, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationContext.jsx'
import { notificationsApi } from '../api/endpoints.js'
import { QUERY_KEYS } from '../store/queryClient.js'
import { Avatar, Toast } from './shared.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const NAV_LINKS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/browse', icon: Search, label: 'Browse' },
  { to: '/exchanges', icon: ArrowLeftRight, label: 'Exchanges' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
]

export const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const { toasts, dismissToast } = useNotifications()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: notifData } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS({ page: 1, limit: 1 }),
    queryFn: () => notificationsApi.list({ limit: 1 }).then(r => r.data),
    enabled: !!user,
    refetchInterval: 30_000,
  })

  const unread = notifData?.pagination?.total ?? 0

  return (
    <div className="min-h-screen bg-bartr-bg text-bartr-text flex transition-colors duration-300">
      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-bartr-sidebar border-r border-bartr-border fixed inset-y-0 left-0 z-30 transition-colors duration-300">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-bartr-border">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-sora font-bold text-lg text-bartr-text">
            <span className="w-7 h-7 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-sm">B</span>
            Bartr
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium font-dm transition-all ${isActive ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/20 dark:shadow-amber-900/20' : 'text-bartr-muted hover:bg-bartr-bg hover:text-bartr-text'}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === 'Notifications' && unread > 0 && (
                <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full font-sora ${isActive ? 'bg-gray-900 text-white' : 'bg-amber-400 text-gray-900'}`}>
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Post skill CTA */}
        <div className="px-3 pb-3">
          <button
            onClick={() => navigate('/skills/new')}
            className="w-full flex items-center justify-center gap-2 bg-yellow-300 text-bartr-dark font-sora font-semibold text-sm py-2.5 rounded-xl hover:bg-yellow-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a Skill
          </button>
        </div>

        {/* Theme Toggle & User footer */}
        <div className="border-t border-bartr-border p-3 space-y-2">
          <div className="px-3 py-2">
             <ThemeToggle />
          </div>
          <button
            onClick={() => navigate(`/profile/${user?.username}`)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bartr-bg transition-colors text-left"
          >
            <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-bartr-text font-sora truncate">{user?.full_name}</p>
              <p className="text-xs text-bartr-muted font-dm truncate">@{user?.username}</p>
            </div>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-bartr-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-dm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-bartr-sidebar/80 backdrop-blur-md border-b border-bartr-border h-14 flex items-center px-4 justify-between transition-colors duration-300">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-sora font-bold text-base text-bartr-text">
          <span className="w-6 h-6 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-xs">B</span>
          Bartr
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/skills/new')} className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-bartr-dark" />
          </button>
          <div className="w-8 h-8 flex items-center justify-center">
            <ThemeToggle />
          </div>
          <button onClick={() => setMobileOpen(o => !o)} className="p-1 text-bartr-text">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
        <div className={`absolute top-0 left-0 bottom-0 w-64 bg-bartr-sidebar border-r border-bartr-border flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}>
          <div className="h-14 flex items-center justify-between px-4 border-b border-bartr-border">
            <button onClick={() => { navigate('/dashboard'); setMobileOpen(false) }} className="flex items-center gap-2 font-sora font-bold text-base text-bartr-text">
              <span className="w-6 h-6 bg-yellow-300 rounded-lg flex items-center justify-center text-bartr-dark font-black text-xs">B</span>
              Bartr
            </button>
            <button onClick={() => setMobileOpen(false)} className="p-1 text-bartr-text">
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
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-dm transition-all ${isActive ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/20 dark:shadow-amber-900/20' : 'text-bartr-muted hover:bg-bartr-bg hover:text-bartr-text'}`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
                {label === 'Notifications' && unread > 0 && (
                  <span className="ml-auto bg-amber-400 text-gray-900 text-xs font-bold px-1.5 py-0.5 rounded-full font-sora">
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-bartr-border space-y-1">
            <button
              onClick={() => { navigate(`/profile/${user?.username}`); setMobileOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-dm text-bartr-muted hover:text-bartr-text hover:bg-bartr-bg transition-all"
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-dm text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 md:ml-60 pt-14 md:pt-0 min-h-screen w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
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
    <div className="min-h-screen flex items-center justify-center bg-bartr-bg">
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
    <div className="min-h-screen flex items-center justify-center bg-bartr-bg">
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
    <div className="min-h-screen flex items-center justify-center bg-bartr-bg">
      <Spinner size="lg" />
    </div>
  )
  if (user) return <Navigate to={user.onboarding_done ? '/dashboard' : '/onboarding'} replace />
  return children
}
