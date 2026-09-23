# Onesta.com.pl — pełna instrukcja poprawek SEO dla Codexa

Data audytu: 22.09.2026. Domena: https://onesta.com.pl.

Dokument jest samodzielnym poleceniem wdrożeniowym. Wklej całość do Codexa pracującego w repozytorium strony albo dołącz ten plik i poleć wykonanie instrukcji.

## 1. Zadanie i zakres wykonania

Pracujesz nad istniejącą stroną Onesta. Wykonaj opisane poniżej poprawki SEO, zaczynając od sprawdzenia aktualnego kodu i odtworzenia ustaleń. Nie poprzestawaj na kolejnym audycie lub planie. Przygotuj zmiany w kodzie, sprawdź ich działanie i przedstaw wynik do przeglądu.

Główny cel: poprawna dostępność ofert dla wyszukiwarki oraz rozwój stron ofertowych dla Hiszpanii, jej wybrzeży i wybranych miejscowości. Obsłuż język polski oraz istniejącą wersję angielską. Nie zmieniaj marki Onesta na Marshall. Marshallap.com nie jest domeną objętą tym zadaniem.

Zachowaj obecny charakter wizualny strony, działanie formularzy, filtrowania, galerii i analityki. Nowe sekcje dopasuj do obecnych komponentów. Naprawy wspólnych szablonów powinny objąć także Cypr, ale nie rozszerzaj samodzielnie projektu o nowe kraje.

Odczytaj AGENTS.md i instrukcje repozytorium. Nie nadpisuj niezwiązanych zmian użytkownika. Dobierz implementację do zainstalowanej wersji frameworka. Nie migruj całej aplikacji ani nie aktualizuj głównych zależności tylko z powodu tego zadania.

Raport daje zakres prac nad kodem. Publikację produkcyjną wykonaj tylko wtedy, gdy jest osobno autoryzowana w bieżącej sesji. Brak danych analitycznych nie blokuje potwierdzonych napraw technicznych. Nie wymyślaj danych do brakujących elementów treści.

## 2. Punkt wyjścia: dane Ahrefs

Dane pobrano przez AIsa z następujących endpointów:

```text
GET https://api.aisa.one/apis/v1/ahrefs/site-explorer/domain-rating?target=onesta.com.pl&date=2026-09-22
GET https://api.aisa.one/apis/v1/ahrefs/site-explorer/metrics?target=onesta.com.pl&date=2026-09-22
```

| Metryka | Wynik |
|---|---:|
| Domain Rating | 3,7 / 100 |
| Ahrefs Rank | 34 293 014 |
| Frazy organiczne w TOP 100 | 20 |
| Frazy organiczne w TOP 3 | 7 |
| Szacowany miesięczny ruch organiczny | 82 |

Wnioski: profil linków ma niski DR, a zasięg organiczny w bazie Ahrefs jest niewielki. Siedem fraz stanowi 35% wszystkich wykrytych fraz. Nie wiemy, jaka część dotyczy marki. Nie znamy trendu, konwersji ani faktycznej liczby wejść z Google Analytics/Search Console.

Te liczby nie diagnozują błędów H1, canonical, indeksowania czy wydajności. Nie przypisuj im takiego znaczenia. DR nie jest oceną techniczną ani wskaźnikiem Google. Zmiana tytułu nie daje podstaw do obietnicy wzrostu DR.

Nie pobieraj ponownie płatnych danych tylko po to, żeby wykonać instrukcję. Jeśli później trzeba skorzystać z API, używaj AISA_API_KEY ze środowiska, wyłącznie po stronie serwera. Nie wpisuj klucza do kodu, raportu, logów ani zmiennej NEXT_PUBLIC_.

## 3. Charakter dowodów i ograniczenia audytu

Audyt obejmował próbkę publicznych odpowiedzi HTTP, początkowy HTML, metadane, linki, sitemapę i dane inicjalizacyjne Next.js. Nie wykonano pełnego crawla wszystkich ofert, kontroli repozytorium, badania renderowania każdej strony w przeglądarce ani analizy Search Console. Ustalenia dotyczą stanu zaobserwowanego 22.09.2026 i wymagają porównania z aktualnym kodem.

Oznaczenia:

- **A — potwierdzona obserwacja:** bezpośrednio widoczna w pobranej odpowiedzi. Nie oznacza automatycznie potwierdzenia przyczyny w kodzie.
- **B — ryzyko do odtworzenia:** wymaga porównania odpowiedzi serwera, renderowania i konfiguracji aplikacji/cache.
- **C — proponowany rozwój:** rozwiązanie projektowe, nie wynik raportu fraz Ahrefs.

