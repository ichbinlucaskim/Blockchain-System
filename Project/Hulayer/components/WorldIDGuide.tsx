'use client'

export default function WorldIDGuide() {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        📱 How to Verify with World ID
      </h3>
      <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
        <div className="flex items-start gap-3">
          <span className="font-bold">1.</span>
          <p>Click "Verify with World ID" button above</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-bold">2.</span>
          <p>You'll be redirected to World ID verification</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-bold">3.</span>
          <p>Use the Worldcoin app to scan your iris (biometric verification)</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-bold">4.</span>
          <p>Once verified, you'll receive your Human Passport (SBT)</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Privacy Note:</strong> World ID only verifies that you're human. 
          Your identity remains anonymous. We never see your biometric data.
        </p>
      </div>
      
      <div className="mt-4">
        <a
          href="https://worldcoin.org/world-id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Learn more about World ID →
        </a>
      </div>
    </div>
  )
}

