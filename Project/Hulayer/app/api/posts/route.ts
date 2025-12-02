import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifySignature, getContentHash } from '@/lib/blockchain'
import { detectAIContent } from '@/lib/ai-detection'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('is_ai_verified', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({ posts: posts || [] })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content, signature, address, aiConfidence } = await req.json()

    if (!content || !signature || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifySignature(content, signature, address)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Check if user has passport
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, world_id_nullifier_hash')
      .eq('wallet_address', address.toLowerCase())
      .single()

    if (!user || !user.world_id_nullifier_hash) {
      return NextResponse.json(
        { error: 'User not verified. Please verify with World ID first.' },
        { status: 403 }
      )
    }

    // Additional AI detection on server side
    const aiResult = await detectAIContent(
      content,
      undefined,
      process.env.AI_DETECTION_API_KEY
    )

    if (!aiResult.isHuman) {
      return NextResponse.json(
        {
          error: 'Content appears to be AI-generated',
          confidence: aiResult.confidence,
        },
        { status: 400 }
      )
    }

    // Create post
    const contentHash = getContentHash(content)
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        author_wallet: address.toLowerCase(),
        content_body: content,
        is_ai_verified: true,
        signature_hash: signature,
        content_hash: contentHash,
        like_count: 0,
        comment_count: 0,
      })
      .select()
      .single()

    if (postError) {
      throw postError
    }

    // Update user reputation
    await supabaseAdmin
      .from('users')
      .update({ reputation_score: user.reputation_score + 1 })
      .eq('id', user.id)

    return NextResponse.json({ post })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}

