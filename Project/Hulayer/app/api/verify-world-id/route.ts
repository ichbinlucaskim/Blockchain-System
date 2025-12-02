import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ethers } from 'ethers'

// This would normally verify with World ID's backend
// For now, we'll do a basic verification
export async function POST(req: NextRequest) {
  try {
    const { proof, walletAddress } = await req.json()

    if (!proof || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create or update user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          wallet_address: walletAddress.toLowerCase(),
          world_id_nullifier_hash: nullifierHash,
          reputation_score: 0,
        },
        {
          onConflict: 'wallet_address',
        }
      )
      .select()
      .single()

    if (userError) {
      console.error('Database error:', userError)
      return NextResponse.json(
        { error: 'Failed to save user' },
        { status: 500 }
      )
    }

    // TODO: Mint SBT passport on blockchain
    // This would call the smart contract to mint the Human Passport SBT

    return NextResponse.json({
      success: true,
      nullifierHash,
      userId: user.id,
    })
  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}

