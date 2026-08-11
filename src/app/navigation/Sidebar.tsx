// ─────────────────────────────────────────────────────────
// COMPONENT: Sidebar
// Collapsible enterprise navigation sidebar
// ─────────────────────────────────────────────────────────

import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Beaker } from 'lucide-react'
import { navGroups } from './navConfig'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils'

export function Sidebar() {
  const { pathname } = useLocation()
  const { sidebarExpanded, toggleSidebar } = useUIStore()

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard' || pathname === '/'
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <aside className={cn('app-sidebar', !sidebarExpanded && 'collapsed')} id="app-sidebar">
      {/* Logo/Brand */}
      <div className="flex items-center gap-2.5 px-3.5 h-[var(--header-height)] border-b border-[var(--color-border)] flex-shrink-0">
        <div className="w-7 h-7 rounded-md bg-[var(--color-accent-primary)] flex items-center justify-center flex-shrink-0">
          <Beaker className="w-4 h-4 text-white" />
        </div>
        {sidebarExpanded && (
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight tracking-tight truncate">
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
        {navGroups.map((group) => (
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

      {/* Collapse toggle */}
      <div className="border-t border-[var(--color-border)] p-2 flex-shrink-0">
        <button
          className="w-full flex items-center justify-center gap-2 p-2 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors text-xs"
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
      </div>
    </aside>
  )
}
