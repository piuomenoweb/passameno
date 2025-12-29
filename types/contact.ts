export type ContactCategory = 'cliente' | 'fornitore' | 'corriere' | 'magazzino' | 'altro'

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  category: ContactCategory
  notes?: string
  tags: string[]
  favorite: boolean
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  category: ContactCategory
  notes?: string
  tags?: string[]
  favorite?: boolean
}

