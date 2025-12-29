'use client'

import { ContactCategory } from '@/types/contact'
import { Star } from 'lucide-react'

interface FilterBarProps {
  category: ContactCategory | 'all'
  favorite: boolean
  onCategoryChange: (category: ContactCategory | 'all') => void
  onFavoriteChange: (favorite: boolean) => void
}

const categories: { value: ContactCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Contacts' },
  { value: 'cliente', label: 'Clienti' },
  { value: 'fornitore', label: 'Fornitori' },
  { value: 'corriere', label: 'Corrieri' },
  { value: 'magazzino', label: 'Magazzini' },
  { value: 'altro', label: 'Altro' },
]

export default function FilterBar({
  category,
  favorite,
  onCategoryChange,
  onFavoriteChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-5 py-2 rounded-full glass-input font-medium text-sm shadow-sm transition-all ${
            category === cat.value
              ? 'bg-white/70 text-slate-900 ring-1 ring-primary/20'
              : 'text-slate-600 hover:bg-white hover:text-primary'
          }`}
        >
          {cat.label}
        </button>
      ))}
      <button
        onClick={() => onFavoriteChange(!favorite)}
        className={`px-5 py-2 rounded-full glass-input font-medium text-sm shadow-sm transition-all flex items-center gap-2 ${
          favorite
            ? 'bg-white/70 text-slate-900 ring-1 ring-primary/20'
            : 'text-slate-600 hover:bg-white hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-sm">star</span>
        Favorites
      </button>
    </div>
  )
}
