import type { SiteLocale } from "./i18n";
import { slugify } from "./publicSeo";

type Copy = { intro: string; advice: string; question: string; answer: string };
export type SeoRegion = {
  slug: string;
  name: string;
  country: string;
  seoEnabled: boolean;
  locationId: string;
  provinces: string[];
  towns: string[];
  copy: Record<SiteLocale, Copy>;
  source: string;
};
// Conservative, explicit locality mapping. A province alone is not a coastal assignment.
// Unverified feed localities remain discoverable in the country catalogue.
export const SEO_REGIONS: SeoRegion[] = [
  {
    slug: "costa-blanca",
    country: "hiszpania",
    seoEnabled: true,
    locationId: "costa_blanca",
    name: "Costa Blanca",
    provinces: ["Alicante", "Alacant", "Costa Blanca"],
    towns: [
      "Alicante",
      "Altea",
      "Benidorm",
      "Benissa",
      "Benissa Costa",
      "Calpe",
      "Calp",
      "Denia",
      "Dénia",
      "El Campello",
      "Guardamar del Segura",
      "Javea",
      "javea",
      "Jávea/Xàbia",
      "Moraira",
      "Orihuela",
      "Orihuela Costa",
      "Santa Pola",
      "Torrevieja",
      "Villajoyosa",
      "La Villajoyosa / Vila Joiosa",
      "San Miguel de Salinas",
      "Pilar de la Horadada",
      "Pilar de La Horadada",
      "La Mata",
      "Gran Alacant",
      "Cabo Roig",
      "La Zenia",
      "Punta Prima",
      "Playa Flamenca",
    ],
    source: "https://www.spain.info/en/region/costa-blanca/",
    copy: {
      pl: {
        intro:
          "Costa Blanca to wybrzeże prowincji Alicante. Porównaj oferty z Torrevieja i Guardamar del Segura z miejscowościami północnej części regionu, takimi jak Altea czy Dénia.",
        advice:
          "Przy wyborze między miastem a osiedlem poza centrum sprawdź codzienny dojazd do sklepów, usług i plaży. Zestaw metraż mieszkania z powierzchnią tarasu oraz ustal, czy parking jest częścią oferty. Lokalizacja na Costa Blanca nie oznacza automatycznie położenia przy plaży.",
        question: "Od czego zacząć porównanie Torrevieja i Guardamar?",
        answer:
          "Wybierz kilka adresów w obu miejscowościach i porównaj otoczenie podczas oglądania. Sprawdź dojście do usług oraz warunki użytkowania budynku poza sezonem, zamiast oceniać całą miejscowość na podstawie jednego zdjęcia.",
      },
      en: {
        intro:
          "Costa Blanca is the coast of Alicante province. Compare listings in Torrevieja and Guardamar del Segura with northern destinations such as Altea and Dénia.",
        advice:
          "When comparing a town centre with an outlying development, check everyday journeys to shops, services and the beach. Compare interior and terrace areas separately and confirm whether parking is included. A Costa Blanca address does not necessarily mean a beachfront location.",
        question: "How should I compare Torrevieja and Guardamar?",
        answer:
          "Shortlist specific addresses in both towns and explore their surroundings during viewings. Check access to services and how the building operates outside the holiday season.",
      },
    },
  },
  {
    slug: "costa-del-sol",
    country: "hiszpania",
    seoEnabled: true,
    locationId: "costa_del_sol",
    name: "Costa del Sol",
    provinces: ["Málaga", "Malaga", "Costa del Sol"],
    towns: [
      "Málaga",
      "Malaga",
      "Estepona",
      "Mijas",
      "Mijas Costa",
      "Mijas Golf",
      "La Cala de Mijas",
      "Fuengirola",
      "Marbella",
      "Marbella centre",
      "Benalmadena",
      "Benalmádena",
      "Benalmadena Costa",
      "Benalmadena Pueblo",
      "Torremolinos",
      "Nerja",
      "Torrox",
      "Manilva",
      "Casares",
      "Casares Playa",
      "Rincón de la Victoria",
      "Vélez-Málaga",
      "San Pedro de Alcántara",
      "Benahavís",
    ],
    source: "https://blog.visitacostadelsol.com/en/destinations-costa-del-sol",
    copy: {
      pl: {
        intro:
          "Costa del Sol pozwala porównać nadmorskie miasta, takie jak Estepona i Fuengirola, z różnymi częściami gminy Mijas. Wybierz oferty według konkretnego adresu, nie tylko nazwy wybrzeża.",
        advice:
          "Mijas obejmuje zarówno miejscowość położoną w głębi lądu, jak i strefę nadmorską. Przy oglądaniu sprawdź nachylenie terenu, dostęp pieszy i trasę dojazdu. W osiedlach ze wspólnymi udogodnieniami poproś o zestawienie opłat i zasad korzystania.",
        question: "Czy każda oferta w Mijas jest blisko plaży?",
        answer:
          "Nie. Nazwa gminy nie określa odległości od morza. Sprawdź punkt na mapie oraz faktyczną drogę dojścia lub dojazdu do wybranej plaży dla konkretnej nieruchomości.",
      },
      en: {
        intro:
          "Costa del Sol offers a choice between coastal towns such as Estepona and Fuengirola and the different areas of Mijas. Compare specific addresses as well as the coast as a whole.",
        advice:
          "Mijas includes an inland village and coastal areas. During viewings, check gradients, pedestrian access and driving routes. For developments with shared facilities, request the fees and rules of use.",
        question: "Is every Mijas property close to the beach?",
        answer:
          "No. The municipality name does not establish distance to the sea. Check the property location and the actual walking or driving route to your chosen beach.",
      },
    },
  },
  {
    slug: "costa-calida",
    country: "hiszpania",
    seoEnabled: true,
    locationId: "costa_calida",
    name: "Costa Cálida",
    provinces: ["Murcia", "Costa Calida", "Costa Cálida"],
    towns: [
      "Aguilas",
      "Águilas",
      "Cartagena",
      "Cabo de Palos",
      "La Manga",
      "La Manga del Mar Menor",
      "Los Alcazares",
      "Los Alcázares",
      "Los Belones",
      "Los Nietos",
      "Mar de Cristal",
      "Mazarron",
      "Mazarrón",
      "Puerto de Mazarron",
      "San Javier",
      "San Pedro del Pinatar",
      "Lo Pagan",
      "Lo Pagán",
      "Santiago de la Ribera",
      "Santiago De La Ribera",
    ],
    source: "https://www.spain.info/es/region/costa-calida/",
    copy: {
      pl: {
        intro:
          "Costa Cálida leży w regionie Murcji. Obejmuje lokalizacje nad Mar Menor i Morzem Śródziemnym, m.in. Los Alcázares, San Pedro del Pinatar oraz Águilas.",
        advice:
          "Przy wyborze lokalizacji ustal, nad którym akwenem chcesz spędzać czas. W San Pedro del Pinatar porównaj konkretną część miejscowości z adresem w Los Alcázares. Do planu oglądania dodaj spacer po okolicy, sprawdzenie usług i dojazdów.",
        question: "Czy San Pedro del Pinatar należy do Costa Blanca?",
        answer:
          "San Pedro del Pinatar leży w regionie Murcji i przypisujemy je do Costa Cálida. Bliskość granicy z prowincją Alicante nie zmienia tego przypisania.",
      },
      en: {
        intro:
          "Costa Cálida is in the Region of Murcia. Its destinations include locations by the Mar Menor and the Mediterranean, such as Los Alcázares, San Pedro del Pinatar and Águilas.",
        advice:
          "Decide which stretch of water you want to spend time near. Compare the particular neighbourhood in San Pedro del Pinatar with a specific Los Alcázares address. Include a walk around the area and a check of services and access in your viewing plan.",
        question: "Is San Pedro del Pinatar on the Costa Blanca?",
        answer:
          "San Pedro del Pinatar is in the Region of Murcia and belongs to our Costa Cálida catalogue. Proximity to Alicante province does not change that assignment.",
      },
    },
  },
  {
    slug: "costa-de-almeria",
    country: "hiszpania",
    seoEnabled: true,
    locationId: "costa_de_almeria",
    name: "Costa de Almería",
    provinces: ["Almería", "Almeria", "Costa de Almeria", "Costa de Almería"],
    towns: [
      "Vera",
      "Vera Playa",
      "Pulpi",
      "Pulpí",
      "San Juan de los Terreros",
      "Mojácar",
      "Mojacar",
      "Cuevas del Almanzora",
      "Cuevas Del Almanzora",
    ],
    source: "https://ws089.juntadeandalucia.es/sima/ficha.htm?mun=04100",
    copy: {
      pl: {
        intro:
          "W katalogu Costa de Almería znajdziesz nieruchomości z wybranych miejscowości prowincji Almería, w tym Vera i okolic Pulpí. Sprawdź osobno położenie miejscowości i adres nieruchomości.",
        advice:
          "Nazwa Vera może oznaczać ofertę w mieście lub w okolicy wybrzeża. Także dla Pulpí warto ustalić, czy chodzi o główną miejscowość, czy o San Juan de los Terreros. Porównaj codzienny dojazd, dostęp do usług i otoczenie osiedla przed ustaleniem planu oglądania.",
        question: "Czy oferta z nazwą Vera oznacza mieszkanie przy plaży?",
        answer:
          "Nie. Samo pole miejscowości nie potwierdza odległości od plaży ani widoku na morze. Te cechy trzeba sprawdzić w danych i podczas oglądania konkretnej oferty.",
      },
      en: {
        intro:
          "Our Costa de Almería catalogue covers selected locations in Almería province, including Vera and the Pulpí area. Check the town and the individual property address separately.",
        advice:
          "A Vera listing may refer to the town or to an area towards the coast. For Pulpí, establish whether the address is in the main town or San Juan de los Terreros. Compare daily travel, services and the development surroundings before arranging viewings.",
        question: "Does a Vera address mean a beachfront apartment?",
        answer:
          "No. The town field alone does not confirm beach distance or a sea view. Check those features in the individual listing and during a viewing.",
      },
    },
  },
];
export type SeoCity = {
  slug: string;
  name: string;
  region: string;
  aliases: string[];
  intro: Record<SiteLocale, string>;
};
export const SEO_CITIES: SeoCity[] = [
  {
    slug: "alicante",
    name: "Alicante",
    region: "costa-blanca",
    aliases: ["Alicante"],
    intro: {
      pl: "Przeglądaj mieszkania, apartamenty i domy na sprzedaż w mieście Alicante. Szukasz w całej prowincji? Pod ofertami porównasz główne miejscowości i przejdziesz do ich nieruchomości.",
      en: "Browse apartments and houses for sale in Alicante city. For a wider search across Alicante province, explore other Costa Blanca locations using the links below the listings.",
    },
  },
  {
    slug: "torrevieja",
    name: "Torrevieja",
    region: "costa-blanca",
    aliases: ["Torrevieja"],
    intro: {
      pl: "Torrevieja leży na Costa Blanca, w otoczeniu nadmorskich dzielnic i lagun. Przy porównywaniu ofert rozróżnij centrum, La Mata i osiedla poza zwartą zabudową: wspólna nazwa miasta nie oznacza tych samych dojazdów.",
      en: "Torrevieja is a Costa Blanca town with coastal neighbourhoods and nearby lagoons. Distinguish the centre, La Mata and outlying developments when comparing listings: the same town name does not mean the same daily journeys.",
    },
  },
  {
    slug: "guardamar-del-segura",
    name: "Guardamar del Segura",
    region: "costa-blanca",
    aliases: ["Guardamar del Segura"],
    intro: {
      pl: "Guardamar del Segura to miejscowość na Costa Blanca. Porównując mieszkanie w centrum z osiedlem poza nim, sprawdź trasę do plaży i usług. Dopytaj o dokładny adres, ponieważ nazwa Guardamar bywa używana także przy ofertach z okolicy.",
      en: "Guardamar del Segura is on the Costa Blanca. Compare a central apartment with an outlying development by checking routes to the beach and everyday services. Ask for the precise address when a listing refers broadly to the Guardamar area.",
    },
  },
  {
    slug: "estepona",
    name: "Estepona",
    region: "costa-del-sol",
    aliases: ["Estepona"],
    intro: {
      pl: "Estepona leży na Costa del Sol. Zestaw oferty w mieście z nieruchomościami na osiedlach poza centrum. Przy tych drugich sprawdź codzienną potrzebę korzystania z samochodu oraz opłaty za wspólne części i udogodnienia.",
      en: "Estepona is on the Costa del Sol. Compare homes in town with developments outside the centre. For the latter, check whether everyday trips require a car and request the fees for shared areas and facilities.",
    },
  },
  {
    slug: "mijas",
    name: "Mijas",
    region: "costa-del-sol",
    aliases: ["Mijas"],
    intro: {
      pl: "Mijas obejmuje różne części gminy, od miejscowości w głębi lądu po strefę nadmorską. Ten katalog pokazuje oferty opisane w bazie jako Mijas. Podczas wyboru zweryfikuj konkretną dzielnicę, nachylenie terenu i odległości po drogach.",
      en: "Mijas includes an inland village and coastal areas. This catalogue shows listings recorded as Mijas in our database. Confirm the actual neighbourhood, gradients and road distances when choosing a property.",
    },
  },
  {
    slug: "san-pedro-del-pinatar",
    name: "San Pedro del Pinatar",
    region: "costa-calida",
    aliases: ["San Pedro del Pinatar"],
    intro: {
      pl: "San Pedro del Pinatar należy do regionu Murcji i Costa Cálida. Przy wyborze nieruchomości porównaj adresy względem Mar Menor, wybrzeża śródziemnomorskiego i codziennych usług. Sprawdź te trasy podczas pobytu, nie tylko na zdjęciach.",
      en: "San Pedro del Pinatar belongs to Murcia and the Costa Cálida. Compare property addresses in relation to the Mar Menor, the Mediterranean shore and everyday services. Check these journeys in person as well as on a map.",
    },
  },
  {
    slug: "vera",
    name: "Vera",
    region: "costa-de-almeria",
    aliases: ["Vera"],
    intro: {
      pl: "Vera leży w prowincji Almería. Przy ofercie oznaczonej tą nazwą ustal, czy lokal jest w mieście, czy bliżej wybrzeża. Na oglądaniu porównaj otoczenie budynku, parking i dojazd do usług, a odległość do plaży sprawdź dla wybranego adresu.",
      en: "Vera is in Almería province. For a listing under this name, establish whether the home is in town or towards the coast. During viewings, compare the building surroundings, parking and access to services, and check beach distance for the specific address.",
    },
  },
];
export const findRegion = (slug: unknown) =>
  SEO_REGIONS.find((r) => r.slug === slug);
export const findCity = (region: unknown, slug: unknown) =>
  SEO_CITIES.find((c) => c.region === region && c.slug === slug);
export function regionForProperty(p: any) {
  return SEO_REGIONS.find(
    (r) =>
      r.provinces.some((x) => slugify(x) === slugify(p.province)) &&
      r.towns.some((x) => slugify(x) === slugify(p.town)),
  );
}