| ID | Status | Obserwacja | Podstawa priorytetu |
|---|---|---|---|
| F01 | A/B | Różne `id` dla tego samego sluga oferty zwróciły dane tej samej nieruchomości; nieistniejące `id` również zwróciło 200 i ofertę. | Poprawność produktu; żadna z metryk Ahrefs tego nie wykazuje. |
| F02 | A | W początkowym HTML katalogu Hiszpanii, katalogu Cypru i próbki ofert brak H1. | Ustalenie HTML; 20 fraz i 82 wejścia wskazują ogólną potrzebę pracy nad widocznością. |
| F03 | A | Metadane katalogu Hiszpanii i próbki ofert są bardzo ogólne. | Ustalenie HTML, nie diagnoza przyczyny 82 wejść. |
| F04 | A | Brak canonical w sprawdzonych katalogach, ofertach, stronie głównej i `/en`; blog ma canonical. | Ustalenie HTML; nie wynika z DR. |
| F05 | A | `/nieruchomosci/hiszpania` oraz `?page=1` są używane w linkowaniu; `?page=2` ma odrębny zestaw ofert w HTML. | Potrzeba spójności adresów przy zachowaniu poprawnej paginacji. |
| F06 | A | Sitemap zawiera stronę główną, blog i artykuły, ale nie katalogi krajów, oferty ani wersje EN. | Rzeczywista luka mapy, nie dowód braku indeksacji. |
| F07 | A/C | Cztery sprawdzone adresy wybrzeży zwracają 404; brak takich linków w sprawdzonym katalogu i sitemapie. | Kandydaci do rozbudowy przy 20 frazach; wolumen zapytań nie został zmierzony. |
| F08 | A | `/abc` ma tytuł, ale brak meta description i H1/H2 w pobranym HTML. | Bezpośrednia obserwacja, niezależna od metryk. |
| F09 | A | Polskie katalogi i sprawdzone polskie artykuły mają `html lang="en"`. | Błąd języka dokumentu i dostępności; nie dowód spadku rankingu. |
| F10 | A | `/en` ma hreflang PL/EN, ale w pobranym HTML polskiej strony głównej brak odpowiedników. Katalog EN nie ma hreflang i zawiera polski moduł konsultacji. | Niespójność wersji językowych. |
| F11 | A/B | Artykuł `nieruchomosci-costa-blanca-old` ma 200, index/follow, self-canonical, dwa H1 i występuje w sitemapie. | Archiwum wymaga decyzji po porównaniu treści. Samo podobieństwo tematu nie dowodzi kanibalizacji. |
| F12 | A | Z archiwalnego artykułu prowadzi link do `/hiszpania?page=1`, który zwraca 404. | Potwierdzony niedziałający link wewnętrzny. |
| F13 | A/B | W próbce zdjęcia nie mają atrybutów width/height; arkusze CSS nie były audytowane. | Sprawdzić rezerwację miejsca. To jeszcze nie dowód wysokiego CLS. |

Rzeczy już działające: robots.txt nie blokuje całej strony, katalog ma linki HTML do ofert i paginacji, strona 2 ma inne oferty niż strona 1, blog ma H1/canonical oraz BlogPosting i BreadcrumbList, losowy nieistniejący adres główny zwraca 404. Zachowaj te elementy; nie zgłaszaj ich jako braków.

## 4. P0 — tożsamość ofert, parametry i cache

To pierwszy etap, przed canonical i sitemapą ofert.

### 4.1. Odtwórz niespójność

Sprawdź kolejno oraz w odwróconej kolejności:

```text
/nieruchomosci/hiszpania/apartament-w-torrevieja?id=MTI-3263-115-10-115
/nieruchomosci/hiszpania/apartament-w-torrevieja?id=MTI-3226-115-10-115
/nieruchomosci/hiszpania/apartament-w-torrevieja?id=SEO-NONEXISTENT-20260922
/nieruchomosci/hiszpania/apartament-w-torrevieja
```

W jednym sprawdzeniu pierwsze trzy odpowiedzi zawierały `external_id=MTI-3226-115-10-115`, cenę 185000 i `beds=1`; również `__NEXT_DATA__.query.id` wskazywało ten sam identyfikator mimo innych parametrów żądania. W innym pobraniu widoczny zestaw danych był inny. To szczególnie uzasadnia kontrolę cache. Nie przesądzaj, czy odpowiada za to aplikacja, hosting, CDN czy pośrednia warstwa pobierania.

Porównaj lokalną wersję produkcyjną, podgląd wdrożenia i publiczny serwer. Sprawdź HTTP, dane inicjalizacyjne i DOM po hydratacji. Kontroluj nagłówki cache, klucze zapytań oraz rzeczywiste rekordy bazy. Nie dodawaj losowych parametrów jako docelowej „naprawy”.

### 4.2. Wymagane zachowanie

1. Prawidłowe `id` wybiera dokładnie właściwy rekord w danym kraju. Nie wybieraj pierwszej oferty z pasującym tytułem.
2. Nieistniejące `id` daje prawdziwe 404. Błąd połączenia z bazą daje odpowiedni błąd serwera, a nie fałszywe 404 ani przypadkową ofertę.
3. Brak `id` przy niejednoznacznym slugu nie może zwracać losowego rekordu. Jeżeli istnieje jednoznaczny historyczny mapping, zastosuj przekierowanie do właściwej oferty; w przeciwnym razie 404 z użytecznymi linkami do katalogu.
4. Nieprawidłowy kraj lub slug przy poprawnym identyfikatorze obsłuż deterministycznie: przekieruj do prawidłowego publicznego adresu tej samej oferty, jeżeli relacja jest jednoznaczna.
5. Cache oferty musi rozróżniać trwałe ID i język. Cache katalogu musi rozróżniać kraj, region, miasto, paginację, sortowanie i wszystkie filtry wpływające na wynik.
6. Metadane, treść, galeria, cena, dane strukturalne i payload formularza muszą pochodzić z tego samego rekordu.
7. Formularz zapytania i zdarzenie analityczne muszą zachować właściwe ID oferty.

Publiczne dane inicjalizacyjne wskazują na Pages Router, trasę `/nieruchomosci/[country]/[title]` i server-side props `propertyFromSupabase`. Potwierdź to w repozytorium. Samo użycie SSR nie jest dowodem poprawnego klucza cache.

**Odbiór:** automatyczny test dwóch ofert o jednakowym slugu i różnych ID; test nieistniejącego ID; test zamiany kolejności żądań; zgodność SSR z DOM i formularzem. Nie wpisuj na sztywno powyższych cen do testów — użyj kontrolowanych rekordów lub bieżących danych testowych.

## 5. P1 — jedna polityka adresów i canonical

Zbuduj wspólne funkcje generowania URL, canonical, breadcrumbs, linków ofert i sitemap. Korzystaj z trwałej tożsamości oferty. W pierwszym wdrożeniu zachowaj istniejący format `?id=...`, jeśli da się go poprawnie obsłużyć; nie wykonuj masowej migracji URL wyłącznie dla estetyki.

Parametr `id` jest częścią tożsamości zasobu. Parametry marketingowe nią nie są. Nie wolno zastosować funkcji „usuń wszystko po znaku zapytania” do wszystkich adresów.

