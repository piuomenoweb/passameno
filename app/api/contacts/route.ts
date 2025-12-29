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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtro ricerca
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    // Filtro categoria
    if (category) {
      query = query.eq('category', category)
    }

    // Filtro preferiti
    if (favorite === 'true') {
      query = query.eq('favorite', true)
    }

    // Paginazione
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      data: data || [],
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
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: 'Nome e telefono sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica duplicati
    const { data: existing } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone', body.phone)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Un contatto con questo numero esiste già' },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        category: body.category || 'altro',
        notes: body.notes || null,
        tags: body.tags || [],
        favorite: body.favorite || false
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

