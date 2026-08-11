// ─────────────────────────────────────────────────────────
// COMPONENT: ProtectedRoute
// Guards all authenticated routes. Redirects to /login if
// not authenticated, shows AccessDenied if role lacks access.
// ─────────────────────────────────────────────────────────

import { Navigate, useLocation } from 'react-router-dom'
import { ShieldX, ArrowLeft, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

// ── Route Guard ─────────────────────────────────────────

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, hasAccess, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!hasAccess(location.pathname)) {
    return <AccessDeniedPage roleName={user?.roleLabel ?? 'your role'} />
  }

  return <>{children}</>
}

// ── Access Denied (403) Page ────────────────────────────

interface AccessDeniedPageProps {
  roleName?: string
}

export function AccessDeniedPage({ roleName }: AccessDeniedPageProps) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
          border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ShieldX style={{ width: '36px', height: '36px', color: 'var(--color-accent-rose)' }} />
      </div>

      {/* Text */}
      <div style={{ maxWidth: '400px' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Access Restricted
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}
        >
          This module is not available for <strong style={{ color: 'var(--color-text-secondary)' }}>{roleName ?? 'your role'}</strong>.
          Contact your National Manager to request elevated access.
        </p>
      </div>

      {/* Role badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          borderRadius: '999px',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <Lock style={{ width: '12px', height: '12px' }} />
        <span>Role: {roleName}</span>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          borderRadius: '8px',
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-strong)',
          color: 'var(--color-text-secondary)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        id="access-denied-back"
      >
        <ArrowLeft style={{ width: '14px', height: '14px' }} />
        Go Back
      </button>
    </div>
  )
}
