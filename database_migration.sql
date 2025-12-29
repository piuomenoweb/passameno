-- MIGRAZIONE DATABASE - Aggiungere nuovi campi
-- Esegui questo script nel SQL Editor di Supabase

-- 1. Aggiungi campo città
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- 2. Aggiungi campo WhatsApp username
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS whatsapp_username VARCHAR(255);

-- 3. Migra da phone (string) a phones (JSONB array)
-- Prima crea la colonna phones
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phones JSONB DEFAULT '[]'::jsonb;

-- Migra i dati esistenti da phone a phones
UPDATE contacts 
SET phones = jsonb_build_array(jsonb_build_object('number', phone, 'label', 'Principale'))
WHERE phones = '[]'::jsonb OR phones IS NULL;

-- 4. Crea indice per città
CREATE INDEX IF NOT EXISTS idx_contacts_city ON contacts(city);

-- 5. Aggiorna full-text search per includere città
DROP INDEX IF EXISTS idx_contacts_name_search;
CREATE INDEX idx_contacts_name_search ON contacts USING gin(
  to_tsvector('italian', 
    COALESCE(name, '') || ' ' || 
    COALESCE(city, '') || ' ' || 
    COALESCE(email, '')
  )
);

-- NOTA: La colonna 'phone' può essere mantenuta per retrocompatibilità
-- oppure rimossa dopo aver verificato che tutto funzioni
-- Per rimuoverla: ALTER TABLE contacts DROP COLUMN phone;

