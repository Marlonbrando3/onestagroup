# Polskie biuro nieruchomości w Hiszpanii

Strona docelowa: `/polskie-biuro-nieruchomosci-w-hiszpanii`.

## Frazy i intencja

Źródło: przekazany eksport Google Keyword Planner `Keyword Stats 2026-10-08 at 14_59_25.csv`, okres wrzesień 2025 – sierpień 2026. Plik jest zapisany jako UTF-16 LE, z tabulatorami jako separatorami.

| Fraza z eksportu | Średnia miesięczna liczba wyszukiwań w eksporcie | Miejsce w treści |
| --- | ---: | --- |
| polskie biuro nieruchomości w hiszpanii | 500 | Title, H1, wstęp, atuty, FAQ |
| polskie biura nieruchomości w alicante | 500 | Sekcja Costa Blanca i Costa del Sol, opis obsługi Alicante w części Costa Blanca |
| nieruchomosci hiszpania polskie biuro | 50 | Naturalne rozwinięcie głównej intencji w opisie usług |
| polskie biuro nieruchomości w torrevieja | 50 | Sekcja lokalna, FAQ, link do katalogu Torrevieja |
| polskie biuro nieruchomosci hiszpania | 50 | Poprawny językowo wariant głównej frazy |
| polskie biura nieruchomosci w hiszpanii | 500 | Poradnik wyboru agencji, linkowanie i FAQ |

Wolumenów bliskich wariantów nie należy sumować jako liczby unikalnych zapytań. W widocznej treści stosujemy poprawną polszczyznę i diakrytykę; nie dodajemy listy błędnie zapisanych fraz. Meta keywords nie jest podstawą optymalizacji dla Google.

## Podział tematów

- Landing page: ONESTA jako polskie biuro, zakres obsługi, lokalna obecność, regiony, zespół, prezentacje, proces, wynagrodzenie, pomoc po zakupie i kontakt.
- `/blog/polskie-biuro-nieruchomosci-w-hiszpanii`: poradnik porównania i wyboru agencji, z odsyłaczami do strony usługowej; pozostaje odrębnym adresem i zachowuje własny canonical.
- Katalog Hiszpanii, regionów i miast: aktualne oferty. Landing page odsyła do tych katalogów, zamiast powielać ich pełną treść ofertową.
- Poradniki o procesie i kosztach: szczegóły uzupełniające krótsze objaśnienia na stronie usługowej.

## Implementacja

