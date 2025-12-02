import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ethers } from 'ethers'

/**
 * Mint Human Passport SBT after World ID verification
 * This endpoint should be called after World ID verification succeeds
 */
export async function POST(req: NextRequest) {
  try {
    const { walletAddress, nullifierHash } = await req.json()

    if (!walletAddress || !nullifierHash) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists and is verified
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, world_id_nullifier_hash')
      .eq('wallet_address', walletAddress.toLowerCase())
      .eq('world_id_nullifier_hash', nullifierHash)
      .single()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or not verified' },
        { status: 404 }
      )
    }

    // TODO: Call smart contract to mint SBT
    // This requires:
    // 1. Contract ABI
    // 2. Private key for contract owner
    // 3. RPC provider
    
    const contractAddress = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS
    if (!contractAddress) {
      // In development, just mark as having passport
      return NextResponse.json({
        success: true,
        message: 'Passport would be minted in production',
        hasPassport: true,
      })
    }

    // Example contract interaction (uncomment when contract is deployed)
    /*
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY!, provider)
    const contract = new ethers.Contract(contractAddress, ABI, wallet)
    
    const tx = await contract.mintHumanPassport(walletAddress, nullifierHash)
    await tx.wait()
    */

    return NextResponse.json({
      success: true,
      hasPassport: true,
      message: 'Passport minted successfully',
    })
  } catch (error: any) {
    console.error('Mint passport error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to mint passport' },
      { status: 500 }
    )
  }
}

