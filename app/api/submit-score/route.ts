import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, score, tapCount, duration } = await req.json()

    // Basic sanity checks:
    // Max possible taps in 7s at ~8 taps/sec = ~56 taps
    // Max score without cheating = 500
    const maxReasonableTaps = 70
    const maxScore = 450

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
    
    const trimmedName = name.trim()
    
    // Check if player already exists (case-insensitive)
    const { data: existing, error: fetchError } = await supabase
      .from('eid_scores')
      .select('id, score')
      .ilike('name', trimmedName)
      .maybeSingle()
      
    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json({ error: 'Failed to check existing score' }, { status: 500 })
    }

    if (existing) {
      // Only update if the new score is higher
      if (score > existing.score) {
        const { error: updateError } = await supabase
          .from('eid_scores')
          .update({ score, name: trimmedName })
          .eq('id', existing.id)
          
        if (updateError) {
          console.error('Supabase update error:', updateError)
          return NextResponse.json({ error: 'Failed to update score' }, { status: 500 })
        }
      }
    } else {
      // Insert new player
      const { error: insertError } = await supabase
        .from('eid_scores')
        .insert({ name: trimmedName, score })
        
      if (insertError) {
        console.error('Supabase insert error:', insertError)
        return NextResponse.json({ error: 'Failed to insert score' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
