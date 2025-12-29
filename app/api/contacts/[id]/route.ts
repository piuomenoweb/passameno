import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ContactFormData } from '@/types/contact'

// GET - Dettaglio contatto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json(
        { error: 'Contatto non trovato' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna contatto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const body: ContactFormData = await request.json()

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Nome e telefono sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica duplicati (escludendo il record corrente)
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone', body.phone)
      .neq('id', params.id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Un contatto con questo numero esiste già' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        category: body.category || 'altro',
        notes: body.notes || null,
        tags: body.tags || [],
        favorite: body.favorite || false
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Elimina contatto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

