'use client'

import { useEffect, useState } from 'react'
import WalletConnect from '@/components/WalletConnect'
import WorldIDAuth from '@/components/WorldIDAuth'
import WorldIDOnlyAuth from '@/components/WorldIDOnlyAuth'
import WorldIDGuide from '@/components/WorldIDGuide'
import OnboardingGuide from '@/components/OnboardingGuide'
import OptionalSBTMint from '@/components/OptionalSBTMint'
import PostEditor from '@/components/PostEditor'
import PostCard from '@/components/PostCard'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/store/auth-store'
import { Post } from '@/types/database'

export default function Home() {
  const { isConnected } = useAccount()
  const { worldIdVerified, hasPassport, nullifierHash } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetchPosts()
    
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=20')
      const data = await response.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWorldIdSuccess = async (nullifierHash: string) => {
    // Check if user has passport (SBT)
    // This would normally check on-chain, but for now we'll assume they have it after World ID verification
    useAuthStore.getState().setPassport(true)
    
    // Refresh posts
    fetchPosts()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Human Layer
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                The Anti-AI Zone • Verified Humans Only
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Authentication Flow */}
        {!isConnected && !worldIdVerified && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Welcome to Human Layer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This is a zero-bot platform where only verified humans can participate.
            </p>
            
            {/* 두 가지 옵션 제공 */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Option 1: World ID Only (Recommended)
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Start immediately with just World ID verification. No wallet needed!
                </p>
                <WorldIDOnlyAuth onSuccess={handleWorldIdSuccess} />
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Option 2: Wallet + World ID (Advanced)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Connect wallet for blockchain features (optional).
                </p>
                <WalletConnect />
              </div>
            </div>
          </div>
        )}

        {!worldIdVerified && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Verify Your Humanity
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To participate in Human Layer, you need to verify your identity using
              World ID. This ensures only real humans can create content.
            </p>
            <WorldIDGuide />
            
            {/* 지갑 연결 여부에 따라 다른 옵션 제공 */}
            {isConnected ? (
              <WorldIDAuth onSuccess={handleWorldIdSuccess} />
            ) : (
              <div className="space-y-3">
                <WorldIDOnlyAuth onSuccess={handleWorldIdSuccess} />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  or
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="mb-2">Want blockchain features?</p>
                  <WalletConnect />
                </div>
              </div>
            )}
          </div>
        )}

        {isConnected && worldIdVerified && !hasPassport && (
          <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              World ID verified! You can now create posts. SBT minting is optional.
            </p>
          </div>
        )}

        {/* Optional SBT Mint */}
        {hasPassport && (
          <OptionalSBTMint />
        )}

        {/* Post Editor */}
        {hasPassport && (
          <div className="mb-8">
            <PostEditor onPostCreated={fetchPosts} />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Human Feed
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No posts yet. Be the first human to share something!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={fetchPosts} />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Human Layer - Built on World ID & Blockchain</p>
          <p className="mt-2">Every post is verified. Every human is real.</p>
        </div>
      </footer>

      {/* Onboarding Guide */}
      {showOnboarding && (
        <OnboardingGuide
          onComplete={() => {
            setShowOnboarding(false)
            localStorage.setItem('hasSeenOnboarding', 'true')
          }}
          onSkip={() => {
            setShowOnboarding(false)
            localStorage.setItem('hasSeenOnboarding', 'true')
          }}
        />
      )}
    </div>
  )
}
