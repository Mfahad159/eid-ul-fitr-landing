import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, score, tapCount, duration } = await req.json()

    // Basic sanity checks:
    // Max possible taps in 7s at ~8 taps/sec = ~56 taps
    // Max score without cheating = 500
    const maxReasonableTaps = 70
    const maxScore = 500

    if (
      score > maxScore ||
      tapCount > maxReasonableTaps ||
      duration < 6800 ||  // must have played full 7s
      duration > 8000 ||
      !name || 
      name.length > 20 ||
      score < 10 // Not worth submitting based on prompt instructions
    ) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 })
    }

    // Use service role key server-side (never expose to client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { error } = await supabase.from('eid_scores').upsert(
      { name: name.trim(), score },
      { onConflict: 'name', ignoreDuplicates: false }
    )

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json({ error: 'Failed to save score' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
