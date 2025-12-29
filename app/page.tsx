'use client'

import { useState, useEffect, useMemo } from 'react'
import { Contact } from '@/types/contact'
import ContactList from '@/components/ContactList'
import ContactForm from '@/components/ContactForm'
import FilterBar from '@/components/FilterBar'
import ShareModal from '@/components/ShareModal'
import ForwardModal from '@/components/ForwardModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import ThemeToggle from '@/components/ThemeToggle'
import { PhoneNumber } from '@/types/contact'

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Contact['category'] | 'all'>('all')
  const [favorite, setFavorite] = useState(false)
  const [city, setCity] = useState('')
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [contactToShare, setContactToShare] = useState<Contact | null>(null)
  const [contactToForward, setContactToForward] = useState<Contact | null>(null)
  const [phoneToForward, setPhoneToForward] = useState<PhoneNumber | null>(null)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

  // Debounce search
  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      fetchContacts()
    }, 150)
    return () => clearTimeout(timeoutId)
  }, [search, category, favorite, city])

  useEffect(() => {
    fetchContacts()
    fetchCities()
  }, [])

  useEffect(() => {
    return debouncedSearch
  }, [search, category, favorite, city])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category !== 'all') params.append('category', category)
      if (favorite) params.append('favorite', 'true')
      if (city) params.append('city', city)

      const res = await fetch(`/api/contacts?${params}`)
      const json = await res.json()
      setContacts(json.data || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/contacts/cities')
      const json = await res.json()
      setAvailableCities(json.cities || [])
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  const handleDelete = (contact: Contact) => {
    setContactToDelete(contact)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!contactToDelete) return

    try {
      const res = await fetch(`/api/contacts/${contactToDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchContacts()
        fetchCities() // Aggiorna lista città
        setShowDeleteModal(false)
        setContactToDelete(null)
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setShowForm(true)
  }

  const handleShare = (contact: Contact) => {
    setContactToShare(contact)
    setShowShareModal(true)
  }

  const handleForward = (contact: Contact, phoneNumber: PhoneNumber) => {
    setContactToForward(contact)
    setPhoneToForward(phoneNumber)
    setShowForwardModal(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingContact(null)
    fetchContacts()
    fetchCities() // Aggiorna lista città dopo creazione/modifica
  }

  return (
    <>
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-blob bg-blue-300 dark:bg-blue-600 w-96 h-96 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="ambient-blob bg-purple-200 dark:bg-purple-600 w-[500px] h-[500px] bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
        <div className="ambient-blob bg-pink-100 dark:bg-pink-600 w-80 h-80 top-1/3 right-1/4 opacity-40"></div>
      </div>

      {/* Fixed Glass Header */}
      <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b-0 h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-lg">contacts</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">Contacts App</h1>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center w-full">
        {/* Hero Section */}
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              Find your connections
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Manage and reach out to your network in seconds.
            </p>
          </div>

          {/* Liquid Search Bar */}
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, tag, or number..."
              className="glass-input w-full h-16 pl-14 pr-6 rounded-full text-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm group-hover:shadow-md outline-none"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <button className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <FilterBar
            category={category}
            favorite={favorite}
            city={city}
            onCategoryChange={setCategory}
            onFavoriteChange={setFavorite}
            onCityChange={setCity}
            availableCities={availableCities}
          />
        </div>

        {/* Cards Grid */}
        <ContactList
          contacts={contacts}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(contact) => handleDelete(contact)}
          onShare={handleShare}
          onForward={handleForward}
        />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowForm(true)}
          className="group relative flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-white text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
          <span className="absolute right-full mr-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Add Contact
          </span>
        </button>
      </div>

      {/* Modals */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          onClose={handleFormClose}
        />
      )}

      {showShareModal && contactToShare && (
        <ShareModal
          contactToShare={contactToShare}
          contacts={contacts.filter(c => c.id !== contactToShare.id)}
          onClose={() => {
            setShowShareModal(false)
            setContactToShare(null)
          }}
        />
      )}

      {showForwardModal && contactToForward && phoneToForward && (
        <ForwardModal
          contact={contactToForward}
          phoneNumber={phoneToForward}
          contacts={contacts.filter(c => c.id !== contactToForward.id)}
          onClose={() => {
            setShowForwardModal(false)
            setContactToForward(null)
            setPhoneToForward(null)
          }}
        />
      )}

      {showDeleteModal && contactToDelete && (
        <DeleteConfirmModal
          contact={contactToDelete}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false)
            setContactToDelete(null)
          }}
        />
      )}
    </>
  )
}
