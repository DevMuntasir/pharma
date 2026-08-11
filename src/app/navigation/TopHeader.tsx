// ─────────────────────────────────────────────────────────
// COMPONENT: TopHeader
// Application-wide header with search, notifications,
// and real authenticated user info + logout.
// ─────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { Bell, Menu, LogOut, ChevronDown, Shield, Sun, Moon } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export function TopHeader() {
  const { toggleMobileSidebar, theme, toggleTheme } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const roleColor = user?.avatarColor ?? 'var(--color-accent-primary)'

  return (
    <header className="app-header" id="app-header" role="banner">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden btn btn-ghost p-1.5"
        onClick={toggleMobileSidebar}
        aria-label="Toggle navigation menu"
        id="mobile-menu-toggle"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Global search */}
      <GlobalSearch />

      <div className="flex items-center gap-2 ml-auto">
        {/* Demo data indicator */}
        {/* <div
          className="badge badge-demo font-bold tracking-widest cursor-help select-none hidden sm:flex"
          data-tooltip="All data shown in this prototype is fictional and intended for product demonstration only."
          id="demo-data-badge"
          role="status"
          aria-label="Demo data — all values are fictional"
        >
          DEMO DATA
        </div> */}

        {/* Theme toggle */}
        <button
          className="btn btn-ghost p-1.5"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          id="theme-toggle-button"
          data-tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="btn btn-ghost p-1.5 relative"
          aria-label="Notifications"
          id="notifications-button"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent-rose)]"
            aria-hidden="true"
          />
        </button>

        {/* User/profile dropdown */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            className="btn btn-ghost p-1 flex items-center gap-2"
            aria-label="User menu"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            id="user-profile-button"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {/* Avatar */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: `${roleColor}20`,
                border: `1px solid ${roleColor}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: roleColor,
                flexShrink: 0,
              }}
            >
              {user?.initials ?? '?'}
            </div>

            {/* Name + role */}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">
                {user?.name ?? 'Guest'}
              </p>
              <p className="text-2xs leading-tight" style={{ color: roleColor }}>
                {user?.roleLabel ?? 'Not signed in'}
              </p>
            </div>

            <ChevronDown
              className="w-3 h-3 text-[var(--color-text-muted)] hidden sm:block"
              style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '220px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                overflow: 'hidden',
                zIndex: 200,
              }}
              role="menu"
              id="user-dropdown-menu"
            >
              {/* User info header */}
              <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                  {user?.email}
                </p>
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '2px 8px',
                    background: `${roleColor}15`,
                    border: `1px solid ${roleColor}30`,
                    borderRadius: '999px',
                  }}
                >
                  <Shield style={{ width: '10px', height: '10px', color: roleColor }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: roleColor }}>
                    {user?.roleLabel}
                  </span>
                </div>
                {user?.territory && (
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                    📍 {user.territory}
                  </p>
                )}
              </div>

              {/* Logout */}
              <div style={{ padding: '0.375rem' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent-rose)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    textAlign: 'left' as const,
                  }}
                  role="menuitem"
                  id="logout-btn"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut style={{ width: '14px', height: '14px' }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
