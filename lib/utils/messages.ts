import { Contact, PhoneNumber } from '@/types/contact'
import { formatPhoneDisplay } from './phone'

/**
 * Genera messaggio WhatsApp default con stile giovanile
 */
export function getDefaultWhatsAppMessage(): string {
  return "Ciao 👋, sono Carmelo! Come ti butta la giornata? 😊✨"
}

/**
 * Genera messaggio per condivisione contatto
 */
export function getShareContactMessage(
  contact: Contact,
  phoneNumber: PhoneNumber
): string {
  const defaultMsg = getDefaultWhatsAppMessage()
  const contactName = contact.whatsapp_username || contact.name
  const formattedPhone = formatPhoneDisplay(phoneNumber.number)
  
  return `${defaultMsg}\n\nCiao questo è il numero che cercavi ${contactName} 📱\n${formattedPhone}\nGrazie! 🙏`
}

/**
 * Genera messaggio per invio diretto WhatsApp
 */
export function getDirectWhatsAppMessage(phoneNumber: PhoneNumber): string {
  const defaultMsg = getDefaultWhatsAppMessage()
  const formattedPhone = formatPhoneDisplay(phoneNumber.number)
  
  return `${defaultMsg}\n\nIl numero che cercavi è: ${formattedPhone} 📞`
}

