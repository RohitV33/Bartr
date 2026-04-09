import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './store/queryClient.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { AppLayout, ProtectedRoute, OnboardingRoute, GuestRoute } from './components/AppLayout.jsx'

import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx'
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx'
import DashboardPage from './pages/app/DashboardPage.jsx'
import BrowsePage from './pages/app/BrowsePage.jsx'
import NewSkillPage from './pages/app/NewSkillPage.jsx'
import SkillDetailPage from './pages/app/SkillDetailPage.jsx'
import ProfilePage from './pages/app/ProfilePage.jsx'
import EditProfilePage from './pages/app/EditProfilePage.jsx'
import ExchangesPage from './pages/app/ExchangesPage.jsx'
import ExchangeDetailPage from './pages/app/ExchangeDetailPage.jsx'
import NotificationsPage from './pages/app/NotificationsPage.jsx'
import PortfolioPage from './pages/app/PortfolioPage.jsx'

const AppProviders = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
    {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
)

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
)

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
          <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
          <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="/browse" element={<ProtectedLayout><BrowsePage /></ProtectedLayout>} />
          <Route path="/skills/new" element={<ProtectedLayout><NewSkillPage /></ProtectedLayout>} />
          <Route path="/skills/:id" element={<ProtectedLayout><SkillDetailPage /></ProtectedLayout>} />
          <Route path="/profile/edit" element={<ProtectedLayout><EditProfilePage /></ProtectedLayout>} />
          <Route path="/profile/:username" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
          <Route path="/exchanges" element={<ProtectedLayout><ExchangesPage /></ProtectedLayout>} />
          <Route path="/exchanges/:id" element={<ProtectedLayout><ExchangeDetailPage /></ProtectedLayout>} />
          <Route path="/notifications" element={<ProtectedLayout><NotificationsPage /></ProtectedLayout>} />
          <Route path="/portfolio" element={<ProtectedLayout><PortfolioPage /></ProtectedLayout>} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
