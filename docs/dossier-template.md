# Dossier Onesta

Podgląd: `/test-1`. Dziesięć stron A4 bez agendy. Przycisk „Drukuj / zapisz PDF” czeka na zdjęcia i fonty, następnie otwiera drukowanie przeglądarki. Wybierz PDF, A4, skalę 100%, brak marginesów oraz wyłącz nagłówki i stopki przeglądarki. Kolory tła są wymagane dla pełnego wyglądu. Na telefonie treść i procesy układają się pionowo; wydruk zachowuje wersję A4.

## Kolejna oferta

1. Skopiuj obiekt `dossierDemo` z `data/dossierDemo.ts` i zachowaj typ `DossierOffer`.
2. Podmień referencję, opisy, parametry, lokalizację, zdjęcia, rzuty, dostępność i harmonogram. Pierwsze zdjęcie definiuje `hero`. Galeria przewiduje trzy fotografie, strona rzutów dwa plany, procesy po dziewięć etapów.
3. Umieść własne materiały w `public/`. Rzuty wyświetlamy bez przycinania. Dłuższe listy lokali wymagają kolejnej strony i aktualizacji numeracji; obecny układ przewiduje sześć wierszy.
4. Podmień współrzędne atrakcji, kafle mapy i źródła. Obecna mapa to sześć lokalnych kafli OpenStreetMap, zoom 12, x 2041–2043, y 1574–1575; zachowaj atrybucję i respektuj warunki źródła. Nie oznaczaj lokalizacji inwestycji bez potwierdzonego adresu.
5. Zweryfikuj podatki dla regionu, datę, warunki banku i tekst objaśnień w komponencie. `finance` przelicza podatek, wkład, kwotę kredytu i ratę; tekst o banku i stawkach referencyjnych musi być aktualizowany razem ze źródłami. To nie jest automatyczny system podatkowy dla wszystkich regionów.
6. Ustaw `isDemo: false` dopiero po podmianie i potwierdzeniu wszystkich danych. Usuń lub zastąp pokazowe podpisy materiałów, cennika i rzutów. Zachowaj rzeczywiste źródła, datę i informacje o założeniach finansowych.
7. Przekaż obiekt jako `<Dossier offer={nowaOferta} />`. Układ i style znajdują się w `components/dossier/`.

## Materiały pokazowe

Zdjęcia i dwa oryginalne rzuty pochodzą z lokalnego folderu `SOL Y PLAYA II` (Calida Homes, Lo Pagán). Zostały zoptymalizowane do WebP. Nie są materiałami inwestycji w Alicante. Parametry i cennik są fikcyjnymi danymi do oceny szablonu. Aktualność źródeł podatkowych i bankowych sprawdzono 15.09.2026.

Symulacja: 360 000 € netto, wkład 40%, kredyt 216 000 €, 15 lat, stopa nominalna 3,60%. Stopa pochodzi z porównania Bankinter dla przykładu 20-letniego z bonifikatą; zastosowanie jej do 15 lat jest jawnie opisanym założeniem, a nie ofertą dla nierezydenta. Rata nie obejmuje kosztów dodatkowych. Harmonogram deweloperski 30% + 30% przed odbiorem nie jest automatycznie zgodny z wkładem 40% i wymaga osobnego uzgodnienia finansowania.

Trasa ma `noindex, nofollow`. Nie zmienia nawigacji ani pozostałych stron serwisu.
