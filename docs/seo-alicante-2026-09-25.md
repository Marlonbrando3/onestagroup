# Alicante — treść i nawigacja po miejscowościach

Data: 25.09.2026. Strona: `/nieruchomosci/hiszpania/costa-blanca/alicante`.

## Materiał wejściowy

CSV użytkownika `nieruchomosci_alicante.csv`: 87 fraz z Google Keyword Planner, okres 1.09.2025–31.08.2026, UTF-16 i separator tabulatorowy. Nie sumowano podobnych wariantów jako odrębnego popytu ani nie utożsamiano konkurencji reklamowej z trudnością SEO.

Treść obsługuje dwie intencje: zakup w mieście Alicante oraz wybór miejscowości w prowincji. Lista 23 lokalizacji pochodzi ze screena użytkownika. Oferta nad treścią nadal dotyczy miasta; katalog nie został rozszerzony na całą prowincję.

| Grupa słów z CSV | Sekcja |
| --- | --- |
| nieruchomości Alicante; nieruchomości Hiszpania Alicante; nieruchomości w Alicante na sprzedaż | H1, wstęp, rozróżnienie miasta i prowincji, FAQ |
| Alicante mieszkania na sprzedaż; apartamenty na sprzedaż Alicante; mieszkanie w Alicante | Mieszkania i apartamenty, opis części miasta |
| Alicante mieszkanie na sprzedaż widok na morze; Alicante mieszkanie nad morzem | Osobna sekcja o widoku, położeniu i dojściu do plaży |
| Alicante domy na sprzedaż; domy z basenem; domy wakacyjne; luksusowe nieruchomości | Domy, basen, ogród, prywatność i kryteria oceny standardu |
| nowe mieszkania Alicante; nieruchomości Alicante do remontu | Porównanie rynku pierwotnego i wtórnego |
| tanie mieszkania w Alicante; tanie domy w Alicante; ceny mieszkań i nieruchomości | Ceny, kompromisy lokalizacyjne i pełny budżet |
| polskie biura nieruchomości w Alicante; biuro nieruchomości Alicante | Obsługa po polsku; bez deklaracji niepotwierdzonej siedziby |
| wynajem mieszkania Alicante; domy na wynajem; wynajem długoterminowy | Zakup pod wynajem i FAQ wyjaśniające sprzedażowy charakter katalogu |

Frazy „morizon alicante” i potencjalnie nawigacyjne zapytania o cudze marki nie stanowią nagłówków Onesty. Warianty „sprzedam” nie zmieniają strony kupującego w ofertę usług dla sprzedających. Warianty bez polskich znaków zastępuje naturalna polszczyzna.

## Przegląd konkurencji i źródła lokalizacyjne

