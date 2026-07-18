import { Component } from 'react'
import { WarningOctagon, ArrowCounterClockwise, House } from '@phosphor-icons/react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false, error: null })} />
    }
    return this.props.children
  }
}

function ErrorFallback({ onReset }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #F7F7F5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        fontFamily: "'Inter', sans-serif",
        animation: 'eb-fadein 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes eb-fadein {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes eb-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.6; }
          50%  { transform: scale(1.18); opacity: 0.15; }
          100% { transform: scale(1);    opacity: 0.6; }
        }
        @keyframes eb-shake {
          0%, 100% { transform: rotate(0deg); }
          20%      { transform: rotate(-8deg); }
          40%      { transform: rotate(8deg); }
          60%      { transform: rotate(-5deg); }
          80%      { transform: rotate(5deg); }
        }
        .eb-icon-wrap { position: relative; display: inline-flex; }
        .eb-ring {
          position: absolute; inset: -10px;
          border-radius: 50%;
          background: rgba(239,68,68,0.12);
          animation: eb-pulse-ring 2.2s ease-in-out infinite;
        }
        .eb-icon { animation: eb-shake 0.6s ease 0.3s both; }
        .eb-reload-btn:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 rgba(11,11,10,0.18) !important; }
        .eb-reload-btn:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 rgba(11,11,10,0.18) !important; }
        .eb-home-btn:hover { opacity: 0.75; }
      `}</style>

      <div className="eb-icon-wrap" style={{ marginBottom: 28 }}>
        <div className="eb-ring" />
        <div className="eb-icon" style={{
          width: 72, height: 72,
          background: 'rgba(239,68,68,0.1)',
          borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ef4444',
        }}>
          <WarningOctagon weight="duotone" style={{ width: 36, height: 36 }} />
        </div>
      </div>

      <h1 style={{
        fontSize: 28, fontWeight: 800,
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'var(--text, #0B0B0A)',
        margin: '0 0 10px', letterSpacing: '-0.5px',
      }}>
        Something went wrong
      </h1>
      <p style={{
        fontSize: 14, color: 'var(--muted, #5e5e5e)',
        maxWidth: 360, margin: '0 0 32px', lineHeight: 1.6,
      }}>
        An unexpected error occurred. Your data is safe.
        Try reloading the page or go back home.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="eb-reload-btn"
          onClick={() => window.location.reload()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'var(--text, #0B0B0A)', color: 'var(--bg, #F7F7F5)',
            fontWeight: 700, fontSize: 14,
            fontFamily: "'Space Grotesk', sans-serif",
            border: '2px solid var(--text, #0B0B0A)',
            boxShadow: '3px 3px 0 rgba(11,11,10,0.18)',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
        >
          <ArrowCounterClockwise weight="bold" style={{ width: 16, height: 16 }} />
          Reload Page
        </button>
        <button
          className="eb-home-btn"
          onClick={() => { window.location.href = '/' }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'transparent', color: 'var(--text, #0B0B0A)',
            fontWeight: 700, fontSize: 14,
            fontFamily: "'Space Grotesk', sans-serif",
            border: '2px solid var(--border, rgba(11,11,10,0.12))',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
        >
          <House weight="bold" style={{ width: 16, height: 16 }} />
          Go Home
        </button>
      </div>
    </div>
  )
}