| Rodzaj URL | Docelowe zachowanie |
|---|---|
| Katalog bez filtrów | Self-canonical na adres HTTPS właściwego języka. |
| Katalog `?page=1` | Normalizacja do katalogu bez `page=1`; preferowane trwałe przekierowanie i poprawa linków. Zachowaj inne znaczące parametry. |
| Katalog `?page=2` i kolejne | Self-canonical z numerem strony; nie wskazuj strony pierwszej. |
| Oferta z ID | Canonical zachowuje ID lub wskazuje jednoznaczny nowy adres tej samej oferty, jeśli istnieje kompletna migracja. |
| Parametry UTM/fbclid/gclid | Nie występują w canonical. Nie usuwaj ich przekierowaniem przed zarejestrowaniem atrybucji. |
| Wybrana strona regionu/miasta | Self-canonical; nie canonical do katalogu całej Hiszpanii. |
| Dokładny duplikat strony regionu pod adresem filtra | Jeden adres główny; przekierowanie lub canonical tylko po potwierdzeniu równoważności. |
| Artykuł | Zachowaj istniejący poprawny self-canonical. |
| Wersja EN | Self-canonical na EN, nie na polski odpowiednik. |
| Brakujący zasób | Prawdziwe 404; nie canonical do strony głównej. |

Canonical ma być jeden, absolutny i zgodny z docelowym URL. Sprawdź też nagłówki HTTP, aby nie wprowadzić sprzecznych deklaracji. Wybierz istniejący standard końcowych ukośników, HTTPS i hosta; nie zmieniaj go bez potrzeby.

## 6. P1 — tytuły, opisy i hierarchia nagłówków

Wprowadź wspólne generowanie metadanych dla katalogów i ofert. W Pages Router użyj właściwego mechanizmu `next/head`; w innym routerze rozwiązania zgodnego z zainstalowaną wersją. Nie dodawaj drugiego, konkurencyjnego systemu metadanych.

Docelowo podstawowe metadane i główna treść mają być dostępne w HTML odpowiedzi serwera. Zbuduj tytuł jako jeden tekst, żeby do treści `<title>` nie trafiały dosłowne znaczniki typu `<!-- -->`, zaobserwowane w pobraniu próbki oferty. Sprawdź surowy HTML i rzeczywisty `document.title`, zanim uznasz to za potwierdzony błąd wyświetlania.

### 6.1. Gotowe metadane podstawowych stron

| Strona | Title | H1 |
|---|---|---|
| `/` | Nieruchomości za granicą: Hiszpania i Cypr \| Onesta | Nieruchomości za granicą — Hiszpania i Cypr |
| `/nieruchomosci/hiszpania` | Nieruchomości w Hiszpanii na sprzedaż \| Onesta | Nieruchomości w Hiszpanii na sprzedaż |
| `/nieruchomosci/cypr` | Nieruchomości na Cyprze na sprzedaż \| Onesta | Nieruchomości na Cyprze na sprzedaż |
| `/abc` | Zakup nieruchomości w Hiszpanii — pytania \| Onesta | Pytania i odpowiedzi o zakupie nieruchomości w Hiszpanii |
| `/en` | Property in Spain and Cyprus \| Onesta | Property for sale in Spain and Cyprus |
| `/en/properties/hiszpania` | Property for sale in Spain \| Onesta | Property for sale in Spain |
| `/en/properties/cypr` | Property for sale in Cyprus \| Onesta | Property for sale in Cyprus |

Propozycja strony głównej odzwierciedla widoczną nawigację Hiszpania/Cypr. Zachowaj informacje o pozostałych rzeczywiście obsługiwanych kierunkach w treści. Nie rób z homepage kopii katalogu Hiszpanii.

Opisy:

- `/`: „Poznaj nieruchomości w Hiszpanii i na Cyprze. Onesta pomaga porównać oferty, wybrać lokalizację i przejść przez proces zakupu. Umów konsultację.”
- `/nieruchomosci/hiszpania`: „Przeglądaj apartamenty i domy w Hiszpanii: Costa Blanca, Costa del Sol, Costa Cálida i Almería. Porównaj oferty i skorzystaj z pomocy przy zakupie.”
- `/nieruchomosci/cypr`: „Przeglądaj apartamenty i domy na Cyprze. Porównaj lokalizacje, ceny i parametry ofert. Skorzystaj ze wsparcia Onesta przy wyborze i zakupie.”
- `/abc`: „Planujesz zakup nieruchomości w Hiszpanii? Sprawdź odpowiedzi na pytania o wybór regionu, oglądanie ofert i organizację procesu zakupu.”
- `/en`: „Explore property in Spain and Cyprus. Compare locations and listings with Onesta and get support from property selection through the buying process.”
- `/en/properties/hiszpania`: „Explore apartments and houses for sale in Spain on the Costa Blanca, Costa del Sol, Costa Cálida and Almería coast. Get buying support from Onesta.”
- `/en/properties/cypr`: „Explore apartments and houses for sale in Cyprus. Compare locations, prices and property features, with support from Onesta throughout your purchase.”

Opisy dostosuj, jeśli aktualna oferta nie potwierdza wskazanych typów lub lokalizacji. Długość 50–65 znaków dla tytułu i około 140–160 dla opisu traktuj jako orientację redakcyjną, nie twardy wymóg Google. Nie obcinaj nazw ani zdań w połowie.

### 6.2. Nagłówki

Przyjmij projektową konwencję jednego widocznego H1 w głównej treści. To zasada porządku i dostępności, nie twierdzenie o automatycznej karze za dwa H1.

Na katalogu: H1, krótki wstęp, sekcja ofert, wybór regionów, informacje zakupowe. Nagłówki kart dobierz jako H2/H3 zgodnie z hierarchią sekcji. Nie zmieniaj całych akapitów w H2 tylko po to, aby tekst był większy. Styl zachowaj przez klasy CSS.

Na `/abc`: pytania jako H2, odpowiedzi jako zwykły tekst. W artykułach popraw źle zagnieżdżone nagłówki, literalne `##`, przypadkową numerację i wielkie litery. Zachowaj znaczenie treści i istniejące kotwice lub zapewnij ich kompatybilność.

