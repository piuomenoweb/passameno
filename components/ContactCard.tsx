'use client'

import { Contact } from '@/types/contact'
import { useState } from 'react'

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onShare: (contact: Contact) => void
}

export default function ContactCard({ contact, onEdit, onDelete, onShare }: ContactCardProps) {
  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const message = encodeURIComponent('Ciao, il numero che cercavi è: ' + phone)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    cliente: { bg: 'bg-blue-100/50', text: 'text-blue-700', border: 'border-blue-200/50' },
    fornitore: { bg: 'bg-purple-100/50', text: 'text-purple-700', border: 'border-purple-200/50' },
    corriere: { bg: 'bg-green-100/50', text: 'text-green-700', border: 'border-green-200/50' },
    magazzino: { bg: 'bg-orange-100/50', text: 'text-orange-700', border: 'border-orange-200/50' },
    altro: { bg: 'bg-gray-100/50', text: 'text-gray-700', border: 'border-gray-200/50' },
  }

  const categoryStyle = categoryColors[contact.category] || categoryColors.altro

  // Generate avatar initials
  const initials = contact.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center shadow-md ring-2 ring-white text-slate-700 font-bold text-lg">
          {initials}
        </div>
        <span className={`px-3 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} text-xs font-bold uppercase tracking-wider border ${categoryStyle.border}`}>
          {contact.category}
        </span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 leading-tight">{contact.name}</h3>
        {contact.email && (
          <p className="text-slate-500 font-medium mt-1">{contact.email}</p>
        )}
        <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
          <span className="material-symbols-outlined text-sm">phone</span>
          <span>{contact.phone}</span>
        </div>
      </div>

      {contact.notes && (
        <p className="text-sm text-slate-600 line-clamp-2">{contact.notes}</p>
      )}

      <div className="mt-auto pt-4 flex gap-3">
        <button
          onClick={() => handleCall(contact.phone)}
          className="flex-1 h-10 rounded-full bg-primary hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          Call
        </button>
        <button
          onClick={() => handleWhatsApp(contact.phone)}
          className="flex-1 h-10 rounded-full bg-whatsapp hover:bg-green-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          WhatsApp
        </button>
      </div>

      {/* Action buttons row */}
      <div className="flex gap-2 pt-2 border-t border-gray-200/50">
        <button
          onClick={() => onShare(contact)}
          className="flex-1 px-3 py-2 glass-btn-secondary rounded-xl text-slate-700 text-sm font-medium hover:bg-white/60 transition-all flex items-center justify-center"
          title="Condividi"
        >
          <span className="material-symbols-outlined text-sm">share</span>
        </button>
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 px-3 py-2 glass-btn-secondary rounded-xl text-slate-700 text-sm font-medium hover:bg-white/60 transition-all flex items-center justify-center"
          title="Modifica"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
        <button
          onClick={() => onDelete(contact)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-all flex items-center justify-center"
          title="Elimina"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </div>
  )
}
