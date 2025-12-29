/**
 * Utility per gestione numeri telefonici italiani
 */

export function formatItalianPhone(phone: string): string {
  // Rimuovi tutti i caratteri non numerici
  let cleaned = phone.replace(/\D/g, '')
  
  // Se inizia con 39 (prefisso internazionale), rimuovilo temporaneamente
  if (cleaned.startsWith('39')) {
    cleaned = cleaned.substring(2)
  }
  
  // Se inizia con 0, rimuovilo
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  
  // Aggiungi prefisso italiano +39
  return '+39' + cleaned
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  // Se ha prefisso +39, formatta in modo leggibile
  if (cleaned.startsWith('39')) {
    const number = cleaned.substring(2)
    if (number.length === 10) {
      // Formato: +39 333 123 4567
      return `+39 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
    }
  }
  
  return phone
}

export function cleanPhoneForWhatsApp(phone: string): string {
  // Rimuovi tutto tranne i numeri
  return phone.replace(/\D/g, '')
}

export function cleanPhoneForCall(phone: string): string {
  // Rimuovi tutto tranne i numeri e mantieni il prefisso +39
  let cleaned = phone.replace(/\D/g, '')
  
  // Se inizia con 39, aggiungi +
  if (cleaned.startsWith('39')) {
    return '+' + cleaned
  }
  
  // Altrimenti aggiungi +39
  return '+39' + cleaned
}

