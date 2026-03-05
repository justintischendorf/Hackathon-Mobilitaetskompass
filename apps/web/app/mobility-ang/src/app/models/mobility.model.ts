export interface MobilityInput {
  budget: number;
  comfort: number;
  eco: number;
  distance: number;
  availability: number;
  flexibility: number;
}

export interface MobilityResult {
  empfehlung: string;
  erklaerung: string;
}

export interface ApiError {
  error: string;
}

export type MobilityCategory = 'Auto' | 'ÖPNV' | 'Jobrad' | 'E-Scooter';

export interface CategoryInfo {
  id: string;
  name: MobilityCategory;
  icon: string;
  tagline: string;
  description: string;
  benefits: string[];
  idealFor: string;
  route: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'auto',
    name: 'Auto',
    icon: '🚗',
    tagline: 'Maximale Flexibilität & Komfort',
    description:
      'Das Auto bietet höchsten Komfort und volle Unabhängigkeit – ideal für längere Strecken oder wenn die ÖPNV-Anbindung eingeschränkt ist.',
    benefits: [
      'Maximaler Komfort & Wetterschutz',
      'Ideal für lange Strecken',
      'Unabhängig von Fahrplänen',
      'Gepäck & Mitfahrer problemlos',
    ],
    idealFor: 'Hoher Komfortbedarf, lange Strecken, schwache ÖPNV-Anbindung',
    route: '/auto',
  },
  {
    id: 'oepnv',
    name: 'ÖPNV',
    icon: '🚌',
    tagline: 'Nachhaltig & kostenbewusst pendeln',
    description:
      'Der öffentliche Nahverkehr ist eine hervorragende Wahl für umweltbewusste Pendler mit guter Anbindung – günstig und stressfrei.',
    benefits: [
      'Kostengünstig mit Abo-Modellen',
      'Umweltfreundlich & nachhaltig',
      'Kein Parkplatzstress',
      'Reisezeit produktiv nutzen',
    ],
    idealFor: 'Kostenbewusste Pendler, gute ÖPNV-Anbindung, Umweltbewusstsein',
    route: '/oepnv',
  },
  {
    id: 'jobrad',
    name: 'Jobrad',
    icon: '🚲',
    tagline: 'Günstig, gesund & grün',
    description:
      'Das Jobrad vereint Bewegung, Kostenersparnis und Nachhaltigkeit – perfekt für kurze bis mittlere Strecken mit maximaler Flexibilität.',
    benefits: [
      'Extrem niedrige Kosten',
      'Maximale Nachhaltigkeit',
      'Fitness & Gesundheitsbonus',
      'Keine Staus, keine Parkplatzsuche',
    ],
    idealFor: 'Kurze Strecken, maximale Kosteneinsparung, umweltbewusster Lebensstil',
    route: '/jobrad',
  },
  {
    id: 'e-scooter',
    name: 'E-Scooter',
    icon: '🛴',
    tagline: 'Schnell & flexibel in der Stadt',
    description:
      'Der E-Scooter ist die moderne Lösung für kurze urbane Wege – flexibel, schnell und mit geringem ökologischen Fußabdruck.',
    benefits: [
      'Schnell & wendig im Stadtverkehr',
      'Flexible Verfügbarkeit',
      'Geringer ökologischer Fußabdruck',
      'Spaßfaktor & moderne Mobilität',
    ],
    idealFor: 'Kurze urbane Strecken, gute Verfügbarkeit, zeitliche Flexibilität',
    route: '/e-scooter',
  },
];
