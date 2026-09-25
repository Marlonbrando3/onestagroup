# Torrevieja — treść pod ofertami

Data: 25.09.2026. Adres: `/nieruchomosci/hiszpania/costa-blanca/torrevieja`.

## Podstawa redakcyjna

Plik użytkownika `nieruchomosci_torrevieja.csv`: 32 frazy, eksport Google Keyword Planner za 1.09.2025–31.08.2026. Plik jest zapisany jako UTF-16 z tabulatorami. Kolumna średnich miesięcznych wyszukiwań podaje wartości 500 lub 50. Nie sumujemy wariantów jako niezależnego popytu; konkurencja z eksportu dotyczy reklam, a nie trudności pozycjonowania organicznego.

| Grupa fraz z CSV | Miejsce w treści |
| --- | --- |
| nieruchomości torrevieja; torrevieja nieruchomości; nieruchomości na sprzedaż torrevieja; warianty z „Hiszpania” | Istniejący H1, wstęp pod ofertami, FAQ; poprawna polszczyzna zamiast powtarzania szyku każdej frazy |
| torrevieja mieszkania na sprzedaż; mieszkania torrevieja; torrevieja mieszkanie na sprzedaż; torrevieja apartamenty na sprzedaż | Sekcja mieszkań i apartamentów, pytanie FAQ, link do poradnika |
| torrevieja domy na sprzedaż; domy na sprzedaż torrevieja; domy torrevieja; torrevieja tani dom | Sekcja domów, akapit o budżecie, FAQ |
| tanie mieszkania torrevieja; tanie mieszkania w torrevieja | Sekcja cen i całkowitego budżetu, FAQ |
| mieszkania rynek wtórny w torrevieja | Porównanie rynku wtórnego i pierwotnego, FAQ |
| polskie biuro nieruchomości w torrevieja; biura nieruchomości torrevieja | Sekcja pomocy Onesta i FAQ; bez deklarowania niepotwierdzonego adresu biura w mieście |
| torrevieja mieszkania wynajem; mieszkanie do wynajęcia torrevieja; torrevieja wynajem długoterminowy; wynajem mieszkania torrevieja | Zakup pod wynajem i FAQ wyjaśniające, że katalog zawiera sprzedaż; bez sugerowania dostępności ofert najmu |

Warianty bez polskich znaków i z inną kolejnością słów są obsłużone naturalnymi odmianami. Ceny odwołują się do aktualnych ogłoszeń, bez utrwalania szybko dezaktualizujących się widełek i obietnic rentowności.

## Przegląd konkurencji

- [Home in Spain — Torrevieja](https://homeinspain.pl/property_city/torrevieja-pl/): tekst pod ofertami rozwija lokalizację, cele zakupu, polską obsługę i odsyła do innych kategorii. W Onesta rozwinięto konkretne kryteria porównania mieszkań, domów i lokalizacji.
- [Casprom — Torrevieja](https://casprom.pl/area/torrevieja): katalog skoncentrowany na ofertach, parametrach i typach nieruchomości. Dodana treść pomaga interpretować te parametry przed kontaktem.
- [Nieruchomości Torrevieja](https://xn--nieruchomocitorrevieja-hee.pl/): podział na mieszkania, apartamenty, domy i tańsze nieruchomości oraz obsługa po polsku. Dla Onesta przygotowano własną treść bez kopiowania sformułowań.

Źródła lokalizacyjne: [miasto — plaże i atrakcje](https://torrevieja.es/es/ciudad/visitas-interes), [miasto — Los Balcones](https://torrevieja.es/es/noticias/2026-01-21-parques-jardines-acomete-actuacion-integral-mejora-parque-reina-sal-balcones). Porady o oglądaniu ofert są redakcyjnymi kryteriami porównania, nie statystykami rynku.

## Wdrożenie

- Osobny komponent `TorreviejaCatalogContent`, wybierany tylko dla polskiej strony miasta w istniejącym `SeoLocationContent`.
- Dziewięć sekcji H2, cztery opisy lokalizacji i sześć pytań FAQ. FAQ wykorzystuje natywne `details`, a odpowiedzi są obecne w HTML serwera.
- Kontekstowy link z anchorem „nieruchomości w Hiszpanii” bezpośrednio do `/nieruchomosci/hiszpania`; dodatkowe linki do Costa Blanca, Guardamar oraz powiązanych poradników i usługi zarządzania.
- Przycisk otwiera istniejący formularz konsultacji. Zachowano istniejące zasady wyświetlania treści dla filtrów, języków i paginacji.
- Bez zmiany tras, canonical i metadanych, bez tworzenia kopii katalogu pod `/torrevieja`.

## Weryfikacja lokalna

- HTTP 200; treść w początkowym HTML za sekcją ofert, jeden H1 i zachowany canonical miasta.
- Chrome: desktop 1440 px i telefon 390 px; bez poziomego przepełnienia i błędów JavaScript. Sprawdzono otwieranie FAQ i formularza konsultacji bez jego wysyłania.
- Potwierdzono brak nowego komponentu w Guardamar, angielskiej wersji Torrevieja i na stronie Torrevieja z filtrem sypialni.
- `git diff --check`: bez błędów.
- `tsc --noEmit --incremental false`: 10 diagnostyk w niezmienionym `lib/catalogRouting.ts` (typowanie pól zapytania, linie 214–224); brak diagnostyk w obu zmienionych komponentach. Pełna kontrola typów repozytorium nie przechodzi.
- Zmiany przygotowane lokalnie, bez publikacji produkcyjnej.
