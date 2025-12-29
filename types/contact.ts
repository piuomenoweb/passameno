export type ContactCategory = 'cliente' | 'fornitore' | 'corriere' | 'magazzino' | 'altro'

export interface PhoneNumber {
  number: string
  label?: string // es: "Mobile", "Ufficio", "Casa"
}

export interface Contact {
  id: string
  name: string
  phones: PhoneNumber[] // Array di numeri telefonici
  email?: string
  category: ContactCategory
  city?: string
  notes?: string
  tags: string[]
  favorite: boolean
  whatsapp_username?: string // Nome utente WhatsApp
  created_at: string
  updated_at: string
}

export interface ContactFormData {
  name: string
  phones: PhoneNumber[]
  email?: string
  category: ContactCategory
  city?: string
  notes?: string
  tags?: string[]
  favorite?: boolean
  whatsapp_username?: string
}