### 6.3. Oferty

Title generuj z rzeczywistych danych, np. „Apartament w Torrevieja, 49 m² | Onesta”. Gdy oferty pozostają identyczne w tytule, dodaj zwięzłe rozróżnienie lub numer referencyjny; nie twórz kilometrowych tytułów.

Opis: typ + miejscowość + metraż + liczba sypialni + potwierdzona cecha + cena, jeśli stabilnie i poprawnie dostępna. Pomijaj puste wartości. `0` sypialni oznacza potencjalnie studio; nie zmieniaj na jedną sypialnię. Rozróżniaj cenę konkretnego lokalu i cenę „od” dla projektu. Nie obiecuj widoku na morze, licencji, wynajmu ani rentowności na podstawie samego regionu.

Dodaj H1 z nazwą i lokalizacją. Parametry, opis, cena i galeria pozostają spójne z rekordem ustalonym w P0. Zapewnij poprawny język etykiet, liczby mnogie i jednostki.

## 7. P1 — nowe strony czterech wybrzeży

To kandydaci o uzasadnieniu ofertowym. Raport nie potwierdza wolumenu fraz ani braku pozycji na te frazy. Najpierw sprawdź, czy równoważne strony nie istnieją pod innymi adresami. Jeśli istnieją, rozbuduj je zamiast tworzyć duplikaty.

| Docelowy URL | Title | H1 |
|---|---|---|
| `/nieruchomosci/hiszpania/costa-blanca` | Nieruchomości Costa Blanca na sprzedaż \| Onesta | Nieruchomości na Costa Blanca |
| `/nieruchomosci/hiszpania/costa-del-sol` | Nieruchomości Costa del Sol na sprzedaż \| Onesta | Nieruchomości na Costa del Sol |
| `/nieruchomosci/hiszpania/costa-calida` | Nieruchomości Costa Cálida na sprzedaż \| Onesta | Nieruchomości na Costa Cálida |
| `/nieruchomosci/hiszpania/costa-de-almeria` | Nieruchomości Costa de Almería na sprzedaż \| Onesta | Nieruchomości na Costa de Almería |

Meta descriptions:

- Costa Blanca: „Sprawdź apartamenty i domy na Costa Blanca. Porównaj oferty, lokalizacje i parametry nieruchomości. Znajdź miejsce dla siebie z pomocą Onesta.”
- Costa del Sol: „Poznaj nieruchomości na Costa del Sol. Przeglądaj apartamenty i domy, porównuj ceny i lokalizacje oraz skorzystaj ze wsparcia Onesta przy zakupie.”
- Costa Cálida: „Szukasz nieruchomości na Costa Cálida? Zobacz aktualne apartamenty i domy, sprawdź ich parametry i porozmawiaj z Onesta o wyborze lokalizacji.”
- Costa de Almería: „Przeglądaj nieruchomości na Costa de Almería. Porównaj apartamenty, domy i miejscowości oraz zaplanuj kolejne kroki zakupu z zespołem Onesta.”

Nie publikuj strony sugerującej aktywne oferty, jeśli nie ma ich w bazie.

### 7.1. Model danych i routing

Utwórz rejestr regionów z trwałym kluczem, slugiem, nazwą PL/EN, aliasami danych i regułą wyboru ofert. Stosuj identyfikatory regionów lub jawne mapowanie, nie przypadkowy `includes()` na całym opisie oferty.

Uwzględnij warianty akcentów i zapisów, np. Calida/Cálida oraz Almeria/Almería. Nie zakładaj, że marketingowa nazwa wybrzeża i podział administracyjny są tożsame. Zweryfikuj przypisania miejscowości na podstawie wiarygodnych źródeł i bazy; import może zawierać błędy.

Nowy adres regionu zajmuje taki sam poziom jak obecna dynamiczna trasa oferty. Nie twórz konkurencyjnych plików `[title]` i `[region]` dla tej samej struktury URL. Rozwiąż to przez dopasowany do repozytorium rejestr rozpoznawanych slugów lub trasy statyczne. Oferta z ID i strona regionu muszą mieć jednoznaczne rozstrzygnięcie.

### 7.2. Zawartość strony regionu

1. Breadcrumbs: strona główna → Hiszpania → region.
2. H1, krótki konkretny wstęp oraz widoczne aktualne oferty.
3. Filtry zachowujące kontekst regionu i paginację z linkami HTML.
4. „Miejscowości na [wybrzeżu]” — linki do gotowych podstron, bez linków do 404.
5. „Jak wybrać lokalizację?” — opis różnic przydatnych kupującemu, oparty na zweryfikowanych informacjach.
6. „Co sprawdzić przed zakupem?” — odnośniki do istniejących poradników, bez kopiowania ich w całości.
7. Kilka pytań właściwych dla regionu, jeśli można udzielić rzeczowych odpowiedzi.
8. CTA do konsultacji przekazujące region w formularzu, bez wysyłania danych podczas testów.

Treść ma być odrębna merytorycznie. Nie generuj czterech identycznych tekstów z podmienioną nazwą. Nie narzucaj minimalnej liczby słów jako celu SEO. Przy braku danych przygotuj redakcyjny szkic oznaczony jako nieopublikowany; wykonaj pozostałą część wdrożenia.

## 8. P2 — miejscowości i podkategorie

Zbuduj możliwość obsługi miejscowości, ale publikuj tylko wybrane, mające rzeczywiste oferty i użyteczną odrębną treść. Nie generuj automatycznie wszystkich kombinacji miasto × typ × liczba sypialni × cena.

Proponowany schemat: `/nieruchomosci/hiszpania/{region}/{miasto}`. Wykorzystaj istniejący schemat, jeżeli równoważne strony już działają.

Lista kandydatów do sprawdzenia w bazie: Torrevieja, Guardamar del Segura, San Miguel de Salinas, Estepona, Mijas, Fuengirola, Los Alcázares, San Pedro del Pinatar, Vera, Pulpí. Obecność ofert tych miejscowości zaobserwowano w próbce katalogu. Nie jest to ranking potencjału wyszukiwania ani gotowe przypisanie regionów.

