// ─────────────────────────────────────────────────────────
// STORE: Authentication & Role-Based Access Control
// Demo-only: credentials are hardcoded for prototype use.
// In production, replace with real API-based auth.
// ─────────────────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, UserRole } from '@/types'

// ── Demo Credentials ────────────────────────────────────
interface DemoUserRecord extends AuthUser {
  password: string
}

const DEMO_USERS: Record<string, DemoUserRecord> = {
  'admin@pharma.demo': {
    id: 'USR-001',
    name: 'Rahman Ahmed',
    email: 'admin@pharma.demo',
    password: 'admin123',
    role: 'national_manager',
    roleLabel: 'National Manager',
    initials: 'RA',
    avatarColor: '#6366f1',
  },
  'manager@pharma.demo': {
    id: 'USR-002',
    name: 'Fatima Khan',
    email: 'manager@pharma.demo',
    password: 'mgr123',
    role: 'regional_manager',
    roleLabel: 'Regional Manager',
    initials: 'FK',
    avatarColor: '#0ea5e9',
    territory: 'Dhaka Region',
  },
  'rep@pharma.demo': {
    id: 'USR-003',
    name: 'Karim Hossain',
    email: 'rep@pharma.demo',
    password: 'rep123',
    role: 'sales_rep',
    roleLabel: 'Sales Representative',
    initials: 'KH',
    avatarColor: '#10b981',
    territory: 'Dhaka Central',
  },
}

// ── Role Permissions ────────────────────────────────────
// Paths the role can access. '*' = unrestricted.
export const ROLE_ALLOWED_PATHS: Record<UserRole, string[]> = {
  national_manager: ['*'],
  regional_manager: [
    '/dashboard',
    '/market',
    '/prescriptions',
    '/doctors',
    '/products',
    '/territories',
    '/competition',
    '/demand',
    '/forecast',
    '/scenarios',
    '/insights',
    '/opportunities',
  ],
  sales_rep: [
    '/dashboard',
    '/territories',
    '/doctors',
    '/insights',
  ],
}

// ── Store ────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loginError: string | null
  // Actions
  login: (email: string, password: string) => boolean
  logout: () => void
  clearError: () => void
  hasAccess: (path: string) => boolean
  canAccessPath: (path: string, role: UserRole) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loginError: null,

      login: (email: string, password: string) => {
        const record = DEMO_USERS[email.toLowerCase().trim()]
        if (record && record.password === password) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pw, ...user } = record
          set({ user, isAuthenticated: true, loginError: null })
          return true
        }
        set({ loginError: 'Invalid email or password. Use the demo credentials below.' })
        return false
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, loginError: null })
      },

      clearError: () => set({ loginError: null }),

      hasAccess: (path: string) => {
        const { user } = get()
        if (!user) return false
        return get().canAccessPath(path, user.role)
      },

      canAccessPath: (path: string, role: UserRole) => {
        const allowed = ROLE_ALLOWED_PATHS[role]
        if (allowed.includes('*')) return true
        return allowed.some((p) => path === p || path.startsWith(p + '/'))
      },
    }),
    { name: 'pharma-auth-v1' }
  )
)

// ── Exported demo users (for login page display) ─────────
export const DEMO_CREDENTIALS = [
  {
    email: 'admin@pharma.demo',
    password: 'admin123',
    role: 'National Manager' as const,
    name: 'Rahman Ahmed',
    color: '#6366f1',
    access: 'Full access to all modules',
  },
  {
    email: 'manager@pharma.demo',
    password: 'mgr123',
    role: 'Regional Manager' as const,
    name: 'Fatima Khan',
    color: '#0ea5e9',
    access: 'Market, Doctors, Territories & more',
  },
  {
    email: 'rep@pharma.demo',
    password: 'rep123',
    role: 'Sales Rep' as const,
    name: 'Karim Hossain',
    color: '#10b981',
    access: 'Dashboard, Territories & Doctors',
  },
]
