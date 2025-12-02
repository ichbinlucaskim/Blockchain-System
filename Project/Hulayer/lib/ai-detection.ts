/**
 * AI Content Detection Service
 * 
 * This module provides multiple methods to detect AI-generated content:
 * 1. Pattern-based detection (typing speed, copy-paste detection)
 * 2. API-based detection (GPTZero, OpenAI Classifier, etc.)
 * 3. Metadata analysis
 */

export interface AIDetectionResult {
  isHuman: boolean
  confidence: number // 0-1, higher = more likely human
  method: string
  details?: any
}

/**
 * Pattern-based detection: Check for suspicious patterns
 */
export async function detectAIPatterns(
  content: string,
  metadata?: {
    typingSpeed?: number // characters per second
    hasPasteEvent?: boolean
    timeSpent?: number // seconds
  }
): Promise<AIDetectionResult> {
  let confidence = 0.5 // Start neutral
  const reasons: string[] = []

  // Check 1: Content length vs time spent
  if (metadata?.timeSpent && metadata.timeSpent > 0) {
    const charsPerSecond = content.length / metadata.timeSpent
    // Average human typing: 40-60 WPM = ~200-300 chars/min = ~3-5 chars/sec
    if (charsPerSecond > 10) {
      confidence -= 0.3
      reasons.push('Typing speed too fast')
    } else if (charsPerSecond < 0.5 && content.length > 100) {
      confidence += 0.1 // Very slow typing suggests human
    }
  }

  // Check 2: Paste event detection
  if (metadata?.hasPasteEvent) {
    confidence -= 0.4
    reasons.push('Copy-paste detected')
  }

  // Check 3: Content patterns
  // AI often has very consistent sentence lengths
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length > 3) {
    const lengths = sentences.map(s => s.length)
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length
    const stdDev = Math.sqrt(variance)
    
    // Very low variance suggests AI
    if (stdDev < 10 && avgLength > 50) {
      confidence -= 0.2
      reasons.push('Sentence structure too uniform')
    }
  }

  // Check 4: Common AI phrases
  const aiPhrases = [
    'as an AI',
    'I apologize',
    'I cannot',
    'I don\'t have access',
    'I\'m not able to',
  ]
  const lowerContent = content.toLowerCase()
  if (aiPhrases.some(phrase => lowerContent.includes(phrase))) {
    confidence -= 0.5
    reasons.push('Contains AI-like phrases')
  }

  // Check 5: Typos and inconsistencies (humans make mistakes)
  const hasTypos = /(teh|adn|taht|recieve|seperate)/i.test(content)
  if (hasTypos && content.length > 50) {
    confidence += 0.1
  }

  confidence = Math.max(0, Math.min(1, confidence))

  return {
    isHuman: confidence > 0.3,
    confidence,
    method: 'pattern-analysis',
    details: { reasons }
  }
}

/**
 * API-based detection using external services
 */
export async function detectAIViaAPI(
  content: string,
  apiKey?: string
): Promise<AIDetectionResult> {
  // If no API key, fall back to pattern detection
  if (!apiKey) {
    return detectAIPatterns(content)
  }

  try {
    // Example: GPTZero API (you can replace with other services)
    const response = await fetch('https://api.gptzero.me/v2/predict/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        document: content,
      }),
    })

    if (!response.ok) {
      // Fallback to pattern detection
      return detectAIPatterns(content)
    }

    const data = await response.json()
    const aiProbability = data.documents?.[0]?.average_generated_prob || 0.5

    return {
      isHuman: aiProbability < 0.2, // Less than 20% AI probability
      confidence: 1 - aiProbability,
      method: 'gptzero-api',
      details: data,
    }
  } catch (error) {
    console.error('AI detection API error:', error)
    // Fallback to pattern detection
    return detectAIPatterns(content)
  }
}

/**
 * Combined detection: Use both pattern and API
 */
export async function detectAIContent(
  content: string,
  metadata?: {
    typingSpeed?: number
    hasPasteEvent?: boolean
    timeSpent?: number
  },
  apiKey?: string
): Promise<AIDetectionResult> {
  // Run both detections
  const [patternResult, apiResult] = await Promise.all([
    detectAIPatterns(content, metadata),
    detectAIViaAPI(content, apiKey),
  ])

  // Combine results (weighted average)
  const combinedConfidence = (patternResult.confidence * 0.4 + apiResult.confidence * 0.6)
  const isHuman = combinedConfidence > 0.3

  return {
    isHuman,
    confidence: combinedConfidence,
    method: 'combined',
    details: {
      pattern: patternResult,
      api: apiResult,
    },
  }
}

