// Treści pod ofertami na polskich stronach miast (/nieruchomosci/hiszpania/{wybrzeże}/{miasto}).
// Zasady jak w Torrevieja i Alicante (docs/seo-torrevieja-2026-09-25.md): bez widełek cen
// i obietnic rentowności, fakty o miejscu tylko sprawdzone w źródłach (docs/seo-miasta-2026-10-14.md).
// Linki w tekście: [anchor](/sciezka).

export type CityGuide = {
  slug: string;
  ariaLabel: string;
  intro: { title: string; paragraphs: string[] };
  areas: {
    title: string;
    lead: string[];
    items: Array<{ name: string; description: string }>;
    after?: string[];
  };
  apartments: { title: string; paragraphs: string[] };
  houses: { title: string; paragraphs: string[] };
  market: { title: string; columns: Array<{ title: string; text: string }> };
  prices: { title: string; paragraphs: string[] };
  rental: { title: string; paragraphs: string[] };
  onesta: { title: string; paragraphs: string[]; button: string };
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const CITY_GUIDES: Record<string, CityGuide> = {
  "orihuela-costa": {
    slug: "orihuela-costa",
    ariaLabel: "Poradnik zakupu nieruchomości w Orihuela Costa",
    intro: {
      title: "Nieruchomości w Orihuela Costa — nadmorska część gminy Orihuela",
      paragraphs: [
        "Orihuela Costa to nie jedno miasteczko, lecz pas osiedli wzdłuż około 16 km wybrzeża na południu Costa Blanca. Należy do gminy Orihuela, choć samo miasto Orihuela leży w głębi lądu, około 35 km dalej. W ogłoszeniach zobaczysz więc zarówno ogólną nazwę „Orihuela Costa”, jak i nazwy poszczególnych urbanizacji: Playa Flamenca, La Zenia, Cabo Roig, Campoamor czy Villamartín. Oferty powyżej obejmują wszystkie te części.",
        "To jeden z największych rynków mieszkań wakacyjnych na wybrzeżu: przeważają apartamenty i bungalowy na osiedlach ze wspólnym basenem, uzupełnione domami szeregowymi i willami. Szukasz szerzej? Porównaj nasze [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania) albo całą [Costa Blanca](/nieruchomosci/hiszpania/costa-blanca).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Orihuela Costa? Porównaj urbanizacje",
      lead: [
        "Różnice między częściami Orihuela Costa są większe, niż sugeruje wspólna nazwa. Jedne osiedla leżą przy zatoczkach i plażach, inne kilka kilometrów w głąb lądu, przy polach golfowych. Zanim porównasz ceny, ustal, czy chcesz chodzić nad morze pieszo, czy wystarczy Ci krótki dojazd.",
      ],
      items: [
        {
          name: "Playa Flamenca i La Zenia",
          description:
            "Najbardziej ruchliwa część wybrzeża, z plażami, restauracjami i centrum handlowym La Zenia Boulevard, jednym z największych w prowincji Alicante. Wygodna przez cały rok, ale w sezonie gwarna. Przy oglądaniu sprawdź hałas od głównych ulic i dostępność parkingu.",
        },
        {
          name: "Cabo Roig i Campoamor",
          description:
            "Spokojniejsze osiedla nad skalistym wybrzeżem z zatoczkami i niewielkimi portami jachtowymi. Dużo domów i willi, także na wzniesieniach z widokiem na morze. Oceń nachylenie ulic i trasę do plaży: widok z tarasu nie zawsze oznacza krótkie zejście nad wodę.",
        },
        {
          name: "Villamartín, Los Dolses i Las Ramblas",
          description:
            "Osiedla w głębi lądu, wokół pól golfowych. Zwykle więcej zieleni i ciszy, nad morze jedzie się samochodem. Dobre dla osób, które grają w golfa lub szukają większego tarasu w podobnym budżecie. Sprawdź koszty wspólnoty i utrzymania terenów zielonych.",
        },
        {
          name: "Punta Prima",
          description:
            "Północny skraj Orihuela Costa, tuż przy granicy z Torrevieja. Łączy nadmorskie osiedla z bliskością usług większego miasta. Porównaj mieszkania przy pierwszej linii z tymi po drugiej stronie drogi nadmorskiej, która bywa ruchliwa.",
        },
      ],
      after: [
        "Rozważasz też sąsiednie miejscowości? Zobacz [nieruchomości w Torrevieja](/nieruchomosci/hiszpania/costa-blanca/torrevieja) na północy oraz [Pilar de la Horadada](/nieruchomosci/hiszpania/costa-blanca/pilar-de-la-horadada) na południu.",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w Orihuela Costa",
      paragraphs: [
        "Większość ofert to apartamenty na zamkniętych osiedlach ze wspólnym basenem i ogrodem. Na parterze zwykle dostaniesz prywatny ogródek lub taras, na najwyższym piętrze solarium na dachu. Zastanów się, co jest ważniejsze: wyjście prosto do ogrodu czy więcej słońca i widoku.",
        "Porównując mieszkania, sprawdź orientację tarasu, windę, miejsce parkingowe i wysokość opłat wspólnoty. Apartamenty w starszych osiedlach bywają przestronniejsze niż nowe, ale mogą wymagać odświeżenia łazienki czy kuchni.",
      ],
    },
    houses: {
      title: "Domy i bungalowy na sprzedaż w Orihuela Costa",
      paragraphs: [
        "Bungalow to w tutejszych ogłoszeniach zwykle mieszkanie z wejściem z zewnątrz, na parterze lub piętrze niewielkiego budynku. Dom szeregowy, quad i wolnostojąca willa różnią się już prywatnością, działką i obowiązkami właściciela.",
        "Przy domu z basenem ustal, czy basen jest prywatny, czy wspólny. Zapytaj o koszt utrzymania ogrodu i basenu podczas Twojej nieobecności oraz o stan instalacji w starszych domach z lat 80. i 90., których jest tu sporo.",
      ],
    },
    market: {
      title: "Rynek wtórny czy nowe osiedle w Orihuela Costa?",
      columns: [
        {
          title: "Rynek wtórny",
          text: "Dominuje w ofercie. Pozwala obejrzeć gotowe mieszkanie, jego światło i sąsiedztwo, a często kupić je z umeblowaniem. Sprawdź stan techniczny, ewentualne zaległości wobec wspólnoty i zgodność stanu faktycznego z dokumentami.",
        },
        {
          title: "Nowe inwestycje",
          text: "Pojawiają się głównie na obrzeżach i przy polach golfowych. Porównaj standard przekazania, termin odbioru i to, co obejmuje cena: klimatyzację, parking, wyposażenie kuchni. Cena z reklamy inwestycji może dotyczyć innego piętra niż to, które Cię interesuje.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Orihuela Costa i tańsze oferty",
      paragraphs: [
        "Na cenę najmocniej wpływa odległość od morza, widok i stan budynku. Mieszkanie przy zatoczce w Cabo Roig i podobny metraż w Villamartín to dwa różne rynki. Aktualne ceny znajdziesz przy ogłoszeniach powyżej; porównuj oferty o zbliżonej lokalizacji i standardzie.",
        "Tańszych nieruchomości warto szukać na rynku wtórnym, w lokalach do odświeżenia i na osiedlach w głębi lądu. Do budżetu dolicz koszty zakupu, wyposażenie i stałe opłaty. Pomoże w tym poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Apartament w Orihuela Costa pod wynajem",
      paragraphs: [
        "Wiele osób kupuje tu mieszkanie, z którego korzysta latem, a resztę roku wynajmuje. Zanim wybierzesz ofertę, sprawdź, czy dla danego lokalu i osiedla możliwy jest wynajem turystyczny; zasady regionu i wspólnoty mogą go ograniczać.",
        "W kalkulacji uwzględnij sezonowość, sprzątanie, przeglądy i okresy bez gości. Jeśli nie chcesz zajmować się tym samodzielnie, zobacz, jak działa [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Zakup nieruchomości w Orihuela Costa z obsługą po polsku",
      paragraphs: [
        "Przy tak wielu osiedlach najtrudniejsze jest zawężenie wyboru. W Onesta zaczynamy od rozmowy o tym, jak chcesz korzystać z nieruchomości, a potem dobieramy urbanizacje i konkretne oferty do wspólnego omówienia.",
        "Organizujemy prezentacje, kontakt ze sprzedającymi i deweloperami oraz pomagamy w formalnościach. Wszystko omawiamy po polsku. Kupujący nie płaci nam prowizji.",
      ],
      button: "Porozmawiajmy o nieruchomości w Orihuela Costa",
    },
    faqTitle: "Nieruchomości Orihuela Costa — najczęstsze pytania",
    faqs: [
      {
        question: "Czy Orihuela Costa to to samo co Orihuela?",
        answer:
          "Nie. Obie należą do tej samej gminy, ale Orihuela to historyczne miasto w głębi lądu, a Orihuela Costa to nadmorskie osiedla oddalone od niego o około 35 km. Oferty na tej stronie dotyczą wybrzeża.",
      },
      {
        question: "Która część Orihuela Costa jest najbliżej plaży?",
        answer:
          "Najbliżej morza leżą Playa Flamenca, La Zenia, Cabo Roig, Campoamor i Punta Prima. Villamartín i osiedla przy polach golfowych są w głębi lądu. Dla każdej oferty sprawdzaj rzeczywistą trasę na plażę, a nie samą nazwę osiedla.",
      },
      {
        question: "Gdzie szukać tańszego mieszkania w Orihuela Costa?",
        answer:
          "Najczęściej na rynku wtórnym, w starszych osiedlach i dalej od pierwszej linii. Niższa cena może oznaczać brak windy, mniejszy taras lub potrzebę remontu, dlatego porównuj pełny budżet, a nie tylko cenę ogłoszenia.",
      },
      {
        question: "Czym jest bungalow w ogłoszeniach z Orihuela Costa?",
        answer:
          "Zwykle to mieszkanie w niskim budynku z osobnym wejściem: na parterze z ogródkiem albo na piętrze z tarasem lub solarium. Nie jest to wolnostojący dom, więc sprawdź, z kim dzielisz ściany i części wspólne.",
      },
      {
        question: "Czy mogę wynajmować apartament w Orihuela Costa turystom?",
        answer:
          "Często tak, ale zależy to od przepisów regionu, zasad wspólnoty i statusu konkretnego lokalu. Sprawdź to przed zakupem. Ta strona prezentuje nieruchomości na sprzedaż, nie oferty najmu.",
      },
      {
        question: "Czy Onesta pomoże kupić mieszkanie w Orihuela Costa po polsku?",
        answer:
          "Tak. Pomagamy wybrać osiedle i oferty, organizujemy oglądanie na miejscu oraz wspieramy formalności. Kupujący nie płaci nam prowizji. Zobacz też, jak pracuje nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },

  "pilar-de-la-horadada": {
    slug: "pilar-de-la-horadada",
    ariaLabel: "Poradnik zakupu nieruchomości w Pilar de la Horadada",
    intro: {
      title: "Nieruchomości w Pilar de la Horadada — na granicy Costa Blanca i Murcji",
      paragraphs: [
        "Pilar de la Horadada to najdalej na południe wysunięta gmina prowincji Alicante, sąsiadująca z regionem Murcji i San Pedro del Pinatar. Samodzielną gminą jest od 1986 roku, wcześniej należała do Orihueli. Miasteczko ma około 24 tys. mieszkańców i żyje przez cały rok, nie tylko w sezonie.",
        "Gmina łączy dwa światy: centrum w głębi lądu oraz nadmorskie Torre de la Horadada i Mil Palmeras z około 5 km plaż. Dużą część ofert stanowią nowe inwestycje. Porównaj je z innymi miejscami na [Costa Blanca](/nieruchomosci/hiszpania/costa-blanca) lub z ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Pilar de la Horadada?",
      lead: [
        "Najpierw zdecyduj, czy wolisz mieszkać przy plaży, czy w miasteczku z całoroczną infrastrukturą. Centrum od wybrzeża dzieli kilka minut jazdy samochodem, a każda z części ma inny rytm życia.",
      ],
      items: [
        {
          name: "Centrum Pilar de la Horadada",
          description:
            "Hiszpańskie miasteczko ze sklepami, szkołami, przychodnią i restauracjami otwartymi przez cały rok. Dobry wybór na przeprowadzkę lub długie pobyty. Na plażę trzeba dojechać, więc sprawdź parking przy wybranym budynku.",
        },
        {
          name: "Torre de la Horadada",
          description:
            "Nadmorska część gminy wokół starej wieży strażniczej, z portem jachtowym i kilkoma plażami w zasięgu spaceru. W sezonie tętni życiem, poza nim jest spokojnie. Porównaj mieszkania przy promenadzie z tymi kilka ulic dalej.",
        },
        {
          name: "Mil Palmeras",
          description:
            "Północna, rodzinna część wybrzeża z piaszczystą plażą, graniczącą z Orihuela Costa. Dużo nowych apartamentów i bungalowów. Sprawdź, po której stronie drogi N-332 leży osiedle: od tego zależy, czy na plażę dojdziesz bez przechodzenia przez ruchliwą trasę.",
        },
        {
          name: "Lo Romero i Pinar de Campoverde",
          description:
            "Osiedla w głębi lądu: pierwsze przy 18-dołkowym polu golfowym Lo Romero, drugie wśród sosnowych lasów. Cisza, zieleń i często większe działki, ale codzienne sprawy załatwia się samochodem.",
        },
      ],
      after: [
        "Chcesz porównać okolicę? Na północy leży [Orihuela Costa](/nieruchomosci/hiszpania/costa-blanca/orihuela-costa), a na południu, już w Murcji, [San Pedro del Pinatar](/nieruchomosci/hiszpania/costa-calida/san-pedro-del-pinatar).",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w Pilar de la Horadada",
      paragraphs: [
        "Przy plaży przeważają apartamenty na osiedlach z basenem, w centrum mieszkania w kamienicach i nowszych blokach. Przy apartamencie wakacyjnym liczą się taras, bliskość plaży i miejsce parkingowe, przy całorocznym — dojście do sklepów, szkoły i lekarza.",
        "Sprawdź, czy mieszkanie ma klimatyzację z funkcją grzania. Zimą w Hiszpanii bywa chłodno w domach, które nie mają ogrzewania.",
      ],
    },
    houses: {
      title: "Domy i wille na sprzedaż w Pilar de la Horadada",
      paragraphs: [
        "Domy szeregowe i wille znajdziesz zarówno przy wybrzeżu, jak i na osiedlach w głębi lądu. Wolnostojąca willa z prywatnym basenem daje najwięcej prywatności, ale wymaga opieki podczas nieobecności.",
        "Oceń wielkość działki, nasłonecznienie ogrodu i to, czy dom ma miejsce na samochód. Przy nowych willach zapytaj o termin odbioru i to, czy basen i zagospodarowanie ogrodu są w cenie.",
      ],
    },
    market: {
      title: "Nowe inwestycje czy rynek wtórny w Pilar de la Horadada?",
      columns: [
        {
          title: "Nowe inwestycje",
          text: "Stanowią większość ofert w gminie, szczególnie w Mil Palmeras i przy polu golfowym Lo Romero. Porównaj standard wykończenia, termin odbioru i harmonogram płatności. Zapytaj, co jeszcze zostanie wybudowane w sąsiedztwie, bo może to zmienić widok i spokój.",
        },
        {
          title: "Rynek wtórny",
          text: "Głównie w centrum miasteczka i w Torre de la Horadada. Pozwala od razu zamieszkać i obejrzeć otoczenie o różnych porach. Sprawdź stan instalacji, wilgoć i zgodność stanu faktycznego z dokumentacją.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Pilar de la Horadada",
      paragraphs: [
        "Na cenę wpływa przede wszystkim odległość od morza i to, czy nieruchomość jest nowa. Apartament przy plaży w Mil Palmeras i mieszkanie w centrum miasteczka to dwa różne rynki. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Szukając tańszej oferty, porównaj rynek wtórny w centrum i osiedla w głębi lądu. Do budżetu dolicz koszty zakupu i wyposażenia; pomoże w tym poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Zakup w Pilar de la Horadada pod wynajem",
      paragraphs: [
        "Popyt na wynajem wakacyjny skupia się przy plaży, w Torre de la Horadada i Mil Palmeras. Centrum miasteczka lepiej sprawdza się przy wynajmie długoterminowym. Przed zakupem sprawdź, czy dla danego lokalu możliwa jest licencja turystyczna.",
        "Policz koszty sprzątania, przeglądów i obsługi gości. Jeśli chcesz to komuś powierzyć, zobacz nasze [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w Pilar de la Horadada z obsługą po polsku",
      paragraphs: [
        "Pilar de la Horadada leży niedaleko naszego biura w San Javier, więc znamy okolicę z codziennej pracy, a nie tylko z ogłoszeń. Pomagamy porównać nowe inwestycje z rynkiem wtórnym i wybrać część gminy pasującą do Twojego planu.",
        "Organizujemy prezentacje, kontakt z deweloperami i sprzedającymi oraz formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w Pilar de la Horadada",
    },
    faqTitle: "Nieruchomości Pilar de la Horadada — najczęstsze pytania",
    faqs: [
      {
        question: "Czy Pilar de la Horadada leży na Costa Blanca?",
        answer:
          "Tak. To najbardziej wysunięta na południe gmina prowincji Alicante, czyli południowy kraniec Costa Blanca. Graniczy z regionem Murcji i Costa Cálida.",
      },
      {
        question: "Jak daleko jest z centrum Pilar de la Horadada do plaży?",
        answer:
          "Centrum leży w głębi lądu, a na plaże w Torre de la Horadada i Mil Palmeras jedzie się kilka minut samochodem. Jeśli chcesz chodzić nad morze pieszo, szukaj w nadmorskich częściach gminy.",
      },
      {
        question: "Które lotnisko jest najbliżej Pilar de la Horadada?",
        answer:
          "Bliżej jest międzynarodowe lotnisko Regionu Murcji (około 40 km), dalej lotnisko Alicante-Elche (około 60 km). Dojazd ułatwia autostrada AP-7.",
      },
      {
        question: "Czy w Pilar de la Horadada są nowe mieszkania od dewelopera?",
        answer:
          "Tak, nowe inwestycje stanowią dużą część ofert, zwłaszcza w Mil Palmeras i przy polu golfowym Lo Romero. Zanim wybierzesz, porównaj standard przekazania, termin odbioru i plany zabudowy sąsiednich działek.",
      },
      {
        question: "Czy można tu mieszkać przez cały rok?",
        answer:
          "Tak. Centrum Pilar de la Horadada to normalne hiszpańskie miasteczko z usługami czynnymi przez cały rok. Nadmorskie osiedla są spokojniejsze poza sezonem, część lokali jest wtedy zamknięta.",
      },
      {
        question: "Czy Onesta pomaga kupić nieruchomość w Pilar de la Horadada?",
        answer:
          "Tak. Prowadzimy cały zakup po polsku: od wyboru ofert, przez oglądanie, po formalności. Kupujący nie płaci nam prowizji. Zobacz, jak działa nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },

  "san-miguel-de-salinas": {
    slug: "san-miguel-de-salinas",
    ariaLabel: "Poradnik zakupu nieruchomości w San Miguel de Salinas",
    intro: {
      title: "Nieruchomości w San Miguel de Salinas — spokój kilka kilometrów od wybrzeża",
      paragraphs: [
        "San Miguel de Salinas to niewielkie miasteczko w głębi lądu na południu prowincji Alicante, między Torrevieja a Pilar de la Horadada. Ma niecałe 7 tys. mieszkańców, z czego ponad połowa to obcokrajowcy. To najwyżej położona miejscowość w okolicy Vega Baja, więc z części osiedli rozciągają się szerokie widoki.",
        "To kierunek dla osób, które cenią ciszę i przestrzeń bardziej niż plażę w zasięgu spaceru. Nad morze, do Orihuela Costa i Torrevieja, dojeżdża się samochodem. Porównaj tę lokalizację z innymi miejscami na [Costa Blanca](/nieruchomosci/hiszpania/costa-blanca) i z całą ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w San Miguel de Salinas?",
      lead: [
        "W ogłoszeniach z San Miguel de Salinas trafisz zarówno na mieszkania w miasteczku, jak i na osiedla wokół niego. Część z nich formalnie należy do sąsiednich gmin, dlatego zawsze sprawdzaj dokładny adres.",
      ],
      items: [
        {
          name: "Centrum miasteczka",
          description:
            "Hiszpańska zabudowa, sklepy, apteki i restauracje czynne przez cały rok. Dobre miejsce na stały pobyt i dla osób, które nie chcą być zależne od samochodu w codziennych sprawach.",
        },
        {
          name: "Blue Lagoon i Lomas del Golf",
          description:
            "Popularne osiedla na obrzeżach miasteczka, z bungalowami, domami szeregowymi i wspólnymi basenami. Spokojnie i zielono. Sprawdź odległość do sklepu i przystanku, bo nie wszystkie ulice mają chodniki.",
        },
        {
          name: "Okolice pól golfowych",
          description:
            "W pobliżu znajdują się resorty golfowe, m.in. Las Colinas i Vistabella, leżące już przy granicy z gminą Orihuela. To zwykle wyższy standard i zadbane tereny wspólne, ale też wyższe opłaty wspólnoty. Zapytaj o ich wysokość przed oglądaniem.",
        },
        {
          name: "Nowe osiedla na obrzeżach",
          description:
            "Nowe inwestycje z widokiem na okolicę, często z prywatnymi basenami lub solarium. Porównaj termin odbioru i to, co obejmuje cena, oraz sprawdź, co jeszcze powstanie na sąsiednich działkach.",
        },
      ],
      after: [
        "Szukasz czegoś bliżej morza? Porównaj [nieruchomości w Torrevieja](/nieruchomosci/hiszpania/costa-blanca/torrevieja) i [Orihuela Costa](/nieruchomosci/hiszpania/costa-blanca/orihuela-costa).",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w San Miguel de Salinas",
      paragraphs: [
        "W miasteczku znajdziesz mieszkania w niskich blokach, a na osiedlach apartamenty i bungalowy ze wspólnym basenem. Przy podobnym budżecie często dostaniesz tu większy taras niż przy plaży.",
        "Sprawdź nasłonecznienie, widok i to, czy w pobliżu jest miejsce parkingowe. Przy mieszkaniu na stały pobyt oceń też dojazd do przychodni, szkoły i większych sklepów.",
      ],
    },
    houses: {
      title: "Domy i wille na sprzedaż w San Miguel de Salinas",
      paragraphs: [
        "Wiele osób wybiera San Miguel de Salinas ze względu na domy z ogrodem i prywatnym basenem w spokojnej okolicy. Porównaj domy szeregowe, quady i wille pod kątem prywatności, wielkości działki i ekspozycji ogrodu.",
        "Pamiętaj o kosztach utrzymania: basen, ogród i zabezpieczenie domu podczas nieobecności to stałe wydatki. W starszych domach sprawdź stan dachu, izolacji i instalacji.",
      ],
    },
    market: {
      title: "Nowe inwestycje czy rynek wtórny w San Miguel de Salinas?",
      columns: [
        {
          title: "Rynek wtórny",
          text: "Większa część ofert. Gotowe domy i mieszkania, często z umeblowaniem i dojrzałym ogrodem. Obejrzyj je o różnych porach dnia i sprawdź zgodność stanu faktycznego z dokumentacją, zwłaszcza przy rozbudowanych tarasach i zabudowanych solarium.",
        },
        {
          title: "Nowe inwestycje",
          text: "Powstają głównie na obrzeżach miasteczka i przy polach golfowych. Nowoczesny układ i energooszczędne rozwiązania to atuty, ale porównaj standard przekazania, termin odbioru i koszty wyposażenia.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w San Miguel de Salinas",
      paragraphs: [
        "Położenie w głębi lądu sprawia, że za podobną kwotę często kupisz tu więcej przestrzeni niż przy plaży. Ostateczna cena zależy od osiedla, widoku, działki i stanu technicznego. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Licząc budżet, dodaj do ceny koszty zakupu, wyposażenia i samochodu, jeśli go nie masz. Pomoże Ci poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "San Miguel de Salinas a wynajem",
      paragraphs: [
        "Wynajem wakacyjny jest tu możliwy, ale goście zwykle szukają plaży w zasięgu spaceru, więc obłożenie może być niższe niż na wybrzeżu. Lepiej sprawdzają się domy z prywatnym basenem i wynajem długoterminowy, także dla osób pracujących w okolicy.",
        "Przed zakupem sprawdź zasady licencji turystycznej dla wybranego lokalu. Jeśli chcesz powierzyć obsługę najmu, zobacz nasze [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w San Miguel de Salinas z obsługą po polsku",
      paragraphs: [
        "Pomagamy ocenić, czy życie w głębi lądu będzie dla Ciebie wygodne, i porównać konkretne osiedla z ofertami bliżej morza. Pokażemy różnice na miejscu, łącząc oglądanie kilku lokalizacji w jeden dzień.",
        "Organizujemy prezentacje, kontakt ze sprzedającymi i formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w San Miguel de Salinas",
    },
    faqTitle: "Nieruchomości San Miguel de Salinas — najczęstsze pytania",
    faqs: [
      {
        question: "Jak daleko z San Miguel de Salinas jest do morza?",
        answer:
          "Miasteczko leży w głębi lądu; najbliższe plaże Orihuela Costa i Torrevieja są w zasięgu krótkiej jazdy samochodem. Dokładny czas zależy od osiedla, dlatego sprawdzaj trasę dla konkretnego adresu.",
      },
      {
        question: "Czy w San Miguel de Salinas mieszka dużo obcokrajowców?",
        answer:
          "Tak. Według danych INE z 2023 roku obcokrajowcy stanowią ponad połowę z niecałych 7 tys. mieszkańców. Dzięki temu łatwo tu o usługi po angielsku, a miasteczko żyje przez cały rok.",
      },
      {
        question: "Czy San Miguel de Salinas to dobre miejsce na stały pobyt?",
        answer:
          "Dla wielu osób tak: jest spokojnie, a centrum ma podstawowe usługi. Warto jednak mieć samochód, bo większe sklepy, szpital i plaże są w sąsiednich miejscowościach.",
      },
      {
        question: "Czy dom z basenem w San Miguel de Salinas będzie droższy niż apartament przy plaży?",
        answer:
          "Niekoniecznie. W głębi lądu za podobną kwotę często dostaniesz większą powierzchnię i działkę. Porównuj jednak pełne koszty: utrzymanie basenu i ogrodu, opłaty wspólnoty i dojazdy.",
      },
      {
        question: "Czy osiedla golfowe należą do San Miguel de Salinas?",
        answer:
          "Nie wszystkie. Część resortów golfowych w okolicy, jak Las Colinas, formalnie leży w gminie Orihuela. Ma to znaczenie dla podatków lokalnych i usług, więc sprawdzaj adres w dokumentach.",
      },
      {
        question: "Czy Onesta pomoże kupić nieruchomość w San Miguel de Salinas?",
        answer:
          "Tak. Pomagamy wybrać osiedle, organizujemy oglądanie i wspieramy formalności, po polsku i bez prowizji dla kupującego. Zobacz, jak pracuje nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },

  "ciudad-quesada": {
    slug: "ciudad-quesada",
    ariaLabel: "Poradnik zakupu nieruchomości w Ciudad Quesada i Rojales",
    intro: {
      title: "Nieruchomości w Ciudad Quesada i Rojales — osiedle przy polu golfowym",
      paragraphs: [
        "Ciudad Quesada to duża urbanizacja w południowej części gminy Rojales, około 6 km od morza, między plażami Guardamar del Segura, La Mata i Torrevieja. Zaczęła powstawać w latach 70., gdy Justo Quesada kupił tu ziemię, a jej sercem jest pole golfowe La Marquesa. Dziś mieszka tu wielu Brytyjczyków i Skandynawów, a osiedle żyje przez cały rok.",
        "Oferty na tej stronie obejmują Ciudad Quesada i resztę gminy Rojales, w tym historyczne miasteczko nad rzeką Segura. Porównaj je z innymi miejscami na [Costa Blanca](/nieruchomosci/hiszpania/costa-blanca) i z całą ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Ciudad Quesada i Rojales?",
      lead: [
        "Ciudad Quesada jest rozległa: od zabudowy przy głównych ulicach z restauracjami i sklepami po spokojne ulice z willami na wzgórzach. Wybór zależy od tego, czy chcesz mieć wszystko w zasięgu spaceru, czy szukasz ciszy.",
      ],
      items: [
        {
          name: "Centrum Ciudad Quesada",
          description:
            "Najwięcej usług, restauracji i sklepów, czynnych także poza sezonem. Dużo bungalowów i domów szeregowych. Sprawdź, czy przy wybranej ulicy wieczorem nie jest zbyt głośno.",
        },
        {
          name: "La Marquesa Golf",
          description:
            "Okolice 18-dołkowego pola golfowego La Marquesa, wokół którego zaczęło się osiedle. Domy z widokiem na pole i zieleń. Zapytaj o opłaty wspólnoty i o to, czy nieruchomość nie leży na trasie lotu piłek.",
        },
        {
          name: "Doña Pepa",
          description:
            "Sąsiednie osiedle z nowszą zabudową i międzynarodową szkołą w pobliżu, wybierane przez rodziny. Porównaj nowe wille z domami z rynku wtórnego w starszej części Quesady.",
        },
        {
          name: "Rojales — miasteczko",
          description:
            "Hiszpańskie centrum gminy nad rzeką Segura, z urzędem, lokalnymi sklepami i zabytkowymi domami wykutymi w skale (Cuevas del Rodeo). Dobre na całoroczne życie w lokalnej atmosferze, z dojazdem na plażę samochodem.",
        },
      ],
      after: [
        "Najbliższe miasta nad morzem to [Guardamar del Segura](/nieruchomosci/hiszpania/costa-blanca/guardamar-del-segura) i [Torrevieja](/nieruchomosci/hiszpania/costa-blanca/torrevieja). Porównaj też pobliskie [San Miguel de Salinas](/nieruchomosci/hiszpania/costa-blanca/san-miguel-de-salinas).",
      ],
    },
    apartments: {
      title: "Mieszkania i bungalowy na sprzedaż w Ciudad Quesada",
      paragraphs: [
        "Klasycznych bloków jest tu niewiele. Najczęściej trafisz na bungalowy, czyli mieszkania w niskich budynkach z osobnym wejściem, ogródkiem na parterze lub solarium na piętrze, oraz apartamenty na osiedlach ze wspólnym basenem.",
        "Przy porównywaniu sprawdź ekspozycję tarasu, miejsce parkingowe i opłaty wspólnoty. Bungalow na górze zwykle ma więcej słońca i widoku, na dole wygodniejsze wejście bez schodów.",
      ],
    },
    houses: {
      title: "Domy i wille na sprzedaż w Ciudad Quesada",
      paragraphs: [
        "Ciudad Quesada słynie z domów: od szeregowców i quadów po wolnostojące wille z prywatnym basenem. Część starszych domów była z czasem rozbudowywana, dlatego porównaj stan faktyczny z dokumentacją, zanim zaczniesz negocjować.",
        "Przy willi oceń wielkość działki, nasłonecznienie ogrodu i koszty utrzymania basenu. Zapytaj o stan dachu, izolację i klimatyzację z funkcją grzania.",
      ],
    },
    market: {
      title: "Rynek wtórny czy nowa inwestycja w Ciudad Quesada?",
      columns: [
        {
          title: "Rynek wtórny",
          text: "Większość ofert. Dojrzałe osiedla, gotowe ogrody i często umeblowanie w cenie. Sprawdź legalność rozbudów, stan instalacji i to, czy nie ma zaległości wobec wspólnoty.",
        },
        {
          title: "Nowe inwestycje",
          text: "Nowe wille i bungalowy powstają głównie na obrzeżach i w Doña Pepa. Porównaj standard wykończenia, termin odbioru i to, co obejmuje cena: basen, ogród, klimatyzację.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Ciudad Quesada i Rojales",
      paragraphs: [
        "Położenie kilka kilometrów od morza sprawia, że w podobnym budżecie częściej dostaniesz dom z ogrodem niż przy samej plaży. Cena zależy od widoku, działki, prywatnego basenu i stanu technicznego. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Licząc budżet, dodaj koszty zakupu, ewentualnego odświeżenia i wyposażenia. Pomoże w tym poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Dom w Ciudad Quesada pod wynajem",
      paragraphs: [
        "Wille z prywatnym basenem cieszą się popytem wśród rodzin i golfistów, także poza szczytem sezonu. Przed zakupem sprawdź jednak, czy dla danej nieruchomości możliwa jest licencja turystyczna i czy wspólnota nie ogranicza najmu.",
        "W kalkulacji uwzględnij utrzymanie basenu i ogrodu, sprzątanie i okresy bez gości. Obsługę najmu możesz powierzyć nam: zobacz [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w Ciudad Quesada z obsługą po polsku",
      paragraphs: [
        "Ciudad Quesada to wiele osiedli o różnym charakterze. Pomagamy wybrać część, która pasuje do Twojego planu, i porównać domy z rynku wtórnego z nowymi inwestycjami.",
        "Organizujemy oglądanie, kontakt ze sprzedającymi i deweloperami oraz formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w Ciudad Quesada",
    },
    faqTitle: "Nieruchomości Ciudad Quesada — najczęstsze pytania",
    faqs: [
      {
        question: "Czy Ciudad Quesada to osobne miasto?",
        answer:
          "Nie. To duża urbanizacja w gminie Rojales. W dokumentach i ogłoszeniach adres może więc brzmieć „Rojales” albo „Ciudad Quesada”. Ta strona obejmuje oba zapisy.",
      },
      {
        question: "Jak daleko z Ciudad Quesada jest do plaży?",
        answer:
          "Około 6 km do morza. Najbliższe plaże są w Guardamar del Segura i La Mata (Torrevieja). Dojazd zajmuje zwykle kilkanaście minut samochodem, zależnie od części osiedla.",
      },
      {
        question: "Ile jedzie się z Ciudad Quesada na lotnisko w Alicante?",
        answer:
          "Około 35 minut autostradą AP-7. To jeden z powodów, dla których okolica jest popularna wśród osób, które często latają między Polską a Hiszpanią.",
      },
      {
        question: "Czy w Ciudad Quesada można mieszkać przez cały rok?",
        answer:
          "Tak. Duża część mieszkańców to stali rezydenci z różnych krajów, a sklepy, restauracje i usługi działają przez cały rok. Do szpitala i większych centrów handlowych jedzie się do sąsiednich miast.",
      },
      {
        question: "Na co uważać przy zakupie starszego domu w Ciudad Quesada?",
        answer:
          "Na rozbudowy wykonane bez pozwolenia: zabudowane tarasy, dodatkowe pokoje czy solarium. Porównaj stan faktyczny z dokumentacją katastralną i rejestrem, zanim wpłacisz zadatek.",
      },
      {
        question: "Czy Onesta pomoże kupić dom w Ciudad Quesada?",
        answer:
          "Tak. Pomagamy wybrać osiedle i ofertę, organizujemy oglądanie i wspieramy formalności, po polsku i bez prowizji dla kupującego. Zobacz nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },
  marbella: {
    slug: "marbella",
    ariaLabel: "Poradnik zakupu nieruchomości w Marbelli",
    intro: {
      title: "Nieruchomości w Marbelli — od starego miasta po Puerto Banús",
      paragraphs: [
        "Marbella to jedno z najbardziej znanych miast Costa del Sol: około 159 tys. mieszkańców, 27 km wybrzeża i pasmo Sierra Blanca, które osłania miasto od północy. Gmina dzieli się na pięć dzielnic, od San Pedro Alcántara na zachodzie po Las Chapas na wschodzie, a każda z nich to inny rynek nieruchomości.",
        "Oferty powyżej obejmują całą gminę: centrum, Złotą Milę, Nueva Andalucía, Puerto Banús, San Pedro Alcántara i wschodnią Marbellę z Elvirią. Porównaj je z innymi miejscami na [Costa del Sol](/nieruchomosci/hiszpania/costa-del-sol) albo z całą ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Marbelli? Porównaj dzielnice",
      lead: [
        "W Marbelli ten sam budżet znaczy zupełnie co innego w zależności od dzielnicy. Zanim zaczniesz porównywać oferty, ustal, czy zależy Ci na życiu w mieście, bliskości plaży, polach golfowych czy spokoju z dala od centrum.",
      ],
      items: [
        {
          name: "Centrum i stare miasto",
          description:
            "Historyczne Casco Antiguo z Plaza de los Naranjos, nadmorska promenada i całoroczne życie miasta. Mieszkania w kamienicach i nowszych blokach, blisko sklepów, szkół i plaży. Sprawdź parking, bo w centrum o miejsce trudno.",
        },
        {
          name: "Złota Mila i Puerto Banús",
          description:
            "Około 4 km między centrum a Puerto Banús, z najbardziej prestiżowymi adresami, hotelami i willami. Okolice portu to restauracje i życie nocne przez cały sezon. Przy apartamencie oceń hałas wieczorem i wysokość opłat wspólnoty w luksusowych kompleksach.",
        },
        {
          name: "Nueva Andalucía",
          description:
            "Dzielnica nad Puerto Banús, nazywana doliną golfa, z kilkoma polami i osiedlami z ogrodami. Dużo apartamentów z dużymi tarasami i willi. Na plażę i do portu dojeżdża się zwykle samochodem, choć z dolnej części da się dojść pieszo.",
        },
        {
          name: "San Pedro Alcántara i wschodnia Marbella",
          description:
            "San Pedro to dzielnica o bardziej lokalnym charakterze, z własnym centrum i promenadą. Wschodnia część, z Elvirią i Las Chapas, to spokojniejsze osiedla przy długich plażach. Obie warto porównać, jeśli szukasz Marbelli w niższym budżecie niż Złota Mila.",
        },
      ],
      after: [
        "Rozważasz okolicę? Na zachód od Marbelli leży [Estepona](/nieruchomosci/hiszpania/costa-del-sol/estepona), a na wschód [Mijas](/nieruchomosci/hiszpania/costa-del-sol/mijas) i [Fuengirola](/nieruchomosci/hiszpania/costa-del-sol/fuengirola).",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w Marbelli",
      paragraphs: [
        "Rozpiętość jest ogromna: od mieszkań w kamienicach w centrum po apartamenty w strzeżonych kompleksach z basenem, siłownią i recepcją. Te drugie dają wygodę, ale opłaty wspólnoty potrafią być wysokie, więc poproś o ich wysokość już przy pierwszym kontakcie.",
        "Przy apartamencie z widokiem na morze sprawdź piętro, orientację tarasu i to, czy widok nie może zostać zasłonięty przez planowaną zabudowę. Na wzgórzach oceń, czy da się normalnie żyć bez samochodu.",
      ],
    },
    houses: {
      title: "Domy i wille na sprzedaż w Marbelli",
      paragraphs: [
        "Wille to wizytówka Marbelli: od domów szeregowych na osiedlach golfowych po rezydencje ze sporą działką. Porównuj prywatność, ekspozycję, widok i drogę dojazdową, która na wzgórzach bywa stroma.",
        "Przy luksusowej nieruchomości sprawdź zgodność stanu faktycznego z dokumentacją, licencje dla rozbudów i koszty utrzymania: ogród, basen, ochrona i serwis domu podczas Twojej nieobecności.",
      ],
    },
    market: {
      title: "Nowe inwestycje czy rynek wtórny w Marbelli?",
      columns: [
        {
          title: "Nowe inwestycje",
          text: "Powstają głównie na obrzeżach, w Nueva Andalucía, San Pedro i wschodniej Marbelli. Zwykle oferują nowoczesny standard i części wspólne. Porównaj termin odbioru, harmonogram płatności i to, co obejmuje cena, oraz sprawdź, czy deweloper ma zabezpieczenie wpłat.",
        },
        {
          title: "Rynek wtórny",
          text: "Pozwala kupić w najbardziej ugruntowanych lokalizacjach, jak centrum czy Złota Mila, gdzie nowych działek prawie nie ma. Starsze budynki mogą wymagać modernizacji, dlatego doliczaj koszt remontu i sprawdź planowane prace we wspólnocie.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Marbelli",
      paragraphs: [
        "Marbella należy do droższych rynków w Hiszpanii, ale ceny mocno różnią się między dzielnicami. Apartament przy plaży na Złotej Mili i mieszkanie w San Pedro to dwa różne światy. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Szukając niższego budżetu, porównaj San Pedro Alcántara, wschodnią Marbellę i sąsiednie miasta. Do ceny dolicz koszty zakupu, wyposażenie i opłaty roczne; pomoże w tym poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Apartament w Marbelli pod wynajem",
      paragraphs: [
        "Marbella przyciąga gości przez większą część roku, także golfistów poza latem. Andaluzja wymaga jednak rejestracji mieszkania turystycznego, a wspólnota może ograniczać najem krótkoterminowy, więc sprawdź to dla konkretnego lokalu przed zakupem.",
        "W kalkulacji uwzględnij wysokie opłaty wspólnoty, sprzątanie, obsługę gości i okresy bez rezerwacji. Obsługę najmu możesz powierzyć nam: zobacz [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w Marbelli z obsługą po polsku",
      paragraphs: [
        "W Marbelli łatwo przepłacić za samą nazwę. Pomagamy porównać dzielnice i konkretne oferty, sprawdzić dokumenty i realne koszty utrzymania, zanim podejmiesz decyzję.",
        "Organizujemy prezentacje, kontakt z deweloperami i sprzedającymi oraz formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w Marbelli",
    },
    faqTitle: "Nieruchomości Marbella — najczęstsze pytania",
    faqs: [
      {
        question: "Czy Puerto Banús należy do Marbelli?",
        answer:
          "Tak. Puerto Banús leży w dzielnicy Nueva Andalucía w gminie Marbella, około 4 km od centrum, na końcu tzw. Złotej Mili.",
      },
      {
        question: "Która część Marbelli jest najtańsza?",
        answer:
          "Zwykle niższe ceny niż na Złotej Mili i w centrum znajdziesz w San Pedro Alcántara i na niektórych osiedlach wschodniej Marbelli. Ostatecznie decyduje jednak konkretny budynek, standard i odległość od plaży.",
      },
      {
        question: "Jak daleko z Marbelli jest na lotnisko w Maladze?",
        answer:
          "Około 45 km. Dojazd zajmuje zwykle 40–50 minut, zależnie od dzielnicy i ruchu na autostradzie.",
      },
      {
        question: "Czy w Marbelli można mieszkać przez cały rok?",
        answer:
          "Tak. To duże miasto z pełną infrastrukturą: szkołami, w tym międzynarodowymi, szpitalami i usługami czynnymi przez cały rok. Część osiedli wakacyjnych jest jednak poza sezonem wyraźnie cichsza.",
      },
      {
        question: "Czy mogę wynajmować apartament w Marbelli turystom?",
        answer:
          "To zależy od lokalu i wspólnoty. W Andaluzji mieszkanie turystyczne trzeba zarejestrować, a statut wspólnoty może najem ograniczać. Sprawdź to przed zakupem. Ta strona prezentuje nieruchomości na sprzedaż.",
      },
      {
        question: "Czy Onesta pomaga kupić nieruchomość w Marbelli po polsku?",
        answer:
          "Tak. Pomagamy wybrać dzielnicę i ofertę, organizujemy oglądanie i wspieramy formalności, bez prowizji dla kupującego. Zobacz, jak działa nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },

  fuengirola: {
    slug: "fuengirola",
    ariaLabel: "Poradnik zakupu nieruchomości w Fuengiroli",
    intro: {
      title: "Nieruchomości w Fuengiroli — miasto z plażą i pociągiem do Malagi",
      paragraphs: [
        "Fuengirola to zwarte, całoroczne miasto na Costa del Sol, około 33 km na południowy zachód od Malagi. Na zaledwie 10 km² mieszka tu prawie 86 tys. osób, a wzdłuż około 8 km wybrzeża ciągnie się siedem plaż i długa promenada. Ponad 30% mieszkańców to obcokrajowcy, m.in. Brytyjczycy, Irlandczycy i Skandynawowie.",
        "To dobry wybór dla osób, które chcą mieć wszystko blisko: plażę, sklepy, lekarzy i pociąg do Malagi i na lotnisko, bez konieczności posiadania samochodu. Porównaj Fuengirolę z innymi miejscami na [Costa del Sol](/nieruchomosci/hiszpania/costa-del-sol) i z całą ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Fuengiroli?",
      lead: [
        "Fuengirola jest mała, ale jej części różnią się zabudową i rytmem życia. Wybór zależy od tego, czy chcesz mieszkać przy promenadzie, w spokojniejszej części mieszkalnej, czy na wzgórzach z widokiem.",
      ],
      items: [
        {
          name: "Centrum i promenada",
          description:
            "Plaża, restauracje, targ i dworzec kolejki podmiejskiej w zasięgu spaceru. Głównie mieszkania w blokach. Przy oglądaniu sprawdź hałas z ulicy i promenady w sezonie oraz to, czy budynek ma windę i parking.",
        },
        {
          name: "Los Boliches",
          description:
            "Dawna dzielnica rybacka na północ od centrum, z własną plażą i stacją kolejki. Spokojniejsza niż ścisłe centrum, ale wciąż z pełną infrastrukturą. Dobra na całoroczne życie i dłuższe pobyty.",
        },
        {
          name: "Torreblanca i Carvajal",
          description:
            "Wzgórza w północnej części miasta, z widokiem na morze i własnymi stacjami kolejki. Więcej osiedli z basenem i domów szeregowych. Oceń nachylenie ulic i trasę do plaży, zwłaszcza jeśli nie chcesz wszędzie jeździć samochodem.",
        },
        {
          name: "Los Pacos i okolice Castillo Sohail",
          description:
            "Część mieszkalna w głębi miasta i okolice arabskiego zamku Sohail przy ujściu rzeki, na zachodnim krańcu. Często spokojniej i w niższym budżecie niż przy promenadzie. Sprawdź dojście do plaży i najbliższego przystanku.",
        },
      ],
      after: [
        "Fuengirola graniczy z [Mijas](/nieruchomosci/hiszpania/costa-del-sol/mijas), a niedaleko leży [Marbella](/nieruchomosci/hiszpania/costa-del-sol/marbella). Porównaj te lokalizacje, jeśli szukasz więcej przestrzeni.",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w Fuengiroli",
      paragraphs: [
        "Większość ofert w Fuengiroli to mieszkania i apartamenty, bo miasto jest gęsto zabudowane. Przy plaży znajdziesz bloki z lat 70. i 80., a na wzgórzach nowsze osiedla z basenem.",
        "Porównując mieszkania, sprawdź orientację i nasłonecznienie, windę, miejsce parkingowe i stan części wspólnych. W starszych budynkach zapytaj o planowane remonty elewacji i wind, które mogą oznaczać dodatkowe opłaty.",
      ],
    },
    houses: {
      title: "Domy na sprzedaż w Fuengiroli",
      paragraphs: [
        "Domów jest tu niewiele, głównie szeregowce i wille na wzgórzach w Torreblanca i Carvajal oraz na pograniczu z Mijas. Jeśli zależy Ci na ogrodzie i prywatnym basenie, porównaj też oferty w sąsiednich gminach.",
        "Przy domu na wzgórzu oceń drogę dojazdową, schody na działce i koszty utrzymania ogrodu i basenu podczas nieobecności.",
      ],
    },
    market: {
      title: "Nowe inwestycje czy rynek wtórny w Fuengiroli?",
      columns: [
        {
          title: "Nowe inwestycje",
          text: "Ze względu na brak wolnych działek powstają głównie na obrzeżach i wzgórzach. Oferują nowoczesne układy, tarasy i części wspólne. Porównaj termin odbioru, standard i to, co obejmuje cena.",
        },
        {
          title: "Rynek wtórny",
          text: "Dominuje w centrum i przy promenadzie. Daje najlepsze lokalizacje i możliwość obejrzenia gotowego mieszkania, ale często wymaga odświeżenia. Sprawdź instalacje, okna i ewentualne zaległości wobec wspólnoty.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Fuengiroli",
      paragraphs: [
        "Ceny zależą przede wszystkim od odległości od plaży, widoku i stanu budynku. Mieszkanie przy promenadzie z widokiem na morze i podobny metraż kilka ulic dalej to różne oferty. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Tańszych mieszkań szukaj na rynku wtórnym w głębi miasta i w lokalach do odświeżenia. Do budżetu dolicz koszty zakupu i ewentualnego remontu; pomoże poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Mieszkanie w Fuengiroli pod wynajem",
      paragraphs: [
        "Bliskość plaży, kolejka do lotniska i całoroczne życie miasta sprzyjają wynajmowi, zarówno wakacyjnemu, jak i długoterminowemu. W Andaluzji mieszkanie turystyczne trzeba jednak zarejestrować, a wspólnota może ograniczać najem krótkoterminowy.",
        "Sprawdź te zasady przed zakupem i policz pełne koszty obsługi. Jeśli chcesz to komuś powierzyć, zobacz nasze [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w Fuengiroli z obsługą po polsku",
      paragraphs: [
        "Pomagamy porównać mieszkania w różnych częściach Fuengiroli i ocenić, czy lepszym wyborem będzie gotowe mieszkanie w centrum, czy nowy apartament na wzgórzach.",
        "Organizujemy prezentacje, kontakt ze sprzedającymi i deweloperami oraz formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w Fuengiroli",
    },
    faqTitle: "Nieruchomości Fuengirola — najczęstsze pytania",
    faqs: [
      {
        question: "Czy z Fuengiroli dojadę pociągiem na lotnisko w Maladze?",
        answer:
          "Tak. Fuengirola jest końcową stacją podmiejskiej linii C-1, która łączy ją z Benalmádeną, Torremolinos, lotniskiem i centrum Malagi. W mieście są też stacje Los Boliches, Torreblanca i Carvajal.",
      },
      {
        question: "Czy w Fuengiroli można żyć bez samochodu?",
        answer:
          "W centrum i Los Boliches w dużej mierze tak: sklepy, lekarze, plaża i kolejka są blisko. Na wzgórzach Torreblanca i Carvajal samochód bardzo się przydaje.",
      },
      {
        question: "Czy Fuengirola jest dobra na stałe zamieszkanie?",
        answer:
          "Dla wielu osób tak. To całoroczne miasto z dużą międzynarodową społecznością, usługami i komunikacją. Poza sezonem jest spokojniej, ale miasto nie zamiera.",
      },
      {
        question: "Gdzie szukać domu z ogrodem w okolicy Fuengiroli?",
        answer:
          "W samej Fuengiroli domów jest niewiele, głównie na wzgórzach. Więcej domów i willi znajdziesz w sąsiednim Mijas, dlatego warto porównać oba katalogi.",
      },
      {
        question: "Czy mogę wynajmować mieszkanie w Fuengiroli turystom?",
        answer:
          "Zależy to od rejestracji mieszkania turystycznego w Andaluzji i zasad wspólnoty. Sprawdź to przed zakupem. Ta strona prezentuje nieruchomości na sprzedaż, nie oferty najmu.",
      },
      {
        question: "Czy Onesta pomaga kupić mieszkanie w Fuengiroli po polsku?",
        answer:
          "Tak. Pomagamy wybrać ofertę, organizujemy oglądanie i wspieramy formalności, bez prowizji dla kupującego. Zobacz, jak działa nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },

  manilva: {
    slug: "manilva",
    ariaLabel: "Poradnik zakupu nieruchomości w Manilvie",
    intro: {
      title: "Nieruchomości w Manilvie — zachodni kraniec Costa del Sol",
      paragraphs: [
        "Manilva to najdalej na zachód wysunięta nadmorska gmina prowincji Malaga, około 100 km od samej Malagi, na granicy z prowincją Kadyks. Ma około 18 tys. mieszkańców i 7,8 km wybrzeża. Na gminę składają się położone na wzgórzu miasteczko Manilva z winnicami, nadmorskie San Luis de Sabinillas oraz okolice zamku i portu La Duquesa.",
        "Manilva wybierana jest przez osoby, które szukają spokojniejszej Costa del Sol niż Marbella, często w niższym budżecie. Porównaj ją z innymi miejscami na [Costa del Sol](/nieruchomosci/hiszpania/costa-del-sol) i z ofertą [nieruchomości w Hiszpanii](/nieruchomosci/hiszpania).",
      ],
    },
    areas: {
      title: "Gdzie kupić nieruchomość w Manilvie?",
      lead: [
        "Części gminy różnią się charakterem: od hiszpańskiego miasteczka na wzgórzu po nadmorskie osiedla przy porcie. Zacznij od tego, czy chcesz mieć plażę i port w zasięgu spaceru, czy wolisz widok i ciszę.",
      ],
      items: [
        {
          name: "San Luis de Sabinillas",
          description:
            "Największa miejscowość gminy, nad morzem, ze sklepami, restauracjami i promenadą czynnymi przez cały rok. Dużo mieszkań w zasięgu plaży. Dobra na całoroczne życie i dla osób bez samochodu.",
        },
        {
          name: "Puerto de la Duquesa",
          description:
            "Port jachtowy otoczony restauracjami i apartamentami, z plażą obok. Żywy w sezonie, spokojniejszy zimą. Przy mieszkaniu z widokiem na port sprawdź, czy wieczorne życie restauracji nie będzie zbyt głośne.",
        },
        {
          name: "El Castillo",
          description:
            "Okolice zamku La Duquesa, wzniesionego w 1767 roku za panowania Karola III, przy plaży. Mniejsza, spokojna zabudowa. Dobre dla osób, które cenią klimat małej nadmorskiej miejscowości.",
        },
        {
          name: "Manilva i osiedla na wzgórzach",
          description:
            "Hiszpańskie miasteczko w głębi lądu, wśród winnic, oraz nowe osiedla na wzgórzach z widokiem na morze, a przy dobrej widoczności nawet na Gibraltar i Afrykę. Na plażę i do sklepów jedzie się samochodem.",
        },
      ],
      after: [
        "Na wschód od Manilvy leżą Casares i [Estepona](/nieruchomosci/hiszpania/costa-del-sol/estepona). Porównaj je, jeśli szukasz większego wyboru ofert na zachodzie Costa del Sol.",
      ],
    },
    apartments: {
      title: "Mieszkania i apartamenty na sprzedaż w Manilvie",
      paragraphs: [
        "W Sabinillas i przy porcie przeważają apartamenty w nadmorskich osiedlach, a na wzgórzach nowe apartamenty z dużymi tarasami i widokiem na morze. Wybierz między wygodą codziennych spacerów a widokiem i ciszą.",
        "Sprawdź orientację tarasu, odległość od plaży po rzeczywistej trasie, parking i opłaty wspólnoty. Na osiedlach na wzgórzach oceń, jak długo jedzie się do sklepu i lekarza.",
      ],
    },
    houses: {
      title: "Domy i wille na sprzedaż w Manilvie",
      paragraphs: [
        "Domy szeregowe i wille znajdziesz głównie na wzgórzach i w okolicach pól golfowych na pograniczu z Casares. Dają więcej przestrzeni i prywatności niż apartamenty przy plaży.",
        "Przy domu oceń wielkość działki, nasłonecznienie, drogę dojazdową i koszty utrzymania ogrodu i basenu. Przy starszych domach sprawdź zgodność stanu faktycznego z dokumentacją.",
      ],
    },
    market: {
      title: "Nowe inwestycje czy rynek wtórny w Manilvie?",
      columns: [
        {
          title: "Nowe inwestycje",
          text: "Powstają głównie na wzgórzach, z widokiem na morze. Porównaj standard, termin odbioru i to, co obejmuje cena. Zapytaj też, jak będzie wyglądać okolica po zakończeniu budowy sąsiednich etapów.",
        },
        {
          title: "Rynek wtórny",
          text: "Głównie w Sabinillas, przy porcie i w El Castillo. Lepsze położenie względem plaży i usług, możliwość obejrzenia gotowego mieszkania. Sprawdź stan techniczny i ewentualne planowane remonty we wspólnocie.",
        },
      ],
    },
    prices: {
      title: "Ceny nieruchomości w Manilvie",
      paragraphs: [
        "Manilva bywa tańsza od Marbelli i Estepony, ale ceny zależą od widoku, odległości od plaży i stanu nieruchomości. Aktualne ceny znajdziesz przy ogłoszeniach powyżej.",
        "Licząc budżet, dodaj koszty zakupu, wyposażenia i dojazdów, jeśli wybierasz osiedle na wzgórzu. Pomoże poradnik o [kosztach zakupu nieruchomości w Hiszpanii](/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca).",
      ],
    },
    rental: {
      title: "Apartament w Manilvie pod wynajem",
      paragraphs: [
        "Najmocniejszy popyt wakacyjny jest przy plaży i porcie La Duquesa. Osiedla na wzgórzach lepiej sprawdzają się przy dłuższych pobytach. W Andaluzji mieszkanie turystyczne trzeba zarejestrować, a wspólnota może ograniczać najem.",
        "Sprawdź te zasady przed zakupem i uwzględnij w kalkulacji sezonowość. Obsługę najmu możesz powierzyć nam: zobacz [zarządzanie nieruchomościami w Hiszpanii](/zarzadzanie-nieruchomosciami-w-hiszpanii).",
      ],
    },
    onesta: {
      title: "Nieruchomości w Manilvie z obsługą po polsku",
      paragraphs: [
        "Pomagamy ocenić, czy Manilva będzie dla Ciebie lepsza niż droższe miasta Costa del Sol, i porównać mieszkania przy plaży z nowymi apartamentami na wzgórzach.",
        "Organizujemy prezentacje, kontakt ze sprzedającymi i deweloperami oraz formalności. Wszystko po polsku, bez prowizji dla kupującego.",
      ],
      button: "Porozmawiajmy o nieruchomości w Manilvie",
    },
    faqTitle: "Nieruchomości Manilva — najczęstsze pytania",
    faqs: [
      {
        question: "Czy Manilva leży na Costa del Sol?",
        answer:
          "Tak. To najbardziej wysunięta na zachód nadmorska gmina prowincji Malaga, zachodni kraniec Costa del Sol, na granicy z prowincją Kadyks.",
      },
      {
        question: "Czy La Duquesa i Sabinillas należą do Manilvy?",
        answer:
          "Tak. San Luis de Sabinillas, El Castillo i Puerto de la Duquesa to części gminy Manilva. W ogłoszeniach często pojawiają się te nazwy zamiast nazwy gminy; ta strona obejmuje wszystkie.",
      },
      {
        question: "Jak daleko z Manilvy jest do Malagi?",
        answer:
          "Około 100 km do miasta Malaga. Na lotnisko w Maladze jedzie się zwykle nieco ponad godzinę, zależnie od ruchu i trasy.",
      },
      {
        question: "Czy Manilva jest tańsza niż Marbella?",
        answer:
          "Często tak, zwłaszcza przy podobnym metrażu i widoku. Porównuj jednak konkretne oferty: nowy apartament z widokiem w Manilvie może kosztować więcej niż starsze mieszkanie w San Pedro Alcántara.",
      },
      {
        question: "Czy w Manilvie można mieszkać przez cały rok?",
        answer:
          "Tak, zwłaszcza w San Luis de Sabinillas, gdzie usługi działają przez cały rok. Część osiedli wakacyjnych i okolice portu są zimą wyraźnie spokojniejsze.",
      },
      {
        question: "Czy Onesta pomaga kupić nieruchomość w Manilvie?",
        answer:
          "Tak. Pomagamy wybrać ofertę, organizujemy oglądanie i wspieramy formalności, po polsku i bez prowizji dla kupującego. Zobacz nasze [polskie biuro nieruchomości w Hiszpanii](/polskie-biuro-nieruchomosci-w-hiszpanii).",
      },
    ],
  },
};

export const cityGuide = (slug?: string) => (slug ? CITY_GUIDES[slug] : undefined);
