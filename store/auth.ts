import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface AuthUser {
  id: string
  email: string
  name: string
  plan: string
}

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
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
          document.cookie = `nexvpn-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
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
          document.cookie = `nexvpn-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
          set({ user, accessToken, refreshToken, isLoading: false })
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Registration failed. Please try again.'
          set({ error: msg, isLoading: false })
          throw new Error(msg)
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        document.cookie = 'nexvpn-token=; path=/; max-age=0'
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