Na początek wybierz do sześciu miejscowości z trwałą podażą ofert i możliwością przygotowania rzeczowego opisu. Jeżeli GSC lub raport fraz są dostępne, wykorzystaj je do kolejności; jeśli nie, jawnie nazwij wybór pilotażem według podaży.

Wzorce:

- Title: „Nieruchomości w {miejscowość}: domy i apartamenty | Onesta” — dopasuj do realnych typów.
- H1: „Nieruchomości w {miejscowość} na sprzedaż”.
- Opis: odrębny, opisujący lokalizację, dostępne typy i wsparcie przy zakupie.
- Canonical: do własnego adresu miasta.
- Breadcrumbs: Hiszpania → region → miasto.

Jeśli oferta nie uzasadnia osobnej kategorii „apartamenty” lub „wille”, pozostaw filtr. Budżety, „nad morzem”, „nowe budownictwo” i „pod wynajem” to kolejne hipotezy do analizy, nie potwierdzone brakujące frazy. Warunek odległości od morza musi pochodzić z danych, nie z ogólnego położenia miasta.

## 9. P1 — sitemap i robots

Rozszerz generowanie sitemap o kanoniczne strony krajów, regionów, zatwierdzonych miast, publiczne aktywne oferty i istniejące poprawne wersje językowe. Źródło danych sitemap i katalogu powinno być spójne. Nie limituj mapy do pierwszej porcji wyników pobranej z bazy.

W mapie nie umieszczaj stron z noindex, błędów, przekierowań, wyników dowolnych kombinacji filtrów, trackingów ani archiwów przeznaczonych do przekierowania. Paginację można pozostawić dostępną przez linkowanie, bez umieszczania każdej strony w sitemapie.

Przy dużej liczbie ofert zastosuj sitemap index i podział, jeśli jest potrzebny. Zachowaj limity protokołu 50 000 URL i 50 MB nieskompresowanego XML na plik. Używaj rzeczywistej daty istotnej aktualizacji dla lastmod; jeśli jej nie ma, pomiń pole. Nie wstawiaj aktualnej daty na każdym żądaniu. `priority` i `changefreq` nie zastępują poprawnych adresów i nie są sposobem na wymuszenie indeksowania.

Koduj parametry adresów i znaki XML poprawnie, szczególnie `&` oraz identyfikatory zawierające `/`. Sprawdź wszystkie generowane adresy na poziomie generatora oraz reprezentatywną próbkę HTTP.

Zachowaj dostęp do zasobów potrzebnych do renderowania. Nie blokuj globalnie query string, ponieważ zawiera ID ofert i paginację. Nie łącz blokady robots.txt z oczekiwaniem, że Google odczyta noindex z zablokowanej strony.

## 10. P1 — paginacja i filtry

Nie zastępuj działających linków paginacji przyciskami wymagającymi JavaScript. Jeśli zachowujesz infinite scroll lub „wczytaj więcej”, zapewnij równoległe działające adresy stron wyników.

Każda strona wyników ma odpowiadające jej rekordy w HTML i self-canonical. Parametry `page=0`, ujemne, nieliczbowe i poza zakresem obsłuż konsekwentnie: nieprawidłowe wartości normalizuj tylko tam, gdzie znaczenie jest jasne; nieistniejące strony poza zakresem zwracają 404. Nie pokazuj zawsze pierwszej lub ostatniej strony z kodem 200.

Paginacja musi zachowywać region, miasto i filtry. Przy zmianie filtra resetuj numer strony w sposób zgodny z UX. Zapewnij stabilną kolejność rekordów z rozstrzygnięciem remisów, aby kolejne strony nie gubiły ofert przy jednakowej cenie.

Polityka indeksowania:

- zatwierdzone strony krajów/regionów/miast: index, follow;
- zwykła paginacja katalogów: dostępna do indeksowania;
- dowolne kombinacje wyszukiwania i filtrów bez osobnej strony SEO: domyślnie noindex, follow i brak w sitemapie;
- poprawne wyniki bez duplikatu: nie wymuszaj canonical do nieodpowiadającej im treści; dla noindex dopuszczalne pominięcie canonical lub spójny self-canonical;
- dokładna kopia zatwierdzonej strony SEO pod filtrem: jednoznaczna normalizacja do tej strony;
- arbitralne puste lub niepoprawne kombinacje URL: właściwa obsługa 404 z użytecznym widokiem;
- istniejąca wartościowa strona regionu z przejściowo zerową liczbą ofert może pozostać 200, jeśli ma użyteczną treść i jasno komunikuje brak ofert; nie udawaj wyników z innego regionu.

Nie przedstawiaj noindex jako sposobu na natychmiastowe ograniczenie crawlowania. Ewentualne bardziej restrykcyjne reguły robots wprowadź dopiero na podstawie rzeczywistej przestrzeni URL i stanu indeksu. Podstawowa dostępność ofert ma pochodzić z indeksowalnych katalogów, linków i sitemap.

## 11. P1 — języki, hreflang i wersja angielska

Popraw `html lang` po stronie serwera: `pl` dla polskiej treści i `en` dla angielskiej. Nie polegaj wyłącznie na zmianie atrybutu po hydratacji.

Zbuduj mapowanie rzeczywistych odpowiedników PL/EN. Dodaj wzajemne hreflang na każdej parze, wskazanie samej strony oraz self-canonical dla każdej wersji. Stosuj `pl` i `en`; nie ograniczaj angielskiego do Wielkiej Brytanii, skoro strona jest dla międzynarodowych kupujących. `x-default` jest opcjonalne i wymaga sensownej strony domyślnej, nie dodawaj go mechanicznie.

Oferty łącz po trwałym ID, nie po tytule. Artykuł bez tłumaczenia nie powinien mieć hreflang prowadzącego do ogólnej strony `/en`. Przełącznik języka powinien zachowywać właściwą stronę i kontekst tam, gdzie istnieje odpowiednik.

