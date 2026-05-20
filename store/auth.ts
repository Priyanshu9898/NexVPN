'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface AuthUser {
  id: string
  email: string
  name: string
  plan: string
  role: 'USER' | 'ADMIN'
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  setSession: (user: AuthUser, accessToken: string, refreshToken: string) => void
  logout: () => void
  clearError: () => void
}

function setAuthCookies(token: string, role: string) {
  document.cookie = `nexvpn-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
  document.cookie = `nexvpn-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

function clearAuthCookies() {
  document.cookie = 'nexvpn-token=; path=/; max-age=0'
  document.cookie = 'nexvpn-role=; path=/; max-age=0'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/api/v1/auth/login', { email, password })
          const { user, accessToken, refreshToken } = res.data
          localStorage.setItem('token', accessToken)
          setAuthCookies(accessToken, user.role)
          set({ user, accessToken, refreshToken, isLoading: false })
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Login failed. Please try again.'
          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/api/v1/auth/register', { name, email, password })
          const { user, accessToken, refreshToken } = res.data
          localStorage.setItem('token', accessToken)
          setAuthCookies(accessToken, user.role)
          set({ user, accessToken, refreshToken, isLoading: false })
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Registration failed. Please try again.'
          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      setSession: (user, accessToken, refreshToken) => {
        localStorage.setItem('token', accessToken)
        setAuthCookies(accessToken, user.role)
        set({ user, accessToken, refreshToken })
      },

      logout: () => {
        localStorage.removeItem('token')
        clearAuthCookies()
        set({ user: null, accessToken: null, refreshToken: null, error: null })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'nexvpn-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
