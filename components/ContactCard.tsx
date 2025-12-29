'use client'

import { Contact, PhoneNumber } from '@/types/contact'
import { getDirectWhatsAppMessage, getShareContactMessage } from '@/lib/utils/messages'
import { cleanPhoneForWhatsApp, formatPhoneDisplay } from '@/lib/utils/phone'

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contact: Contact) => void
  onShare: (contact: Contact) => void
  onForward: (contact: Contact, phoneNumber: PhoneNumber) => void
}

export default function ContactCard({ contact, onEdit, onDelete, onShare, onForward }: ContactCardProps) {
  const handleWhatsApp = (phoneNumber: PhoneNumber) => {
    const cleanPhone = cleanPhoneForWhatsApp(phoneNumber.number)
    const message = getDirectWhatsAppMessage(phoneNumber)
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank')
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

  const primaryPhone = contact.phones?.[0] || { number: '', label: 'Principale' }

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-primary/30 dark:to-purple-500/30 flex items-center justify-center shadow-md ring-2 ring-white dark:ring-white/20 text-slate-700 dark:text-slate-300 font-bold text-lg">
          {initials}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full ${categoryStyle.bg} ${categoryStyle.text} text-xs font-bold uppercase tracking-wider border ${categoryStyle.border}`}>
            {contact.category}
          </span>
          {contact.city && (
            <span className="px-2 py-1 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors duration-300">
              📍 {contact.city}
            </span>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight transition-colors duration-300">{contact.name}</h3>
        {contact.email && (
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors duration-300">{contact.email}</p>
        )}
        <div className="mt-2 space-y-1">
          {contact.phones?.map((phone, index) => (
            <div key={index} className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-sm transition-colors duration-300">
              <span className="material-symbols-outlined text-sm">phone</span>
              <span>{formatPhoneDisplay(phone.number)}</span>
              {phone.label && phone.label !== 'Principale' && (
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({phone.label})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {contact.notes && (
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 transition-colors duration-300">{contact.notes}</p>
      )}

      <div className="mt-auto pt-4 flex gap-3">
        <button
          onClick={() => onForward(contact, primaryPhone)}
          className="flex-1 h-10 rounded-full bg-primary hover:bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">call</span>
          Inoltra
        </button>
        <button
          onClick={() => handleWhatsApp(primaryPhone)}
          className="flex-1 h-10 rounded-full bg-whatsapp hover:bg-green-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          WhatsApp
        </button>
      </div>

      {/* Action buttons row */}
      <div className="flex gap-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <button
          onClick={() => onShare(contact)}
          className="flex-1 px-3 py-2 glass-btn-secondary rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center justify-center"
          title="Condividi"
        >
          <span className="material-symbols-outlined text-sm">share</span>
        </button>
        <button
          onClick={() => onEdit(contact)}
          className="flex-1 px-3 py-2 glass-btn-secondary rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center justify-center"
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
