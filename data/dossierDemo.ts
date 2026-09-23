/** One offer = one data object. The layout lives in components/dossier/Dossier.tsx. */
export interface DossierImage {
  src: string;
  alt: string;
  caption: string;
}

export interface DossierStep {
  title: string;
  description: string;
  timing?: string;
  repeat?: boolean;
}

export interface DossierOffer {
  reference: string;
  title: string;
  introduction: string;
  location: string;
  edition: string;
  isDemo: boolean;
  imageCredit: string;
  hero: DossierImage;
  gallery: DossierImage[];
  project: {
    title: string;
    paragraphs: string[];
    details: [string, string][];
    amenities: string[];
  };
  area: {
    name: string;
    description: string;
    map: { zoom: number; x: number; y: number; columns: number; rows: number; assetPath: string; url: string };
    places: { name: string; description: string; latitude: number; longitude: number }[];
    sources: { label: string; url: string }[];
  };
  plans: (DossierImage & { title: string; details: string })[];
  availability: { id: string; floor: string; bedrooms: number; bathrooms: number; area: number; terrace: number; price: number; status: "Dostępny" | "Rezerwacja" }[];
  purchaseSteps: DossierStep[];
  cooperationSteps: DossierStep[];
  finance: { price: number; depositPercent: number; annualRate: number; years: number; vatPercent: number; ajdPercent: number; region: string; sourceDate: string };
}

export const dossierSources = {
  vat: { label: "Agencia Tributaria · IVA", url: "https://sede.agenciatributaria.gob.es/Sede/iva/iva-operaciones-inmobiliarias/compro-vivienda-tengo-que-pagar-itp.html" },
  ajd: { label: "BOE · art. 14, AJD", url: "https://www.boe.es/buscar/act.php?id=BOE-A-1998-8202#a14" },
  mortgageCosts: { label: "Banco de España · koszty kredytu", url: "https://clientebancario.bde.es/pcb/es/menu-horizontal/productosservici/financiacion/hipotecas/guia-textual/primerospasoscon/Gastos_asociados_a_la_hipoteca.html" },
  rates: { label: "Bankinter · porównanie kredytów", url: "https://www.bankinter.com/banca/en/mortgages-loans/mortgages/mortgage-related-financial-decisions/mortgage-comparison-tool" },
  mortgage: { label: "Bankinter · warunki kredytu", url: "https://www.bankinter.com/banca/en/mortgages-loans/mortgages/fixed-rate-mortgage" },
  onesta: { label: "Poznaj Onesta Group", url: "https://onesta.com.pl" },
};

