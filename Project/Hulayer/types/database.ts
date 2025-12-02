/**
 * Database types for Supabase
 */

export interface User {
  id: string
  wallet_address: string
  world_id_nullifier_hash: string
  reputation_score: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_wallet: string
  content_body: string
  is_ai_verified: boolean
  signature_hash: string
  content_hash: string
  ipfs_cid?: string
  created_at: string
  updated_at: string
  like_count: number
  comment_count: number
}

export interface Like {
  id: string
  post_id: string
  user_wallet: string
  created_at: string
}

export interface Comment {
  id: string
  post_id: string
  author_wallet: string
  content_body: string
  is_ai_verified: boolean
  signature_hash: string
  created_at: string
  updated_at: string
}

