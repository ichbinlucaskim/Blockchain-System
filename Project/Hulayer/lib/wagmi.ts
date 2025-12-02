'use client'

import { createConfig, http } from 'wagmi'
import { polygon, base } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

// WalletConnect is optional - only include if project ID is provided
// This avoids build errors when the package isn't needed
const connectors = [injected(), metaMask()]

// Only add WalletConnect if project ID is provided
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  try {
    const { walletConnect } = require('wagmi/connectors')
    connectors.push(walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }))
  } catch (e) {
    // WalletConnect not available, skip it
    console.warn('WalletConnect not available')
  }
}

export const config = createConfig({
  chains: [polygon, base],
  connectors,
  transports: {
    [polygon.id]: http(),
    [base.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

