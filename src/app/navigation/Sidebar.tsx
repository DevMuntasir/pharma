// ─────────────────────────────────────────────────────────
// COMPONENT: Sidebar
// Collapsible enterprise navigation sidebar.
// Filters nav items based on current user role.
// ─────────────────────────────────────────────────────────

import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Beaker, LogOut } from 'lucide-react'
import { navGroups } from './navConfig'
import { useUIStore } from '@/store/useUIStore'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/utils'
import type { UserRole } from '@/types'

function canSeeGroup(roles: UserRole[] | undefined, userRole: UserRole): boolean {
  if (!roles) return true
  return roles.includes(userRole)
}

export function Sidebar() {
  const { pathname } = useLocation()
  const { sidebarExpanded, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname === path || pathname.startsWith(path + '/')
  }

  const userRole = user?.role ?? 'sales_rep'

  const visibleGroups = navGroups.filter((group) =>
    canSeeGroup(group.roles, userRole)
  )

  return (
    <aside className={cn('app-sidebar', !sidebarExpanded && 'collapsed')} id="app-sidebar">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2.5 px-3.5 h-[var(--header-height)] border-b border-[var(--color-border)] flex-shrink-0">
        {/* <div className="w-7 h-7 rounded-md bg-[var(--color-accent-primary)] flex items-center justify-center flex-shrink-0">
          <Beaker className="w-4 h-4 text-white" />
        </div> */}
        {sidebarExpanded && (
          <div className="min-w-0">
            <p className="text-lg font-bold text-[var(--color-text-primary)] leading-tight tracking-tight truncate">
              PHARMA INTELLIGENCE
            </p>
            <p className="text-2xs text-[var(--color-text-muted)] leading-tight tracking-wide truncate">
              OS
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-2"
        aria-label="Main navigation"
      >
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {sidebarExpanded && (
              <div className="nav-group-label">{group.label}</div>
            )}
            {!sidebarExpanded && (
              <div className="h-3" /> /* spacing between groups when collapsed */
            )}
            {group.items.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={`${group.label}-${item.label}`}
                  to={item.path}
                  className={cn('nav-item', active && 'active')}
                  title={!sidebarExpanded ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <item.icon className="nav-icon" />
                  {sidebarExpanded && (
                    <span className="nav-item-label truncate">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User info + Logout */}
      {user && (
        <div className="border-t border-[var(--color-border)] p-2 flex-shrink-0">
          {sidebarExpanded ? (
            <div style={{ marginBottom: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.375rem',
                  borderRadius: '8px',
                  background: 'var(--color-bg-elevated)',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `${user.avatarColor}25`,
                    border: `1px solid ${user.avatarColor}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: user.avatarColor,
                  }}
                >
                  {user.initials}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.2,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.name}
                  </p>
                  <p
                    style={{
                      fontSize: '0.65rem',
                      color: user.avatarColor,
                      lineHeight: 1.2,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {user.roleLabel}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              title={`${user.name} — ${user.roleLabel}`}
              style={{
                width: '32px',
                height: '32px',
                margin: '0 auto 6px',
                borderRadius: '50%',
                background: `${user.avatarColor}20`,
                border: `1px solid ${user.avatarColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: user.avatarColor,
              }}
            >
              {user.initials}
            </div>
          )}
        </div>
      )}

      {/* Collapse toggle + logout */}
      <div className="border-t border-[var(--color-border)] p-2 flex-shrink-0 flex gap-1.5">
        <button
          className="flex-1 flex items-center justify-center gap-2 p-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors text-xs"
          onClick={toggleSidebar}
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          id="sidebar-toggle"
        >
          {sidebarExpanded ? (
            <>
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Logout */}
        <button
          className="flex items-center justify-center p-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-accent-rose)] hover:bg-[var(--color-bg-hover)] transition-colors"
          onClick={logout}
          aria-label="Logout"
          id="sidebar-logout-btn"
          title="Sign out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  )
}