Napraw polskie fragmenty formularza konsultacji w katalogu EN: tytuł, pola, komunikaty, walidację i potwierdzenie. Zachowaj znaczenie zgód i dotychczasowe mechanizmy ich zbierania. Nie zmieniaj polityki zgód przy okazji SEO.

Nie zmieniaj istniejącego `/en/properties/hiszpania` na `/spain` tylko ze względów estetycznych. Taka migracja wymagałaby osobnej mapy przekierowań i aktualizacji wszystkich sygnałów. Nowe odpowiedniki regionów mogą zachować te same slugi regionów, np. `/en/properties/hiszpania/costa-blanca`.

Wersję EN nowej strony publikuj, gdy ma pełną treść i poprawne interfejsy. Nie twórz pustych odpowiedników wyłącznie dla hreflang.

## 12. P2 — blog, archiwum, FAQ i linkowanie

### 12.1. Nie twórz ponownie istniejących poradników

Istnieją już materiały o procesie zakupu, kosztach zakupu, Costa Blanca, Torrevieja i wynajmie. Rozbuduj strukturę wokół istniejących adresów. Nie zakładaj, że temat jest „nieobsługiwany”, bo nie ma go w czterech metrykach Ahrefs.

Sprawdź i nadaj odrębny cel następującym adresom:

| URL | Docelowa rola |
|---|---|
| `/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces` | Główny poradnik procesu zakupu. |
| `/blog/jak-kupic-nieruchomosc-w-hiszpanii` | Ustalenie potrzeb i kryteriów wyboru. |
| `/blog/jak-kupic-nieruchomosc-w-hiszpanii-pigulka` | Krótka checklista, tylko jeśli ma odrębną wartość. |
| `/blog/koszty-zakupu-nieruchomosci-hiszpania-costa-blanca` | Koszty; nie zmieniaj URL bez potrzeby. |
| `/blog/nieruchomosci-costa-blanca` | Poradnik regionalny wspierający katalog wybrzeża. |
| `/blog/torrevieja-apartamenty-na-sprzedaz` | Poradnik o miejscowości, połączony z katalogiem miasta. |

Zbliżone słownictwo nie jest dowodem kanibalizacji. Nie łącz automatycznie wszystkich artykułów z frazą „jak kupić”. Jeśli teksty faktycznie powielają tę samą odpowiedź, przenieś wartościowe fragmenty do najlepszego adresu, ustaw jednostopniowe przekierowanie, popraw linki i sitemapę. Przy niejasnym wyborze adresu docelowego wykorzystaj GSC, jeśli dostępne; zachowaj strony, gdy nie ma podstaw do połączenia.

### 12.2. Archiwum Costa Blanca

Porównaj `/blog/nieruchomosci-costa-blanca-old` z aktualnym poradnikiem. Jeśli to zastąpiona wersja, przenieś brakujące przydatne fragmenty, ustaw 301/308 do właściwego poradnika, usuń archiwum z sitemap i listy artykułów oraz popraw linki. Jeśli ma cel archiwalny i musi pozostać, jasno go oznacz; zdecyduj o noindex na podstawie wartości strony, nie samego sufiksu `old`. Usuń przypadkowy drugi H1.

### 12.3. Linki do starego katalogu

Znajdź odwołania do `/hiszpania?page=1` w repozytorium i treściach CMS. Zamień na aktualny katalog. Dodaj dokładne przekierowanie historycznej ścieżki `/hiszpania` do `/nieruchomosci/hiszpania`, zachowując znaczące parametry, jeśli potwierdzisz, że była to ta sama funkcja. Nie dodawaj ogólnego przekierowania wszystkich 404 do homepage.

### 12.4. Docelowe linkowanie

- Homepage → katalogi krajów; sekcja Hiszpanii → cztery gotowe wybrzeża.
- Hiszpania → regiony → wybrane miasta → oferty.
- Oferta → właściwe miasto i region, o ile strony istnieją.
- Poradnik regionalny → odpowiedni katalog; katalog → pomocny poradnik.
- Poradnik procesu → poradnik kosztów i katalog ofert.
- Breadcrumbs jako działające linki HTML.

Wszystkie linki kieruj od razu do końcowych adresów. Nie dodawaj wielkiej stopki z setkami identycznych fraz. Nie usuwaj istniejących działających linków podczas przebudowy.

### 12.5. Treści i wiarygodność

Popraw błędy językowe, polskie znaki, przypadkowe etykiety angielskie w PL i odwrotnie. Twierdzenia o podatkach, licencjach, prawie, gwarantowanych zyskach i stopach zwrotu wymagają aktualnego źródła oraz daty. Jeśli ich nie da się zweryfikować, zgłoś konkretny fragment do redakcji; nie dopisuj liczb z pamięci.

Nie twórz fikcyjnych opinii, realizacji ani doświadczenia. Osobę autora, datę publikacji i aktualizacji pokaż zgodnie z rzeczywistością. Blog ma już dane strukturalne — poprawiaj je, nie dodawaj zdublowanego drugiego zestawu.

## 13. P2 — dane strukturalne

Zachowaj istniejące BlogPosting i BreadcrumbList na blogu. Dodaj lub uzupełnij dane organizacji i breadcrumbs na katalogach/regionach/ofertach, jeśli ich brakuje po sprawdzeniu całej odpowiedzi i DOM.

Wszystkie wartości muszą odpowiadać widocznej treści i istniejącym danym. Adresy firmy, logo, dane kontaktowe i profile społecznościowe pobierz z aktualnego źródła projektu. Używaj stabilnych identyfikatorów `@id` dla organizacji.

Oferty nieruchomości oznaczaj semantycznie tylko po sprawdzeniu właściwych typów i pól schema.org. Nie dodawaj Product, AggregateRating, ocen ani statusu dostępności tylko w nadziei na rozszerzony wynik. Brak dedykowanego rich result dla danego typu nie oznacza błędu strony. FAQ ma przede wszystkim pomagać użytkownikowi; nie obiecuj widocznych rozwinięć FAQ w Google.

