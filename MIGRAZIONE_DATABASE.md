# Migrazione Database - Nuove Funzionalità

## ⚠️ IMPORTANTE: Esegui questa migrazione prima di usare l'app!

Questa migrazione aggiunge i nuovi campi necessari per le funzionalità richieste.

## Script SQL da Eseguire

Copia e incolla questo script nel **SQL Editor** di Supabase:

```sql
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
WHERE (phones = '[]'::jsonb OR phones IS NULL) AND phone IS NOT NULL;

-- 4. Crea indice per città
CREATE INDEX IF NOT EXISTS idx_contacts_city ON contacts(city);

-- 5. Aggiorna full-text search per includere città
DROP INDEX IF EXISTS idx_contacts_name_search;
CREATE INDEX IF NOT EXISTS idx_contacts_name_search ON contacts USING gin(
  to_tsvector('italian', 
    COALESCE(name, '') || ' ' || 
    COALESCE(city, '') || ' ' || 
    COALESCE(email, '')
  )
);
```

## Cosa fa questa migrazione:

1. ✅ Aggiunge campo `city` per filtrare per città
2. ✅ Aggiunge campo `whatsapp_username` per nome su WhatsApp
3. ✅ Crea campo `phones` (array JSONB) per supportare più numeri
4. ✅ Migra automaticamente i numeri esistenti da `phone` a `phones`
5. ✅ Crea indice per ricerca veloce per città
6. ✅ Aggiorna full-text search per includere città

## Dopo la migrazione:

- I contatti esistenti avranno automaticamente il numero in `phones[0]`
- Puoi aggiungere più numeri per ogni contatto
- Puoi filtrare per città
- Il campo `phone` viene mantenuto per retrocompatibilità

## Nota:

Il campo `phone` viene mantenuto per retrocompatibilità. Se vuoi rimuoverlo dopo aver verificato che tutto funziona:

```sql
-- ATTENZIONE: Esegui solo dopo aver verificato che tutto funziona!
-- ALTER TABLE contacts DROP COLUMN phone;
```

