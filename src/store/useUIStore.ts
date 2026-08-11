// ─────────────────────────────────────────────────────────
// STORE: UI State
// Sidebar, modals, and other global UI state.
// ─────────────────────────────────────────────────────────

import { create } from 'zustand'

interface UIState {
  sidebarExpanded: boolean
  sidebarMobileOpen: boolean
  activeSearchQuery: string
  searchOpen: boolean
  // Actions
  toggleSidebar: () => void
  setSidebarExpanded: (expanded: boolean) => void
  toggleMobileSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  activeSearchQuery: '',
  searchOpen: false,

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
}))
