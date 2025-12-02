'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { setWallet, logout } = useAuthStore()

  useEffect(() => {
    if (isConnected && address) {
      setWallet(address)
    } else {
      logout()
    }
  }, [isConnected, address, setWallet, logout])

  const handleDisconnect = () => {
    disconnect()
    logout()
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-center sm:text-left">
          <span className="text-xs sm:text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
        >
          {isPending ? 'Connecting...' : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  )
}

