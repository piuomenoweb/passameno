/**
 * FUTURA INTEGRAZIONE GESTIONALE
 * 
 * Questo file contiene la struttura per integrare il gestionale interno
 * e recuperare le date di consegna della merce.
 * 
 * APPROCCI POSSIBILI:
 * 
 * 1. DATABASE POLLING (se hai accesso read-only al DB gestionale)
 *    - Connessione diretta al database gestionale
 *    - Query periodiche per nuovi ordini/consegne
 *    - Mapping campi gestionale -> sistema
 * 
 * 2. API REST (se il gestionale espone API)
 *    - Chiamate HTTP al gestionale
 *    - Autenticazione OAuth/API Key
 *    - Webhook per eventi real-time
 * 
 * 3. EXPORT/IMPORT CSV (soluzione temporanea)
 *    - Export periodico dal gestionale
 *    - Import automatico nel sistema
 *    - Sincronizzazione manuale
 * 
 * 4. WEBHOOK (se il gestionale supporta)
 *    - Il gestionale chiama il nostro endpoint
 *    - Eventi real-time
 *    - Più efficiente
 */

export interface GestionaleOrder {
  order_id: string
  customer_phone: string
  customer_name?: string
  delivery_date?: string
  status: string
  items?: any[]
}

export interface GestionaleConfig {
  type: 'database' | 'api' | 'csv' | 'webhook'
  connectionString?: string
  apiUrl?: string
  apiKey?: string
  mapping?: {
    ordersTable?: string
    customerPhoneField?: string
    deliveryDateField?: string
    statusField?: string
  }
}

/**
 * Esempio: Recupera ordini dal gestionale
 * Da implementare in base all'approccio scelto
 */
export async function fetchOrdersFromGestionale(
  config: GestionaleConfig
): Promise<GestionaleOrder[]> {
  // TODO: Implementare in base all'approccio scelto
  // Esempio con API:
  /*
  if (config.type === 'api') {
    const response = await fetch(`${config.apiUrl}/orders`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`
      }
    })
    return response.json()
  }
  */
  
  return []
}

/**
 * Esempio: Recupera data consegna per un ordine
 */
export async function getDeliveryDate(
  orderId: string,
  config: GestionaleConfig
): Promise<string | null> {
  // TODO: Implementare query/API call
  return null
}

/**
 * Esempio: Formatta messaggio WhatsApp con data consegna
 */
export function formatWhatsAppMessageWithDelivery(
  contactName: string,
  phone: string,
  deliveryDate?: string
): string {
  let message = `Ciao ${contactName}, il numero che cercavi è: ${phone}`
  
  if (deliveryDate) {
    message += `\n\nLa data di consegna prevista è: ${deliveryDate}`
  }
  
  return message
}

/**
 * STRUTTURA DATABASE PER FUTURA INTEGRAZIONE
 * 
 * Aggiungere queste tabelle in Supabase quando pronto:
 * 
 * CREATE TABLE gestionale_orders (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   gestionale_order_id VARCHAR(255) UNIQUE NOT NULL,
 *   customer_phone VARCHAR(20) NOT NULL,
 *   customer_name VARCHAR(255),
 *   delivery_date DATE,
 *   status VARCHAR(50),
 *   order_data JSONB,
 *   synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE TABLE delivery_notifications (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   order_id UUID REFERENCES gestionale_orders(id),
 *   contact_id UUID REFERENCES contacts(id),
 *   message_sent BOOLEAN DEFAULT false,
 *   sent_at TIMESTAMP WITH TIME ZONE,
 *   delivery_date DATE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */

