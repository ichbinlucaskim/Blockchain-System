'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/store/auth-store'

export default function OptionalSBTMint() {
  const { address } = useAccount()
  const { hasPassport, nullifierHash } = useAuthStore()
  const [isMinting, setIsMinting] = useState(false)
  const [minted, setMinted] = useState(false)

  const handleMint = async () => {
    if (!address || !nullifierHash) return

    setIsMinting(true)
    try {
      const response = await fetch('/api/mint-passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          nullifierHash,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setMinted(true)
      } else {
        throw new Error(data.error || 'Minting failed')
      }
    } catch (error: any) {
      console.error('SBT minting error:', error)
      alert(`Minting failed: ${error.message}\n\nNote: This requires a small gas fee (~$0.01-0.05 on Polygon).`)
    } finally {
      setIsMinting(false)
    }
  }

  if (!hasPassport || minted) {
    return null
  }

  return (
    <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
        🎫 Get Your Human Passport NFT (Optional)
      </h3>
      <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
        Mint a Soulbound Token (SBT) as proof of your verified human identity. 
        This is optional and requires a small gas fee (~$0.01-0.05 on Polygon).
      </p>
      <button
        onClick={handleMint}
        disabled={isMinting}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
      >
        {isMinting ? 'Minting...' : 'Mint Human Passport NFT'}
      </button>
      {minted && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ Human Passport minted successfully!
        </p>
      )}
    </div>
  )
}

