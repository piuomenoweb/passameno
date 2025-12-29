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

    // Trasforma per compatibilità
    const transformed = {
      ...data,
      phones: data.phones || (data.phone ? [{ number: data.phone, label: 'Principale' }] : [])
    }

    return NextResponse.json({ data: transformed })
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

    if (!body.name || !body.phones || body.phones.length === 0) {
      return NextResponse.json(
        { error: 'Nome e almeno un numero telefonico sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica duplicati (escludendo il record corrente)
    const primaryPhone = body.phones[0]?.number
    if (primaryPhone) {
      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
        .neq('id', params.id)
        .or(`phone.eq.${primaryPhone},phones.cs.[{"number":"${primaryPhone}"}]`)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Un contatto con questo numero esiste già' },
          { status: 409 }
        )
      }
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({
        name: body.name,
        phones: body.phones || [],
        phone: body.phones?.[0]?.number || null, // Retrocompatibilità
        email: body.email || null,
        category: body.category || 'altro',
        city: body.city || null,
        whatsapp_username: body.whatsapp_username || null,
        notes: body.notes || null,
        tags: body.tags || [],
        favorite: body.favorite || false
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    // Trasforma per compatibilità
    const transformed = {
      ...data,
      phones: data.phones || (data.phone ? [{ number: data.phone, label: 'Principale' }] : [])
    }

    return NextResponse.json({ data: transformed })
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
