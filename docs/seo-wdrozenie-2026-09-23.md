# Wdrożenie SEO Onesta — 23.09.2026

Status: zmiany w lokalnym kodzie, zbudowane i przetestowane jako wersja produkcyjna Next.js 16.2.1 / Pages Router. Nie opublikowano ich na produkcji ani na zdalnym preview. Nie zmieniano rekordów produkcyjnej bazy, nie wysyłano leadów i nie pobierano płatnych danych Ahrefs. Zastane, niezwiązane pliki robocze pozostały bez zmian.

## F01–F13 i pliki

| ID | Wykonanie | Główne pliki |
|---|---|---|
| F01 | Odczyt wyłącznie po dokładnym `external_id`; brak ID/rekordu → 404; błędy bazy → błąd serwera; błędny kraj/slug → 308 do tej samej oferty. Wyłączony cache współdzielony, także nagłówkiem Netlify. Formularze i zdarzenie konwersji otrzymują ID rekordu. Stan formularza, opisów i galerii resetuje się przy zmianie ID lub języka. | `pages/nieruchomosci/[country]/[title]/index.tsx`, `lib/publicSeo.ts`, formularze `components/SearchEngine/`, `analitycs/googleAdsConversion.ts` |
| F02 | Widoczny H1 w HTML katalogów i ofert, H2 sekcji ofert, H3 kart; usunięty drugi, niepełny zestaw breadcrumbs. | oba szablony katalogu/oferty, `SearchComponentsList.tsx`, `PropertyCard.tsx`, `SeoBreadcrumbs.tsx` |
| F03 | Metadane katalogów i ofert na serwerze; pojedynczy tekst title; metraż i rzeczywiste parametry, zachowane 0 sypialni; numer referencyjny rozróżnia oferty. | `lib/publicSeo.ts`, `components/SeoHead.js` |
| F04 | Jeden absolutny canonical, także homepage PL/EN. ID pozostaje w canonical oferty, tracking jest pomijany. Breadcrumbs i sitemap korzystają z tych samych URL. | `lib/publicSeo.ts`, `SeoHead.js`, strony główne |
| F05 | `page=1` → 308 bez tego parametru, z zachowaniem pozostałych parametrów. Strony ≥2 mają własny canonical. Niepoprawna i nieistniejąca paginacja → 404, również odpowiedź 416/PGRST103 z Supabase. | szablon katalogu, `Pagination.tsx`, `MainSearchInSearchEngine.tsx`, `SearchResults.tsx` |
| F06 | Pełna sitemap PL/EN, kraje, regiony, zatwierdzone miasta, oferty, blog i FAQ. Partie bazy po 1000 rekordów; wsparcie indeksu powyżej 45 000 URL. Bez sztucznego lastmod importowanych ofert. | `lib/publicSitemap.ts`, `lib/publicListings.ts`, `pages/sitemap.xml.js`, `pages/sitemaps/[part].tsx` |
| F07 | Cztery regiony PL/EN, sześć miast PL/EN, jawny rejestr i dokładne przypisania kraj + prowincja + miejscowość. Filtry i paginacja zachowują zakres. | `lib/seoLocations.ts`, `SeoLocationContent.tsx`, trasy `[title]` i `[title]/[city]` |
| F08 | `/abc`: title, description, canonical, widoczny H1 i pytania H2; odpowiedzi dostępne w HTML, bez ręcznego obliczania wysokości i ukrywania treści. | `pages/abc.js`, `data/Abc.json` |
| F09 | `lang=pl/en` na serwerze; aktualizacja atrybutu także przy nawigacji klienta. | `pages/_document.tsx`, `pages/_app.tsx` |
| F10 | Wzajemne hreflang i canonical PL/EN; przełącznik oferty zachowuje ID i poprawny slug EN. Formularz konsultacji i TOP 10 w EN, z zachowaną logiką zgód; kontekst regionu w wiadomości konsultacji. | `Header.tsx`, `consultation.tsx`, `RecommendedOffersPopup.tsx`, szablony stron |
| F11 | Archiwum `-old` → 308 do aktualnego poradnika; status archived, brak w listach i sitemapie. Nie przeniesiono niepotwierdzonych cen/ROI. Korekty nagłówków bez zmiany adresów poradników. | `next.config.ts`, `content/blog/*.mdx`, `pages/blog/[slug].js` |
| F12 | Poprawiony stary link w treściach, stopce i podziękowaniu; historyczna ścieżka katalogu → jedno przekierowanie zachowujące parametry. | `pages/hiszpania.tsx`, `Footer.tsx`, `pages/thankyoupage.js`, treści bloga |
| F13 | Zweryfikowano rezerwację miejsca w istniejących kontenerach zdjęć. Główne zdjęcie i miniatury oferty używają istniejącego proxy/Next Image, responsywnych rozmiarów i jakości 70. Główne eager/high priority, miniatury lazy; fallback na źródło bezpośrednie. | `PropertyDetailImage.tsx`, szablon oferty; priorytet zdjęcia hero homepage |