- [Alicante Costa](https://alicantecosta.com/pl/): obejmuje wiele miejscowości prowincji; inspiracja do rozdzielenia miasta od szerszego obszaru poszukiwań.
- [Idealista — prowincja Alicante](https://www.idealista.com/pl/venta-viviendas/alicante/): jawnie określa zakres prowincji. W Onesta analogicznie wyjaśniono zakres listy ofert i rolę nawigacji lokalizacyjnej.
- [Costa Royal](https://costaroyal.pl/): nacisk na apartamenty, wille, standard premium i obsługę po polsku. Własna treść Onesty rozwija praktyczne kryteria wyboru oraz poszczególne miejscowości.
- [Costa Blanca — wybrzeże](https://www.costablanca.org/es/discover/seaside/beaches): orientacja północ–południe, plaże i miejscowości.
- [Comunitat Valenciana — trasa przez Costa Blanca](https://www.comunitatvalenciana.com/va/itineraris/costa-blanca-que-veure): główne lokalizacje prowincji.
- [Rojales — Ciudad Quesada](https://www.rojales.es/turismo/): urbanizacja w gminie Rojales.
- [Comunitat Valenciana — Postiguet](https://www.comunitatvalenciana.com/es/alacant-alicante/alacant-alicante/playas/playa-del-postiguet): plaża miejska Alicante.
- [Wybrzeże Walencji](https://www.comunitatvalenciana.com/es/itinerarios/ruta-costa-valencia), [Oliva](https://www.comunitatvalenciana.com/es/valencia/oliva): Gandía i Oliva poza prowincją Alicante.
- [Murcja](https://www.turismodemurcia.es/es/acerca-de-murcia), [San Pedro del Pinatar](https://www.turismoregiondemurcia.es/es/san_pedro_del_pinatar/): odrębny region, rozróżnienie miasta w głębi lądu i miejscowości nadmorskiej.

Opisy i pytania są własną treścią redakcyjną, bez kopiowania tekstów konkurencji, stałych widełek cenowych ani prognoz rentowności.

## Implementacja i linkowanie

- Dodano Alicante do `SEO_CITIES`: istniejący routing obsługuje od razu PL/EN, metadane, breadcrumbs, menu i sitemapę. Filtr miasta używa `town = Alicante` wraz z zakresem prowincji regionu.
- `AlicanteCatalogContent`: treść pod ofertami po polsku, 11 sekcji H2, 6 odpowiedzi FAQ w HTML serwera, istniejący formularz konsultacji.
- 19 kafelków lokalizacji w prowincji, w tym Alicante odsyłające do ofert powyżej. Osobna grupa 4 kierunków sąsiednich: Gandía, Oliva, Murcja i San Pedro del Pinatar.
- Linki używają opublikowanych stron miast, a dla pozostałych lokalizacji istniejących wyników wyszukiwania. Nie utworzono masowo nowych stron SEO. Przy kolejnych publikacjach stron miast wspólny helper nawigacji może zastąpić linki pojedynczych filtrów ich adresami.
- Gandía nie miała publicznych ofert podczas kontroli: kafelek „Zapytaj o oferty” prowadzi do sekcji kontaktowej. Nie prowadzi do filtra zwracającego 404.
- Oliva miała publiczną ofertę, ale brakowało jej w słowniku wyszukiwarki. Dodano identyfikator `oliva` bez przypisania do Costa Blanca.
- Dla Benissy, Ciudad Quesada, Elche, Jávei i Villajoyosy kafelki łączą wskazane, istniejące wpisy słownika lokalizacji.
- Kontekstowy link „nieruchomości w Hiszpanii” prowadzi bezpośrednio do `/nieruchomosci/hiszpania`; dodatkowo są odnośniki do Costa Blanca, kosztów zakupu i zarządzania.

## Kontrola typów

`tsc --noEmit --incremental false` nadal zgłasza 10 wcześniejszych błędów typowania pól zapytania w `lib/catalogRouting.ts`, linie 214–224. Nie zgłasza błędów nowych komponentów i danych Alicante. Nie zmieniano niezwiązanej logiki typowania zapytań.

## Weryfikacja lokalna

- 16 testów istniejącego zestawu katalogów przeszło, w tym nowy test izolacji Alicante: dopuszcza rekord miasta, wyklucza inne miasta tej samej prowincji i rekord o nazwie Alicante z niewłaściwej prowincji. Sprawdzono PL i EN.
- Strona zwraca HTTP 200 i ma treść pod ofertami w początkowym HTML, jeden H1, canonical miasta oraz `index, follow`.
- Wszystkie 21 odnośników kafelków do katalogów zwróciło 200 i niepuste listy właściwych miejscowości. Pozostałe dwa kafelki prowadzą do istniejących kotwic ofert Alicante i kontaktu.
- Chrome: 1440 px i 390 px; obejrzano zrzuty kafelków, brak poziomego przepełnienia i błędów JavaScript. FAQ rozwija odpowiedź, CTA otwiera konsultację. Nie wysyłano formularzy.
- Polski komponent nie pojawia się na EN ani przy filtrze sypialni; strona Torrevieja zachowuje swój komponent.
- `git diff --check`: bez błędów. Zmiany lokalne, bez publikacji produkcyjnej.