export const dossierDemo: DossierOffer = {
  reference: "12345",
  title: "Wyjątkowy projekt blisko morza w Alicante",
  introduction: "Poznaj inwestycję powstającą z myślą o miłym spędzaniu czasu i możliwości wynajmu.",
  location: "Alicante · Costa Blanca · Hiszpania",
  edition: "Wrzesień 2026",
  isDemo: true,
  imageCredit: "Materiały pokazowe: SOL Y PLAYA II, Lo Pagán · Calida Homes. Nie przedstawiają oferty w Alicante.",
  hero: { src: "/dossier-demo/exterior.webp", alt: "Wizualizacja jasnej elewacji i tarasów SOL Y PLAYA II", caption: "Architektura otwarta na słońce" },
  gallery: [
    { src: "/dossier-demo/aerial.webp", alt: "Wizualizacja SOL Y PLAYA II z lotu ptaka, ze wspólnym dziedzińcem i basenem", caption: "01 / Projekt z lotu ptaka" },
    { src: "/dossier-demo/exterior.webp", alt: "Balkony i elewacja SOL Y PLAYA II od strony ulicy", caption: "02 / Śródziemnomorska architektura" },
    { src: "/dossier-demo/facade.webp", alt: "Zbliżenie tarasów i wejść do apartamentów SOL Y PLAYA II", caption: "03 / Przestrzeń na co dzień" },
  ],
  project: {
    title: "Twój własny kawałek Śródziemnomorza.",
    paragraphs: [
      "Jasne wnętrza, miejsce na poranną kawę na tarasie i przestrzeń, w której po prostu dobrze się odpoczywa. Przykładowa inwestycja łączy wygodę własnego apartamentu z udogodnieniami kameralnego osiedla.",
      "To propozycja dla osób szukających drugiego domu w Hiszpanii, z możliwością rozważenia wynajmu w czasie swojej nieobecności. Przed zakupem sprawdzamy dopuszczalność wybranego rodzaju najmu, zasady wspólnoty i koszty obsługi.",
    ],
    details: [["Liczba sypialni", "2–3"], ["Liczba łazienek", "2"], ["Parking", "Tak · miejsce w garażu"], ["Basen", "Tak · wspólny"], ["Powierzchnia zabudowana", "76–112 m²"], ["Termin oddania", "IV kwartał 2027 · przykład"]],
    amenities: ["Blisko morza", "Sklepy i restauracje w okolicy", "Ogródek w wybranych lokalach", "Zamknięte osiedle"],
  },
  area: {
    name: "Alicante",
    description: "Miasto na Costa Blanca łączy plaże z codziennym życiem przez cały rok. Przy centrum leży plaża Postiguet, a na północny wschód rozciąga się Playa de San Juan. Stare miasto, port i promenada Explanada tworzą spacerowe centrum. Połączenia TRAM pozwalają odkrywać wybrzeże, a lotnisko Alicante–Elche obsługuje region.",
    map: { zoom: 12, x: 2041, y: 1574, columns: 3, rows: 2, assetPath: "/dossier-demo/map", url: "https://www.openstreetmap.org/#map=12/38.335/-0.485" },
    places: [
      { name: "Playa de San Juan", description: "Szeroka, piaszczysta plaża z promenadą, restauracjami i miejscami do uprawiania sportu.", latitude: 38.3708, longitude: -0.4091 },
      { name: "Castillo de Santa Bárbara", description: "Zamek na wzgórzu Benacantil. Punkt widokowy na port, stare miasto i zatokę Alicante.", latitude: 38.3493, longitude: -0.4779 },
      { name: "Explanada de España", description: "Nadmorska promenada z charakterystyczną mozaiką, przy marinie i historycznym centrum.", latitude: 38.342, longitude: -0.4834 },
      { name: "Lotnisko Alicante–Elche", description: "Główny port lotniczy regionu. Dojazd do konkretnej inwestycji ustalamy po potwierdzeniu adresu.", latitude: 38.2822, longitude: -0.5582 },
    ],
    sources: [
      { label: "Alicante Turismo · przewodnik", url: "https://alicanteturismo.com/wp-content/uploads/2023/01/GUIA-TURISTICA-IMAGINARTE.pdf" },
      { label: "Miasto Alicante · zamek", url: "https://www.alicante.es/es/equipamientos/castillo-santa-barbara" },
    ],
  },
  plans: [
    { src: "/dossier-demo/plan-a.webp", alt: "Oryginalny rzut mieszkania P1-A w SOL Y PLAYA II, dwie sypialnie, dwie łazienki i taras", title: "Apartament P1-A", caption: "Przykład układu · SOL Y PLAYA II", details: "2 sypialnie · 2 łazienki · taras" },
    { src: "/dossier-demo/plan-b.webp", alt: "Oryginalny rzut mieszkania P1-B w SOL Y PLAYA II", title: "Apartament P1-B", caption: "Przykład układu · SOL Y PLAYA II", details: "Układ alternatywny · pierwsze piętro" },
  ],
  availability: [
    { id: "A.01", floor: "Parter", bedrooms: 2, bathrooms: 2, area: 78, terrace: 24, price: 360000, status: "Dostępny" },
    { id: "A.02", floor: "Parter", bedrooms: 2, bathrooms: 2, area: 82, terrace: 31, price: 375000, status: "Dostępny" },
    { id: "B.03", floor: "1. piętro", bedrooms: 2, bathrooms: 2, area: 76, terrace: 16, price: 365000, status: "Rezerwacja" },
    { id: "B.04", floor: "1. piętro", bedrooms: 3, bathrooms: 2, area: 98, terrace: 22, price: 425000, status: "Dostępny" },
    { id: "C.05", floor: "2. piętro", bedrooms: 3, bathrooms: 2, area: 104, terrace: 28, price: 455000, status: "Dostępny" },
    { id: "C.06", floor: "Penthouse", bedrooms: 3, bathrooms: 2, area: 112, terrace: 62, price: 520000, status: "Dostępny" },
  ],
  purchaseSteps: [
    { title: "Wybór nieruchomości", description: "Wspólnie wybieramy projekty, które warto obejrzeć na miejscu.", timing: "Przygotowanie" },
    { title: "Spotkania z deweloperami", description: "Poznajesz mieszkania, standard wykończenia i otoczenie.", timing: "Wizyta w Hiszpanii" },
    { title: "Decyzja i rezerwacja", description: "Opłata rezerwacyjna 5 000 € zaliczana na cenę zgodnie z umową.", timing: "Dzień rezerwacji" },
    { title: "Podpisanie kontraktu", description: "Weryfikacja umowy, harmonogramu i zabezpieczeń wpłat.", timing: "Około 2 tygodnie później" },
    { title: "Pierwsza transza · ok. 30%", description: "Wpłata zgodnie z kontraktem, z rozliczeniem rezerwacji.", timing: "Około 1 miesiąc" },
    { title: "Kolejna transza · ok. 30%", description: "Płatność powiązana z postępem prac budowlanych.", timing: "Około 6–10 miesięcy" },
    { title: "NIE, bank i formalności", description: "Komplet dokumentów przed aktem. Procedury rozpoczynamy z wyprzedzeniem.", timing: "Przed aktem notarialnym" },
    { title: "Akt i odbiór mieszkania", description: "Kontrola lokalu, zapłata pozostałej ceny (ok. 40%) i przekazanie kluczy.", timing: "Zakończenie budowy" },
    { title: "Gotowe do zamieszkania", description: "Opcjonalnie: umeblowanie i przygotowanie do zarządzania najmem.", timing: "Po odbiorze" },
  ],
  cooperationSteps: [
    { title: "Rozmowa i zrozumienie", description: "Poznajemy Twoje potrzeby, cel i budżet." },
    { title: "Pierwszy zestaw ofert", description: "Przygotowujemy około 10–20 propozycji." },
    { title: "Wspólne omówienie", description: "Na zdjęciach wykluczamy niepożądane cechy." },
    { title: "Kolejne propozycje", description: "Dopasowujemy wybór do Twoich wniosków." },
    { title: "Dopracowujemy wybór", description: "Powtarzamy aż do idealnego zestawu.", repeat: true },
    { title: "Przylot na 2–4 dni", description: "Ustalamy plan spotkań na miejscu." },
    { title: "Prezentacje i okolica", description: "Oglądamy projekty i ich otoczenie." },
    { title: "Korekty i aktualizacja", description: "Uwzględniamy wnioski po prezentacjach." },
    { title: "Decyzja zakupowa", description: "Wybierasz ze spokojem i pełną wiedzą." },
  ],
  finance: { price: 360000, depositPercent: 40, annualRate: 3.6, years: 15, vatPercent: 10, ajdPercent: 1.4, region: "Wspólnota Walencka", sourceDate: "15.09.2026" },
};

export function mortgagePayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  return monthlyRate === 0 ? principal / months : principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}
