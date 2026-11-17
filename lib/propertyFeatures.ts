// Cechy nieruchomości z kolumny `features` (Supabase). Feedy (REDSP/Kyero, Resales, Inmovilla,
// MLS) podają je jako swobodne etykiety, głównie po angielsku, w różnych zapisach
// („Communal Pool”, „Pool-Communal”, „Swimming Pool”, „basen”…). Tu sprowadzamy je do
// jednej listy z polską/angielską etykietą, grupą i ikoną; nieznane etykiety pomijamy.

export type FeatureGroup = "outdoor" | "interior" | "parking" | "area";
export type FeatureIcon =
  | "pool"
  | "garden"
  | "sun"
  | "terrace"
  | "bbq"
  | "spa"
  | "gym"
  | "sport"
  | "kids"
  | "shield"
  | "lift"
  | "snow"
  | "fire"
  | "sofa"
  | "kitchen"
  | "box"
  | "wifi"
  | "home"
  | "car"
  | "waves"
  | "view"
  | "mountain"
  | "golf"
  | "pin"
  | "plane"
  | "bolt"
  | "key";

export type PropertyFeature = {
  key: string;
  label: string;
  group: FeatureGroup;
  icon: FeatureIcon;
};

type Rule = {
  key: string;
  test: RegExp;
  pl: string | ((m: RegExpMatchArray) => string);
  en: string | ((m: RegExpMatchArray) => string);
  group: FeatureGroup;
  icon: FeatureIcon;
};

