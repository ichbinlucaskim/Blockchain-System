'use client'

import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'

interface WorldIDAuthProps {
  onSuccess?: (nullifierHash: string) => void
}

export default function WorldIDAuth({ onSuccess }: WorldIDAuthProps) {
  const { setWorldIdVerification, walletAddress } = useAuthStore()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async (proof: any) => {
    setIsVerifying(true)
    try {
      // Verify proof on backend
      const response = await fetch('/api/verify-world-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof,
          walletAddress,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setWorldIdVerification(true, data.nullifierHash)
        
        // Set passport in DB (no gas fee)
        // SBT minting is optional and can be done later
        useAuthStore.getState().setPassport(true)
        
        // Optionally mint SBT (user can skip this)
        // For now, we'll skip automatic minting to avoid gas fees
        // Users can mint SBT later if they want
        
        onSuccess?.(data.nullifierHash)
      } else {
        throw new Error(data.error || 'Verification failed')
      }
    } catch (error) {
      console.error('World ID verification error:', error)
      alert('Verification failed. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID || 'app_staging_xxx'
  const action = process.env.NEXT_PUBLIC_WORLD_ID_ACTION || 'human-layer-verify'

  return (
    <IDKitWidget
      app_id={appId}
      action={action}
      verification_level={VerificationLevel.Orb}
      onSuccess={handleVerify}
      enableTelemetry
    >
      {({ open }) => (
        <button
          onClick={open}
          disabled={isVerifying || !walletAddress}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? 'Verifying...' : 'Verify with World ID'}
        </button>
      )}
    </IDKitWidget>
  )
}

