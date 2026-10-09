# Zarządzanie nieruchomościami w Hiszpanii — źródła i założenia

Przebudowa: 8 października 2026. Dotychczasowy plik JS zastąpiono nową stroną TSX pod tym samym adresem `/zarzadzanie-nieruchomosciami-w-hiszpanii`.

## Źródła

1. `docs/HOLASTAY_ Oferta Zarządzania Apartamentem Wakacyjnym w Hiszpanii.pdf` (nazwa pliku na dysku zawiera rozłożone znaki Unicode), obie strony. Źródło zakresu usług i stawek.
2. [Holastay.eu](https://holastay.eu/): firma rodzinna, wyposażone apartamenty na Costa Blanca i Costa Cálida.
3. [Flamenca Village Perla del Mar](https://holastay.eu/offer/13/Flamenca-Village-Perla-del-Mar-apartament-w-kompleksie-wakacyjnym-z-podgrzewanymi-basenami): rzeczywisty przykład apartamentu z portfolio, lokalizacja Orihuela Costa oraz fotografie kompleksu.

Draft umowy nie był dostępny w projekcie ani załącznikach podczas realizacji. Wysłano pytanie o nazwę lub ścieżkę. Strona nie deklaruje niepotwierdzonych okresów wypowiedzenia, wyłączności, harmonogramu wypłat, limitów napraw ani limitu pobytów właściciela. Po otrzymaniu draftu należy sprawdzić podstawę prowizji, częstotliwość opłaty rezydenta i pozostałe uzgodnienia umowne.

## Potwierdzone informacje z oferty

- Kontrole techniczne i wizualne; organizacja napraw oraz współpraca z hydraulikiem, elektrykiem, serwisem AGD i klimatyzacji; raportowanie nieprawidłowości właścicielowi.
- Sprzątanie po rezerwacji, przygotowanie i wymiana tekstyliów, zewnętrzna pralnia, sprawdzenie wyposażenia, podstawowe środki higieniczne.
- Osobisty check-in i check-out; gotowość rezydenta do pomocy 24 godziny na dobę podczas pobytu; obsługa zgłoszeń na miejscu.
- Przygotowanie dokumentów do rejestracji gości. Na stronie nie wskazano konkretnego systemu ani organu, ponieważ oferta nie wystarcza do potwierdzenia aktualnej procedury.
- Pakiet powitalny z wodą, winem i przekąskami.
- Właściciel: 15% prowizji od każdej rezerwacji oraz 60 EUR za usługę rezydenta.
- Gość: 125 EUR za sprzątanie i 80 EUR za pralnię.
- Wszystkie stawki w ofercie są netto.

## Kalkulator

Stawki źródłowe i czysta funkcja obliczeniowa: `lib/holastay.ts`. Interfejs: `components/PropertyManagementCalculator.tsx`.

- Model roczny: liczba rezerwacji × średnia długość pobytu × średnia cena za noc.
- Przykład startowy: 18 rezerwacji, 7 nocy, 110 EUR za noc. To wartości ilustracyjne, a nie prognoza popytu lub danych historycznych HOLASTAY.
- Model przyjmuje 15% od noclegów przed prowizją portalu, bez sprzątania i pralni, oraz jedną opłatę rezydenta 60 EUR netto za rezerwację. Założenia opisano na stronie; trzeba potwierdzić je w umowie.
- VAT/IVA 21% jest edytowalnym założeniem, a nie interpretacją podatkową. Model nalicza go od zarządzania i usługi rezydenta. Wpisanie 0% pozwala obejrzeć te koszty bez podatku od usług.
- Prowizja portali/płatności jest osobnym edytowalnym kosztem, domyślnie 0%. Zero nie oznacza, że wszystkie kanały są bezpłatne; interfejs prosi o wpisanie stawki dla własnych kanałów. Podstawa w modelu to sam nocleg.
- Inne koszty roczne: edytowalne, przykładowo 1 800 EUR. W tym polu właściciel uwzględnia media, wspólnotę, ubezpieczenie, naprawy i inne obciążenia.
- Sprzątanie i pralnia po stronie gościa pozostają poza przychodem z noclegów i saldem właściciela. Nie podwyższają jego wyniku ani nie są od niego ponownie odejmowane.
- Kwoty usług i ich VAT zaokrąglane do centa na rezerwację, następnie sumowane rocznie. Przykład startowy: przychód 13 860 EUR; zarządzanie 2 079 EUR; rezydent 1 080 EUR; VAT/IVA 663,48 EUR; inne koszty 1 800 EUR; saldo 8 237,52 EUR.
- Wynik to saldo po wskazanych kosztach, przed podatkiem dochodowym, finansowaniem, kosztami zakupu i wyposażenia. Brak deklaracji stopy zwrotu lub gwarantowanego zysku.
- Liczba wynajętych nocy nie przekracza 365; przy wydłużaniu pobytu liczba rezerwacji jest automatycznie ograniczana. Ujemne saldo jest pokazywane.

## Materiały wizualne

Lokalne kopie materiałów z Holastay.eu (bez generowania fikcyjnych nieruchomości):

- `public/images/management/flamenca-village.webp`: `/images/objects/pictures/large/3/1/1105.jpg`.
- `public/images/management/flamenca-pool.webp`: `/images/objects/pictures/large/3/1/1068.jpg`.
- `public/images/management/holastay-logo.png`: `/images/owner/wideLogo.png?v=1749485244`.

Zdjęcia zoptymalizowano do WebP. Zdjęcie otwierające stronę ma priorytet, pozostałe są ładowane przez `next/image`. Podpisy i link wskazują rzeczywiste portfolio HOLASTAY.

## Walidacja

- Test obliczeń: `node scripts/check-holastay.cjs` (Node 24).
- Formularz korzysta z istniejącego `/api/contact`; nie wysyłano rzeczywistych zapytań w trakcie testów.
- Metadane: canonical, opis, Open Graph, Twitter, WebPage, Service, BreadcrumbList i FAQPage.
- Link `Kontakt` w wspólnym nagłówku trafia do istniejącego na tej stronie `#contact`.
- Dodano dotychczasowy adres podstrony do publicznej mapy witryny.
- `npm run build -- --webpack`: sukces, strona wyrenderowana statycznie.
- Sprawdzono produkcyjny HTML: jeden H1, canonical, komplet danych strukturalnych, unikalne ID i wszystkie lokalne kotwice.
- Test formularza z atrapą API: prawidłowy payload, sukces, błąd HTTP, odpowiedź `ok: false`, brak sieci i ochrona przed równoległym wysłaniem. Nie wysyłano wiadomości.
- W Chrome sprawdzono zdjęcie i widok desktopowy oraz zmianę wyniku kalkulatora po zmianie ceny suwakiem. Nie ukończono kontroli mobilnej z powodu problemów z narzędziem podglądu; reguły responsywne obejmują progi 1100, 899, 599 i 359 px.
- `npx tsc --noEmit --incremental false`: zgłoszenia wyłącznie z istniejącego `lib/catalogRouting.ts` (typ obiektu zapytania); brak zgłoszeń z nowych plików.

## Wdrożenie produkcyjne

Opublikowano na Netlify 8 października 2026 o 18:27 czasu Europe/Warsaw, na wyraźne polecenie użytkownika.

- Domena: `https://onesta.com.pl/zarzadzanie-nieruchomosciami-w-hiszpanii`.
- Projekt: `onesta`, ID `6b255a4c-13fa-439d-baf1-f8fdc2859561`.
- Opublikowany deploy: `6ac7c4149d426f8e06ec565f`.
- Zakres: izolowana kopia bieżącej produkcji (`4283e27d55a0c7058e535617021bd94114a9c5dd`) z nową podstroną, dwoma komponentami, modelem kalkulacji, CSS, trzema zasobami graficznymi i wpisem tej podstrony w sitemapie. Nie wdrażano pozostałych lokalnych prac ani lokalnego commita artykułu o okupas. Nie wykonywano push do GitHub.
- Build i wysyłkę wykonano razem przez `netlify deploy --build --context production`, aby adapter Next.js zastosował wymagane pliki statyczne, przekierowania i nagłówki. Oddzielne `build` oraz `deploy --no-build` pomijają tymczasowe zmiany adaptera; nie należy tak wdrażać tego projektu bez odtworzenia kompletnej konfiguracji.
- Najpierw sprawdzono podgląd, następnie opublikowano dokładnie ten sam deploy przez API Netlify. Po publikacji API potwierdziło ten sam ID i stan `ready`.
- Produkcyjne HTTP 200: podstrona HOLASTAY (z poprawnym canonical, H1, schema i kalkulatorem), wszystkie trzy nowe zasoby graficzne, optymalizator `/_next/image`, strona główna i katalog `/nieruchomosci/hiszpania`.
