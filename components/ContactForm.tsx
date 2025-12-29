'use client'

import { useState, useEffect } from 'react'
import { Contact, ContactFormData, ContactCategory } from '@/types/contact'

interface ContactFormProps {
  contact?: Contact | null
  onClose: () => void
}

const categories: ContactCategory[] = ['cliente', 'fornitore', 'corriere', 'magazzino', 'altro']

export default function ContactForm({ contact, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    category: 'altro',
    notes: '',
    favorite: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        phone: contact.phone,
        email: contact.email || '',
        category: contact.category,
        notes: contact.notes || '',
        tags: contact.tags,
        favorite: contact.favorite,
      })
    }
  }, [contact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = contact ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Errore nel salvataggio')
      }

      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-200/40 backdrop-blur-[20px] transition-opacity duration-300 flex items-center justify-center p-4">
      <div className="glass-modal relative w-full max-w-[640px] overflow-hidden rounded-3xl flex flex-col transform transition-all shadow-2xl animate-fade-in-scale">
        {/* Modal Header */}
        <header className="flex items-center justify-between border-b border-white/40 px-8 py-5 backdrop-blur-xl bg-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 shadow-[0_0_15px_rgba(6,123,249,0.15)]">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                {contact ? 'Modifica Contatto' : 'Nuovo Contatto'}
              </h2>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Scheda dettagli</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/50 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">close</span>
          </button>
        </header>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Row 1: Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="group flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 ml-1">Nome *</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">badge</span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none"
                  placeholder="Mario"
                />
              </div>
            </label>
            <label className="group flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 ml-1">Telefono *</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">call</span>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none"
                  placeholder="+39 333 1234567"
                />
              </div>
            </label>
          </div>

          {/* Row 2: Email and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="group flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 ml-1">Email</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">mail</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none"
                  placeholder="mario@esempio.com"
                />
              </div>
            </label>
            <label className="group flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700 ml-1">Categoria *</span>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">category</span>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ContactCategory })}
                  className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-base focus:outline-none appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          {/* Row 3: Notes */}
          <label className="group flex flex-col gap-2">
            <div className="flex justify-between items-center ml-1">
              <span className="text-sm font-semibold text-slate-700">Note</span>
              <span className="text-xs text-slate-400 font-medium">Opzionale</span>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">note</span>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="glass-input w-full rounded-xl py-3.5 pl-11 pr-4 text-base placeholder:text-slate-400 focus:outline-none resize-none"
                placeholder="Note aggiuntive..."
              />
            </div>
          </label>

          {/* Favorite Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              checked={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="favorite" className="ml-2 text-sm text-slate-700 font-medium">
              Contatto preferito
            </label>
          </div>

          {/* Modal Footer */}
          <footer className="flex items-center justify-end gap-3 pt-4 border-t border-white/40">
            <button
              type="button"
              onClick={onClose}
              className="glass-btn-secondary px-6 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:text-slate-900 active:scale-95 transition-transform shadow-sm"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden bg-primary hover:bg-blue-600 px-8 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              <span className="material-symbols-outlined text-[18px]">save</span>
              {loading ? 'Salvataggio...' : 'Salva Contatto'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