JSON-LD generuj przez poprawną serializację, zabezpieczając osadzanie danych w HTML. Sprawdź zgodność `url`, breadcrumbs i canonical. Nie publikuj w JSON-LD niepublicznych pól bazy.

## 14. P2 — wydajność i dostępność treści

W tym audycie nie zmierzono Core Web Vitals ani Lighthouse. Nie pisz, że strona nie spełnia progów. Wykonaj pomiar przed zmianami na homepage, katalogu i ofercie; porównaj z pomiarem po zmianach w tych samych warunkach.

Sprawdź:

- czy zdjęcia rezerwują miejsce przez width/height, aspect-ratio albo poprawny kontener; brak samych atrybutów nie dowodzi skakania układu;
- czy główne zdjęcie/LCP nie jest niepotrzebnie ładowane leniwie;
- czy pozostałe zdjęcia galerii są odpowiednio opóźniane i mają rozsądne rozmiary;
- czy warianty responsywne pasują do szerokości wyświetlania;
- czy nowe treści SEO nie powodują nadmiernego payloadu lub pobierania wszystkich ofert naraz;
- czy filtry pozostają responsywne, a formularz nie przestaje działać po zmianach SSR;
- czy kluczowa treść jest dostępna bez kliknięcia i bez interakcji uruchamiającej pobieranie;
- czy zamknięte modale nie dominują struktury dokumentu ani nie wchodzą w nawigację klawiaturą.

Nie przebudowuj istniejącego dostawcy obrazów ani analityki bez wykazanego problemu. Nie usuwaj narzędzi pomiarowych, aby sztucznie poprawić wynik Lighthouse. Obrazy dekoracyjne mogą mieć pusty alt; opisowe powinny mieć naturalny opis, bez upychania fraz.

## 15. Wymagania implementacyjne

Najpierw rozpoznaj źródła danych i wspólne komponenty. Publiczne dane wskazują na Next.js, katalogi renderowane serwerowo, oferty z server-side props oraz artykuły generowane statycznie. Nazwy plików poniżej są logicznymi rolami, nie założeniem o istniejącej strukturze repozytorium:

- wspólny generator publicznego URL i canonical;
- generator metadanych katalogów/ofert;
- rejestr krajów, wybrzeży i wybranych miast;
- wspólny moduł filtrów i pobierania ofert;
- breadcrumbs;
- mapa odpowiedników językowych;
- generator sitemap;
- testy zachowania routingu i metadanych.

Nie duplikuj logiki pobierania dla każdej strony regionu. Wykorzystaj istniejące zapytania i model danych; parametryzuj zakres. Nie opieraj pobierania na parsowaniu marketingowego tytułu. Nie modyfikuj produkcyjnych rekordów przy okazji testów. Ewentualne migracje bazy przygotuj jawnie, z uzasadnieniem i zgodnie z procesem projektu.

Dobierz indeksy bazy i cache tylko, gdy analiza zapytań wskazuje potrzebę. Sitemap nie powinna generować tysięcy pojedynczych zapytań do oferty. Waliduj zewnętrzne parametry, dopuszczalne sortowania, paginację i identyfikatory.

Przy brakujących danych do jednego regionu nie zatrzymuj całego wdrożenia. Zakończ pozostałe zadania, a brakujący fragment opisz precyzyjnie w raporcie końcowym.

## 16. Kolejność prac

1. Sprawdź repozytorium i odtwórz P0: ID, cache, treść i formularz oferty.
2. Napraw tożsamość ofert i statusy HTTP, zanim wygenerujesz mapę ich adresów.
3. Wprowadź wspólne URL/canonical oraz popraw lang i podstawowe metadane.
4. Popraw nagłówki katalogów i ofert oraz stary niedziałający link.
5. Dodaj strony czterech regionów, dopasowane dane i linkowanie.
6. Uzupełnij sitemap, paginację, politykę filtrów oraz odpowiedniki językowe.
7. Wykonaj uzasadnione poprawki bloga, `/abc` i archiwum.
8. Dodaj gotowe podstrony miast z pilotażu; resztę oznacz jako wymagającą treści/danych.
9. Zweryfikuj schema, wygląd, wydajność i brak regresji formularzy.
10. Oddaj kod, listę zmian i wyniki weryfikacji. Nie ogłaszaj wzrostu SEO przed pomiarem po wdrożeniu.

## 17. Kryteria odbioru i testy

Wykorzystaj istniejący zestaw testów i dodaj testy tylko dla rzeczywistych ryzyk: rozpoznawania ofert, routingu, normalizacji adresów, filtrów i metadanych. Nie twórz testów sprawdzających jedynie, czy tekst w pliku jest równy temu samemu tekstowi wpisanemu w teście.