Dane strukturalne: zachowano BlogPosting/BreadcrumbList bloga, dodano breadcrumbs katalogów/regionów/miast/ofert i organizację homepage ze stałym `@id`. JSON-LD serializowany z escapowaniem `<`. Nie dodawano Product, ocen, fikcyjnej dostępności ani obietnic rich results.

## Dowody i zasady danych

Publiczne żądanie z nieistniejącym `id=SEO-NONEXISTENT-20260922` przed wdrożeniem lokalnym zwróciło 200, `age: 899` oraz `cache-status: "Netlify Durable"; hit`. Lokalny serwer po poprawce zwraca 404 i no-store. Nie można potwierdzić naprawy publicznego CDN przed publikacją; należy sprawdzić go ponownie po deployu. Nie utworzono zdalnego preview.

W bazie nie wykryto powtórzeń `external_id` w odczytanej próbce pełnej tabeli. Brak ID nigdy nie wybiera pierwszego rekordu o podobnym tytule. Nie znaleziono jednoznacznego historycznego mapowania sluga bez ID, dlatego zwracane jest 404 z linkami do katalogów. Brak konfiguracji lub awaria Supabase nie udaje pustego katalogu ani 404.

`publicAvailability` akceptuje aktualnie występujące statusy `null`/`AKTUALNA` i operacje `null`/`sale`/`SPRZEDAŻ`. Pozostałe statusy lub operacje są wyłączone. Importy przechowują także rekordy bez statusu; dla tych rekordów zachowano dotychczasowy model publicznej bazy. Katalog i sitemap dodatkowo współdzielą warunki ceny, zdjęć, kraju i `new_build`. Nie wprowadzono migracji bazy ani nowych indeksów.

Dane nie rozróżniają pewnie ceny pojedynczego lokalu od ceny startowej projektu. Dlatego nowe meta descriptions pomijają cenę, zamiast wywodzić „od” z samego `new_build`. Istniejącego modelu cen kart nie przebudowywano.

Mapowanie wybrzeży jest zachowawcze: jawna lista miejscowości oraz zgodna prowincja, bez dopasowania fragmentu opisu i bez uznania każdej miejscowości prowincji za nadmorską. Niezmapowane lokalizacje nadal są dostępne w katalogu kraju. Stary słownik filtrów zawiera błędne przypisania, np. Baza/Huéscar w Almeríi; nie skopiowano ich do rejestru SEO. Ze względu na różnice zakresu stary filtr wybrzeża nie jest automatycznie canonicalizowany do nowej strony regionu. Dowolne filtry mają `noindex, follow` i self-canonical; nie są blokowane w robots.txt.

## Nowe strony i treści

Regiony, z pełnym wariantem PL i EN:

- `/nieruchomosci/hiszpania/costa-blanca`
- `/nieruchomosci/hiszpania/costa-del-sol`
- `/nieruchomosci/hiszpania/costa-calida`
- `/nieruchomosci/hiszpania/costa-de-almeria`

Miasta: `costa-blanca/torrevieja`, `costa-blanca/guardamar-del-segura`, `costa-del-sol/estepona`, `costa-del-sol/mijas`, `costa-calida/san-pedro-del-pinatar`, `costa-de-almeria/vera`. Każde pod prefiksem `/nieruchomosci/hiszpania/` i `/en/properties/hiszpania/`. Razem 20 nowych stron PL/EN.

Miasta wybrano pilotażowo według bieżącej podaży, odrębności treści i pokrycia czterech regionów — bez raportu fraz/GSC. Nie deklarujemy trwałości podaży na podstawie jednego odczytu. Pozostałe cztery propozycje opisano w [szkicach niepublikowanych](seo-miasta-szkice.md).

Regiony mają wstęp, listę ofert, linki miast, wskazówki wyboru lokalizacji, pytanie i odpowiedź, odnośniki do istniejących poradników oraz konsultację z kontekstem. Poradniki bez tłumaczenia są w EN wyraźnie podpisane jako polskie. Wartościowy katalog regionu bez ofert może pozostać 200; arbitralny filtr bez wyników zwraca 404, zamiast ofert z innego obszaru.

