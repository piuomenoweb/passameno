# PassaMeno - Dashboard Contatti

Dashboard moderna per la gestione di contatti logistici con design iOS 26 Liquid Glass e integrazione WhatsApp automatica.

## ✨ Funzionalità

- ✅ **Dashboard Contatti** - Gestione completa CRUD con design glassmorphism
- ✅ **Ricerca in Tempo Reale** - Trova contatti istantaneamente
- ✅ **Filtri Avanzati** - Per categoria e preferiti
- ✅ **Condivisione WhatsApp** - Condividi contatti con messaggio preimpostato
- ✅ **Invio WhatsApp Diretto** - Messaggio automatico con numero contatto
- ✅ **Design Moderno** - Stile iOS 26 Liquid Glass con effetti glassmorphism

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS con glassmorphism
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **Icons**: Material Symbols

## 📋 Prerequisiti

- Node.js 18+ installato
- Account Supabase (gratuito)
- Account GitHub
- Account Vercel (gratuito)

## 🛠️ Setup Locale

1. **Clona il repository**
   ```bash
   git clone https://github.com/piuomenoweb/passameno.git
   cd passameno
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   ```

3. **Configura variabili ambiente**
   Crea file `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Configura Supabase**
   - Crea progetto su [Supabase](https://supabase.com)
   - Esegui lo script SQL (vedi `SETUP.md`)
   - Ottieni le credenziali API

5. **Avvia sviluppo**
   ```bash
   npm run dev
   ```
   Apri [http://localhost:3000](http://localhost:3000)

## 📚 Documentazione

Vedi `SETUP.md per guida completa setup e configurazione.

## 🚢 Deploy su Vercel

1. Push codice su GitHub
2. Importa progetto su [Vercel](https://vercel.com)
3. Aggiungi variabili ambiente in Vercel Dashboard
4. Deploy automatico!

## 📝 Script SQL Supabase

Esegui questo script nel SQL Editor di Supabase:

```sql
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

CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_category ON contacts(category);
CREATE INDEX idx_contacts_favorite ON contacts(favorite);

CREATE INDEX idx_contacts_name_search ON contacts USING gin(to_tsvector('italian', name));

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON contacts
FOR ALL
USING (true)
WITH CHECK (true);
```

## 🔒 Sicurezza

- File sensibili (`.env.local`, `credentials.txt`) sono nel `.gitignore`
- Non committare mai credenziali nel codice
- Usa variabili ambiente per tutte le chiavi API

## 📄 Licenza

Questo progetto è privato.

## 👤 Autore

**piuomenoweb**

---

Made with ❤️ using Next.js and Supabase
