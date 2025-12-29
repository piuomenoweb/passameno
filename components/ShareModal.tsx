'use client'

import { useState, useEffect } from 'react'
import { Contact } from '@/types/contact'

interface ShareModalProps {
  contactToShare: Contact | null
  contacts: Contact[]
  onClose: () => void
}

export default function ShareModal({ contactToShare, contacts, onClose }: ShareModalProps) {
  const [search, setSearch] = useState('')
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(contacts)

  useEffect(() => {
    if (search) {
      const filtered = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      )
      setFilteredContacts(filtered)
    } else {
      setFilteredContacts(contacts)
    }
  }, [search, contacts])

  const handleShare = (recipient: Contact) => {
    if (!contactToShare) return

    const message = `Ciao il numero che cercavi è: ${contactToShare.phone}`
    const cleanPhone = recipient.phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    
    // Apri WhatsApp con messaggio preimpostato
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank')
    onClose()
  }

  if (!contactToShare) return null

  return (
    <div className="fixed inset-0 z-40 bg-slate-200/40 backdrop-blur-[20px] transition-opacity duration-300 flex items-center justify-center p-4">
      <div className="liquid-glass relative w-full max-w-md overflow-hidden rounded-2xl animate-fade-in-scale">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 group p-1.5 rounded-full glass-btn-secondary text-slate-500 hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20 z-10"
        >
          <span className="material-symbols-outlined text-[20px] block leading-none">close</span>
        </button>

        <div className="p-6 pt-8 text-center flex flex-col items-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(6,123,249,0.15)]">
            <span className="material-symbols-outlined text-[32px]">share</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Condividi Contatto
          </h2>
          <p className="text-[15px] leading-relaxed text-slate-600 px-4">
            Seleziona il destinatario per <strong>{contactToShare.name}</strong>
          </p>
        </div>

        <div className="p-6 pt-0">
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca destinatario..."
              className="glass-input w-full rounded-xl py-3 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nessun contatto trovato
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleShare(contact)}
                  className="w-full glass-btn-secondary rounded-xl p-4 hover:bg-white/60 transition-all duration-150 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                        {contact.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span className="material-symbols-outlined text-sm">phone</span>
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">chat</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
