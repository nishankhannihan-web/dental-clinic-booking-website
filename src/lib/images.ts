/**
 * High-quality dental clinic photography and visual assets
 * Curated for medical excellence, patient trust, warmth, and clinical precision.
 */

export const DENTAL_IMAGES = {
  hero: {
    primary: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=85", // Bright modern dental clinic with dentist smiling and modern equipment
    consultation: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80", // Dentist discussing patient care warmly
    chair: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80", // Modern ergonomic dental chair in luminous studio
  },
  services: {
    checkup: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", // Comprehensive dental exam / friendly consultation
    cleaning: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80", // Gentle hygiene & ultrasonic cleaning tools
    whitening: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80", // Bright radiant smile & laser whitening care
    filling: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80", // Modern restorative clinic suite
    emergency: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", // Professional healthcare care & diagnosis
    cosmetic: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?auto=format&fit=crop&w=800&q=80", // Aesthetic smile consultation & porcelain veneers
    invisalign: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=800&q=80", // Clear aligners / orthodontic scanning
    pediatric: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80", // Gentle family dentistry
  },
  about: {
    clinicInterior: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=1200&q=80", // Pristine clinic reception and architectural treatment rooms
    dentistTeam: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80", // Lead clinician in modern medical attire
    technology: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80", // Advanced 3D digital imaging and sterilized technology
  },
  badges: {
    sterilization: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80", // Hospital-grade autoclave sterilization
  }
};

/**
 * Returns a fitting image for a given service name or falls back to standard dental visual
 */
export function getServiceImage(serviceName: string): string {
  const lower = serviceName.toLowerCase();
  if (lower.includes("check") || lower.includes("exam") || lower.includes("consult")) {
    return DENTAL_IMAGES.services.checkup;
  }
  if (lower.includes("clean") || lower.includes("hygiene") || lower.includes("scale") || lower.includes("polish")) {
    return DENTAL_IMAGES.services.cleaning;
  }
  if (lower.includes("white") || lower.includes("bleach") || lower.includes("glow")) {
    return DENTAL_IMAGES.services.whitening;
  }
  if (lower.includes("fill") || lower.includes("cavity") || lower.includes("restor")) {
    return DENTAL_IMAGES.services.filling;
  }
  if (lower.includes("emerg") || lower.includes("urgent") || lower.includes("pain") || lower.includes("toothache")) {
    return DENTAL_IMAGES.services.emergency;
  }
  if (lower.includes("cosmetic") || lower.includes("veneer") || lower.includes("aesthetic") || lower.includes("smile")) {
    return DENTAL_IMAGES.services.cosmetic;
  }
  if (lower.includes("align") || lower.includes("invis") || lower.includes("brace") || lower.includes("ortho")) {
    return DENTAL_IMAGES.services.invisalign;
  }
  return DENTAL_IMAGES.services.checkup;
}
