import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { ContactFormData } from '@/types/contact'

// GET - Lista contatti con search e filtri
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category')
    const favorite = searchParams.get('favorite')
    const city = searchParams.get('city')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtro ricerca (su name, city, email, e numeri telefonici in phones)
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`)
    }

    // Filtro categoria
    if (category) {
      query = query.eq('category', category)
    }

    // Filtro preferiti
    if (favorite === 'true') {
      query = query.eq('favorite', true)
    }

    // Filtro città
    if (city) {
      query = query.eq('city', city)
    }

    // Paginazione
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    // Trasforma i dati per compatibilità: se c'è phone (vecchio formato), convertilo in phones
    const transformedData = (data || []).map((contact: any) => {
      if (contact.phones && Array.isArray(contact.phones) && contact.phones.length > 0) {
        return contact
      }
      // Retrocompatibilità: se c'è phone ma non phones, crea array phones
      if (contact.phone) {
        return {
          ...contact,
          phones: [{ number: contact.phone, label: 'Principale' }]
        }
      }
      return {
        ...contact,
        phones: []
      }
    })

    return NextResponse.json({
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Crea nuovo contatto
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body: ContactFormData = await request.json()

    // Validazione base
    if (!body.name || !body.phones || body.phones.length === 0) {
      return NextResponse.json(
        { error: 'Nome e almeno un numero telefonico sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica duplicati (controlla tutti i numeri)
    const primaryPhone = body.phones[0]?.number
    if (primaryPhone) {
      // Cerca in phones array o in phone (retrocompatibilità)
      const { data: existing } = await supabase
        .from('contacts')
        .select('id')
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
      .insert({
        name: body.name,
        phones: body.phones || [],
        phone: body.phones?.[0]?.number || null, // Mantieni per retrocompatibilità
        email: body.email || null,
        category: body.category || 'altro',
        city: body.city || null,
        whatsapp_username: body.whatsapp_username || null,
        notes: body.notes || null,
        tags: body.tags || [],
        favorite: body.favorite || false
      })
      .select()
      .single()

    if (error) throw error

    // Trasforma per compatibilità
    const transformed = {
      ...data,
      phones: data.phones || (data.phone ? [{ number: data.phone, label: 'Principale' }] : [])
    }

    return NextResponse.json({ data: transformed }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
