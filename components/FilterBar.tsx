'use client'

import { ContactCategory } from '@/types/contact'

interface FilterBarProps {
  category: ContactCategory | 'all'
  favorite: boolean
  city: string
  onCategoryChange: (category: ContactCategory | 'all') => void
  onFavoriteChange: (favorite: boolean) => void
  onCityChange: (city: string) => void
  availableCities: string[]
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
  city,
  onCategoryChange,
  onFavoriteChange,
  onCityChange,
  availableCities,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-5 py-2 rounded-full glass-input font-medium text-sm shadow-sm transition-all ${
            category === cat.value
              ? 'bg-white/70 dark:bg-white/10 text-slate-900 dark:text-white ring-1 ring-primary/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-primary'
          }`}
        >
          {cat.label}
        </button>
      ))}
      <button
        onClick={() => onFavoriteChange(!favorite)}
        className={`px-5 py-2 rounded-full glass-input font-medium text-sm shadow-sm transition-all flex items-center gap-2 ${
          favorite
            ? 'bg-white/70 dark:bg-white/10 text-slate-900 dark:text-white ring-1 ring-primary/20'
            : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-sm">star</span>
        Favorites
      </button>
      {availableCities.length > 0 && (
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className={`px-5 py-2 rounded-full glass-input font-medium text-sm shadow-sm transition-all ${
            city
              ? 'bg-white/70 dark:bg-white/10 text-slate-900 dark:text-white ring-1 ring-primary/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/10 hover:text-primary'
          }`}
        >
          <option value="">Tutte le città</option>
          {availableCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  )
}