- Treść strony jest renderowana po stronie serwera; nie wymaga kliknięcia ani JavaScript do pobrania FAQ.
- Jeden H1, title, description, self-canonical, robots, Open Graph i Twitter Card.
- Dane JSON-LD: RealEstateAgent, WebPage, Service, BreadcrumbList i FAQPage. Odpowiedzi FAQ w interfejsie i JSON-LD korzystają z jednej tablicy.
- Dane FAQ opisują widoczną treść; nie oznaczają obietnicy rozszerzonego wyniku w wyszukiwarce.
- Adres firmy w danych strukturalnych jest adresem siedziby we Wrocławiu. Nie dodano niepotwierdzonych adresów biur w Hiszpanii.
- Biura własne opisano na poziomie Costa Blanca, biura współpracujące na Costa del Sol. Sekcja Alicante/Torrevieja opisuje obszar obsługi, bez sugerowania adresu biura w tych miastach.
- Adres strony znajduje się już w istniejącym `lib/publicSitemap.ts`. Linki przychodzące są w katalogu Hiszpanii, artykule o wyborze agencji i polskiej stopce.
- Formularz korzysta z istniejącego `/api/contact`; ma referencję nowej strony i zachowuje przekazywanie `source` oraz dotychczasowy mechanizm zgód.
- Główny formularz kontaktowy zajmuje pełną szerokość strony, bez dodatkowego tła i kontenera wokół komponentu. Lokalny wariant wizualny wyrównuje treść do marginesów strony, łączy ciepłą fotografię z kremowym panelem pól, porządkuje dane kontaktowe i zachowuje nagłówek wewnątrz formularza. Pozostałe strony korzystają z dotychczasowego wyglądu wspólnego komponentu.
- Strona korzysta ze wspólnych komponentów `Header` i `Footer`, tak jak strona główna projektu. Hero ma panoramiczne tło fotograficzne wybrzeża z ciepłą, przezroczystą warstwą poprawiającą czytelność H1 i tekstu SEO. Tekst jest wyrównany do lewej, a po prawej znajduje się niewielkie zdjęcie Marka i Karoliny, zachowujące pełny kadr. Biała wyszukiwarka znajduje się bezpośrednio pod nimi, na tym samym tle. Na telefonie zdjęcie przechodzi pod tekst. Zdjęcie zespołu pozostaje także w Open Graph i danych strony.
- Biały panel wyszukiwania ma zaokrąglone narożniki, filtry regionu, typu i zakresu cen oraz przycisk „Wyszukaj oferty”. Opcje zaawansowane obejmują rynek, minimalną liczbę sypialni i łazienek oraz basen. Filtry trafiają do istniejącego katalogu Hiszpanii przez `buildCatalogUrl`; przycisk czyszczenia resetuje formularz.
- Atuty mają ikony. Osiem etapów procesu tworzy na dużym ekranie ścieżkę w układzie 1–2–3 / 6–5–4 / 7–8; na węższych ekranach przechodzą w pionową listę w kolejności 1–8.
- Karty regionów pokazują nazwy, etykiety i pełne opisy bezpośrednio na fotografiach, z ciepłym gradientem pod tekstem. Cała karta prowadzi do odpowiedniego katalogu; treść pozostaje widoczna bez najechania i na telefonie.
- Sekcja „Kim jesteśmy” przedstawia pięć osób w jednym rzędzie na komputerze: Marka, Karolinę, Przemysława, Dominika Michałowskiego i Damiana Włodarkiewicza. Pionowe kadry zachowują całe głowy. Opisy Dominika i Damiana dotyczą zarządzania nieruchomościami oraz organizacji zespołu, procesów i marketingu. Nowe osoby dodano lokalnie na tej podstronie; na tabletach i telefonach siatka ma odpowiednio mniej kolumn.
- Pod regionami znajduje się krótki formularz: imię, telefon i zgoda na kontakt. Ma osobną referencję zapytania, potwierdzenie wysyłki oraz obsługę błędu.
- Drugi wariant krótkiego formularza znajduje się bezpośrednio pod sekcją o kosztach, z hasłem „Każdy nasz klient zaczął od rozmowy”. Obie instancje mają osobne identyfikatory pól, stan wysyłki i referencje zapytań.
- Sekcja atutów ma szerokie fotograficzne tło z Calpe, kremowe karty, piaskowe tło oraz złote ikony. Zdjęcia krajobrazów i nieruchomości uzupełniają proces, Alicante/Torrevieję, pomoc po zakupie, FAQ i karty poradników. Krótkie formularze mają fotograficzne tła z granatową warstwą poprawiającą kontrast, a główna sekcja kontaktowa — ciepłą nakładkę na fotografii. Ze strony usunięto wszystkie szkice dekoracyjne.
- Paleta podstrony opiera się na granacie, złocie i jasnych neutralnych tłach. Tekst, panel wyszukiwania i pas atutów korzystają z Montserrat, a pozostałe nagłówki z Playfair. H1 ma maksymalnie 54 px. Na węższych ekranach pola wyszukiwarki układają się w dwie kolumny, a przycisk wyszukiwania zajmuje pełną szerokość panelu.
- Granatowy pas prezentuje sześć atutów: kontakt po polsku, biura na wybrzeżach, pełne wsparcie w zakupie, bezpieczny proces transakcji, preselekcję oraz dostęp do 100% ofert rynku pierwotnego. Ostatnia deklaracja pochodzi z informacji właściciela i jest zgodna z obecną stroną główną.

## Weryfikacja treści formalnej

Przy opracowaniu ogólnych informacji sprawdzono oficjalne źródła (8 października 2026):

- [NIE — Ambasada Hiszpanii w Warszawie](https://www.exteriores.gob.es/Embajadas/varsovia/pl/ServiciosConsulares/Paginas/Numer-Identyfikacyjny-Cudzoziemca.aspx).
- [Zakup i weryfikacja nieruchomości — Colegio de Registradores](https://www.registradores.org/en/web/blog-corpme/-/compra-segura-de-vivienda?redirect=%2Fweb%2Fblog-corpme).
- [Rejestracja najmu turystycznego — Generalitat Valenciana](https://sede.gva.es/es/detall-tramit?id_proc=19207).

Strona nie podaje uniwersalnych stawek podatków, gwarantowanych terminów, stóp zwrotu ani automatycznej dostępności najmu turystycznego. Zakres usług, opłaty i możliwości konkretnej nieruchomości są ustalane indywidualnie.

## Publikacja

8 października 2026, 18:33 CEST: opublikowano na `https://onesta.com.pl/polskie-biuro-nieruchomosci-w-hiszpanii` przez Netlify, deploy `6ac7c55a4a72f1bb13797e74`. Wdrożenie zachowuje podstronę HOLASTAY. Do izolowanej wersji produkcyjnej włączono pliki tej podstrony, wymagane komponenty i zdjęcia oraz powiązane linki i mapę witryny.

Przeszły: build produkcyjny, testy wyszukiwarki i krótkich formularzy z atrapą API, kalkulacje HOLASTAY oraz kontrola HTTP na podglądzie i domenie produkcyjnej. Sprawdzono canonical, JSON-LD, unikalne identyfikatory i kotwice, 43 zasoby wraz z optymalizacją zdjęć, linki ze strony głównej, katalogu i poradników oraz obecność obu podstron w sitemap. Nie wysyłano rzeczywistych zgłoszeń formularzy.
