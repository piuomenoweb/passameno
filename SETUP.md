# Guida Setup PassaMeno

## 1. Setup Supabase

### Creare Progetto
1. Vai su https://supabase.com e crea un account gratuito
2. Clicca "New Project"
3. Compila:
   - **Name**: PassaMeno
   - **Database Password**: (vedi file `credentials.txt` nella root del progetto - NON committare!)
   - **Region**: Scegli la più vicina (es: West Europe)
4. Attendi il provisioning (2-3 minuti)

⚠️ **IMPORTANTE**: La password del database è salvata nel file `credentials.txt` (non versionato). 
Non committare mai questo file o la password nel codice!

### Configurare Database
1. Vai su **SQL Editor** nel menu laterale
2. Clicca **New Query**
3. Copia e incolla questo SQL:

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

-- Indici per performance
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_favorite ON contacts(favorite);

-- Full-text search su nome
CREATE INDEX idx_contacts_name_search ON contacts USING gin(to_tsvector('italian', name));

-- Trigger per updated_at automatico
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (modifica se aggiungi autenticazione)
CREATE POLICY "Allow all operations" ON contacts
FOR ALL
USING (true)
WITH CHECK (true);
```

4. Clicca **Run** (o F5)
5. Verifica che la tabella sia stata creata in **Table Editor**

### Ottenere Credenziali
1. Vai su **Settings** → **API**
2. Copia:
   - **Project URL** (es: `https://xxxxx.supabase.co`)
   - **anon/public key** (chiave pubblica)
   - **service_role key** (chiave privata - tieni segreta!)

## 2. Configurare Variabili Ambiente

1. Nella root del progetto, crea file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Sostituisci con le tue credenziali reali

⚠️ **SICUREZZA**: 
- Il file `.env.local` è già nel `.gitignore` e NON verrà committato
- La password del database è nel file `credentials.txt` (anche questo non versionato)
- Non condividere mai questi file o le credenziali pubblicamente

## 3. Installare e Avviare

```bash
# Installare dipendenze
npm install

# Avviare sviluppo
npm run dev
```

Apri http://localhost:3000

## 4. Funzionalità Implementate

### ✅ Dashboard Contatti
- Visualizzazione lista contatti con design glassmorphism
- Ricerca in tempo reale (debounce 150ms)
- Filtri per categoria e preferiti
- CRUD completo (crea, modifica, elimina)

### ✅ Condivisione Contatti
1. Clicca sul pulsante **Condividi** (icona Share) su una card contatto
2. Si apre un modal con lista di tutti i contatti
3. Cerca il destinatario
4. Clicca sul contatto destinatario
5. Si apre WhatsApp automaticamente con messaggio:
   ```
   Ciao il numero che cercavi è: [numero]
   ```

### ✅ Invio WhatsApp Diretto
1. Clicca sul pulsante **WhatsApp** verde su una card
2. Si apre WhatsApp Web/App
3. Messaggio preimpostato:
   ```
   Ciao, il numero che cercavi è: [numero]
   ```

## 5. Futura Integrazione Gestionale

Il file `lib/gestionale/integration.ts` contiene la struttura per integrare il gestionale.

### Opzioni Disponibili:

#### Opzione A: Accesso Database (se possibile)
- Connessione read-only al database gestionale
- Query periodiche per nuovi ordini
- Mapping automatico campi

#### Opzione B: API REST (se il gestionale espone API)
- Chiamate HTTP al gestionale
- Autenticazione con API Key
- Webhook per eventi real-time

#### Opzione C: Export CSV (soluzione temporanea)
- Export periodico dal gestionale
- Upload CSV nel sistema
- Sincronizzazione manuale

#### Opzione D: Webhook (se supportato)
- Il gestionale chiama il nostro endpoint
- Eventi in tempo reale
- Più efficiente

### Prossimi Passi per Integrazione:
1. Identificare quale approccio è possibile
2. Ottenere credenziali/accesso
3. Mappare campi gestionale → sistema
4. Implementare sincronizzazione
5. Aggiungere data consegna ai messaggi WhatsApp

## 6. Deploy su Vercel

1. Push codice su GitHub
2. Vai su https://vercel.com
3. **Import Project** → seleziona repository
4. Aggiungi variabili ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy!

## Troubleshooting

### Errore "Missing Supabase environment variables"
- Verifica che `.env.local` esista
- Verifica che le variabili siano corrette
- Riavvia il server dev (`npm run dev`)

### Errore "relation contacts does not exist"
- Verifica che lo script SQL sia stato eseguito
- Controlla in Supabase Table Editor che la tabella esista

### WhatsApp non si apre
- Verifica che il numero sia nel formato corretto
- Su mobile, assicurati che WhatsApp sia installato
- Su desktop, usa WhatsApp Web