// Kolejność = priorytet: pierwsza pasująca reguła wygrywa, a każdy `key` pojawia się raz.
const RULES: Rule[] = [
  // Basen i strefy zewnętrzne
  { key: "private-pool", test: /\b(private|prywatny)\b.*\b(pool|swimming|basen)|^(private swimming pool|piscina privada)$/i, pl: "Prywatny basen", en: "Private pool", group: "outdoor", icon: "pool" },
  { key: "communal-pool", test: /communal pool|pool[\s-]*communal|community[\s-]*pool|comminity pool|^piscina comunitaria$/i, pl: "Basen wspólny", en: "Communal pool", group: "outdoor", icon: "pool" },
  // Samo „Pool” nie mówi, czy basen jest prywatny, czy wspólny — pokazujemy po prostu „Basen”.
  { key: "pool", test: /^swimming[\s-]*pool$|^pool$|^basen$|^piscina$/i, pl: "Basen", en: "Pool", group: "outdoor", icon: "pool" },
  { key: "indoor-pool", test: /indoor[\s-]*pool|heated pool/i, pl: "Basen kryty / podgrzewany", en: "Indoor / heated pool", group: "outdoor", icon: "pool" },
  { key: "private-garden", test: /garden\s*-\s*private|private garden|prywatny ogród/i, pl: "Prywatny ogród", en: "Private garden", group: "outdoor", icon: "garden" },
  { key: "garden", test: /^(garden|ogród|jardín|jardin)$|garden\s*-\s*communal|communal garden|landscaped|garden[\s-]*(zones|areas)|green zones|^garden$/i, pl: "Ogród / tereny zielone", en: "Garden / green areas", group: "outdoor", icon: "garden" },
  { key: "solarium", test: /solarium/i, pl: "Solarium", en: "Solarium", group: "outdoor", icon: "sun" },
  { key: "terrace-size", test: /^terrace:\s*(\d+)\s*m/i, pl: (m) => `Taras ${m[1]} m²`, en: (m) => `Terrace ${m[1]} m²`, group: "outdoor", icon: "terrace" },
  { key: "terrace", test: /terrace|terraza|^taras$/i, pl: "Taras", en: "Terrace", group: "outdoor", icon: "terrace" },
  { key: "balcony", test: /balcon/i, pl: "Balkon", en: "Balcony", group: "outdoor", icon: "terrace" },
  { key: "patio", test: /patio|porch|courtyard|pergola|^yard$/i, pl: "Patio / zadaszona weranda", en: "Patio / porch", group: "outdoor", icon: "terrace" },
  { key: "bbq", test: /bbq|barbe(c|q)ue/i, pl: "Grill", en: "Barbecue", group: "outdoor", icon: "bbq" },
  { key: "jacuzzi", test: /jacc?uzz?i/i, pl: "Jacuzzi", en: "Jacuzzi", group: "outdoor", icon: "spa" },
  { key: "spa", test: /^spa$|sauna/i, pl: "Spa / sauna", en: "Spa / sauna", group: "outdoor", icon: "spa" },
  { key: "gym", test: /\bgym|gymnasium|siłownia/i, pl: "Siłownia", en: "Gym", group: "outdoor", icon: "gym" },
  { key: "padel", test: /padel|paddle|tennis|sport facilities/i, pl: "Kort / strefa sportowa", en: "Sports court", group: "outdoor", icon: "sport" },
  { key: "kids", test: /playground|children area|children'?s area|plac zabaw/i, pl: "Plac zabaw", en: "Playground", group: "outdoor", icon: "kids" },
  { key: "outdoor-shower", test: /outdoor shower/i, pl: "Prysznic zewnętrzny", en: "Outdoor shower", group: "outdoor", icon: "waves" },
  { key: "fenced-plot", test: /fenced plot/i, pl: "Ogrodzona działka", en: "Fenced plot", group: "outdoor", icon: "shield" },
  { key: "gated", test: /^gated|gated community|24 hour security|^security$|security$|ochrona|electric gates|automatic gate/i, pl: "Teren zamknięty / ochrona", en: "Gated / security", group: "outdoor", icon: "shield" },
  { key: "lift", test: /elevator|\blift\b|^winda$|ascensor/i, pl: "Winda", en: "Lift", group: "outdoor", icon: "lift" },

  // Wnętrze i wyposażenie
  { key: "ac-pre", test: /(air conditioning|a\/c|ac)[\s:-]*pre-?install|^pre-installed$|preinstalaci/i, pl: "Instalacja pod klimatyzację", en: "A/C pre-installation", group: "interior", icon: "snow" },
  { key: "ac", test: /air[\s-]*condition|a\/c|climate control - (hot|cold) a\/c|central air|klimatyzacja/i, pl: "Klimatyzacja", en: "Air conditioning", group: "interior", icon: "snow" },
  { key: "underfloor", test: /under[\s-]*floor|u\/f\/h/i, pl: "Ogrzewanie podłogowe", en: "Underfloor heating", group: "interior", icon: "fire" },
  { key: "heating", test: /heating|ogrzewanie|calefacci/i, pl: "Ogrzewanie", en: "Heating", group: "interior", icon: "fire" },
  { key: "fireplace", test: /fireplace|chimney|kominek/i, pl: "Kominek", en: "Fireplace", group: "interior", icon: "fire" },
  { key: "unfurnished", test: /not furnished|unfurnished/i, pl: "Bez umeblowania", en: "Unfurnished", group: "interior", icon: "sofa" },
  { key: "furniture-optional", test: /furniture - optional/i, pl: "Umeblowanie opcjonalne", en: "Furniture optional", group: "interior", icon: "sofa" },
  { key: "part-furnished", test: /part[\s-]*furnished/i, pl: "Częściowo umeblowane", en: "Part furnished", group: "interior", icon: "sofa" },
  { key: "furnished", test: /furnished|^furniture$|umeblowan|amueblado/i, pl: "Umeblowane", en: "Furnished", group: "interior", icon: "sofa" },
  { key: "kitchen", test: /appliances|equipped kitchen|kitchen - fully fitted|fully fitted|dishwasher|oven|kitchen with island|open kitchen|ceramic cooker|freezer|fridge|refrigerator|microwave|fitted kitchen|open plan kitchen|independent kitchen|electrodomesticos/i, pl: "Wyposażona kuchnia", en: "Equipped kitchen", group: "interior", icon: "kitchen" },
  { key: "wardrobes", test: /wardrobe|built-in-closets|armarios|dressing room/i, pl: "Szafy w zabudowie", en: "Fitted wardrobes", group: "interior", icon: "box" },
  { key: "storage", test: /storage|trastero|storeroom|komórka/i, pl: "Komórka lokatorska", en: "Storage room", group: "interior", icon: "box" },
  { key: "laundry", test: /laundry|utility room|washing room/i, pl: "Pralnia", en: "Laundry room", group: "interior", icon: "home" },
  { key: "basement", test: /basement|under-build|piwnica/i, pl: "Piwnica", en: "Basement", group: "interior", icon: "home" },
  { key: "ensuite", test: /en[\s-]*suite/i, pl: "Łazienka przy sypialni", en: "En-suite bathroom", group: "interior", icon: "home" },
  { key: "glazing", test: /double glaz|doble glazing/i, pl: "Okna z podwójnymi szybami", en: "Double glazing", group: "interior", icon: "home" },
  { key: "internet", test: /fib(er|re)/i, pl: "Internet światłowodowy", en: "Fibre internet", group: "interior", icon: "wifi" },
  { key: "internet", test: /wi-?fi|internet/i, pl: "Dostęp do internetu", en: "Internet access", group: "interior", icon: "wifi" },
  { key: "intercom", test: /intercom|video-door/i, pl: "Domofon / wideodomofon", en: "Intercom", group: "interior", icon: "shield" },
  { key: "safe", test: /safe box/i, pl: "Sejf", en: "Safe", group: "interior", icon: "shield" },
  { key: "marble", test: /flooring-marble|marble floor/i, pl: "Podłogi marmurowe", en: "Marble floors", group: "interior", icon: "home" },
  { key: "games-room", test: /games room/i, pl: "Pokój gier", en: "Games room", group: "interior", icon: "home" },
  { key: "extra-wc", test: /^(toilet|wc):\s*\d+$|guest toilet/i, pl: "Dodatkowe WC", en: "Extra WC", group: "interior", icon: "home" },
  { key: "satellite-tv", test: /satellite tv/i, pl: "Telewizja satelitarna", en: "Satellite TV", group: "interior", icon: "wifi" },
  { key: "outdoor-lighting", test: /(outdoor|garden|exterior) lighting/i, pl: "Oświetlenie zewnętrzne", en: "Outdoor lighting", group: "outdoor", icon: "sun" },
  { key: "level-plot", test: /level plot/i, pl: "Płaska działka", en: "Level plot", group: "outdoor", icon: "garden" },
  { key: "utilities", test: /mains (water|electric)|has main electric|^electricity$/i, pl: "Przyłącza wody i prądu", en: "Mains water & electricity", group: "interior", icon: "bolt" },
  { key: "condition", test: /^condition\s*-\s*(excellent|good)$/i, pl: (m) => (m[1].toLowerCase() === "excellent" ? "Stan bardzo dobry" : "Stan dobry"), en: (m) => `Condition: ${m[1].toLowerCase()}`, group: "interior", icon: "key" },
  { key: "irrigation", test: /irrigation/i, pl: "System nawadniania ogrodu", en: "Irrigation system", group: "outdoor", icon: "garden" },
  { key: "parquet", test: /parquet/i, pl: "Parkiet", en: "Parquet floors", group: "interior", icon: "home" },
  { key: "ceiling-fans", test: /ceiling fans/i, pl: "Wentylatory sufitowe", en: "Ceiling fans", group: "interior", icon: "snow" },
  { key: "outdoor-kitchen", test: /outside kitchen|outdoor kitchen|summer kitchen/i, pl: "Kuchnia zewnętrzna", en: "Outdoor kitchen", group: "outdoor", icon: "bbq" },
  { key: "cctv", test: /video surveillance|cctv/i, pl: "Monitoring wideo", en: "Video surveillance", group: "interior", icon: "shield" },
  { key: "alarm", test: /alarm|security door|reinforced door|armou?red door|security grills/i, pl: "Alarm / drzwi antywłamaniowe", en: "Alarm / security door", group: "interior", icon: "shield" },
  { key: "solar", test: /solar (panels|energy)|aerotherm/i, pl: "Panele słoneczne / aerotermia", en: "Solar / aerothermal energy", group: "interior", icon: "bolt" },
  { key: "shutters", test: /electric shutters|motori[sz]ed (blinds|shutters)|electric blinds/i, pl: "Rolety elektryczne", en: "Electric shutters", group: "interior", icon: "home" },
  { key: "access", test: /disabled access|reduced mobility/i, pl: "Dostęp dla osób z niepełnosprawnościami", en: "Accessible", group: "interior", icon: "home" },
  { key: "renovated", test: /renovated|refurbished/i, pl: "Po remoncie", en: "Renovated", group: "interior", icon: "key" },
  { key: "key-ready", test: /key ready/i, pl: "Gotowe do odbioru", en: "Key ready", group: "interior", icon: "key" },
  { key: "tourist-licence", test: /licensed tourist/i, pl: "Licencja turystyczna", en: "Tourist licence", group: "interior", icon: "key" },

  // Parking
  { key: "parking-spaces", test: /number of parking spaces:\s*(\d+)/i, pl: (m) => (m[1] === "1" ? "1 miejsce parkingowe" : `${m[1]} miejsca parkingowe`), en: (m) => `${m[1]} parking space${m[1] === "1" ? "" : "s"}`, group: "parking", icon: "car" },
  { key: "garage", test: /garage|garaż|garaje/i, pl: "Garaż", en: "Garage", group: "parking", icon: "car" },
  { key: "underground-parking", test: /underground[\s-]*parking|parking - underground/i, pl: "Parking podziemny", en: "Underground parking", group: "parking", icon: "car" },
  { key: "parking", test: /parking|car port|driveway|off-street/i, pl: "Miejsce parkingowe", en: "Parking space", group: "parking", icon: "car" },

  // Okolica i widoki
  { key: "first-line", test: /first line|beachfront/i, pl: "Pierwsza linia brzegowa", en: "Frontline beach", group: "area", icon: "waves" },
  { key: "sea-views", test: /sea[\s-]*view|views:\s*sea|views-sea|^sea$|widok na morze|vistas al mar/i, pl: "Widok na morze", en: "Sea views", group: "area", icon: "view" },
  { key: "mountain-views", test: /mountain[\s-]*views|views?\s*-\s*mountain|countryside views|widok na góry/i, pl: "Widok na góry", en: "Mountain views", group: "area", icon: "mountain" },
  { key: "golf", test: /golf/i, pl: "Blisko pola golfowego", en: "Near golf", group: "area", icon: "golf" },
  { key: "near-beach", test: /near (the )?beach|close to (the )?(beach|sea)|blisko do morza|setting - close to sea|beachside/i, pl: "Blisko plaży", en: "Near the beach", group: "area", icon: "waves" },
  { key: "shops", test: /commercial cent|shops|amenities|sklep|restaurac/i, pl: "Sklepy i usługi w pobliżu", en: "Shops nearby", group: "area", icon: "pin" },
  { key: "schools", test: /school/i, pl: "Szkoły w pobliżu", en: "Schools nearby", group: "area", icon: "pin" },
  { key: "transport", test: /bus route|near transport|train station|tram stop|metro station/i, pl: "Komunikacja publiczna", en: "Public transport", group: "area", icon: "pin" },
  { key: "parks", test: /childrens? parks?|near trees/i, pl: "Parki i zieleń w pobliżu", en: "Parks nearby", group: "area", icon: "garden" },
  { key: "orientation", test: /^(?:orientation\s*-\s*)?(south[\s-]*east|south[\s-]*west|south|east|west)$/i, pl: (m) => `Wystawa: ${({ "south": "południowa", "south east": "południowo-wschodnia", "south west": "południowo-zachodnia", "east": "wschodnia", "west": "zachodnia" } as Record<string, string>)[m[1].toLowerCase().replace(/-/g, " ").replace(/\s+/g, " ")] || m[1]}`, en: (m) => `Facing ${m[1].toLowerCase()}`, group: "area", icon: "sun" },
  { key: "airport", test: /airport/i, pl: "Dobry dojazd z lotniska", en: "Easy airport access", group: "area", icon: "plane" },
  { key: "hospital", test: /near hospital|hospital/i, pl: "Szpital w pobliżu", en: "Hospital nearby", group: "area", icon: "pin" },
  { key: "marina", test: /close to (port|marina)|setting - close to marina/i, pl: "Blisko portu / mariny", en: "Close to the marina", group: "area", icon: "waves" },
  { key: "coastal", test: /^location:\s*coastal$|^coastal$/i, pl: "Lokalizacja nadmorska", en: "Coastal location", group: "area", icon: "waves" },
  { key: "urbanisation", test: /^(location:\s*)?urbani[sz]ation$/i, pl: "Osiedle mieszkaniowe", en: "Residential complex", group: "area", icon: "home" },
  { key: "rural", test: /^(location:\s*)?(rural|countryside|campo)$/i, pl: "Spokojna okolica poza miastem", en: "Rural setting", group: "area", icon: "garden" },
  { key: "mountain", test: /^(location:\s*)?mountain$/i, pl: "Okolica górska", en: "Mountain setting", group: "area", icon: "mountain" },
  { key: "garden-views", test: /views?:?\s*-?\s*garden/i, pl: "Widok na ogród", en: "Garden views", group: "area", icon: "view" },
  { key: "city-views", test: /views?[:\s-]*city/i, pl: "Widok na miasto", en: "City views", group: "area", icon: "view" },
  { key: "views", test: /^great views$|^(views|panoramic views?)$/i, pl: "Piękne widoki", en: "Great views", group: "area", icon: "view" },
  { key: "town", test: /near (the )?(town|city)( cent(er|re))?|close to town|setting - close to town/i, pl: "Blisko centrum miasta", en: "Close to town", group: "area", icon: "pin" },
];

export const FEATURE_GROUP_LABELS: Record<FeatureGroup, { pl: string; en: string }> = {
  outdoor: { pl: "Basen, ogród i części wspólne", en: "Pool, garden & communal areas" },
  interior: { pl: "Wnętrze i wyposażenie", en: "Interior & equipment" },
  parking: { pl: "Parking", en: "Parking" },
  area: { pl: "Okolica i widoki", en: "Area & views" },
};

// Napisy zepsute przy imporcie (np. „ogrÃ³d”, „GARAÅ»”) → poprawne UTF-8.
function fixMojibake(value: string) {
  if (!/[ÃÅÄ][\u0080-\u00ff]/.test(value)) return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
}

function featureStrings(features: unknown): string[] {
  if (Array.isArray(features)) return features.map((f) => fixMojibake(String(f ?? "").trim())).filter(Boolean);
  if (typeof features === "string") return features.split(/[,;|]/).map((f) => f.trim()).filter(Boolean);
  return [];
}

export function normalizeFeatures(
  features: unknown,
  locale: "pl" | "en" = "pl",
  property?: { pool?: boolean | null; distance_to_sea_m?: number | null },
): PropertyFeature[] {
  const out = new Map<string, PropertyFeature>();
  for (const raw of featureStrings(features)) {
    if (/:\s*no\b/i.test(raw)) continue; // „Garage: No”
    for (const rule of RULES) {
      const m = raw.match(rule.test);
      if (!m) continue;
      if (!out.has(rule.key)) {
        const label = locale === "en" ? rule.en : rule.pl;
        out.set(rule.key, {
          key: rule.key,
          label: typeof label === "function" ? label(m) : label,
          group: rule.group,
          icon: rule.icon,
        });
      }
      break;
    }
  }
  // Duplikaty o różnej szczegółowości: zostaw dokładniejszą wersję.
  if (out.has("terrace-size")) out.delete("terrace");
  if (out.has("private-garden")) out.delete("garden");
  if (out.has("ac")) out.delete("ac-pre");
  if (out.has("underfloor")) out.delete("heating");
  if (out.has("unfurnished") || out.has("part-furnished")) out.delete("furnished");
  if (out.has("parking-spaces") || out.has("garage") || out.has("underground-parking")) out.delete("parking");
  if (out.has("first-line")) out.delete("near-beach");
  if (out.has("private-pool") || out.has("communal-pool") || out.has("indoor-pool")) out.delete("pool");
  if (property?.pool && !out.has("private-pool") && !out.has("communal-pool") && !out.has("indoor-pool") && !out.has("pool")) {
    out.set("pool", { key: "pool", label: locale === "en" ? "Pool" : "Basen", group: "outdoor", icon: "pool" });
  }
  return [...out.values()];
}

/** Powierzchnia tarasu z cech, np. „Terrace: 18 Msq.” → 18. */
export function terraceArea(features: unknown): number | null {
  for (const raw of featureStrings(features)) {
    const m = raw.match(/^terrace:\s*(\d+)\s*m/i);
    if (m) return Number(m[1]);
  }
  return null;
}
