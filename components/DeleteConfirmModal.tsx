'use client'

import { Contact } from '@/types/contact'

interface DeleteConfirmModalProps {
  contact: Contact | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ contact, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!contact) return null

  return (
    <div className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[20px] transition-all duration-300 flex items-center justify-center p-4">
      <div className="relative w-full max-w-[420px] liquid-glass rounded-2xl overflow-hidden animate-fade-in-scale">
        {/* Luminous Top Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80"></div>

        <div className="p-6 pt-8 text-center flex flex-col items-center">
          {/* Icon */}
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 shadow-inner">
            <span className="material-symbols-outlined text-[32px] text-red-600">delete_forever</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Eliminare contatto?
          </h2>

          {/* Body Text */}
          <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 px-4">
            Questa azione non può essere annullata. <br/>Il contatto <strong>{contact.name}</strong> verrà rimosso permanentemente.
          </p>
        </div>

        {/* Footer / Button Group */}
        <div className="p-4 px-6 pb-6 mt-2 flex flex-col-reverse sm:flex-row gap-3">
          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full sm:w-1/2 h-11 flex items-center justify-center rounded-xl text-[15px] font-semibold text-slate-700 dark:text-slate-300 liquid-glass-btn hover:bg-white/60 dark:hover:bg-white/10 active:scale-[0.98] transition-all"
          >
            Annulla
          </button>

          {/* Delete Button */}
          <button
            onClick={onConfirm}
            className="w-full sm:w-1/2 h-11 flex items-center justify-center rounded-xl text-[15px] font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 active:scale-[0.98] transition-all border border-red-400/50"
          >
            <span className="material-symbols-outlined text-[18px] mr-2">delete</span>
            Elimina
          </button>
        </div>

        {/* Subtle bottom gradient for depth */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  )
}

