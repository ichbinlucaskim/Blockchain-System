'use client'

import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'

interface WorldIDOnlyAuthProps {
  onSuccess?: (nullifierHash: string) => void
}

/**
 * World ID만으로 인증 (지갑 불필요)
 * 진입 장벽을 낮추기 위한 옵션
 */
export default function WorldIDOnlyAuth({ onSuccess }: WorldIDOnlyAuthProps) {
  const { setWorldIdVerification } = useAuthStore()
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async (proof: any) => {
    setIsVerifying(true)
    try {
      // Verify proof on backend (지갑 없이도 가능)
      const response = await fetch('/api/verify-world-id-only', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proof,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setWorldIdVerification(true, data.nullifierHash)
        useAuthStore.getState().setPassport(true)
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
          disabled={isVerifying}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isVerifying ? 'Verifying...' : 'Verify with World ID (No Wallet Needed)'}
        </button>
      )}
    </IDKitWidget>
  )
}

