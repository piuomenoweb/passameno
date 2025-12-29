'use client'

import { useState, useRef } from 'react'
import { ContactFormData, ContactCategory } from '@/types/contact'
import { formatItalianPhone } from '@/lib/utils/phone'

interface ImportModalProps {
  onClose: () => void
  onImport: (contacts: ContactFormData[]) => Promise<void>
}

interface ParsedContact {
  name: string
  phone: string
  phones?: string[]
  email?: string
  category?: string
  city?: string
  notes?: string
  tags?: string[]
  whatsapp_username?: string
  favorite?: string | boolean
  errors?: string[]
}

export default function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'success'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([])
  const [validContacts, setValidContacts] = useState<ContactFormData[]>([])
  const [importResults, setImportResults] = useState<{ success: number; errors: number; details: string[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories: ContactCategory[] = ['cliente', 'fornitore', 'corriere', 'magazzino', 'altro']

  const parseCSV = (text: string): ParsedContact[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    // Prima riga = header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const contacts: ParsedContact[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const contact: ParsedContact = {
        name: '',
        phone: '',
        errors: []
      }

      // Mappa i valori alle colonne
      headers.forEach((header, index) => {
        const value = values[index] || ''
        
        if (header.includes('nome') || header.includes('name')) {
          contact.name = value
        } else if (header.includes('telefono') || header.includes('phone') || header.includes('cellulare')) {
          contact.phone = value
        } else if (header.includes('email') || header.includes('mail')) {
          contact.email = value
        } else if (header.includes('categoria') || header.includes('category') || header.includes('tipo')) {
          contact.category = value.toLowerCase()
        } else if (header.includes('citta') || header.includes('city') || header.includes('città')) {
          contact.city = value
        } else if (header.includes('note') || header.includes('notes') || header.includes('descrizione')) {
          contact.notes = value
        } else if (header.includes('tag') || header.includes('tags')) {
          contact.tags = value.split(';').map(t => t.trim()).filter(Boolean)
        } else if (header.includes('whatsapp') || header.includes('wa')) {
          contact.whatsapp_username = value
        } else if (header.includes('preferito') || header.includes('favorite') || header.includes('star')) {
          contact.favorite = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'sì' || value.toLowerCase() === 'si' || value.toLowerCase() === 'yes'
        }
      })

      // Validazione base
      if (!contact.name) {
        contact.errors?.push('Nome mancante')
      }
      if (!contact.phone) {
        contact.errors?.push('Telefono mancante')
      }

      contacts.push(contact)
    }

    return contacts
  }

  const validateAndTransform = (parsed: ParsedContact[]): ContactFormData[] => {
    const valid: ContactFormData[] = []

    parsed.forEach((contact, index) => {
      if (contact.errors && contact.errors.length > 0) {
        return // Salta contatti con errori
      }

      // Formatta il numero telefonico
      const formattedPhone = contact.phone ? formatItalianPhone(contact.phone) : ''
      
      // Valida categoria
      let category: ContactCategory = 'altro'
      if (contact.category) {
        const cat = contact.category.toLowerCase() as ContactCategory
        if (categories.includes(cat)) {
          category = cat
        }
      }

      // Gestisci più numeri telefonici (separati da ; o |)
      const phoneNumbers = contact.phone
        ? contact.phone.split(/[;|]/).map(p => formatItalianPhone(p.trim())).filter(Boolean)
        : []

      if (phoneNumbers.length === 0 && formattedPhone) {
        phoneNumbers.push(formattedPhone)
      }

      const validContact: ContactFormData = {
        name: contact.name,
        phones: phoneNumbers.map((num, idx) => ({
          number: num,
          label: idx === 0 ? 'Principale' : `Telefono ${idx + 1}`
        })),
        email: contact.email || undefined,
        category,
        city: contact.city || undefined,
        notes: contact.notes || undefined,
        tags: contact.tags || [],
        favorite: contact.favorite === 'true' || contact.favorite === true || contact.favorite === '1' || false,
        whatsapp_username: contact.whatsapp_username || undefined
      }

      valid.push(validContact)
    })

    return valid
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Per favore seleziona un file CSV')
      return
    }

    setFile(selectedFile)

    // Leggi il file
    const text = await selectedFile.text()
    const parsed = parseCSV(text)
    setParsedContacts(parsed)

    // Valida e trasforma
    const valid = validateAndTransform(parsed)
    setValidContacts(valid)

    setStep('preview')
  }

  const handleImport = async () => {
    if (validContacts.length === 0) {
      alert('Nessun contatto valido da importare')
      return
    }

    setStep('importing')
    
    try {
      let success = 0
      let errors = 0
      const details: string[] = []

      // Importa in batch (10 alla volta per evitare timeout)
      const batchSize = 10
      for (let i = 0; i < validContacts.length; i += batchSize) {
        const batch = validContacts.slice(i, i + batchSize)
        
        const promises = batch.map(async (contact) => {
          try {
            const res = await fetch('/api/contacts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(contact)
            })

            if (res.ok) {
              success++
              return { success: true, name: contact.name }
            } else {
              const error = await res.json()
              errors++
              return { success: false, name: contact.name, error: error.error || 'Errore sconosciuto' }
            }
          } catch (err: any) {
            errors++
            return { success: false, name: contact.name, error: err.message || 'Errore di rete' }
          }
        })

        const results = await Promise.all(promises)
        results.forEach(result => {
          if (result.success) {
            details.push(`✓ ${result.name}`)
          } else {
            details.push(`✗ ${result.name}: ${result.error}`)
          }
        })
      }

      setImportResults({ success, errors, details })
      setStep('success')
    } catch (error: any) {
      alert(`Errore durante l'importazione: ${error.message}`)
      setStep('preview')
    }
  }

  const handleDownloadTemplate = () => {
    const template = `Nome,Telefono,Email,Categoria,Città,Note,Tag,WhatsApp,Preferito
Mario Rossi,3331234567,mario.rossi@email.com,cliente,Roma,Cliente importante,importante;vip,mariorossi,false
Luigi Bianchi,3337654321,luigi.bianchi@email.com,fornitore,Milano,Fornitore affidabile,affidabile,luigibianchi,true`
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'template_contatti.csv'
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-modal rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {step === 'upload' && 'Importa Contatti'}
            {step === 'preview' && 'Anteprima Importazione'}
            {step === 'importing' && 'Importazione in corso...'}
            {step === 'success' && 'Importazione Completata'}
          </h2>
          {step !== 'importing' && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-btn-secondary flex items-center justify-center hover:bg-white/60 dark:hover:bg-white/10 transition-all"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">close</span>
            </button>
          )}
        </div>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">upload_file</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Seleziona un file CSV con i contatti da importare
              </p>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 glass-input rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-primary text-4xl">folder</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {file ? file.name : 'Clicca per selezionare un file CSV'}
                </span>
              </button>

              <button
                onClick={handleDownloadTemplate}
                className="w-full px-4 py-3 glass-btn-secondary rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">download</span>
                Scarica Template CSV
              </button>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">Formato CSV supportato:</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li><strong>Nome</strong> (obbligatorio) - Nome del contatto</li>
                <li><strong>Telefono</strong> (obbligatorio) - Numero telefonico principale</li>
                <li><strong>Email</strong> (opzionale) - Indirizzo email</li>
                <li><strong>Categoria</strong> (opzionale) - cliente, fornitore, corriere, magazzino, altro</li>
                <li><strong>Città</strong> (opzionale) - Città del contatto</li>
                <li><strong>Note</strong> (opzionale) - Note aggiuntive</li>
                <li><strong>Tag</strong> (opzionale) - Tag separati da punto e virgola (;)</li>
                <li><strong>WhatsApp</strong> (opzionale) - Username WhatsApp</li>
                <li><strong>Preferito</strong> (opzionale) - true/false</li>
              </ul>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-600 dark:text-slate-400">
                  Trovati <strong className="text-primary">{parsedContacts.length}</strong> contatti nel file
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  <strong className="text-green-600 dark:text-green-400">{validContacts.length}</strong> validi,{' '}
                  <strong className="text-red-600 dark:text-red-400">{parsedContacts.length - validContacts.length}</strong> con errori
                </p>
              </div>
              <button
                onClick={() => {
                  setStep('upload')
                  setFile(null)
                  setParsedContacts([])
                  setValidContacts([])
                }}
                className="px-4 py-2 glass-btn-secondary rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium"
              >
                Cambia File
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {parsedContacts.map((contact, index) => {
                const isValid = !contact.errors || contact.errors.length === 0
                return (
                  <div
                    key={index}
                    className={`glass-card rounded-xl p-4 ${
                      isValid ? 'border-green-500/30' : 'border-red-500/30'
                    } border-2`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-slate-900 dark:text-white">{contact.name || 'Nome mancante'}</span>
                          {isValid ? (
                            <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                              ✓ Valido
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                              ✗ Errore
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          {contact.phone && <div>📞 {contact.phone}</div>}
                          {contact.email && <div>✉️ {contact.email}</div>}
                          {contact.city && <div>📍 {contact.city}</div>}
                          {contact.category && <div>🏷️ {contact.category}</div>}
                        </div>
                        {contact.errors && contact.errors.length > 0 && (
                          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {contact.errors.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 glass-btn-secondary rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-white/60 dark:hover:bg-white/10 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={handleImport}
                disabled={validContacts.length === 0}
                className="flex-1 px-4 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Importa {validContacts.length} Contatti
              </button>
            </div>
          </div>
        )}

        {step === 'importing' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center animate-spin">
              <span className="material-symbols-outlined text-primary text-4xl">sync</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Importazione in corso... Attendere prego
            </p>
          </div>
        )}

        {step === 'success' && importResults && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Importazione Completata!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                <strong className="text-green-600 dark:text-green-400">{importResults.success}</strong> contatti importati con successo
                {importResults.errors > 0 && (
                  <>, <strong className="text-red-600 dark:text-red-400">{importResults.errors}</strong> errori</>
                )}
              </p>
            </div>

            {importResults.details.length > 0 && (
              <div className="max-h-64 overflow-y-auto glass-card rounded-xl p-4 space-y-1">
                {importResults.details.map((detail, index) => (
                  <div key={index} className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                    {detail}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-primary hover:bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 transition-all"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

