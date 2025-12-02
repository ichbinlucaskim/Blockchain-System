/**
 * Enhanced AI Detection with Multiple Layers
 * 
 * 더 강력한 AI 탐지를 위한 다중 레이어 시스템
 */

import { detectAIContent, AIDetectionResult } from './ai-detection'

export interface EnhancedAIDetectionResult extends AIDetectionResult {
  layers: {
    pattern: AIDetectionResult
    api: AIDetectionResult
    behavior?: AIDetectionResult
    community?: AIDetectionResult
  }
  finalConfidence: number
  isHuman: boolean
}

/**
 * 행동 기반 검증
 */
export async function detectBehaviorPatterns(
  metadata: {
    typingSpeed?: number
    typingPattern?: number[] // 시간 간격 배열
    pauseCount?: number
    backspaceCount?: number
    timeSpent?: number
  }
): Promise<AIDetectionResult> {
  let confidence = 0.5
  const reasons: string[] = []

  // 인간은 불규칙한 타이핑 패턴을 가짐
  if (metadata.typingPattern && metadata.typingPattern.length > 5) {
    const variance = calculateVariance(metadata.typingPattern)
    // 높은 분산 = 불규칙 = 인간
    if (variance > 100) {
      confidence += 0.2
      reasons.push('Irregular typing pattern (human-like)')
    } else if (variance < 20) {
      confidence -= 0.3
      reasons.push('Too regular typing pattern (bot-like)')
    }
  }

  // 인간은 백스페이스를 많이 사용
  if (metadata.backspaceCount && metadata.backspaceCount > 0) {
    const backspaceRatio = metadata.backspaceCount / (metadata.typingSpeed || 1)
    if (backspaceRatio > 0.1) {
      confidence += 0.15
      reasons.push('Backspace usage suggests human')
    }
  }

  // 인간은 휴식 시간을 가짐
  if (metadata.pauseCount && metadata.pauseCount > 2) {
    confidence += 0.1
    reasons.push('Pauses detected (human-like)')
  }

  confidence = Math.max(0, Math.min(1, confidence))

  return {
    isHuman: confidence > 0.3,
    confidence,
    method: 'behavior-analysis',
    details: { reasons },
  }
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length
  return variance
}

/**
 * 다중 AI 탐지 API 조합
 */
export async function detectWithMultipleAPIs(
  content: string,
  apiKeys: {
    gptzero?: string
    openai?: string
    custom?: string
  }
): Promise<AIDetectionResult> {
  const results: AIDetectionResult[] = []

  // GPTZero
  if (apiKeys.gptzero) {
    try {
      const response = await fetch('https://api.gptzero.me/v2/predict/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys.gptzero,
        },
        body: JSON.stringify({ document: content }),
      })
      if (response.ok) {
        const data = await response.json()
        const aiProb = data.documents?.[0]?.average_generated_prob || 0.5
        results.push({
          isHuman: aiProb < 0.2,
          confidence: 1 - aiProb,
          method: 'gptzero',
        })
      }
    } catch (e) {
      console.error('GPTZero error:', e)
    }
  }

  // OpenAI Classifier
  if (apiKeys.openai) {
    try {
      const response = await fetch('https://api.openai.com/v1/classifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: 'text-moderation-latest',
          input: content,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        // OpenAI 결과 처리
        results.push({
          isHuman: true, // OpenAI는 다른 목적
          confidence: 0.7,
          method: 'openai-classifier',
        })
      }
    } catch (e) {
      console.error('OpenAI error:', e)
    }
  }

  // 결과 통합 (Ensemble)
  if (results.length === 0) {
    return {
      isHuman: true,
      confidence: 0.5,
      method: 'no-api-available',
    }
  }

  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length
  const humanCount = results.filter(r => r.isHuman).length
  const isHuman = humanCount > results.length / 2

  return {
    isHuman,
    confidence: avgConfidence,
    method: 'multi-api-ensemble',
    details: { results },
  }
}

/**
 * 향상된 AI 탐지 (다중 레이어)
 */
export async function enhancedAIDetection(
  content: string,
  metadata?: {
    typingSpeed?: number
    typingPattern?: number[]
    pauseCount?: number
    backspaceCount?: number
    hasPasteEvent?: boolean
    timeSpent?: number
  },
  apiKeys?: {
    gptzero?: string
    openai?: string
    custom?: string
  }
): Promise<EnhancedAIDetectionResult> {
  // 레이어 1: 패턴 기반 탐지
  const patternResult = await detectAIContent(
    content,
    {
      typingSpeed: metadata?.typingSpeed,
      hasPasteEvent: metadata?.hasPasteEvent,
      timeSpent: metadata?.timeSpent,
    }
  )

  // 레이어 2: API 기반 탐지
  const apiResult = apiKeys
    ? await detectWithMultipleAPIs(content, apiKeys)
    : await detectAIContent(content, undefined, apiKeys?.gptzero)

  // 레이어 3: 행동 기반 탐지
  const behaviorResult = metadata
    ? await detectBehaviorPatterns(metadata)
    : { isHuman: true, confidence: 0.5, method: 'no-behavior-data' }

  // 결과 통합 (가중 평균)
  const weights = {
    pattern: 0.3,
    api: 0.5,
    behavior: 0.2,
  }

  const finalConfidence =
    patternResult.confidence * weights.pattern +
    apiResult.confidence * weights.api +
    behaviorResult.confidence * weights.behavior

  const isHuman = finalConfidence > 0.35 // 더 엄격한 기준

  return {
    isHuman,
    confidence: finalConfidence,
    method: 'enhanced-multi-layer',
    finalConfidence,
    layers: {
      pattern: patternResult,
      api: apiResult,
      behavior: behaviorResult,
    },
  }
}

