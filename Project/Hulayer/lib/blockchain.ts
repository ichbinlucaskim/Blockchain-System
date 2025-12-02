import { ethers } from 'ethers'

/**
 * Blockchain utilities for content signing and verification
 */

export interface SignedContent {
  content: string
  signature: string
  address: string
  timestamp: number
}

/**
 * Sign content with wallet
 */
export async function signContent(
  content: string,
  signer: ethers.Signer
): Promise<SignedContent> {
  const address = await signer.getAddress()
  const message = `Human Layer Content Verification\n\n${content}\n\nTimestamp: ${Date.now()}`
  
  const signature = await signer.signMessage(message)
  
  return {
    content,
    signature,
    address,
    timestamp: Date.now(),
  }
}

/**
 * Verify content signature
 */
export function verifySignature(
  content: string,
  signature: string,
  address: string
): boolean {
  try {
    const message = `Human Layer Content Verification\n\n${content}\n\nTimestamp: ${Date.now()}`
    const recoveredAddress = ethers.verifyMessage(message, signature)
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * Get content hash for blockchain storage
 */
export function getContentHash(content: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(content))
}

