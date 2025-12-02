'use client'

import { Post } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { useAccount } from 'wagmi'

interface PostCardProps {
  post: Post
  onLike?: (postId: string) => void
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { address } = useAccount()
  const [isLiking, setIsLiking] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)

  const handleLike = async () => {
    if (!address || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      if (response.ok) {
        setLikeCount((prev) => prev + 1)
        onLike?.(post.id)
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const authorDisplay = `${post.author_wallet.slice(0, 6)}...${post.author_wallet.slice(-4)}`

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
              {authorDisplay[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                {authorDisplay}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
        {post.is_ai_verified && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full flex-shrink-0">
            ✓ Verified
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words text-sm sm:text-base">
          {post.content_body}
        </p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          disabled={isLiking || !address}
          className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400 font-mono hidden sm:block">
          {post.content_hash.slice(0, 16)}...
        </div>
      </div>
    </article>
  )
}

