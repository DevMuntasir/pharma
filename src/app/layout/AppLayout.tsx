// ─────────────────────────────────────────────────────────
// COMPONENT: AppLayout
// Root layout wrapper: sidebar + header + content
// ─────────────────────────────────────────────────────────

import { type ReactNode } from 'react'
import { Sidebar } from '../navigation/Sidebar'
import { TopHeader } from '../navigation/TopHeader'
import { useUIStore } from '@/store/useUIStore'
import { cn } from '@/utils'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarMobileOpen, setMobileSidebarOpen } = useUIStore()

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={cn(sidebarMobileOpen && 'mobile-open')}>
        <Sidebar />
      </div>

      {/* Main */}
      <div className="app-main">
        <TopHeader />
        <main className="app-content" id="main-content" role="main">
          {children}
        </main>
      </div>
    </div>
  )
}
