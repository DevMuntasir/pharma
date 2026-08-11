// ─────────────────────────────────────────────────────────
// STORE: UI State
// Sidebar, modals, and other global UI state.
// ─────────────────────────────────────────────────────────

import { create } from 'zustand'

type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('pharma-theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch {}
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try { localStorage.setItem('pharma-theme', theme) } catch {}
}

interface UIState {
  sidebarExpanded: boolean
  sidebarMobileOpen: boolean
  activeSearchQuery: string
  searchOpen: boolean
  theme: Theme
  // Actions
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSearchOpen: (open: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

// Apply theme on store initialisation
const _initialTheme = getInitialTheme()
applyTheme(_initialTheme)

export const useUIStore = create<UIState>()((set) => ({
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  activeSearchQuery: '',
  searchOpen: false,
  theme: _initialTheme,

  toggleSidebar: () => {
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded }))
  },

  setSidebarExpanded: (expanded: boolean) => {
    set({ sidebarExpanded: expanded })
  },

  toggleMobileSidebar: () => {
    set((state) => ({ sidebarMobileOpen: !state.sidebarMobileOpen }))
  },

  setMobileSidebarOpen: (open: boolean) => {
    set({ sidebarMobileOpen: open })
  },

  setSearchQuery: (query: string) => {
    set({ activeSearchQuery: query })
  },

  setSearchOpen: (open: boolean) => {
    set({ searchOpen: open })
  },

  toggleTheme: () => {
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      return { theme: next }
    })
  },

  setTheme: (theme: Theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
