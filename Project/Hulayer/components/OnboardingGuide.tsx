'use client'

import { useState } from 'react'

interface OnboardingGuideProps {
  onComplete?: () => void
  onSkip?: () => void
}

export default function OnboardingGuide({ onComplete, onSkip }: OnboardingGuideProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: 'Welcome to Human Layer',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a zero-bot platform where only verified humans can participate.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Every post is verified. Every human is real.
          </p>
        </div>
      ),
    },
    {
      title: 'Why World ID?',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            World ID uses biometric verification to prove you're a real human. This prevents bots and AI from flooding the platform.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Your privacy is protected - we only verify that you're human, not who you are.
          </p>
        </div>
      ),
    },
    {
      title: 'How It Works',
      content: (
        <div className="space-y-4">
          <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Connect your wallet (MetaMask, etc.)</li>
            <li>Verify with World ID (biometric scan)</li>
            <li>Get your Human Passport (SBT)</li>
            <li>Start creating verified content!</li>
          </ol>
        </div>
      ),
    },
    {
      title: 'Content Guidelines',
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            We use AI detection to ensure all content is human-written. Tips:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Write in your own words</li>
            <li>Pasted content will be more strictly checked</li>
            <li>Be authentic - humans make mistakes, and that's okay!</li>
          </ul>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete?.()
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {steps[step].title}
          </h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        <div className="mb-6 min-h-[120px]">
          {steps[step].content}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Skip
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {step === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

