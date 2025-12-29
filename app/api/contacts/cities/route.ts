import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// GET - Lista città disponibili per filtro
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('contacts')
      .select('city')
      .not('city', 'is', null)

    if (error) throw error

    // Estrai città uniche e ordina
    const cities = Array.from(new Set((data || []).map((c: any) => c.city).filter(Boolean)))
      .sort()

    return NextResponse.json({ cities })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

