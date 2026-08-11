// ─────────────────────────────────────────────────────────
// PAGE: Login
// Premium dark glassmorphism login screen with demo
// credential quick-fill cards. No backend required.
// ─────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Zap, AlertCircle, LogIn } from 'lucide-react'
import { useAuthStore, DEMO_CREDENTIALS } from '@/store/useAuthStore'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, loginError, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'

  // Already logged in → redirect
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    clearError()
    await new Promise((r) => setTimeout(r, 600)) // simulated auth delay
    const ok = login(email, password)
    setLoading(false)
    if (ok) navigate(from, { replace: true })
  }

  const fillCreds = (cred: (typeof DEMO_CREDENTIALS)[0]) => {
    setEmail(cred.email)
    setPassword(cred.password)
    clearError()
  }

  return (
    <div id="login-page" style={styles.page}>
      {/* Ambient background orbs */}
      <div style={{ ...styles.orb, top: '10%', left: '15%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
      <div style={{ ...styles.orb, bottom: '15%', right: '10%', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)' }} />
      <div style={{ ...styles.orb, top: '50%', right: '25%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />

      {/* Login card */}
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>
              {/* <Beaker style={{ width: '22px', height: '22px', color: 'white' }} /> */}
            </div>
            <div>
              <p style={styles.logoTitle}>PHARMA INTELLIGENCE</p>
              <p style={styles.logoSub}>Analytics Operating System</p>
            </div>
          </div>
          <h1 style={styles.heading}>Sign in to your account</h1>
          <p style={styles.subheading}>
            Pharma market intelligence platform for Bangladesh
          </p>
        </div>

        {/* Error */}
        {loginError && (
          <div style={styles.errorBox} role="alert" id="login-error">
            <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form} id="login-form">
          <div style={styles.field}>
            <label htmlFor="login-email" style={styles.label}>Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@pharma.demo"
              style={styles.input}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="login-password" style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: '2.5rem' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="toggle-password-visibility"
              >
                {showPassword
                  ? <EyeOff style={{ width: '14px', height: '14px' }} />
                  : <Eye style={{ width: '14px', height: '14px' }} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.submitBtn}
            id="login-submit"
          >
            {loading ? (
              <span style={styles.loadingDots}>
                <span style={styles.dot} className="dot-1" />
                <span style={styles.dot} className="dot-2" />
                <span style={styles.dot} className="dot-3" />
              </span>
            ) : (
              <>
                <LogIn style={{ width: '15px', height: '15px' }} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={styles.demoSection}>
          <div style={styles.demoDivider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>
              <Zap style={{ width: '11px', height: '11px', color: '#f59e0b' }} />
              Quick Demo Login
            </span>
            <div style={styles.dividerLine} />
          </div>

          <div style={styles.demoGrid}>
            {DEMO_CREDENTIALS.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillCreds(cred)}
                style={styles.demoCard}
                id={`demo-login-${cred.role.toLowerCase().replace(' ', '-')}`}
              >
                <div style={{ ...styles.demoAvatar, background: `${cred.color}20`, border: `1px solid ${cred.color}50` }}>
                  <span style={{ color: cred.color, fontSize: '0.7rem', fontWeight: 700 }}>
                    {cred.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div style={styles.demoInfo}>
                  <p style={styles.demoName}>{cred.name}</p>
                  <p style={{ ...styles.demoRole, color: cred.color }}>{cred.role}</p>
                  <p style={styles.demoAccess}>{cred.access}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={styles.footerNote}>
          🔒 Demo prototype — all data is fictional
        </p>
      </div>

      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .dot-1 { animation: dot-bounce 1.2s ease-in-out infinite; }
        .dot-2 { animation: dot-bounce 1.2s ease-in-out 0.2s infinite; }
        .dot-3 { animation: dot-bounce 1.2s ease-in-out 0.4s infinite; }
        #login-page input:focus {
          outline: none;
          border-color: rgba(99,102,241,0.7) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important;
        }
        #login-page .demo-card-btn:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.12) !important;
        }
      `}</style>
    </div>
  )
}

// ── Inline Styles ────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0b0e 0%, #0f1117 40%, #0d0f14 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
  },
  orb: {
    position: 'absolute' as const,
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    pointerEvents: 'none' as const,
  },
  card: {
    position: 'relative' as const,
    zIndex: 10,
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
  },
  cardHeader: {
    marginBottom: '1.75rem',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    flexShrink: 0,
  },
  logoTitle: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '0.1em',
    lineHeight: 1.2,
    margin: 0,
  },
  logoSub: {
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.05em',
    margin: 0,
  },
  heading: {
    fontSize: '1.375rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: '-0.025em',
    margin: '0 0 0.375rem',
  },
  subheading: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    color: '#fca5a5',
    fontSize: '0.8125rem',
    marginBottom: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: '0.02em',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box' as const,
  },
  eyeBtn: {
    position: 'absolute' as const,
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '0.8125rem',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'opacity 0.2s, transform 0.1s',
    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
    marginTop: '0.25rem',
  },
  loadingDots: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'white',
    display: 'inline-block',
  },
  demoSection: {
    marginBottom: '1.25rem',
  },
  demoDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.35)',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    letterSpacing: '0.04em',
  },
  demoGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  demoCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left' as const,
    width: '100%',
  },
  demoAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  demoInfo: {
    flex: 1,
    minWidth: 0,
  },
  demoName: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
    margin: 0,
    lineHeight: 1.3,
  },
  demoRole: {
    fontSize: '0.7rem',
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.3,
  },
  demoAccess: {
    fontSize: '0.68rem',
    color: 'rgba(255,255,255,0.3)',
    margin: 0,
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  footerNote: {
    textAlign: 'center' as const,
    fontSize: '0.7rem',
    color: 'rgba(255,255,255,0.2)',
    margin: 0,
    letterSpacing: '0.02em',
  },
} as const
