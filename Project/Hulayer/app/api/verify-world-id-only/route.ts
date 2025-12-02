import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * World ID만으로 인증 (지갑 불필요)
 * 진입 장벽을 낮추기 위한 엔드포인트
 */
export async function POST(req: NextRequest) {
  try {
    const { proof } = await req.json()

    if (!proof) {
      return NextResponse.json(
        { error: 'Missing proof' },
        { status: 400 }
      )
    }

    // Extract nullifier hash from proof
    const nullifierHash = proof.nullifier_hash || proof.merkle_root

    if (!nullifierHash) {
      return NextResponse.json(
        { error: 'Invalid proof structure' },
        { status: 400 }
      )
    }

    // Check if this nullifier hash was already used
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('world_id_nullifier_hash', nullifierHash)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'This World ID has already been used' },
        { status: 400 }
      )
    }

    // Create user without wallet (지갑 없이도 가능)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        world_id_nullifier_hash: nullifierHash,
        wallet_address: `worldid_${nullifierHash.slice(0, 10)}`, // 임시 주소
        reputation_score: 0,
      })
      .select()
      .single()

    if (userError) {
      console.error('Database error:', userError)
      return NextResponse.json(
        { error: 'Failed to save user' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      nullifierHash,
      userId: user.id,
      message: 'Verified with World ID. Wallet connection is optional.',
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}

