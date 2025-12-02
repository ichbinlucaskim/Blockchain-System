'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAuthStore } from '@/store/auth-store'
import { ethers } from 'ethers'
import { detectAIContent } from '@/lib/ai-detection'

interface PostEditorProps {
  onPostCreated?: () => void
}

export default function PostEditor({ onPostCreated }: PostEditorProps) {
  const { address } = useAccount()
  const { hasPassport } = useAuthStore()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Track typing metadata
  const [typingStartTime] = useState(Date.now())
  const [hasPasteEvent, setHasPasteEvent] = useState(false)
  const [pasteCount, setPasteCount] = useState(0)
  const [showPasteWarning, setShowPasteWarning] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(0)
  const [isManuallyWritten, setIsManuallyWritten] = useState(false)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Improved paste handling: Warn instead of blocking
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text') || ''
      
      // Allow paste but track it
      setHasPasteEvent(true)
      setPasteCount(prev => prev + 1)
      
      // Show warning for large pastes
      if (pastedText.length > 50) {
        setShowPasteWarning(true)
        // Auto-hide warning after 5 seconds
        setTimeout(() => setShowPasteWarning(false), 5000)
      }
    }

    // Track typing speed
    let lastLength = 0
    const handleInput = () => {
      const currentLength = textarea.value.length
      const timeElapsed = (Date.now() - typingStartTime) / 1000
      if (timeElapsed > 0) {
        setTypingSpeed(currentLength / timeElapsed)
      }
      
      // If user types after paste, consider it manually written
      if (hasPasteEvent && currentLength > lastLength + 10) {
        setIsManuallyWritten(true)
      }
      
      lastLength = currentLength
    }

    textarea.addEventListener('paste', handlePaste)
    textarea.addEventListener('input', handleInput)

    return () => {
      textarea.removeEventListener('paste', handlePaste)
      textarea.removeEventListener('input', handleInput)
    }
  }, [typingStartTime, hasPasteEvent])

  const handleSubmit = async () => {
    if (!address || !hasPassport) {
      setError('Please connect wallet and verify with World ID first')
      return
    }

    if (content.trim().length < 10) {
      setError('Content must be at least 10 characters')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Step 1: AI Detection (more strict if pasted content)
      const timeSpent = (Date.now() - typingStartTime) / 1000
      const aiResult = await detectAIContent(
        content,
        {
          typingSpeed,
          hasPasteEvent: pasteCount > 0,
          timeSpent,
        },
        process.env.NEXT_PUBLIC_AI_DETECTION_API_KEY
      )

      // Adjust threshold based on paste events
      const adjustedConfidence = pasteCount > 0 
        ? aiResult.confidence * 0.7 // Lower confidence if pasted
        : aiResult.confidence

      if (adjustedConfidence < 0.3) {
        setError(
          `Content appears to be AI-generated (confidence: ${(adjustedConfidence * 100).toFixed(1)}%). Please write original content in your own words.`
        )
        setIsSubmitting(false)
        return
      }

      // Step 2: Get signature from wallet (NO GAS FEE - just a signature)
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or a compatible wallet')
      }
      
      // Show confirmation that this is free
      const confirmMessage = `This signature is FREE and does not require any gas fees.\n\nIt only verifies that you are the author of this content.\n\nProceed?`
      if (!window.confirm(confirmMessage)) {
        setIsSubmitting(false)
        return
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const message = `Human Layer Content Verification\n\n${content}\n\nTimestamp: ${Date.now()}`
      const signature = await signer.signMessage(message)

      // Step 3: Submit to backend
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          signature,
          address,
          aiConfidence: aiResult.confidence,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post')
      }

      // Success
      setContent('')
      onPostCreated?.()
    } catch (err: any) {
      console.error('Post creation error:', err)
      setError(err.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasPassport) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          Please verify with World ID to create posts.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Create Post
      </h2>
      
      {/* Gas Fee Notice */}
      <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-200 flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400">✓</span>
          <span><strong>No gas fees required</strong> - Signing is free and only verifies your identity</span>
        </p>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts... (Original content preferred)"
        className="w-full min-h-[120px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        disabled={isSubmitting}
      />
      
      {/* Paste Warning */}
      {showPasteWarning && (
        <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Pasted content detected. AI detection will be more strict. Please ensure this is your original work.
          </p>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {content.length} characters
          </div>
          {pasteCount > 0 && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              {pasteCount} paste event{pasteCount > 1 ? 's' : ''} detected
            </div>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || content.trim().length < 10}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  )
}

