export interface MobilityInput {
  budget: number;
  comfort: number;
  eco: number;
  distance: number;
  availability: number;
  flexibility: number;
  fuehrerschein: boolean;
}

export interface MobilityResult {
  empfehlung: string;
  erklaerung: string;
}

export interface ApiError {
  error: string;
}

export type MobilityCategory = 'Auto' | 'ÖPNV' | 'Fahrrad' | 'E-Scooter' | 'Car Sharing' | 'Uber';

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
    id: 'fahrrad',
    name: 'Fahrrad',
    icon: '🚲',
    tagline: 'Günstig, gesund & grün',
    description:
      'Das Fahrrad vereint Bewegung, Kostenersparnis und Nachhaltigkeit – perfekt für kurze bis mittlere Strecken mit maximaler Flexibilität.',
    benefits: [
      'Extrem niedrige Kosten',
      'Maximale Nachhaltigkeit',
      'Fitness & Gesundheitsbonus',
      'Keine Staus, keine Parkplatzsuche',
    ],
    idealFor: 'Kurze Strecken, maximale Kosteneinsparung, umweltbewusster Lebensstil',
    route: '/fahrrad',
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
  {
    id: 'carsharing',
    name: 'Car Sharing',
    icon: '🚙',
    tagline: 'Auto nutzen ohne zu besitzen',
    description:
      'Car Sharing bietet die Flexibilität eines Autos ohne die Kosten eines eigenen Fahrzeugs – ideal für gelegentliche Fahrten.',
    benefits: [
      'Keine Anschaffungskosten',
      'Flexible Nutzung bei Bedarf',
      'Verschiedene Fahrzeugtypen verfügbar',
      'Wartung & Versicherung inklusive',
    ],
    idealFor: 'Gelegentlicher Autobedarf, Führerschein vorhanden, urbanes Umfeld',
    route: '/carsharing',
  },
  {
    id: 'uber',
    name: 'Uber',
    icon: '📱',
    tagline: 'Komfortabel von Tür zu Tür',
    description:
      'Uber bietet bequemen Tür-zu-Tür-Transport per App – ohne eigenes Fahrzeug und ohne Parkplatzsuche.',
    benefits: [
      'Kein eigenes Fahrzeug nötig',
      'Tür-zu-Tür-Service',
      'Per App sofort verfügbar',
      'Kein Führerschein erforderlich',
    ],
    idealFor: 'Komfortbedarf, kein eigenes Auto, flexible Verfügbarkeit',
    route: '/uber',
  },
];

export interface MobilityLink {
  label: string;
  url: string;
  drittanbieter: boolean;
}

export interface MobilityLinks {
  kaufvorschlag?: MobilityLink;
  service: MobilityLink;
}

export const CATEGORY_LINKS: Record<MobilityCategory, MobilityLinks> = {
  'Fahrrad': {
    kaufvorschlag: {
      label: 'Fahrrad kaufen',
      url: 'https://www.fahrrad.de',
      drittanbieter: true,
    },
    service: {
      label: 'Fahrradversicherung',
      url: 'https://www.huk.de/haus-haftung-recht/sport-freizeit/fahrradversicherung.html',
      drittanbieter: false,
    },
  },
  'Auto': {
    kaufvorschlag: {
      label: 'Auto kaufen',
      url: 'https://huk-autowelt.de/auto_kaufen',
      drittanbieter: false,
    },
    service: {
      label: 'Autoversicherung',
      url: 'https://www.huk.de/fahrzeuge/kfz-versicherung/autoversicherung.html',
      drittanbieter: false,
    },
  },
  'E-Scooter': {
    kaufvorschlag: {
      label: 'E-Scooter kaufen',
      url: 'https://www.mediamarkt.de/de/category/e-scooter-1845.html',
      drittanbieter: true,
    },
    service: {
      label: 'E-Scooter Versicherung',
      url: 'https://www.huk.de/fahrzeuge/kfz-versicherung/elektro-kleinstfahrzeuge.html?INID=O3140',
      drittanbieter: false,
    },
  },
  'ÖPNV': {
    service: {
      label: 'Deutschlandticket',
      url: 'https://deutschlandticket.de/',
      drittanbieter: true,
    },
  },
  'Uber': {
    service: {
      label: 'Uber nutzen',
      url: 'https://www.uber.com/de/de/',
      drittanbieter: true,
    },
  },
  'Car Sharing': {
    service: {
      label: 'MILES Mobility',
      url: 'https://www.miles-mobility.com/',
      drittanbieter: true,
    },
  },
};
