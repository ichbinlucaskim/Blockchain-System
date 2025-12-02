'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  walletAddress: string | null
  worldIdVerified: boolean
  nullifierHash: string | null
  hasPassport: boolean
  setWallet: (address: string | null) => void
  setWorldIdVerification: (verified: boolean, nullifierHash: string | null) => void
  setPassport: (hasPassport: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      walletAddress: null,
      worldIdVerified: false,
      nullifierHash: null,
      hasPassport: false,
      setWallet: (address) => set({ walletAddress: address, isAuthenticated: !!address }),
      setWorldIdVerification: (verified, nullifierHash) =>
        set({ worldIdVerified: verified, nullifierHash }),
      setPassport: (hasPassport) => set({ hasPassport }),
      logout: () =>
        set({
          isAuthenticated: false,
          walletAddress: null,
          worldIdVerified: false,
          nullifierHash: null,
          hasPassport: false,
        }),
    }),
    {
      name: 'human-layer-auth',
    }
  )
)

