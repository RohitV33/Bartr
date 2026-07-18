import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from './store/queryClient.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { AppLayout, ProtectedRoute, OnboardingRoute, GuestRoute } from './components/AppLayout.jsx'
import { ThemeProvider } from './context/themeContext.jsx'
import { Spinner } from './components/shared.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'))
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage.jsx'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage.jsx'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage.jsx'))
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback.jsx'))
const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage.jsx'))
const DashboardPage = lazy(() => import('./pages/app/DashboardPage.jsx'))
const BrowsePage = lazy(() => import('./pages/app/BrowsePage.jsx'))
const NewSkillPage = lazy(() => import('./pages/app/NewSkillPage.jsx'))
const SkillDetailPage = lazy(() => import('./pages/app/SkillDetailPage.jsx'))
const ProfilePage = lazy(() => import('./pages/app/ProfilePage.jsx'))
const EditProfilePage = lazy(() => import('./pages/app/EditProfilePage.jsx'))
const ExchangesPage = lazy(() => import('./pages/app/ExchangesPage.jsx'))
const ExchangeDetailPage = lazy(() => import('./pages/app/ExchangeDetailPage.jsx'))
const NotificationsPage = lazy(() => import('./pages/app/NotificationsPage.jsx'))
const PortfolioPage = lazy(() => import('./pages/app/PortfolioPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'))

const AppProviders = ({ children }) => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider> 
      <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SocketProvider>
      </AuthProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </HelmetProvider>
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
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-bartr-bg">
              <Spinner size="lg" />
            </div>
          }>
            <Routes>
              <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
            <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
            <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
            <Route path="/browse" element={<ProtectedLayout><BrowsePage /></ProtectedLayout>} />
            <Route path="/skills/new" element={<ProtectedLayout><NewSkillPage /></ProtectedLayout>} />
            <Route path="/skills/:id" element={<ProtectedLayout><SkillDetailPage /></ProtectedLayout>} />
            <Route path="/skills/:id/edit" element={<ProtectedLayout><NewSkillPage /></ProtectedLayout>} />
            <Route path="/profile/edit" element={<ProtectedLayout><EditProfilePage /></ProtectedLayout>} />
            <Route path="/profile/:username" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
            <Route path="/exchanges" element={<ProtectedLayout><ExchangesPage /></ProtectedLayout>} />
            <Route path="/exchanges/:id" element={<ProtectedLayout><ExchangeDetailPage /></ProtectedLayout>} />
            <Route path="/notifications" element={<ProtectedLayout><NotificationsPage /></ProtectedLayout>} />
            <Route path="/portfolio" element={<ProtectedLayout><PortfolioPage /></ProtectedLayout>} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AppProviders>
  )
}
