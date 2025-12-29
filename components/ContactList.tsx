'use client'

import { Contact } from '@/types/contact'
import ContactCard from './ContactCard'

interface ContactListProps {
  contacts: Contact[]
  loading: boolean
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onShare: (contact: Contact) => void
}

export default function ContactList({ contacts, loading, onEdit, onDelete, onShare }: ContactListProps) {
  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-16 w-16 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">contacts</span>
        <p className="text-slate-500 text-lg font-medium">Nessun contatto trovato</p>
        <p className="text-slate-400 text-sm mt-2">Prova a modificare i filtri di ricerca</p>
      </div>
    )
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
          onShare={onShare}
        />
      ))}
    </div>
  )
}
