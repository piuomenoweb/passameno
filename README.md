# PassaMeno - Dashboard Contatti

Dashboard per la gestione di contatti logistici con stile iOS 26 Liquid Glass.

## Funzionalità

- ✅ Gestione completa contatti (CRUD)
- ✅ Ricerca e filtri avanzati
- ✅ Condivisione contatti via WhatsApp con messaggio preimpostato
- ✅ Invio automatico WhatsApp con messaggio preimpostato
- ✅ Design glassmorphism iOS 26 style
- ✅ Responsive e ottimizzato per velocità

## Setup

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Configurazione Supabase

1. Crea un progetto su [Supabase](https://supabase.com)
2. Esegui questo SQL nella SQL Editor:

```sql
-- Tabella contatti
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  category VARCHAR(50) NOT NULL DEFAULT 'altro',
  notes TEXT,
  tags JSONB DEFAULT '[]',
  favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_favorite ON contacts(favorite);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON contacts
FOR ALL
USING (true)
WITH CHECK (true);
```

3. Copia `.env.local.example` in `.env.local` e inserisci le tue credenziali Supabase

### 3. Avvio Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Deploy su Vercel

1. Push del codice su GitHub
2. Connetti il repository a Vercel
3. Aggiungi le variabili d'ambiente in Vercel Dashboard
4. Deploy automatico!

## Funzionalità Future

- [ ] Integrazione con gestionale per data consegna
- [ ] Notifiche automatiche WhatsApp
- [ ] Import/Export CSV
- [ ] Storico comunicazioni

