// ─────────────────────────────────────────────────────────
// COMPONENT: TopHeader
// Application-wide header with search, notifications, demo badge
// ─────────────────────────────────────────────────────────

import { Bell, Menu, User } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { useUIStore } from '@/store/useUIStore'

export function TopHeader() {
  const { toggleMobileSidebar } = useUIStore()

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
        <div
          className="badge badge-demo font-bold tracking-widest cursor-help select-none hidden sm:flex"
          data-tooltip="All data shown in this prototype is fictional and intended for product demonstration only."
          id="demo-data-badge"
          role="status"
          aria-label="Demo data — all values are fictional"
        >
          DEMO DATA
        </div>

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

        {/* User/profile */}
        <button
          className="btn btn-ghost p-1 flex items-center gap-2"
          aria-label="User menu"
          id="user-profile-button"
        >
          <div className="w-7 h-7 rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-strong)] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">Demo User</p>
            <p className="text-2xs text-[var(--color-text-muted)] leading-tight">Analytics Viewer</p>
          </div>
        </button>
      </div>
    </header>
  )
}