Źródła geografii: [Costa Blanca — Spain.info](https://www.spain.info/en/region/costa-blanca/), [Costa del Sol — oficjalna organizacja turystyczna](https://blog.visitacostadelsol.com/en/destinations-costa-del-sol), [Costa Cálida — Spain.info](https://www.spain.info/es/region/costa-calida/), [Vera — Junta de Andalucía](https://ws089.juntadeandalucia.es/sima/ficha.htm?mun=04100). Rejestr zachowuje źródła obok treści.

[Pełna tabela URL → title → H1 → canonical → robots → lang](seo-weryfikacja/metadane.md) została wygenerowana z odpowiedzi HTTP. W ofertach tytuł i metraż są dynamiczne, a numer referencyjny odróżnia identycznie nazwane rekordy.

## Przekierowania

| Stary URL | Docelowy URL | Status |
|---|---|---|
| `/hiszpania` | `/nieruchomosci/hiszpania` | 308 |
| `/hiszpania?page=1` | `/nieruchomosci/hiszpania` | 308, bez pośredniego `page=1` |
| dowolny poprawny katalog `?page=1` | ten sam katalog bez page; inne parametry zachowane | 308 |
| `/blog/nieruchomosci-costa-blanca-old` | `/blog/nieruchomosci-costa-blanca` | 308 |
| `/nieruchomosci/hiszpania/wszystkie-regiony` | `/nieruchomosci/hiszpania` | 308 |
| `/sitemap27.06.2025.xml` | `/sitemap.xml` | 308 |
| oferta z poprawnym ID i błędnym krajem/slugiem | właściwy adres tego rekordu i języka, ID oraz tracking zachowane | 308 |

UTM/fbclid/gclid nie są usuwane z bieżącego URL przed odczytem analityki. Canonical pomija tracking. Nie wprowadzono przekierowania wszystkich 404 na homepage.

## Weryfikacja

- Build produkcyjny: `npm run build -- --webpack` — PASS. Wcześniejszy build domyślnym Turbopack również przeszedł. Zależności aplikacji bez zmian.
- Istniejący skrypt `npm run lint` nie działa z zainstalowanym Next 16 (`next lint` jest interpretowane jako katalog `lint`). To zastana konfiguracja; nie zmieniano zależności ani konfiguracji lintowania przy tym wdrożeniu.
- TypeScript: `npx tsc --noEmit --incremental false` — PASS, niezależnie od istniejącego `ignoreBuildErrors`.
- `node --test scripts/seo/routing.test.cjs` — 7 testów PASS. Kontrolowane rekordy: identyczny slug/różne ID, odwrotna kolejność, ID zawierające `/ &`, 0 sypialni, brak ID, awaria bazy, wycofanie/najem, region/miasto i stabilna paginacja, canonical i kolizja sluga regionu z ofertą.
- `node scripts/seo/http-check.cjs` — PASS, 41 kontroli stron. Realne odpowiedzi 200/308/404, początkowy HTML, dwa rzeczywiste ID w obu kolejnościach, kraj PL/EN, regiony i miasta, dalsze strony, błędny filtr/paginacja, tracking oraz special ID z `/`.
- XML sitemapy: 8946 adresów, w tym 8898 adresów ofert PL/EN, poprawny XML i brak duplikatów. Próba URL obejmuje końcowe rekordy i rekordy spoza pierwszego tysiąca. Liczby mogą zmieniać się po imporcie.
- Chrome/Playwright: homepage, katalogi, region, miasto, oferta, blog, FAQ w desktop 1440 px i mobile 390 px. Brak błędów hydratacji/pageerror. Zrzuty skontrolowano wizualnie. W katalogach zachowano fotograficzny baner między nawigacją a wyszukiwarką, a nagłówek SEO osadzono na przyciemnionym tle; na telefonie pozostaje zwarty wariant tekstowy. Sprawdzono główne zdjęcie galerii i rezerwację miejsca; provider obrazów i analityka zachowane.
- Formularze wyłącznie z przechwyceniem API: oba rzeczywiste ID ofert zgodne z SSR/DOM i payloadem, zgoda wymagana, jedna lokalna konwersja z poprawnym ID; konsultacja EN z kontekstem Costa Cálida, potwierdzenie EN; TOP 10 EN z zachowanym rozdzieleniem zgód; otwarcie/zamknięcie galerii EN i ID jej formularza zgodne z rekordem. Prawdziwe leady ani konwersje nie zostały wysłane.
- Przełącznik PL → EN sprawdzony również jako nawigacja klienta: ID i `html lang` poprawne. Zmiana sortowania resetuje stronę i zachowuje miasto/region. Przejście między dwoma ID w tym samym szablonie bez przeładowania dokumentu resetuje stan poprzedniego formularza.
- Brak testu po publikacji / zdalnego preview; brak danych Search Console i monitoringu rzeczywistych konwersji. Testy nie dowodzą wzrostu SEO.

Reprodukcja: uruchom produkcyjny serwer na `localhost:3100` z istniejącą konfiguracją Supabase, następnie test HTTP. Testy kontrolowane nie wymagają bazy. Test przeglądarkowy wymaga lokalnego Chrome i Playwright; można zainstalować narzędzie poza projektem: `npm install --prefix /tmp/onesta-seo-tools playwright`, następnie `SEO_PLAYWRIGHT_PATH=/tmp/onesta-seo-tools/node_modules/playwright node scripts/seo/browser-check.cjs`. Skrypt blokuje zewnętrzne skrypty/analitykę i przechwytuje wysyłkę formularzy; Lighthouse działał osobno bez tych blokad.

## Wydajność

Lighthouse 13.5.0, symulacja mobile, lokalne buildy produkcyjne obu wersji tym samym bundlerem webpack. Wersja przed zmianami pochodzi z HEAD w odizolowanym katalogu. Ten sam komputer, przeglądarka, trasy i istniejąca analityka; żaden tracker nie został usunięty na potrzeby pomiaru. Pojedyncze pomiary laboratoryjne, nie Core Web Vitals użytkowników. Zewnętrzne obrazy, sieć, obciążenie i cache powodują zmienność.

| Strona | Performance przed → po | LCP przed → po | CLS przed → po | TBT przed → po |
|---|---|---|---|---|
| Homepage | 68 → 94 | 8,73 → 2,86 s | 0,00002 → 0,00002 | 18 → 18,5 ms |
| Katalog Hiszpanii | 71 → 71 | 7,93 → 7,92 s | 0,00088 → 0,00010 | 24,5 → 17,5 ms |
| Oferta | 70 → 84 | 11,03 → 4,05 s | 0,00009 → 0,00024 | 31,5 → 38 ms |

Dla oferty wykonano dodatkowy pomiar po włączeniu istniejącego optymalizatora zdjęć; tabela pokazuje ten wynik końcowy. Pierwotny plik głównego zdjęcia miał ok. 366 kB i rozmiar nieadekwatny do telefonu. Niski zmierzony CLS potwierdza, że sam brak width/height nie dowodził problemu ze stabilnością. Serwer zgłasza również ostrzeżenie o ok. 140 kB danych strony katalogu Cypru (próg Next: 128 kB); nie zwiększano liczby ofert na stronę. Katalog nadal wymaga osobnej pracy nad LCP; nie deklarujemy zaliczenia progów CWV ani gwarantowanej poprawy produkcyjnej. Wyniki: [wydajnosc.json](seo-weryfikacja/wydajnosc.json).

## Pozostała redakcja i kontrola po publikacji

[Lista konkretnych fragmentów do weryfikacji](seo-redakcja-do-weryfikacji.md) obejmuje istniejące obietnice ROI, stawki podatków, licencje i twierdzenia prawne. Nie zastąpiono ich liczbami z pamięci. Zachowano istniejące artykuły procesu, potrzeb i kosztów; nie scalano tematów arbitralnie. Poprawiono strukturę, język i linki; pełna aktualizacja merytoryczna tych twierdzeń pozostaje zadaniem redakcyjnym.

Po autoryzowanej publikacji:

1. Oczyścić ewentualny stary cache ofert w hostingu i powtórzyć dwa ID w obu kolejnościach, brak ID i nieistniejące ID; sprawdzić odpowiedź serwera i DOM, Cache-Control oraz Netlify cache-status.
2. Sprawdzić `/robots.txt`, `/sitemap.xml`, końcowe URL i przykłady EN. Zgłosić sitemapę w GSC i sprawdzić po jednym kraju, regionie, mieście, ofercie oraz stronie 2.
3. Monitorować 404/5xx, przekierowania, canonical wybrany przez Google, strony wykluczone i błędy indeksowania.
4. Zachować punkt odniesienia GSC 28 dni vs wcześniejsze 28 dni, osobno brand/non-brand i typy stron. Brak dostępu GSC w tej sesji — punktu odniesienia nie pobrano.
5. Po 2–4 tygodniach sprawdzić odkrywanie/indeksowanie; po 6–12 tygodniach wyświetlenia, kliknięcia i jakość zapytań, z uwzględnieniem sezonowości. To terminy kontroli, nie obietnica wyniku.

Dokumentacja techniczna użyta do weryfikacji: [Next.js getServerSideProps](https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props), [Google: paginacja](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading).
