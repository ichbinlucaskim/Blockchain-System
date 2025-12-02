import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { address } = await req.json()
    const postId = params.id

    if (!address) {
      return NextResponse.json(
        { error: 'Missing wallet address' },
        { status: 400 }
      )
    }

    // Check if already liked
    const { data: existingLike } = await supabaseAdmin
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_wallet', address.toLowerCase())
      .single()

    if (existingLike) {
      return NextResponse.json({ message: 'Already liked' })
    }

    // Create like
    const { error: likeError } = await supabaseAdmin.from('likes').insert({
      post_id: postId,
      user_wallet: address.toLowerCase(),
    })

    if (likeError) {
      throw likeError
    }

    // Update post like count
    const { data: post } = await supabaseAdmin
      .from('posts')
      .select('like_count')
      .eq('id', postId)
      .single()

    if (post) {
      await supabaseAdmin
        .from('posts')
        .update({ like_count: (post.like_count || 0) + 1 })
        .eq('id', postId)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to like post' },
      { status: 500 }
    )
  }
}

