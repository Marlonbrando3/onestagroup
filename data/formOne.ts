// Landing /form-one (dawniej osobna strona „Dulka”). Dane 40 ofert w 8 kategoriach.
// Edycja: ceny, opisy i zdjęcia zmieniasz tutaj. Zachowaj unikalne ref i slug.

export type FormOneOffer = {
  slug: string;
  key: string;
  ref: string;
  region: string;
  budget: string;
  city: string;
  title: string;
  subtitle: string;
  price: number;
  area: number;
  beds: number;
  baths: number;
  beach: string;
  features: string[];
  paragraphs: string[];
  note?: string;
  images: string[];
};

export const FORM_ONE_BASE = "/form-one";

export const GROUPS = [
  { slug: "do-250-tys-euro", price: "250 000 €", label: "Do 250 000 €", description: "Pierwszy adres pod hiszpańskim słońcem." },
  { slug: "do-400-tys-euro", price: "400 000 €", label: "Do 400 000 €", description: "Więcej miejsca na Twoje plany." },
  { slug: "do-500-tys-euro", price: "500 000 €", label: "Do 500 000 €", description: "Komfort w starannie wybranej lokalizacji." },
  { slug: "premium", price: "Premium", label: "Nieruchomości premium", description: "Wyjątkowe adresy. Indywidualna selekcja." },
] as const;

export const REGIONS = [
  { slug: "costa-blanca", name: "Costa Blanca", description: "Apartamenty i domy na Costa Blanca. Wybierz budżet i poznaj naszą selekcję." },
  { slug: "costa-del-sol", name: "Costa del Sol", description: "Apartamenty i domy na Costa del Sol. Wybierz budżet i poznaj naszą selekcję." },
] as const;

export type FormOneGroup = (typeof GROUPS)[number];
export type FormOneRegion = (typeof REGIONS)[number];

