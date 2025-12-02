import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { ethers } from 'ethers'

/**
 * Check if a wallet address has a Human Passport SBT
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('address')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing wallet address' },
        { status: 400 }
      )
    }

    // Check database first
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, world_id_nullifier_hash')
      .eq('wallet_address', walletAddress.toLowerCase())
      .single()

    if (!user || !user.world_id_nullifier_hash) {
      return NextResponse.json({ hasPassport: false })
    }

    // TODO: Check on-chain if SBT exists
    const contractAddress = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS
    if (!contractAddress) {
      // In development, assume they have passport if verified in DB
      return NextResponse.json({ hasPassport: true })
    }

    // Example on-chain check (uncomment when contract is deployed)
    /*
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const contract = new ethers.Contract(contractAddress, ABI, provider)
    const hasPassport = await contract.hasPassport(walletAddress)
    */

    return NextResponse.json({ hasPassport: true })
  } catch (error: any) {
    console.error('Check passport error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check passport' },
      { status: 500 }
    )
  }
}