| Test | Warunek zaliczenia |
|---|---|
| Dwa ID, jeden slug | Dwie różne oferty, poprawne dane SSR/DOM i formularza. |
| Nieistniejące ID | 404; żadnej przypadkowej oferty. |
| Cache | Wynik nie zależy od tego, którą ofertę wywołano wcześniej. |
| Brak ID | Jednoznaczne przekierowanie historyczne albo 404, bez losowego fallbacku. |
| Metadane | Jeden title, jeden description i właściwy canonical dla testowanych stron indeksowalnych. |
| Nagłówki | Jeden główny H1 zgodnie z konwencją projektu; logiczne H2/H3. |
| Język | Prawidłowy lang w odpowiedzi serwera PL/EN. |
| Canonical oferty | Zachowuje tożsamość konkretnego rekordu. |
| Tracking | Brak trackingów w canonical; atrybucja kampanii nadal działa. |
| Paginacja | Strony 1 i 2 mają właściwe, różne rekordy i odrębne canonical. |
| Filtry | Parametry pozostają w nawigacji; zmiana filtra nie daje przypadkowo pustej strony przez stary numer. |
| Region | Widoczne wyłącznie oferty przypisane do tego regionu, również na dalszych stronach. |
| Miasto | Właściwa miejscowość i region; nie dopasowanie po fragmencie nazwy w opisie. |
| Routing | Slug regionu nie przechwytuje adresów ofert i odwrotnie. |
| Nieistniejąca paginacja | 404 zamiast kopii poprawnej strony z kodem 200. |
| Sitemap | Poprawny XML, pełny zakres danych, brak noindex/404/redirectów/trackingów. |
| Lastmod | Daty odpowiadają rzeczywistym aktualizacjom albo pole jest pominięte. |
| Hreflang | Wzajemne istniejące odpowiedniki; każda wersja ma własny canonical. |
| Przekierowania | Brak pętli i łańcuchów, prawidłowe parametry i docelowy zasób. |
| Blog | Istniejące działające canonical i schema zachowane; brak przypadkowych zmian URL. |
| Formularze | Walidacja, zgody, ID oferty i kontekst regionu działają; testy z mockiem bez wysyłania prawdziwych leadów. |
| Analityka | Brak podwójnych zdarzeń i utraty istniejących identyfikatorów po hydratacji. |
| Wygląd | Kontrola mobile i desktop: homepage, katalog, region, oferta, blog, FAQ. |
| Błędy aplikacji | Build i wymagane kontrole projektu przechodzą; brak nowych błędów hydratacji. |

Do testów użyj co najmniej: dwóch ofert o jednakowym slugu, oferty z ID zawierającym znak specjalny, regionu z wieloma stronami wyników, regionu z małą liczbą ofert, wersji EN, brakującego zasobu i starego URL.

Przeprowadź weryfikację zewnętrznego zachowania, nie tylko funkcji pomocniczych. Gdy usługa testowa lub dostęp do bazy jest niedostępny, podaj dokładnie, który test nie został wykonany. Nie wpisuj „wszystko działa” na podstawie samego builda.

## 18. Co oddać po wykonaniu

Przygotuj zwięzłą odpowiedź oraz dokumentację w repozytorium zgodną z jego zwyczajami:

1. Lista wykonanych zmian z przypisaniem do F01–F13 i plików.
2. Tabela URL → title → H1 → canonical → robots → język dla zmienionych typów stron.
3. Lista nowych stron i stron pozostawionych jako szkice wraz z konkretnym powodem.
4. Mapa przekierowań stary URL → nowy URL → status.
5. Wyniki builda i testów, wraz z ograniczeniami.
6. Zestawienie pomiarów wydajności przed/po, jeśli wykonano porównywalne pomiary.
7. Krótka instrukcja kontroli po publikacji: sitemap, przykładowe URL w Search Console, błędy indeksowania i dane organiczne.

Nie ukrywaj zadań warunkowych jako wykonanych. Odróżnij „zmiana gotowa w kodzie”, „działa na podglądzie” i „opublikowana produkcyjnie”.

## 19. Jak mierzyć efekt po publikacji

Jeśli Search Console jest dostępne, zachowaj punkt odniesienia z ostatnich 28 dni i poprzednich 28 dni: kliknięcia, wyświetlenia, CTR i pozycje dla katalogów, ofert, regionów oraz zapytań brandowych i pozostałych. Nie porównuj wzrostu samej średniej pozycji bez uwzględnienia nowych fraz.

Kontrola techniczna następuje zaraz po publikacji. Po około 2–4 tygodniach sprawdź odkrywanie i indeksowanie nowych adresów; po 6–12 tygodniach pierwsze zmiany widoczności, uwzględniając sezonowość i wielkość próbki. To terminy kontroli, nie gwarancja efektu.

Podstawowe KPI: liczba poprawnie indeksowanych stron ofertowych, wyświetlenia i kliknięcia na zapytania niezawierające marki, ruch na nowych stronach regionów oraz jakościowe zapytania klientów. DR traktuj osobno jako sygnał profilu linków. Raport nie zawiera planu kupowania linków ani gwarancji wzrostu ruchu.

## 20. Źródła i adresy kontrolne

Ustalenia o stronie pochodzą z bezpośrednich pobrań HTTP/HTML wskazanych adresów, a liczby z odpowiedzi API AIsa/Ahrefs z 22.09.2026. Nie są to dane z Search Console.

Adresy kontrolne:

- https://onesta.com.pl/
- https://onesta.com.pl/nieruchomosci/hiszpania
- https://onesta.com.pl/nieruchomosci/hiszpania?page=1
- https://onesta.com.pl/nieruchomosci/hiszpania?page=2
- https://onesta.com.pl/nieruchomosci/cypr
- https://onesta.com.pl/en
- https://onesta.com.pl/en/properties/hiszpania
- https://onesta.com.pl/abc
- https://onesta.com.pl/blog
- https://onesta.com.pl/blog/nieruchomosci-costa-blanca
- https://onesta.com.pl/blog/nieruchomosci-costa-blanca-old
- https://onesta.com.pl/robots.txt
- https://onesta.com.pl/sitemap.xml
- Oferty i pozostałe artykuły: adresy podane w odpowiednich sekcjach.

Dokumentacja odniesienia dla reguł technicznych:

- Ahrefs — znaczenie metryk: https://docs.ahrefs.com/en/api/reference/site-explorer/get-metrics
- AIsa — endpointy Ahrefs: https://aisa.one/api/ahrefs
- Google — title: https://developers.google.com/search/docs/appearance/title-link
- Google — opisy wyników: https://developers.google.com/search/docs/appearance/snippet
- Google — canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google — paginacja: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Google — filtry: https://developers.google.com/crawling/docs/faceted-navigation
- Google — sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google — wersje językowe: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google — renderowanie JavaScript: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google — robots meta: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google — dane strukturalne: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google — Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals

Instrukcje wykonawcze w tym dokumencie są projektem dla Onesta, a nie cytatem ani listą gwarantowanych czynników rankingowych Google. W razie zmiany strony lub dokumentacji kieruj się aktualnym, sprawdzonym stanem i zapisz istotną różnicę w raporcie wdrożenia.