export const OFFERS: FormOneOffer[] = [
  {
    "slug": "apartament-santa-pola",
    "key": "santa-pola",
    "ref": "MTI-3343-115-10-115",
    "city": "Santa Pola",
    "title": "Apartament w Santa Pola",
    "subtitle": "Nowe mieszkanie 1 km od plaży",
    "price": 205000,
    "area": 59,
    "beds": 1,
    "baths": 1,
    "beach": "1 km do plaży",
    "features": [
      "Wspólny basen i solarium na dachu",
      "Aerotermia do podgrzewania wody",
      "Panel słoneczny z falownikiem",
      "Przygotowanie do klimatyzacji kanałowej"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią w centrum Santa Pola, w inwestycji obejmującej 48 mieszkań. Plaża znajduje się około 1 km od budynku, a sklepy, restauracje i promenada są w pobliżu.",
      "Do dyspozycji mieszkańców przewidziano basen i wspólne solarium na dachu. Mieszkanie ma zabudowę kuchenną, wzmocnione drzwi wejściowe i rozwiązania ograniczające zużycie energii. Lotnisko w Alicante jest oddalone o około 14 km."
    ],
    "note": "Obowiązkowy zakup co najmniej jednego miejsca parkingowego: od 15 000 € dodatkowo. Parking nie jest wliczony w cenę 205 000 €.",
    "images": [
      "/form-one/assets/properties/santa-pola-1.webp",
      "/form-one/assets/properties/santa-pola-2.webp",
      "/form-one/assets/properties/santa-pola-3.webp",
      "/form-one/assets/properties/santa-pola-4.webp",
      "/form-one/assets/properties/santa-pola-5.webp"
    ],
    "region": "costa-blanca",
    "budget": "do-250-tys-euro"
  },
  {
    "slug": "apartament-guardamar-centrum",
    "key": "guardamar-3312",
    "ref": "MTI-3312-115-10-115",
    "city": "Guardamar del Segura",
    "title": "Apartament w centrum Guardamar",
    "subtitle": "Kameralny budynek, 600 m od plaży",
    "price": 215000,
    "area": 71,
    "beds": 2,
    "baths": 1,
    "beach": "600 m do plaży",
    "features": [
      "Budynek obejmujący tylko 10 mieszkań",
      "Wspólny basen i strefa wypoczynku na dachu",
      "Prywatny taras",
      "Kuchnia ze sprzętem AGD",
      "Ogrzewanie podłogowe w łazience i winda"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i jedną łazienką w kameralnym budynku w Guardamar del Segura. Na każdym piętrze znajdują się tylko dwa mieszkania, a od plaży dzieli inwestycję około 600 m.",
      "Prywatny taras uzupełniają wspólne przestrzenie na dachu z basenem i strefą do opalania. W wyposażeniu uwzględniono kuchnię z AGD, oświetlenie LED oraz przygotowanie do klimatyzacji kanałowej. Sklepy, kawiarnie i restauracje są w zasięgu spaceru."
    ],
    "note": "",
    "images": [
      "/form-one/assets/properties/guardamar-3312-1.webp",
      "/form-one/assets/properties/guardamar-3312-2.webp",
      "/form-one/assets/properties/guardamar-3312-3.webp",
      "/form-one/assets/properties/guardamar-3312-4.webp",
      "/form-one/assets/properties/guardamar-3312-5.webp"
    ],
    "region": "costa-blanca",
    "budget": "do-250-tys-euro"
  },
  {
    "slug": "bungalow-san-miguel-de-salinas",
    "key": "san-miguel",
    "ref": "MTI-3042-115-10-115",
    "city": "San Miguel de Salinas",
    "title": "Bungalow w San Miguel de Salinas",
    "subtitle": "Dwie sypialnie i osiedle z trzema basenami",
    "price": 219900,
    "area": 70,
    "beds": 2,
    "baths": 2,
    "beach": "11 km do plaż Orihuela Costa",
    "features": [
      "3 wspólne baseny dla dorosłych i dzieci",
      "Ponad 3400 m² terenów zielonych",
      "Zamknięte osiedle",
      "Wyposażona kuchnia i meble łazienkowe",
      "Przygotowanie do klimatyzacji typu split"
    ],
    "paragraphs": [
      "Bungalow o powierzchni zabudowanej 70 m², z dwiema sypialniami i dwiema łazienkami. Inwestycja powstaje na obrzeżach San Miguel de Salinas, w odległości spacerowej od miejscowych usług.",
      "Osiedle oferuje partery z ogrodami oraz lokale na piętrze z prywatnym solarium. Części wspólne obejmują trzy baseny i rozległe tereny zielone. Plaże Orihuela Costa są oddalone o około 11 km, a centrum handlowe La Zenia Boulevard o około 9 km."
    ],
    "note": "Dokładny układ przestrzeni zewnętrznej dla wybranego lokalu potwierdzimy podczas rozmowy.",
    "images": [
      "/form-one/assets/properties/san-miguel-1.webp",
      "/form-one/assets/properties/san-miguel-2.webp",
      "/form-one/assets/properties/san-miguel-3.webp",
      "/form-one/assets/properties/san-miguel-4.webp",
      "/form-one/assets/properties/san-miguel-5.webp"
    ],
    "region": "costa-blanca",
    "budget": "do-250-tys-euro"
  },
  {
    "slug": "apartament-el-raso-guardamar",
    "key": "guardamar-2861",
    "ref": "MTI-2861-115-10-115",
    "city": "El Raso, Guardamar del Segura",
    "title": "Apartament w El Raso",
    "subtitle": "Licencja turystyczna i otoczenie laguny La Mata",
    "price": 229000,
    "area": 86,
    "beds": 2,
    "baths": 2,
    "beach": "5 km do Playa del Moncayo",
    "features": [
      "2 sypialnie i 2 łazienki",
      "Pełne umeblowanie, oświetlenie i AGD",
      "Basen, ogrody i strefa wellness",
      "Miejsce parkingowe i komórka lokatorska",
      "Profesjonalny model zarządzania najmem"
    ],
    "paragraphs": [
      "Apartament w zamkniętym kompleksie w El Raso, blisko parku przyrodniczego Laguna de La Mata. Oferta obejmuje dwie sypialnie, dwie łazienki i pełne wyposażenie: meble, oświetlenie oraz sprzęt AGD.",
      "Kompleks przewiduje basen, ogrody, recepcję, minigolf i strefę wellness. Playa del Moncayo leży około 5 km od inwestycji, a centrum Guardamar około 4 km. W opisie projektu wskazano licencję turystyczną i zarządzanie najmem przez profesjonalnego operatora."
    ],
    "note": "Własny pobyt do 4 miesięcy w roku. Przez pozostały okres nieruchomość jest przeznaczona na wynajem w modelu opisanym dla inwestycji.",
    "images": [
      "/form-one/assets/properties/guardamar-2861-1.webp",
      "/form-one/assets/properties/guardamar-2861-2.webp",
      "/form-one/assets/properties/guardamar-2861-3.webp",
      "/form-one/assets/properties/guardamar-2861-4.webp",
      "/form-one/assets/properties/guardamar-2861-5.webp"
    ],
    "region": "costa-blanca",
    "budget": "do-250-tys-euro"
  },
  {
    "slug": "apartament-villajoyosa",
    "key": "villajoyosa",
    "ref": "MTI-1437-87-10-115",
    "city": "Villajoyosa",
    "title": "Apartament nad morzem w Villajoyosie",
    "subtitle": "Zejście na plażę naturalną ścieżką",
    "price": 240000,
    "area": 56,
    "beds": 1,
    "baths": 1,
    "beach": "200 m do Playa del Torres",
    "features": [
      "Prywatny taras",
      "Miejsce parkingowe i komórka w cenie",
      "Klimatyzacja kanałowa i aerotermia",
      "Basen, siłownia i spa",
      "Klub na dachu z basenem infinity"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w dzielnicy Tellerola, pomiędzy Playa del Torres i Playa El Tío Roig. Inwestycja jest położona na wzgórzu, z dojściem do plaży naturalną ścieżką.",
      "Wyposażenie obejmuje kuchnię z AGD, klimatyzację kanałową i ogrzewanie podłogowe w łazience. Parking i komórka lokatorska są w cenie. Części wspólne przewidują ogrody, basen, siłownię, spa oraz klub na dachu z basenem infinity. Centrum Villajoyosy znajduje się około 1,5 km od inwestycji."
    ],
    "note": "Widok i położenie konkretnego apartamentu potwierdzimy przy wyborze lokalu.",
    "images": [
      "/form-one/assets/properties/villajoyosa-1.webp",
      "/form-one/assets/properties/villajoyosa-2.webp",
      "/form-one/assets/properties/villajoyosa-3.webp",
      "/form-one/assets/properties/villajoyosa-4.webp",
      "/form-one/assets/properties/villajoyosa-5.webp"
    ],
    "region": "costa-blanca",
    "budget": "do-250-tys-euro"
  },
  {
    "key": "pilar-2163",
    "slug": "apartament-mil-palmeras-600m",
    "city": "Mil Palmeras, Pilar de la Horadada",
    "title": "Apartament w Mil Palmeras",
    "subtitle": "Trzy sypialnie, 600 m od plaży",
    "beach": "600 m do plaży",
    "features": [
      "Taras 15 m²",
      "Wspólne baseny i ogrody",
      "Zamknięte osiedle i winda",
      "Aerotermia i przygotowanie do klimatyzacji kanałowej"
    ],
    "paragraphs": [
      "Apartament z trzema sypialniami i dwiema łazienkami, o powierzchni zabudowanej 102 m², z tarasem 15 m². Inwestycja znajduje się w Mil Palmeras, około 600 m od piaszczystej plaży, pomiędzy Campoamor i Torre de la Horadada.",
      "Na zamkniętym osiedlu zaplanowano wspólne ogrody i baseny. Wyposażenie obejmuje szafy wnękowe z oświetleniem LED, podwójne szyby, aerotermię do podgrzewania wody i przygotowanie do klimatyzacji kanałowej. Podziemny parking i komórka lokatorska są opcjonalne; w pobliżu znajdują się restauracje, sklepy oraz tereny spacerowe."
    ],
    "note": "",
    "ref": "MTI-2163-115-10-115",
    "price": 335000,
    "area": 102,
    "beds": 3,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "images": [
      "/form-one/assets/properties/pilar-2163-1.webp",
      "/form-one/assets/properties/pilar-2163-2.webp",
      "/form-one/assets/properties/pilar-2163-3.webp",
      "/form-one/assets/properties/pilar-2163-4.webp",
      "/form-one/assets/properties/pilar-2163-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "pilar-2557",
    "slug": "apartament-turystyczny-mil-palmeras",
    "city": "Mil Palmeras, Pilar de la Horadada",
    "title": "Apartament turystyczny w Mil Palmeras",
    "subtitle": "200 m od morza, taras z widokiem na morze",
    "beach": "200 m od morza",
    "features": [
      "Dwie sypialnie i garderoba",
      "Taras 25 m² z widokiem na morze",
      "Pełne umeblowanie i sprzęt AGD",
      "Parking i komórka lokatorska",
      "Basen, ogrody i recepcja"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami, jedną łazienką i garderobą w kameralnej inwestycji obejmującej 24 apartamenty turystyczne. Lokal ma 71 m² powierzchni zabudowanej oraz taras 25 m² z widokiem na morze. Budynek powstaje w drugiej linii brzegowej, około 200 m od morza.",
      "Mieszkanie jest oferowane z umeblowaniem, sprzętem AGD i zainstalowaną klimatyzacją kanałową. Do lokalu przypisano miejsce parkingowe i komórkę. Części wspólne przewidują ogrody, basen, recepcję i salon dla mieszkańców. W okolicy dostępne są promenady, restauracje oraz obiekty sportowe."
    ],
    "note": "",
    "ref": "MTI-2557-115-10-115",
    "price": 365000,
    "area": 71,
    "beds": 2,
    "baths": 1,
    "budget": "do-400-tys-euro",
    "images": [
      "/form-one/assets/properties/pilar-2557-1.webp",
      "/form-one/assets/properties/pilar-2557-2.webp",
      "/form-one/assets/properties/pilar-2557-3.webp",
      "/form-one/assets/properties/pilar-2557-4.webp",
      "/form-one/assets/properties/pilar-2557-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "denia-1467",
    "slug": "apartament-denia-lestanyo",
    "city": "Dénia, L’Estanyó",
    "title": "Apartament przy plaży w Dénii",
    "subtitle": "Pierwsza linia brzegowa przy L’Estanyó",
    "beach": "30 m do plaży",
    "features": [
      "Pierwsza linia brzegowa",
      "Dwie sypialnie i dwie łazienki",
      "Taras 19 m² i widok na morze",
      "Dwa baseny, w tym jeden dla dzieci",
      "Wspólny ogród i winda"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w pierwszej linii brzegowej, przy plaży L’Estanyó w Dénii. Powierzchnia zabudowana wynosi 84 m², a taras ma 19 m². Według danych oferty od plaży dzieli nieruchomość około 30 m.",
      "Inwestycja obejmuje apartamenty i penthouse’y z widokiem na morze. Do dyspozycji mieszkańców przewidziano duży ogród i dwa baseny, w tym jeden dla dzieci. Okolica oferuje szeroką, piaszczystą plażę oraz restauracje i usługi. Centrum Dénii znajduje się około 7 km od kompleksu."
    ],
    "note": "",
    "ref": "MTI-1467-115-10-115",
    "price": 379000,
    "area": 84,
    "beds": 2,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "images": [
      "/form-one/assets/properties/denia-1467-1.webp",
      "/form-one/assets/properties/denia-1467-2.webp",
      "/form-one/assets/properties/denia-1467-3.webp",
      "/form-one/assets/properties/denia-1467-4.webp",
      "/form-one/assets/properties/denia-1467-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "rojales-3192",
    "slug": "bungalow-rojales-lo-marabu",
    "city": "Lo Marabú, Ciudad Quesada — Rojales",
    "title": "Bungalow w Lo Marabú",
    "subtitle": "Kameralne osiedle 28 bungalowów",
    "beach": "Ok. 8 km do plaż Guardamar",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Prywatny parking i komórka lokatorska",
      "Wspólny basen i ogrody",
      "Elektryczne rolety",
      "Ogrzewanie podłogowe w łazienkach"
    ],
    "paragraphs": [
      "Bungalow z dwiema sypialniami i dwiema łazienkami w Lo Marabú, w Ciudad Quesada. Nieruchomość ma 78 m² powierzchni zabudowanej. Kameralne osiedle składa się z 28 lokali rozmieszczonych w czterech blokach, wokół wspólnego basenu i ogrodów.",
      "Oferta obejmuje prywatny parking i komórkę lokatorską. W standardzie przewidziano podwójne szyby, elektryczne rolety oraz wykończone łazienki z ogrzewaniem podłogowym. W inwestycji dostępne są partery z ogrodami i lokale na piętrze z tarasem oraz solarium. Sklepy, restauracje i apteki znajdują się w zasięgu spaceru."
    ],
    "note": "",
    "ref": "MTI-3192-115-10-115",
    "price": 339000,
    "area": 78,
    "beds": 2,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "images": [
      "/form-one/assets/properties/rojales-3192-1.webp",
      "/form-one/assets/properties/rojales-3192-2.webp",
      "/form-one/assets/properties/rojales-3192-3.webp",
      "/form-one/assets/properties/rojales-3192-4.webp",
      "/form-one/assets/properties/rojales-3192-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "guardamar-3085",
    "slug": "penthouse-el-raso-guardamar",
    "city": "El Raso, Guardamar del Segura",
    "title": "Penthouse w El Raso",
    "subtitle": "Trzy sypialnie i prywatne solarium",
    "beach": "3,5 km od morza",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Prywatne solarium",
      "Pełne umeblowanie i kuchnia z AGD",
      "Podziemny parking i komórka lokatorska",
      "Basen, siłownia i kryte spa"
    ],
    "paragraphs": [
      "Penthouse z trzema sypialniami i dwiema łazienkami w El Raso, w gminie Guardamar del Segura. Powierzchnia zabudowana wynosi 82 m², a w danych oferty wskazano 96 m² tarasu i prywatne solarium. Nieruchomość jest oferowana z pełnym umeblowaniem.",
      "Cena obejmuje kuchnię z AGD, klimatyzację kanałową, oświetlenie, elektryczne rolety, podziemny parking i komórkę lokatorską. Na terenie osiedla przewidziano basen, ogrody, siłownię, kryte spa, boisko do pétanque i plac zabaw. Centrum Guardamar znajduje się około 4 km od inwestycji, a plaża Moncayo około 5 km."
    ],
    "note": "",
    "ref": "MTI-3085-115-10-115",
    "price": 395000,
    "area": 82,
    "beds": 3,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "images": [
      "/form-one/assets/properties/guardamar-3085-1.webp",
      "/form-one/assets/properties/guardamar-3085-2.webp",
      "/form-one/assets/properties/guardamar-3085-3.webp",
      "/form-one/assets/properties/guardamar-3085-4.webp",
      "/form-one/assets/properties/guardamar-3085-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "calpe-2430",
    "slug": "apartament-calpe-arenal",
    "city": "Calpe",
    "title": "Apartament przy plaży Arenal w Calpe",
    "subtitle": "Trzy sypialnie i taras 30 m²",
    "beach": "200 m do plaży Arenal",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Taras 30 m²",
      "Podziemny parking i komórka lokatorska",
      "Kuchnia z AGD i klimatyzacja kanałowa",
      "Baseny, siłownia i kort do padla"
    ],
    "paragraphs": [
      "Apartament z trzema sypialniami i dwiema łazienkami, około 200 m od plaży Arenal w Calpe. Powierzchnia zabudowana wynosi 93 m², a prywatny taras ma 30 m². Inwestycja obejmuje dwa piętnastopiętrowe budynki, położone przy głównej alei miasta.",
      "Do mieszkania przynależą podziemne miejsce parkingowe i komórka lokatorska. Wyposażenie obejmuje kuchnię ze sprzętem AGD, klimatyzację kanałową, aerotermię i szafy wnękowe. W częściach wspólnych przewidziano dwa baseny zewnętrzne, siłownię, kort do padla i plac zabaw. Zakres widoku na morze zależy od położenia wybranego lokalu."
    ],
    "note": "",
    "ref": "MTI-2430-115-10-115",
    "price": 500000,
    "area": 93,
    "beds": 3,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "images": [
      "/form-one/assets/properties/calpe-2430-1.webp",
      "/form-one/assets/properties/calpe-2430-2.webp",
      "/form-one/assets/properties/calpe-2430-3.webp",
      "/form-one/assets/properties/calpe-2430-4.webp",
      "/form-one/assets/properties/calpe-2430-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "torrevieja-587",
    "slug": "dom-torrevieja-los-balcones",
    "city": "Los Balcones, Torrevieja",
    "title": "Dom z basenem w Los Balcones",
    "subtitle": "Prywatny ogród i solarium",
    "beach": "4 km do plaży",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Prywatny ogród z basenem",
      "Solarium i parking na terenie posesji",
      "Dwa wspólne baseny",
      "Osiedlowe ogrody, strefa ćwiczeń i plac zabaw"
    ],
    "paragraphs": [
      "Dom w zabudowie bliźniaczej w Los Balcones w Torrevieja, w inwestycji z widokiem na różową lagunę. Nieruchomość ma 84 m² powierzchni zabudowanej, trzy sypialnie, dwie łazienki i otwartą kuchnię połączoną z salonem.",
      "Do dyspozycji właściciela jest prywatny ogród z basenem, solarium oraz miejsce parkingowe na terenie posesji. Osiedle oferuje także wspólne ogrody, strefę ćwiczeń na świeżym powietrzu, plac zabaw i dwa duże baseny — osobno dla dorosłych i dzieci. Odległość do plaży wskazana w ofercie wynosi około 4 km."
    ],
    "note": "",
    "ref": "MTI-587-115-10-115",
    "price": 499000,
    "area": 84,
    "beds": 3,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "images": [
      "/form-one/assets/properties/torrevieja-587-1.webp",
      "/form-one/assets/properties/torrevieja-587-2.webp",
      "/form-one/assets/properties/torrevieja-587-3.webp",
      "/form-one/assets/properties/torrevieja-587-4.webp",
      "/form-one/assets/properties/torrevieja-587-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "pilar-3157",
    "slug": "willa-pilar-prywatny-basen",
    "city": "Pilar de la Horadada",
    "title": "Wolnostojąca willa z basenem",
    "subtitle": "Kameralna inwestycja obejmująca cztery domy",
    "beach": "3 km do plaż Torre de la Horadada",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Prywatny basen i ogród",
      "Taras 50 m²",
      "Parking na działce",
      "Przygotowanie do klimatyzacji kanałowej"
    ],
    "paragraphs": [
      "Wolnostojąca willa w kameralnej inwestycji obejmującej zaledwie cztery domy w Pilar de la Horadada. Powierzchnia zabudowana wynosi 150 m². Dom oferuje trzy sypialnie, dwie łazienki, dodatkową toaletę oraz otwartą część dzienną z kuchnią i jadalnią.",
      "Na prywatnej działce znajdują się ogród, basen i miejsce parkingowe. W danych oferty wskazano taras o powierzchni 50 m². Standard obejmuje meble kuchenne, wykończone łazienki, szafy wnękowe i przygotowanie do klimatyzacji kanałowej. Do centrum miejscowości można dojść pieszo, a plaże Torre de la Horadada są oddalone o około 3 km."
    ],
    "note": "",
    "ref": "MTI-3157-115-10-115",
    "price": 495000,
    "area": 150,
    "beds": 3,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "images": [
      "/form-one/assets/properties/pilar-3157-1.webp",
      "/form-one/assets/properties/pilar-3157-2.webp",
      "/form-one/assets/properties/pilar-3157-3.webp",
      "/form-one/assets/properties/pilar-3157-4.webp",
      "/form-one/assets/properties/pilar-3157-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "pilar-1533",
    "slug": "dom-parterowy-pilar-solarium",
    "city": "Pilar de la Horadada",
    "title": "Parterowy dom z solarium",
    "subtitle": "Ogród i bliskość centrum Pilar de la Horadada",
    "beach": "3,5 km do plaży",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Układ na jednej kondygnacji",
      "Prywatne solarium i ogród",
      "Miejsce parkingowe",
      "Basen opcjonalnie, za dopłatą"
    ],
    "paragraphs": [
      "Parterowy dom w zabudowie bliźniaczej w Pilar de la Horadada, blisko centrum i codziennych usług. Nieruchomość ma 83 m² powierzchni zabudowanej, trzy sypialnie, dwie łazienki oraz otwartą kuchnię połączoną z salonem.",
      "Dom dysponuje prywatnym solarium, ogrodem i miejscem parkingowym. Prywatny basen jest opcją za dodatkową opłatą i nie jest uwzględniony w podanej cenie. W pobliżu znajdują się sklepy, restauracje, ścieżki rowerowe i obiekty sportowe. Odległość do plaży wskazana w ofercie wynosi około 3,5 km."
    ],
    "note": "",
    "ref": "MTI-1533-115-10-115",
    "price": 480000,
    "area": 83,
    "beds": 3,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "images": [
      "/form-one/assets/properties/pilar-1533-1.webp",
      "/form-one/assets/properties/pilar-1533-2.webp",
      "/form-one/assets/properties/pilar-1533-3.webp",
      "/form-one/assets/properties/pilar-1533-4.webp",
      "/form-one/assets/properties/pilar-1533-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "villajoyosa-1396",
    "slug": "apartament-villajoyosa-200m",
    "city": "Villajoyosa",
    "title": "Apartament 200 m od plaży w Villajoyosie",
    "subtitle": "Dwie sypialnie i taras 26 m²",
    "beach": "200 m do plaży",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 26 m²",
      "Prywatne miejsce parkingowe",
      "Basen i ogrody",
      "Siłownia, sauna i strefa dla dzieci"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w inwestycji obejmującej 42 apartamenty i penthouse’y w Villajoyosie. Powierzchnia zabudowana wynosi 76 m², a taras ma 26 m². Kompleks znajduje się około 200 m od morza.",
      "Do nieruchomości przynależy prywatne miejsce parkingowe. Części wspólne obejmują basen, ogrody, strefę dla dzieci, wyposażoną siłownię i saunę. Położenie pozwala korzystać z plaży i nadmorskiego otoczenia, a jednocześnie pozostawać blisko usług Villajoyosy oraz jej historycznego centrum."
    ],
    "note": "",
    "ref": "MTI-1396-115-10-115",
    "price": 445000,
    "area": 76,
    "beds": 2,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "images": [
      "/form-one/assets/properties/villajoyosa-1396-1.webp",
      "/form-one/assets/properties/villajoyosa-1396-2.webp",
      "/form-one/assets/properties/villajoyosa-1396-3.webp",
      "/form-one/assets/properties/villajoyosa-1396-4.webp",
      "/form-one/assets/properties/villajoyosa-1396-5.webp"
    ],
    "region": "costa-blanca"
  },
  {
    "key": "marbella-335",
    "slug": "willa-marbella-spacerem-do-morza",
    "city": "Marbella",
    "title": "Willa w Marbelli, spacerem do morza",
    "subtitle": "Prywatny basen, winda i rozbudowana automatyka",
    "beach": "600 m do plaży",
    "features": [
      "Cztery sypialnie i pięć łazienek",
      "Prywatny basen i ogród",
      "Tarasy 95 m²",
      "Winda łącząca kondygnacje",
      "Ogrzewanie podłogowe i automatyka domowa"
    ],
    "paragraphs": [
      "Willa z czterema sypialniami i pięcioma łazienkami, na zamkniętym osiedlu obejmującym siedem rezydencji w Marbelli. Powierzchnia zabudowana wynosi 396 m², a tarasy mają 95 m². Od plaży dzieli nieruchomość około 600 m.",
      "Do dyspozycji właściciela są prywatny ogród z basenem, winda i parking z punktem ładowania samochodu elektrycznego. Wyposażenie obejmuje kuchnię z wysokiej klasy AGD, klimatyzację ze sterowaniem strefowym, ogrzewanie podłogowe i automatykę domową. Kompleks ma kontrolę dostępu, monitoring oraz system alarmowy."
    ],
    "note": "",
    "ref": "MTI-335-119-10-115",
    "price": 4350000,
    "area": 396,
    "beds": 4,
    "baths": 5,
    "budget": "premium",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/marbella-335-1.webp",
      "/form-one/assets/properties/marbella-335-2.webp",
      "/form-one/assets/properties/marbella-335-3.webp",
      "/form-one/assets/properties/marbella-335-4.webp",
      "/form-one/assets/properties/marbella-335-5.webp"
    ]
  },
  {
    "key": "estepona-1087",
    "slug": "apartament-estepona-przy-plazy",
    "city": "Guadalobón, Estepona",
    "title": "Rezydencja apartamentowa przy plaży w Esteponie",
    "subtitle": "Pierwsza linia brzegowa i taras 168 m²",
    "beach": "20 m od plaży",
    "features": [
      "Cztery sypialnie i cztery łazienki",
      "Taras 168 m² i widok na morze",
      "Trzy miejsca parkingowe",
      "Spa z krytym basenem, sauną i łaźnią parową",
      "Klub, kino i symulator golfa"
    ],
    "paragraphs": [
      "Apartament z czterema sypialniami i czterema łazienkami w kameralnej inwestycji obejmującej dziesięć rezydencji, bezpośrednio przy plaży w Esteponie. W ofercie wskazano 457 m² powierzchni zabudowanej oraz taras 168 m². Lokalizacja w Guadalobón zapewnia dostęp do nadmorskiej ścieżki Senda Litoral.",
      "Rezydencje mają południową orientację i otwarte widoki na morze. Kuchnie wyposażono w sprzęt Gaggenau, z osobną kuchnią pomocniczą i przestrzenią do przechowywania wina. W częściach wspólnych przewidziano basen, spa z podgrzewanym basenem krytym, siłownię, klub z barem, salę kinową i symulator golfa. Do oferty przypisano trzy miejsca parkingowe."
    ],
    "note": "",
    "ref": "MTI-1087-119-10-115",
    "price": 9000000,
    "area": 457,
    "beds": 4,
    "baths": 4,
    "budget": "premium",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/estepona-1087-1.webp",
      "/form-one/assets/properties/estepona-1087-2.webp",
      "/form-one/assets/properties/estepona-1087-3.webp",
      "/form-one/assets/properties/estepona-1087-4.webp",
      "/form-one/assets/properties/estepona-1087-5.webp"
    ]
  },
  {
    "key": "benahavis-59",
    "slug": "willa-benahavis-panoramiczny-widok",
    "city": "Benahavís",
    "title": "Willa z panoramicznym widokiem w Benahavís",
    "subtitle": "Pięć sypialni, prywatny basen i całodobowa ochrona",
    "beach": "4 km do plaży",
    "features": [
      "Pięć sypialni i sześć łazienek",
      "Tarasy 200 m² i solarium",
      "Prywatny basen i ogród",
      "Winda i dwa miejsca parkingowe",
      "Zamknięte osiedle z ochroną 24/7"
    ],
    "paragraphs": [
      "Willa z pięcioma sypialniami i sześcioma łazienkami w Benahavís, na zamkniętym osiedlu obejmującym 53 rezydencje z całodobową ochroną. Powierzchnia zabudowana wynosi 903 m², a tarasy mają 200 m². Położenie na zboczu zapewnia panoramiczne widoki na Morze Śródziemne.",
      "Układ rezydencji obejmuje kilka poziomów, prywatny basen, piwniczkę na wino i salę wielofunkcyjną. W ofercie uwzględniono także windę, solarium, ogród oraz dwa miejsca parkingowe. Rozległe przeszklenia łączą wnętrza z otoczeniem, a Marbella jest oddalona o około 15 minut jazdy."
    ],
    "note": "",
    "ref": "MTI-59-119-10-115",
    "price": 12135423,
    "area": 903,
    "beds": 5,
    "baths": 6,
    "budget": "premium",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/benahavis-59-1.webp",
      "/form-one/assets/properties/benahavis-59-2.webp",
      "/form-one/assets/properties/benahavis-59-3.webp",
      "/form-one/assets/properties/benahavis-59-4.webp",
      "/form-one/assets/properties/benahavis-59-5.webp"
    ]
  },
  {
    "key": "marbella-729",
    "slug": "willa-nueva-andalucia-wellness",
    "city": "Nueva Andalucía, Marbella",
    "title": "Willa w Golf Valley, Nueva Andalucía",
    "subtitle": "Prywatne spa, kino i basen infinity",
    "beach": "2,7 km do plaży",
    "features": [
      "Pięć sypialni i sześć łazienek",
      "Tarasy 296 m²",
      "Basen infinity i kuchnia zewnętrzna",
      "Siłownia, spa i sala kinowa",
      "Winda i parking dla czterech samochodów"
    ],
    "paragraphs": [
      "Willa z pięcioma sypialniami i sześcioma łazienkami w Nueva Andalucía, w otoczeniu pól golfowych Marbelli. W danych oferty podano 534 m² powierzchni zabudowanej i 296 m² tarasów. Działka ma ponad 1014 m², a marina Puerto Banús znajduje się około 3 km od nieruchomości.",
      "W domu zaplanowano siłownię, spa z sauną i łaźnią turecką, salę kinową, bar oraz pokój gier. Na zewnątrz znajdują się basen infinity, ogród i kuchnia letnia. Winda, ogrzewanie podłogowe, klimatyzacja kanałowa i system inteligentnego domu uzupełniają wyposażenie. Garaż mieści dwa samochody, a kolejne dwa miejsca przewidziano na terenie posesji."
    ],
    "note": "",
    "ref": "MTI-729-119-10-115",
    "price": 6100000,
    "area": 534,
    "beds": 5,
    "baths": 6,
    "budget": "premium",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/marbella-729-1.webp",
      "/form-one/assets/properties/marbella-729-2.webp",
      "/form-one/assets/properties/marbella-729-3.webp",
      "/form-one/assets/properties/marbella-729-4.webp",
      "/form-one/assets/properties/marbella-729-5.webp"
    ]
  },
  {
    "key": "marbella-445",
    "slug": "willa-golden-mile-podgrzewany-basen",
    "city": "Golden Mile, Marbella",
    "title": "Willa na Złotej Mili w Marbelli",
    "subtitle": "Podgrzewany basen i umeblowane wnętrza",
    "beach": "2 km do plaży",
    "features": [
      "Pięć sypialni i pięć łazienek",
      "Tarasy 239 m² i solarium",
      "Prywatny podgrzewany basen",
      "Winda i dwa miejsca parkingowe",
      "Ogrzewanie podłogowe i automatyka domowa"
    ],
    "paragraphs": [
      "Willa z pięcioma sypialniami i pięcioma łazienkami na Golden Mile w Marbelli, w inwestycji obejmującej cztery niezależne domy. Nieruchomość ma 618 m² powierzchni zabudowanej i 239 m² tarasów, na działce około 1100 m². Oferta obejmuje umeblowane wnętrza.",
      "Prywatny basen o wymiarach 4,5 × 13,7 m ma pompę ciepła i system chlorowania solnego. Dom oferuje ogród, strefę grillową, windę, solarium, ogrzewanie podłogowe i automatykę do sterowania klimatem, oświetleniem oraz bezpieczeństwem. Niższy poziom obejmuje kino, strefę gier, pralnię i pomieszczenia dla personelu. Plaża znajduje się około 2 km od willi."
    ],
    "note": "",
    "ref": "MTI-445-119-10-115",
    "price": 4850000,
    "area": 618,
    "beds": 5,
    "baths": 5,
    "budget": "premium",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/marbella-445-1.webp",
      "/form-one/assets/properties/marbella-445-2.webp",
      "/form-one/assets/properties/marbella-445-3.webp",
      "/form-one/assets/properties/marbella-445-4.webp",
      "/form-one/assets/properties/marbella-445-5.webp"
    ]
  },
  {
    "key": "mijas-1059",
    "slug": "apartament-mijas-miedzy-morzem-a-gorami",
    "city": "Mijas",
    "title": "Apartament w Mijas, między morzem a górami",
    "subtitle": "Jedna sypialnia i taras 8 m²",
    "beach": "3 km do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 8 m²",
      "Miejsce garażowe i komórka lokatorska",
      "Kuchnia z AGD, klimatyzacja i aerotermia",
      "Basen, siłownia i strefa jogi"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w prywatnej inwestycji obejmującej 117 mieszkań w Mijas, w pobliżu toru wyścigowego Costa del Sol. Powierzchnia zabudowana wynosi 69 m², a taras ma 8 m². Plaże Mijas Costa znajdują się około 3 km od osiedla.",
      "Do mieszkania przynależą miejsce garażowe i komórka lokatorska. Standard obejmuje kuchnię z głównymi urządzeniami AGD, klimatyzację kanałową i aerotermię do podgrzewania wody. Mieszkańcy będą mieli do dyspozycji basen, ogrody, siłownię, strefę ćwiczeń na świeżym powietrzu i miejsce do jogi. Centrum Fuengiroli jest oddalone o około 4 km."
    ],
    "note": "",
    "ref": "MTI-1059-119-10-115",
    "price": 231000,
    "area": 69,
    "beds": 1,
    "baths": 1,
    "budget": "do-250-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/mijas-1059-1.webp",
      "/form-one/assets/properties/mijas-1059-2.webp",
      "/form-one/assets/properties/mijas-1059-3.webp",
      "/form-one/assets/properties/mijas-1059-4.webp",
      "/form-one/assets/properties/mijas-1059-5.webp"
    ]
  },
  {
    "key": "manilva-1073",
    "slug": "apartament-manilva-la-duquesa",
    "city": "La Duquesa, Manilva",
    "title": "Apartament w La Duquesa",
    "subtitle": "Taras 42 m², 800 m od plaży",
    "beach": "800 m do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 42 m²",
      "Prywatne miejsce parkingowe",
      "Kuchnia z AGD i klimatyzacja kanałowa",
      "Basen, kort do padla i siłownia plenerowa"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w El Castillo de la Duquesa w Manilvie. Nieruchomość ma 46 m² powierzchni zabudowanej oraz taras 42 m². Inwestycja obejmuje 88 mieszkań w czterech budynkach, około 800 m od plaży.",
      "Każdy lokal ma przypisane miejsce na podziemnym parkingu. Mieszkania są oferowane z kuchnią wyposażoną w AGD, klimatyzacją kanałową i wzmocnionymi drzwiami wejściowymi. Części wspólne przewidują basen, ogrody, kort do padla i siłownię na świeżym powietrzu. Marina Puerto de la Duquesa znajduje się około 1,5 km od osiedla."
    ],
    "note": "",
    "ref": "MTI-1073-119-10-115",
    "price": 235000,
    "area": 46,
    "beds": 1,
    "baths": 1,
    "budget": "do-250-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/manilva-1073-1.webp",
      "/form-one/assets/properties/manilva-1073-2.webp",
      "/form-one/assets/properties/manilva-1073-3.webp",
      "/form-one/assets/properties/manilva-1073-4.webp",
      "/form-one/assets/properties/manilva-1073-5.webp"
    ]
  },
  {
    "key": "mijas-297",
    "slug": "apartament-las-lagunas-garaz",
    "city": "Las Lagunas de Mijas",
    "title": "Apartament z garażem w Las Lagunas",
    "subtitle": "Jedna sypialnia i taras 6 m²",
    "beach": "2,5 km do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 6 m²",
      "Miejsce garażowe i komórka lokatorska",
      "Klimatyzacja",
      "Basen, ogrody i strefa sportowa"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w Las Lagunas de Mijas. Powierzchnia zabudowana wynosi 37 m², a taras ma 6 m². Do nieruchomości przynależą miejsce garażowe i komórka lokatorska. W danych oferty odległość do plaży określono na około 2,5 km.",
      "Prywatne osiedle oferuje basen, ogrody, strefę zabaw dla dzieci i miejsce do aktywności sportowej. Wyposażenie obejmuje klimatyzację, wzmocnione drzwi wejściowe i uchylno-rozwierane okna w sypialni. W okolicy znajdują się sklepy, szkoły i obiekty sportowe, a dostęp do autostrady A-7 oraz przystanków autobusowych ułatwia codzienne dojazdy."
    ],
    "note": "",
    "ref": "MTI-297-118-10-115",
    "price": 239000,
    "area": 37,
    "beds": 1,
    "baths": 1,
    "budget": "do-250-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/mijas-297-1.webp",
      "/form-one/assets/properties/mijas-297-2.webp",
      "/form-one/assets/properties/mijas-297-3.webp",
      "/form-one/assets/properties/mijas-297-4.webp",
      "/form-one/assets/properties/mijas-297-5.webp"
    ]
  },
  {
    "key": "mijas-541",
    "slug": "apartament-mijas-costa-coworking",
    "city": "Las Lagunas, Mijas Costa",
    "title": "Apartament w Mijas Costa ze strefą coworkingu",
    "subtitle": "Jedna sypialnia i taras 8 m²",
    "beach": "Ok. 2 km do plaż Mijas Costa",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 8 m²",
      "Miejsce parkingowe w cenie",
      "Kuchnia z AGD i klimatyzacja kanałowa",
      "Basen, siłownia, coworking i strefa grilla"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w Las Lagunas, w inwestycji obejmującej 116 mieszkań. Powierzchnia zabudowana wynosi 53 m², a taras ma 8 m². Do mieszkania przypisano prywatne miejsce parkingowe w cenie.",
      "Standard obejmuje kuchnię z AGD oraz klimatyzację kanałową. Wspólny basen otaczają strefy wypoczynkowe; mieszkańcy będą mogli korzystać także z siłowni, miejsca do grillowania i przestrzeni coworkingowej. Plaże Mijas Costa znajdują się około 2 km od inwestycji, centrum handlowe Miramar około 1 km, a lotnisko w Maladze około 25 km."
    ],
    "note": "",
    "ref": "MTI-541-118-10-115",
    "price": 240000,
    "area": 53,
    "beds": 1,
    "baths": 1,
    "budget": "do-250-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/mijas-541-1.webp",
      "/form-one/assets/properties/mijas-541-2.webp",
      "/form-one/assets/properties/mijas-541-3.webp",
      "/form-one/assets/properties/mijas-541-4.webp",
      "/form-one/assets/properties/mijas-541-5.webp"
    ]
  },
  {
    "key": "casares-1060",
    "slug": "apartament-casares-costa-garaz",
    "city": "Casares Costa",
    "title": "Apartament w Casares Costa",
    "subtitle": "Taras, garaż i komórka lokatorska",
    "beach": "1 km do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 7 m²",
      "Garaż i komórka lokatorska",
      "Wyposażona kuchnia i aerotermia",
      "Basen, ogród i plac zabaw"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w prywatnej inwestycji obejmującej 47 apartamentów i penthouse’ów w Casares Costa. Powierzchnia zabudowana wynosi 66 m², a taras ma 7 m². Do każdego lokalu przynależą garaż i komórka lokatorska.",
      "Kompleks oferuje wspólny basen, ogród i plac zabaw dla dzieci. W wyposażeniu uwzględniono kuchnię, aerotermię do podgrzewania wody oraz przygotowanie instalacji do ładowania samochodów elektrycznych. Plaża jest oddalona o około 1 km. Okolica zapewnia dostęp do pól golfowych, a Sierra Bermeja i pobliskie andaluzyjskie miejscowości sprzyjają wycieczkom."
    ],
    "note": "",
    "ref": "MTI-1060-119-10-115",
    "price": 245000,
    "area": 66,
    "beds": 1,
    "baths": 1,
    "budget": "do-250-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/casares-1060-1.webp",
      "/form-one/assets/properties/casares-1060-2.webp",
      "/form-one/assets/properties/casares-1060-3.webp",
      "/form-one/assets/properties/casares-1060-4.webp",
      "/form-one/assets/properties/casares-1060-5.webp"
    ]
  },
  {
    "key": "fuengirola-666",
    "slug": "apartament-fuengirola-los-pacos",
    "city": "Los Pacos, Fuengirola",
    "title": "Apartament w Los Pacos, Fuengirola",
    "subtitle": "Taras 16 m² i udogodnienia w stylu resortowym",
    "beach": "1,5 km do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 16 m²",
      "Parking i komórka lokatorska w cenie",
      "Kuchnia z AGD i aerotermia",
      "Basen, siłownia, sauna i coworking"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w Los Pacos w Fuengiroli, w inwestycji obejmującej 218 mieszkań. Powierzchnia zabudowana wynosi 65 m², a taras ma 16 m². Plaża znajduje się około 1,5 km od osiedla.",
      "W cenie uwzględniono miejsce parkingowe i komórkę lokatorską. Standard obejmuje kuchnię z AGD, wykończoną łazienkę oraz aerotermię do podgrzewania wody i obsługi klimatyzacji. Części wspólne przewidują basen dla dorosłych i dzieci, ogrody, siłownię, saunę, salę wellness, coworking i wspólną pralnię. W pobliżu dostępne są sklepy, szkoły i komunikacja publiczna."
    ],
    "note": "",
    "ref": "MTI-666-119-10-115",
    "price": 303450,
    "area": 65,
    "beds": 1,
    "baths": 1,
    "budget": "do-400-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/fuengirola-666-1.webp",
      "/form-one/assets/properties/fuengirola-666-2.webp",
      "/form-one/assets/properties/fuengirola-666-3.webp",
      "/form-one/assets/properties/fuengirola-666-4.webp",
      "/form-one/assets/properties/fuengirola-666-5.webp"
    ]
  },
  {
    "key": "malaga-950",
    "slug": "apartament-malaga-cortijo-merino",
    "city": "Cortijo Merino, Málaga",
    "title": "Apartament w Maladze z tarasem 54 m²",
    "subtitle": "Miejska lokalizacja w Cortijo Merino",
    "beach": "6 km do plaży La Malagueta",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 54 m²",
      "Podziemny parking i komórka lokatorska",
      "Kuchnia z AGD, klimatyzacja i aerotermia",
      "Basen, siłownia i strefy jogi"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w dzielnicy Cortijo Merino w Maladze. Nieruchomość ma 84 m² powierzchni zabudowanej i taras 54 m². Inwestycja obejmuje 165 mieszkań, w sąsiedztwie dzielnicy Teatinos i infrastruktury uniwersyteckiej.",
      "W cenie są podziemne miejsce parkingowe i komórka lokatorska. Wyposażenie obejmuje kuchnię z AGD, klimatyzację kanałową, aerotermię i rozwiązania fotowoltaiczne. Osiedle oferuje basen, siłownię, strefy jogi, tereny zielone i plac zabaw. Uniwersytet w Maladze jest oddalony o około 2 km, plaża La Malagueta o 6 km, a lotnisko o 7 km."
    ],
    "note": "",
    "ref": "MTI-950-119-10-115",
    "price": 319000,
    "area": 84,
    "beds": 1,
    "baths": 1,
    "budget": "do-400-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/malaga-950-1.webp",
      "/form-one/assets/properties/malaga-950-2.webp",
      "/form-one/assets/properties/malaga-950-3.webp",
      "/form-one/assets/properties/malaga-950-4.webp",
      "/form-one/assets/properties/malaga-950-5.webp"
    ]
  },
  {
    "key": "estepona-311",
    "slug": "apartament-estepona-golf",
    "city": "Estepona, okolice Estepona Golf",
    "title": "Apartament przy Estepona Golf",
    "subtitle": "Dwie sypialnie i taras 21 m²",
    "beach": "1,7 km do plaży",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 21 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Kuchnia z AGD i aerotermia",
      "Basen, coworking i taras wypoczynkowy"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w inwestycji obejmującej 72 mieszkania, w pobliżu Estepona Golf. Powierzchnia zabudowana wynosi 114 m², a taras ma 21 m². Odległość do plaży wskazana w ofercie to około 1,7 km.",
      "Do nieruchomości przypisano miejsce parkingowe i komórkę lokatorską. Kuchnia jest wyposażona m.in. w piekarnik, płytę indukcyjną, lodówkę i zmywarkę. Komfort termiczny zapewnia indywidualny system aerotermiczny i klimatyzacja kanałowa. Na terenie osiedla przewidziano basen, strefę coworkingową i taras do wypoczynku. Lokalizacja sprzyja korzystaniu z pobliskich pól golfowych i wybrzeża."
    ],
    "note": "",
    "ref": "MTI-311-119-10-115",
    "price": 330000,
    "area": 114,
    "beds": 2,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/estepona-311-1.webp",
      "/form-one/assets/properties/estepona-311-2.webp",
      "/form-one/assets/properties/estepona-311-3.webp",
      "/form-one/assets/properties/estepona-311-4.webp",
      "/form-one/assets/properties/estepona-311-5.webp"
    ]
  },
  {
    "key": "benalmadena-733",
    "slug": "apartament-benalmadena-pueblo",
    "city": "Benalmádena Pueblo",
    "title": "Apartament w Benalmádena Pueblo",
    "subtitle": "Dwie sypialnie i taras 24 m²",
    "beach": "3 km do plaży",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 24 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Kuchnia z AGD",
      "Basen, siłownia i sala spotkań"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w Benalmádena Pueblo, w inwestycji obejmującej 70 mieszkań. Nieruchomość ma 99 m² powierzchni zabudowanej i taras 24 m². Plaże Benalmádeny znajdują się około 3 km od osiedla.",
      "Kuchnia z wyspą i sprzętem AGD łączy się z częścią dzienną, z której można wyjść na taras. Oferta obejmuje miejsce parkingowe i komórkę lokatorską. Części wspólne przewidują basen, wyposażoną siłownię i salę do spotkań mieszkańców. W okolicy dostępne są sklepy, szkoły i opieka medyczna, a lotnisko w Maladze jest oddalone o około 15 km."
    ],
    "note": "",
    "ref": "MTI-733-119-10-115",
    "price": 338900,
    "area": 99,
    "beds": 2,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/benalmadena-733-1.webp",
      "/form-one/assets/properties/benalmadena-733-2.webp",
      "/form-one/assets/properties/benalmadena-733-3.webp",
      "/form-one/assets/properties/benalmadena-733-4.webp",
      "/form-one/assets/properties/benalmadena-733-5.webp"
    ]
  },
  {
    "key": "manilva-193",
    "slug": "apartament-manilva-taras-76m",
    "city": "Manilva",
    "title": "Apartament w Manilvie z tarasem 76 m²",
    "subtitle": "Trzy sypialnie, 300 m od plaży",
    "beach": "300 m do plaży",
    "features": [
      "Trzy sypialnie i dwie łazienki",
      "Taras 76 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Wspólne baseny i ogrody",
      "Zamknięty kompleks z windą"
    ],
    "paragraphs": [
      "Apartament z trzema sypialniami i dwiema łazienkami w Manilvie, około 300 m od plaży. Powierzchnia zabudowana wynosi 121 m², a prywatny taras ma 76 m². Inwestycja obejmuje mieszkania z otwartą kuchnią i częścią wypoczynkową, zaprojektowane z myślą o korzystaniu z nadmorskiego otoczenia.",
      "Do nieruchomości przypisano miejsce parkingowe i komórkę lokatorską. W standardzie przewidziano szafy wnękowe oraz przygotowanie do klimatyzacji. Kompleks zajmuje ponad 14 000 m² i oferuje wspólne ogrody, baseny oraz przestrzenie do wypoczynku. Lokalizacja w zachodniej części Costa del Sol pozwala korzystać z plaż Manilvy i spokojniejszego charakteru tej części wybrzeża."
    ],
    "note": "",
    "ref": "MTI-193-119-10-115",
    "price": 394000,
    "area": 121,
    "beds": 3,
    "baths": 2,
    "budget": "do-400-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/manilva-193-1.webp",
      "/form-one/assets/properties/manilva-193-2.webp",
      "/form-one/assets/properties/manilva-193-3.webp",
      "/form-one/assets/properties/manilva-193-4.webp",
      "/form-one/assets/properties/manilva-193-5.webp"
    ]
  },
  {
    "key": "estepona-612",
    "slug": "apartament-estepona-taras-60m",
    "city": "Estepona",
    "title": "Apartament w Esteponie z tarasem 60 m²",
    "subtitle": "Dwie sypialnie, 400 m od plaży",
    "beach": "400 m do plaży",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 60 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Ogrzewanie podłogowe, klimatyzacja i aerotermia",
      "Baseny, siłownia i klub mieszkańców"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w zamkniętej inwestycji obejmującej 105 mieszkań w Esteponie. Powierzchnia zabudowana wynosi 116 m², a taras ma 60 m². Plaża znajduje się około 400 m od osiedla.",
      "W standardzie przewidziano ogrzewanie podłogowe w całym mieszkaniu, klimatyzację kanałową, aerotermię oraz kuchnię z AGD. Oferta obejmuje miejsce parkingowe i komórkę lokatorską. Części wspólne oferują dwa baseny dla dorosłych, basen dziecięcy, ogrody, siłownię i klub mieszkańców. Marina w Esteponie jest oddalona o około 4 km."
    ],
    "note": "",
    "ref": "MTI-612-119-10-115",
    "price": 401000,
    "area": 116,
    "beds": 2,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/estepona-612-1.webp",
      "/form-one/assets/properties/estepona-612-2.webp",
      "/form-one/assets/properties/estepona-612-3.webp",
      "/form-one/assets/properties/estepona-612-4.webp",
      "/form-one/assets/properties/estepona-612-5.webp"
    ]
  },
  {
    "key": "mijas-569",
    "slug": "apartament-mijas-costa-spa",
    "city": "Mijas Costa",
    "title": "Apartament w Mijas Costa ze strefą spa",
    "subtitle": "Dwie sypialnie i taras 13 m²",
    "beach": "W pobliżu plaż Mijas Costa",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 13 m²",
      "Miejsce parkingowe w cenie",
      "Klimatyzacja kanałowa i aerotermia",
      "Dwa baseny, kryte spa, siłownia i coworking"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w Mijas Costa, w inwestycji o architekturze inspirowanej śródziemnomorskimi klifami. Powierzchnia zabudowana wynosi 87 m², a taras ma 13 m². W cenie uwzględniono miejsce parkingowe.",
      "Mieszkanie jest oferowane z kuchnią wyposażoną w AGD, klimatyzacją kanałową oraz aerotermią do podgrzewania wody. W częściach wspólnych przewidziano dwa baseny zewnętrzne, kryte spa z podgrzewanym basenem i sauną, siłownię oraz coworking. Projekt obejmuje także ogrody i bar przy basenie ze strefą wypoczynku."
    ],
    "note": "",
    "ref": "MTI-569-118-10-115",
    "price": 415000,
    "area": 87,
    "beds": 2,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/mijas-569-1.webp",
      "/form-one/assets/properties/mijas-569-2.webp",
      "/form-one/assets/properties/mijas-569-3.webp",
      "/form-one/assets/properties/mijas-569-4.webp",
      "/form-one/assets/properties/mijas-569-5.webp"
    ]
  },
  {
    "key": "casares-265",
    "slug": "apartament-casares-taras-48m",
    "city": "Casares Costa",
    "title": "Apartament w Casares Costa z tarasem 48 m²",
    "subtitle": "Dwie sypialnie, 400 m od plaży",
    "beach": "400 m do plaży",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 48 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Klimatyzacja",
      "Wspólny basen i ogrody"
    ],
    "paragraphs": [
      "Apartament z dwiema sypialniami i dwiema łazienkami w Casares Costa, pomiędzy Marbellą a Sotogrande. Nieruchomość ma 106 m² powierzchni zabudowanej oraz taras 48 m². Odległość do plaży wskazana w ofercie wynosi około 400 m.",
      "Zamknięty kompleks oferuje wspólny basen, ogrody i nadmorskie otoczenie. Do nieruchomości przypisano miejsce parkingowe oraz komórkę lokatorską; w wyposażeniu uwzględniono klimatyzację. Lokalizacja zapewnia dostęp do pobliskich pól golfowych, Estepony i mariny w Sotogrande, a połączenia z drogą N-340 i autostradą ułatwiają podróże po wybrzeżu."
    ],
    "note": "",
    "ref": "MTI-265-118-10-115",
    "price": 420000,
    "area": 106,
    "beds": 2,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/casares-265-1.webp",
      "/form-one/assets/properties/casares-265-2.webp",
      "/form-one/assets/properties/casares-265-3.webp",
      "/form-one/assets/properties/casares-265-4.webp",
      "/form-one/assets/properties/casares-265-5.webp"
    ]
  },
  {
    "key": "marbella-624",
    "slug": "penthouse-nueva-andalucia-solarium",
    "city": "Nueva Andalucía, Marbella",
    "title": "Penthouse z solarium w Nueva Andalucía",
    "subtitle": "Dwie sypialnie i taras 64 m²",
    "beach": "Nueva Andalucía · blisko pól golfowych",
    "features": [
      "Dwie sypialnie i dwie łazienki",
      "Taras 64 m² i prywatne solarium",
      "Miejsce parkingowe i komórka lokatorska",
      "Dwa baseny, siłownia i spa",
      "Zamknięty kompleks z ochroną 24/7"
    ],
    "paragraphs": [
      "Penthouse z dwiema sypialniami i dwiema łazienkami w Nueva Andalucía w Marbelli. Powierzchnia zabudowana wynosi 105 m², a taras ma 64 m². Oferta obejmuje prywatne solarium, miejsce parkingowe i komórkę lokatorską.",
      "Inwestycja składa się z 70 apartamentów i penthouse’ów. Mieszkańcy mają do dyspozycji tropikalne ogrody, dwa baseny, przestrzenie do wypoczynku, siłownię, spa i strefę wellness. Kompleks przewiduje całodobową ochronę i podziemny parking. W okolicy znajdują się pola golfowe, szkoły międzynarodowe, sklepy i restauracje Nueva Andalucía."
    ],
    "note": "",
    "ref": "MTI-624-118-10-115",
    "price": 500000,
    "area": 105,
    "beds": 2,
    "baths": 2,
    "budget": "do-500-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/marbella-624-1.webp",
      "/form-one/assets/properties/marbella-624-2.webp",
      "/form-one/assets/properties/marbella-624-3.webp",
      "/form-one/assets/properties/marbella-624-4.webp",
      "/form-one/assets/properties/marbella-624-5.webp"
    ]
  },
  {
    "key": "mijas-1010",
    "slug": "apartament-la-cala-de-mijas-resort",
    "city": "La Cala de Mijas",
    "title": "Apartament w La Cala de Mijas",
    "subtitle": "Jedna sypialnia, taras 18 m² i udogodnienia resortowe",
    "beach": "Ok. 1,5 km do plaży",
    "features": [
      "Jedna sypialnia i jedna łazienka",
      "Taras 18 m²",
      "Miejsce parkingowe i komórka lokatorska",
      "Kuchnia z AGD i klimatyzacja kanałowa",
      "Baseny, spa, siłownia i coworking"
    ],
    "paragraphs": [
      "Apartament z jedną sypialnią i jedną łazienką w La Cala de Mijas, w osiedlu położonym na wzniesieniu, około 1,5 km od plaży. Powierzchnia zabudowana wynosi 75 m², a taras ma 18 m². Do nieruchomości przynależą prywatne miejsce parkingowe i komórka lokatorska.",
      "Wyposażenie obejmuje kuchnię ze zintegrowanym AGD, klimatyzację kanałową i wzmocnione drzwi wejściowe. Części wspólne przewidują ogrody, baseny zewnętrzne, salon mieszkańców, siłownię, coworking i spa. W pobliżu dostępne są restauracje, sklepy i pola golfowe, a połączenia z A-7 i AP-7 ułatwiają dojazd do innych miejscowości Costa del Sol."
    ],
    "note": "",
    "ref": "MTI-1010-119-10-115",
    "price": 496200,
    "area": 75,
    "beds": 1,
    "baths": 1,
    "budget": "do-500-tys-euro",
    "region": "costa-del-sol",
    "images": [
      "/form-one/assets/properties/mijas-1010-1.webp",
      "/form-one/assets/properties/mijas-1010-2.webp",
      "/form-one/assets/properties/mijas-1010-3.webp",
      "/form-one/assets/properties/mijas-1010-4.webp",
      "/form-one/assets/properties/mijas-1010-5.webp"
    ]
  },
  {
    "key": "altea-1319",
    "slug": "willa-altea-trzy-sypialnie",
    "city": "Altea",
    "title": "Willa z prywatnym ogrodem w Altei",
    "subtitle": "Trzy sypialnie z własnymi łazienkami",
    "beach": "5 km do plaży",
    "features": [
      "Trzy sypialnie i trzy łazienki",
      "Tarasy 40 m² i solarium",
      "Prywatny basen i ogród",
      "Działka ponad 800 m²",
      "Dwa miejsca parkingowe"
    ],
    "paragraphs": [
      "Willa z trzema sypialniami i trzema łazienkami w Altei. Powierzchnia zabudowana wynosi 220 m², a tarasy mają 40 m². Dom zaprojektowano na działce o powierzchni ponad 800 m², z prywatnym ogrodem i basenem.",
      "Układ wnętrz skupia się wokół tarasu i basenu. Każda sypialnia ma własną łazienkę i dostęp do tarasu, a główna sypialnia dodatkowo przestronną garderobę. Wyposażenie obejmuje kuchnię z wyspą i wysokiej klasy AGD oraz klimatyzację kanałową. Oferta przewiduje solarium i dwa miejsca parkingowe. Odległość do plaży wskazana w ofercie wynosi około 5 km."
    ],
    "note": "",
    "ref": "MTI-1319-87-10-115",
    "price": 1395000,
    "area": 220,
    "beds": 3,
    "baths": 3,
    "budget": "premium",
    "region": "costa-blanca",
    "images": [
      "/form-one/assets/properties/altea-1319-1.webp",
      "/form-one/assets/properties/altea-1319-2.webp",
      "/form-one/assets/properties/altea-1319-3.webp",
      "/form-one/assets/properties/altea-1319-4.webp",
      "/form-one/assets/properties/altea-1319-5.webp"
    ]
  },
  {
    "key": "calpe-70",
    "slug": "willa-calpe-widok-ifach",
    "city": "Maryvilla, Calpe",
    "title": "Willa z widokiem na Peñón de Ifach w Calpe",
    "subtitle": "Trzy poziomy połączone windą i basen infinity",
    "beach": "1 km do plaży",
    "features": [
      "Cztery sypialnie i pięć łazienek",
      "Tarasy 140 m² i solarium",
      "Prywatny basen infinity",
      "Winda i garaż dwustanowiskowy",
      "Ogrzewanie podłogowe i automatyka domowa"
    ],
    "paragraphs": [
      "Willa z czterema sypialniami i pięcioma łazienkami w dzielnicy Maryvilla w Calpe, z widokiem na morze, zatokę i Peñón de Ifach. Powierzchnia zabudowana wynosi 427 m², a tarasy mają 140 m². Od plaży dzieli nieruchomość około 1 km.",
      "Dom ma trzy poziomy połączone wewnętrzną windą. Oferuje prywatny basen infinity, ogród, solarium, strefę wypoczynku i miejsce do grillowania. Wyposażenie obejmuje automatykę domową i ogrzewanie podłogowe. Do dyspozycji właściciela jest także garaż dwustanowiskowy."
    ],
    "note": "",
    "ref": "MTI-70-115-10-115",
    "price": 1550000,
    "area": 427,
    "beds": 4,
    "baths": 5,
    "budget": "premium",
    "region": "costa-blanca",
    "images": [
      "/form-one/assets/properties/calpe-70-1.webp",
      "/form-one/assets/properties/calpe-70-2.webp",
      "/form-one/assets/properties/calpe-70-3.webp",
      "/form-one/assets/properties/calpe-70-4.webp",
      "/form-one/assets/properties/calpe-70-5.webp"
    ]
  },
  {
    "key": "pilar-1511",
    "slug": "willa-torre-higuericas",
    "city": "Torre de la Horadada, Pilar de la Horadada",
    "title": "Willa przy plaży Higuericas",
    "subtitle": "Pięć sypialni, 100 m od morza",
    "beach": "100 m do plaży Higuericas",
    "features": [
      "Pięć sypialni i pięć łazienek",
      "Działka 618 m²",
      "Prywatny basen i ogród",
      "Klimatyzacja kanałowa",
      "Garaż na dwa samochody i dodatkowy parking"
    ],
    "paragraphs": [
      "Willa z pięcioma sypialniami i pięcioma łazienkami, około 100 m od plaży Higuericas w Torre de la Horadada. Dom ma 344 m² powierzchni zabudowanej i stoi na działce 618 m². Dwie sypialnie mają własne łazienki i garderoby.",
      "Otwarta kuchnia łączy się z jadalnią i częścią dzienną, z bezpośrednim wyjściem do prywatnego ogrodu i basenu. W wyposażeniu przewidziano kuchnię z AGD oraz klimatyzację kanałową z funkcją grzania i chłodzenia. Garaż mieści dwa samochody, a na posesji jest miejsce na kolejny. W pobliżu znajdują się promenada, restauracje i przystań Torre de la Horadada."
    ],
    "note": "",
    "ref": "MTI-1511-87-10-115",
    "price": 3600000,
    "area": 344,
    "beds": 5,
    "baths": 5,
    "budget": "premium",
    "region": "costa-blanca",
    "images": [
      "/form-one/assets/properties/pilar-1511-1.webp",
      "/form-one/assets/properties/pilar-1511-2.webp",
      "/form-one/assets/properties/pilar-1511-3.webp",
      "/form-one/assets/properties/pilar-1511-4.webp",
      "/form-one/assets/properties/pilar-1511-5.webp"
    ]
  },
  {
    "key": "benissa-1449",
    "slug": "willa-benissa-architektura-zbocze",
    "city": "Benissa",
    "title": "Willa wpisana w zbocze w Benissie",
    "subtitle": "Panoramiczny widok, basen infinity i strefa rekreacji",
    "beach": "2,2 km do plaży",
    "features": [
      "Cztery sypialnie i sześć łazienek",
      "Tarasy 208 m²",
      "Basen infinity i ogród",
      "Winda i dwa miejsca parkingowe",
      "Siłownia, sala gier i bar"
    ],
    "paragraphs": [
      "Willa z czterema sypialniami i sześcioma łazienkami w Benissie, zaprojektowana na kilku poziomach zgodnie z naturalnym ukształtowaniem zbocza. Powierzchnia zabudowana wynosi 654 m², a tarasy mają 208 m². Betonowe platformy, drewniane pergole i przesuwne przeszklenia łączą wnętrza z nadmorskim krajobrazem.",
      "Dom oferuje prywatny basen infinity, ogród i windę. Na niższym poziomie przewidziano strefę rekreacyjną z salą gier, barem i siłownią. Wyposażenie obejmuje ogrzewanie podłogowe, klimatyzację kanałową ze sterowaniem strefowym, automatykę domową i kuchnię z wysokiej klasy AGD. Oferta uwzględnia dwa miejsca parkingowe; odległość do plaży wynosi około 2,2 km."
    ],
    "note": "",
    "ref": "MTI-1449-87-10-115",
    "price": 4250000,
    "area": 654,
    "beds": 4,
    "baths": 6,
    "budget": "premium",
    "region": "costa-blanca",
    "images": [
      "/form-one/assets/properties/benissa-1449-1.webp",
      "/form-one/assets/properties/benissa-1449-2.webp",
      "/form-one/assets/properties/benissa-1449-3.webp",
      "/form-one/assets/properties/benissa-1449-4.webp",
      "/form-one/assets/properties/benissa-1449-5.webp"
    ]
  },
  {
    "key": "benissa-3150",
    "slug": "willa-la-fustera-benissa",
    "city": "La Fustera, Benissa Costa",
    "title": "Willa w La Fustera, Benissa Costa",
    "subtitle": "Śródziemnomorski dom po gruntownym przeprojektowaniu",
    "beach": "800 m do plaży",
    "features": [
      "Cztery sypialnie i sześć łazienek",
      "Tarasy 296 m²",
      "Działka 1070 m²",
      "Prywatny basen i zadaszona weranda",
      "Parking na dwa samochody"
    ],
    "paragraphs": [
      "Willa w La Fustera, około 800 m od plaży, na działce o powierzchni 1070 m². Dom został gruntownie przeprojektowany z zachowaniem śródziemnomorskiego charakteru. Oferuje 300 m² powierzchni zabudowanej, cztery sypialnie z własnymi łazienkami oraz dwie dodatkowe łazienki.",
      "Otwarta część dzienna z kuchnią prowadzi na zadaszoną werandę i rozległe tarasy. Prywatny basen otacza ogród, a na posesji przewidziano parking dla dwóch samochodów. Wyposażenie obejmuje kuchnię z AGD, system alarmowy, klimatyzację strefową i aerotermię. W okolicy dostępne są restauracje i codzienne usługi La Fustera."
    ],
    "note": "",
    "ref": "MTI-3150-115-10-115",
    "price": 2250000,
    "area": 300,
    "beds": 4,
    "baths": 6,
    "budget": "premium",
    "region": "costa-blanca",
    "images": [
      "/form-one/assets/properties/benissa-3150-1.webp",
      "/form-one/assets/properties/benissa-3150-2.webp",
      "/form-one/assets/properties/benissa-3150-3.webp",
      "/form-one/assets/properties/benissa-3150-4.webp",
      "/form-one/assets/properties/benissa-3150-5.webp"
    ]
  }
];
