import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { XCircle, WifiSlash, ArrowLeft, ArrowCounterClockwise } from '@phosphor-icons/react'

const ERROR_CONFIGS = {
  oauth: {
    icon: XCircle,
    iconColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
    title: 'Sign-in Failed',
    description:
      'We couldn\'t sign you in with Google. This might be because you cancelled the request, or permissions were denied. Please try again.',
    primaryLabel: 'Try Again',
    primaryAction: (navigate) => navigate('/login'),
    secondaryLabel: 'Go Home',
    secondaryAction: (navigate) => navigate('/'),
  },
  server_error: {
    icon: WifiSlash,
    iconColor: '#f59e0b',
    iconBg: 'rgba(245,158,11,0.1)',
    title: 'Service Unavailable',
    description:
      'Our servers are temporarily experiencing issues. We\'re working on it! Please wait a moment and try again.',
    primaryLabel: 'Try Again',
    primaryAction: (navigate) => navigate('/login'),
    secondaryLabel: 'Go Home',
    secondaryAction: (navigate) => navigate('/'),
  },
  default: {
    icon: XCircle,
    iconColor: '#6d28d9',
    iconBg: 'rgba(109,40,217,0.1)',
    title: 'Something went wrong',
    description:
      'An unexpected error occurred. Please try again or go back to the home screen.',
    primaryLabel: 'Try Again',
    primaryAction: (navigate) => navigate(-1),
    secondaryLabel: 'Go Home',
    secondaryAction: (navigate) => navigate('/'),
  },
}

export default function ErrorPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [dots, setDots] = useState(0)

  const code = params.get('code') || 'default'
  const config = ERROR_CONFIGS[code] || ERROR_CONFIGS.default
  const Icon = config.icon

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    const interval = setInterval(() => setDots(d => (d + 1) % 4), 600)
    return () => { clearTimeout(t); clearInterval(interval) }
  }, [])

  const dotsStr = '.'.repeat(dots)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg, #F7F7F5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes ep-in {
          from { opacity: 0; transform: scale(0.94) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes ep-ring {
          0%   { transform: scale(1);    opacity: 0.5; }
          50%  { transform: scale(1.22); opacity: 0.1; }
          100% { transform: scale(1);    opacity: 0.5; }
        }
        @keyframes ep-bob {
          0%, 100% { transform: translateY(0);   }
          50%      { transform: translateY(-6px); }
        }
        @keyframes ep-glitch {
          0%, 100% { clip-path: inset(0 0 100% 0); opacity: 1; }
          5%       { clip-path: inset(10% 0 60% 0); opacity: 0.8; transform: translateX(-3px); }
          10%      { clip-path: inset(50% 0 30% 0); opacity: 0.6; transform: translateX(3px); }
          15%      { clip-path: inset(0 0 0 0);     opacity: 1; transform: translateX(0); }
          95%      { clip-path: inset(0 0 0 0);     opacity: 1; }
        }
        .ep-card {
          opacity: 0;
          animation: ep-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }
        .ep-icon-wrap { position: relative; display: inline-flex; animation: ep-bob 3s ease-in-out infinite; }
        .ep-ring {
          position: absolute; inset: -12px; border-radius: 50%;
          animation: ep-ring 2.5s ease-in-out infinite;
        }
        .ep-code {
          font-family: 'Space Grotesk', sans-serif;
          animation: ep-glitch 6s linear infinite;
        }
        .ep-primary:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 rgba(11,11,10,0.2) !important; }
        .ep-primary:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 rgba(11,11,10,0.15) !important; }
        .ep-secondary:hover { background: rgba(11,11,10,0.04) !important; }
        .ep-bg-blob {
          position: fixed; border-radius: 50%; filter: blur(80px);
          pointer-events: none; z-index: 0;
        }
      `}</style>

      {/* Ambient background blobs */}
      <div className="ep-bg-blob" style={{
        width: 400, height: 400,
        background: `${config.iconColor}18`,
        top: -100, right: -100,
      }} />
      <div className="ep-bg-blob" style={{
        width: 300, height: 300,
        background: `${config.iconColor}10`,
        bottom: -80, left: -80,
      }} />

      <div className="ep-card" style={{
        position: 'relative', zIndex: 1,
        background: 'var(--surface, #ffffff)',
        borderRadius: 24,
        border: '2px solid var(--border, rgba(11,11,10,0.08))',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08), 8px 8px 0 var(--border, rgba(11,11,10,0.06))',
        padding: '48px 40px',
        maxWidth: 440,
        width: '100%',
        textAlign: 'center',
      }}>

        {/* Error code badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 99,
          background: `${config.iconColor}15`,
          marginBottom: 28,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: config.iconColor,
            boxShadow: `0 0 6px ${config.iconColor}`,
          }} />
          <span className="ep-code" style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            color: config.iconColor, textTransform: 'uppercase',
          }}>
            {code === 'server_error' ? 'SERVER ERROR' : code === 'oauth' ? 'AUTH FAILED' : 'ERROR'}
          </span>
        </div>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div className="ep-icon-wrap">
            <div className="ep-ring" style={{ background: `${config.iconColor}18` }} />
            <div style={{
              width: 80, height: 80, borderRadius: 22,
              background: config.iconBg,
              border: `2px solid ${config.iconColor}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: config.iconColor,
            }}>
              <Icon weight="duotone" style={{ width: 40, height: 40 }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 800,
          fontFamily: "'Space Grotesk', sans-serif",
          color: 'var(--text, #0B0B0A)',
          margin: '0 0 12px', letterSpacing: '-0.5px',
        }}>
          {config.title}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 14, lineHeight: 1.65,
          color: 'var(--muted, #5e5e5e)',
          margin: '0 0 36px',
        }}>
          {config.description}
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'var(--border, rgba(11,11,10,0.08))',
          margin: '0 0 28px',
        }} />

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="ep-primary"
            id="error-page-primary-btn"
            onClick={() => config.primaryAction(navigate)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 24px', borderRadius: 12,
              background: 'var(--text, #0B0B0A)', color: 'var(--bg, #F7F7F5)',
              fontWeight: 700, fontSize: 14,
              fontFamily: "'Space Grotesk', sans-serif",
              border: '2px solid var(--text, #0B0B0A)',
              boxShadow: '3px 3px 0 rgba(11,11,10,0.15)',
              cursor: 'pointer', transition: 'all 0.15s ease', width: '100%',
            }}
          >
            <ArrowCounterClockwise weight="bold" style={{ width: 16, height: 16 }} />
            {config.primaryLabel}
          </button>
          <button
            className="ep-secondary"
            id="error-page-secondary-btn"
            onClick={() => config.secondaryAction(navigate)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 24px', borderRadius: 12,
              background: 'transparent', color: 'var(--text, #0B0B0A)',
              fontWeight: 700, fontSize: 14,
              fontFamily: "'Space Grotesk', sans-serif",
              border: '2px solid var(--border, rgba(11,11,10,0.1))',
              cursor: 'pointer', transition: 'all 0.15s ease', width: '100%',
            }}
          >
            <ArrowLeft weight="bold" style={{ width: 16, height: 16 }} />
            {config.secondaryLabel}
          </button>
        </div>

        {/* Support hint */}
        <p style={{
          marginTop: 24, fontSize: 12,
          color: 'var(--muted, #5e5e5e)',
        }}>
          Error persisting?{' '}
          <a href="/contact" style={{ color: config.iconColor, fontWeight: 600, textDecoration: 'none' }}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
