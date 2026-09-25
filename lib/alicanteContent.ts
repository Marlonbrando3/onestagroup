import locations from "@/data/locations.json";
import { buildCatalogUrl } from "./catalogRouting";
import type { LocationEntry } from "./locations";
import { navigationLocationHref } from "./propertyNavigation";

type AlicanteDestination = {
  name: string;
  description: string;
  locationIds: string[];
  area: "province" | "valencia" | "murcia";
};

// Editorial selection supplied by the user; this is not a list of every town in the province.
export const ALICANTE_DESTINATIONS: AlicanteDestination[] = [
  {
    name: "Alicante",
    description:
      "Miasto dla osób łączących plażę z codziennym życiem w większym ośrodku. Porównaj centrum, okolice Postiguet i Playa de San Juan.",
    locationIds: ["alicante"],
    area: "province",
  },
  {
    name: "Altea",
    description:
      "Stare miasto na wzgórzu i nadmorska część miejscowości dają różne możliwości. Przy wyborze domu zwróć uwagę na nachylenie terenu i dojazd.",
    locationIds: ["altea"],
    area: "province",
  },
  {
    name: "Benidorm",
    description:
      "Miejska zabudowa przy plażach Levante i Poniente. Przy apartamencie w wysokim budynku porównaj piętro, widok, windy i opłaty wspólnoty.",
    locationIds: ["benidorm"],
    area: "province",
  },
  {
    name: "Benissa",
    description:
      "Historyczne centrum w głębi lądu i osobna strefa nadmorska z zatokami. Ustal, czy oferta dotyczy miasta, czy Benissa Costa.",
    locationIds: ["benissa", "benissa_costa"],
    area: "province",
  },
  {
    name: "Calpe",
    description:
      "Nadmorskie miasto przy charakterystycznej skale Peñón de Ifach. Zestaw mieszkania przy plażach z domami położonymi dalej od zwartej zabudowy.",
    locationIds: ["calpe"],
    area: "province",
  },
  {
    name: "Ciudad Quesada",
    description:
      "Urbanizacja w gminie Rojales, w głębi lądu. Warto ją porównać, szukając domu z tarasem lub ogrodem i planując dojazdy samochodem.",
    locationIds: ["ciudad_quesada", "rojales_ciudad_quesada"],
    area: "province",
  },
  {
    name: "Dénia",
    description:
      "Miasto portowe z plażami i otoczeniem masywu Montgó. Porównaj lokal w centrum z nieruchomością wzdłuż wybrzeża, sprawdzając codzienne odległości.",
    locationIds: ["denia"],
    area: "province",
  },
  {
    name: "Elche",
    description:
      "Duże miasto w głębi lądu, znane z gaju palmowego. Adres w gminie Elche może oznaczać inną okolicę niż samo centrum — sprawdź punkt na mapie.",
    locationIds: ["elche", "elche_pedanias"],
    area: "province",
  },
  {
    name: "Guardamar del Segura",
    description:
      "Nadmorska miejscowość z plażami i wydmami. Zestaw mieszkanie w centrum z osiedlem poza nim, porównując pieszą drogę nad morze i do sklepów.",
    locationIds: ["guardamar_del_segura"],
    area: "province",
  },
  {
    name: "Jávea / Xàbia",
    description:
      "Stare miasto, port i okolice plaży Arenal to różne części tej samej miejscowości. Wybierz tę, która odpowiada Twojemu rytmowi pobytów.",
    locationIds: ["javea", "javea_xabia"],
    area: "province",
  },
  {
    name: "Mil Palmeras",
    description:
      "Nadmorska lokalizacja przy południowym krańcu prowincji. Przy apartamencie na wakacje sprawdź dojście do plaży i dostępność usług poza sezonem.",
    locationIds: ["mil_palmeras"],
    area: "province",
  },
  {
    name: "Moraira",
    description:
      "Nadmorska część gminy Teulada, z portem i zatokami. Szukając willi, porównaj odległość od centrum, ukształtowanie działki i prywatność ogrodu.",
    locationIds: ["moraira"],
    area: "province",
  },
  {
    name: "Orihuela Costa",
    description:
      "Nadmorska część gminy Orihuela obejmująca wiele osiedli. Dokładna dzielnica ma znaczenie: nazwa całego obszaru nie określa odległości od plaży.",
    locationIds: ["orihuela_costa"],
    area: "province",
  },
  {
    name: "Pilar de la Horadada",
    description:
      "Miasto na południu prowincji Alicante. Porównaj wygodę życia w centrum z lokalizacjami nadmorskimi, do których prowadzą osobne kafelki.",
    locationIds: ["pilar_de_la_horadada"],
    area: "province",
  },
  {
    name: "San Miguel de Salinas",
    description:
      "Miejscowość w głębi lądu, do rozważenia przy poszukiwaniu domu lub apartamentu poza nadmorskim centrum. Sprawdź dojazdy do wybranych plaż.",
    locationIds: ["san_miguel_de_salinas"],
    area: "province",
  },
  {
    name: "Santa Pola",
    description:
      "Miasto portowe na południe od Alicante. Przy mieszkaniu na dłuższe pobyty porównaj sąsiedztwo portu, plaż oraz codziennych usług.",
    locationIds: ["santa_pola"],
    area: "province",
  },
  {
    name: "Torre de la Horadada",
    description:
      "Nadmorska część gminy Pilar de la Horadada. Dobry punkt porównania dla osób szukających pobytów przy plaży, z dala od dużego miasta.",
    locationIds: ["torre_de_la_horadada"],
    area: "province",
  },
  {
    name: "Torrevieja",
    description:
      "Nadmorskie miasto z plażami i lagunami w otoczeniu. Porównaj centrum, La Mata i osiedla dalej od morza; każde oznacza inny sposób korzystania z nieruchomości.",
    locationIds: ["torrevieja"],
    area: "province",
  },
  {
    name: "Villajoyosa",
    description:
      "Miasto znane z kolorowej zabudowy nad morzem. Oceniaj osobno mieszkania przy centrum i inwestycje w innych częściach wybrzeża gminy.",
    locationIds: ["villajoyosa", "la_villajoyosa_vila_joiosa"],
    area: "province",
  },
  {
    name: "Gandía",
    description:
      "Prowincja Walencja. Centrum miasta i dzielnica przy plaży są oddalone od siebie, więc przed wyborem nieruchomości ustal preferowaną część miejscowości.",
    // No public listings at verification time: use a clearly labelled enquiry, not a 404 search URL.
    locationIds: [],
    area: "valencia",
  },
  {
    name: "Oliva",
    description:
      "Prowincja Walencja, na północ od Dénia. Porównaj zabudowę miejską z okolicami plaży; bliskość Alicante na mapie nie oznacza tej samej prowincji.",
    locationIds: ["oliva"],
    area: "valencia",
  },
  {
    name: "Murcja",
    description:
      "Stolica regionu Murcji, położona w głębi lądu. To kierunek dla osób rozważających życie w mieście; nazwa regionu nie oznacza adresu nad morzem.",
    locationIds: ["murcia"],
    area: "murcia",
  },
  {
    name: "San Pedro del Pinatar",
    description:
      "Region Murcji i Costa Cálida. Przy wyborze adresu rozróżnij okolice Mar Menor i wybrzeże Morza Śródziemnego oraz sprawdź faktyczną trasę do wody.",
    locationIds: ["san_pedro_del_pinatar"],
    area: "murcia",
  },
];

export function alicanteDestinationHref(destination: AlicanteDestination) {
  if (!destination.locationIds.length) return "#alicante-onesta";
  if (destination.locationIds[0] === "alicante") return "#oferty";
  if (destination.locationIds.length > 1) {
    return buildCatalogUrl(
      "hiszpania",
      { location: destination.locationIds.join(",") },
      "pl",
    )!;
  }
  const location = (locations as LocationEntry[]).find(
    (item) => item.id === destination.locationIds[0],
  );
  if (!location)
    throw new Error(`Unknown Alicante destination: ${destination.name}`);
  return navigationLocationHref("hiszpania", location, "pl");
}
