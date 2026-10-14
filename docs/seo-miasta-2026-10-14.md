# Nowe strony miast — partia 1 (14.10.2026)

Adresy (Costa Blanca):
- `/nieruchomosci/hiszpania/costa-blanca/orihuela-costa`
- `/nieruchomosci/hiszpania/costa-blanca/pilar-de-la-horadada`
- `/nieruchomosci/hiszpania/costa-blanca/san-miguel-de-salinas`
- `/nieruchomosci/hiszpania/costa-blanca/ciudad-quesada`

Wybór: 10 miast z największą liczbą aktualnych ofert (odczyt bazy 14.10.2026), publikowane partiami. Partia 2: Marbella, Fuengirola, Manilva. Partia 3: Finestrat, Los Alcázares, San Javier.

## Jak to działa

- Wpis w `SEO_CITIES` (`lib/seoLocations.ts`): slug, wybrzeże, aliasy (dokładne nazwy `town` z bazy) i krótki opis PL/EN (meta description).
- Aliasy dopisane też do `towns` Costa Blanca, żeby te oferty były w katalogu wybrzeża i miały poprawne okruszki.
- Treść pod ofertami: `data/cityGuides.ts` + wspólny komponent `components/CityGuideContent.tsx` (wygląd jak Torrevieja/Alicante). Wybór w `SeoLocationContent` tylko dla wersji polskiej.
- `buildCatalogUrl`: filtr jednej miejscowości z własną stroną (`?location=la_zenia`) przekierowuje (308) na czysty adres miasta, z zachowaniem pozostałych filtrów. Dotyczy też wcześniejszych miast (np. `?location=torrevieja`). Pomija strony typów (`/costa-blanca/apartments?location=…`), które nie mają wariantu miasto+typ.
- Sitemap i menu biorą nowe miasta automatycznie z `SEO_CITIES`.

## Aliasy

| Strona | Nazwy z bazy |
|---|---|
| Orihuela Costa | Orihuela Costa, Playa Flamenca, La Zenia, Cabo Roig, Lomas de Caboroig, Campoamor, Dehesa de Campoamor, Punta Prima, Villamartin, Los Dolses, Las Filipinas, Las Ramblas Golf, Las Colinas Golf, Los Almendros (Orihuela-Costa) |
| Pilar de la Horadada | Pilar de la Horadada, Pilar de La Horadada, Torre de La Horadada, Mil Palmeras |
| San Miguel de Salinas | San Miguel de Salinas |
| Ciudad Quesada | Ciudad Quesada, Rojales, Rojales - La Marquesa Golf, Rojales, CIudad Quesada |

Uwaga: „Orihuela” (miasto w głębi lądu) celowo NIE jest aliasem Orihuela Costa.

## Źródła faktów

- Orihuela Costa — ok. 16 km wybrzeża, ok. 35 km od miasta Orihuela, La Zenia Boulevard (2012): https://es.hispanopedia.com/wiki/Orihuela_Costa
- Pilar de la Horadada — segregacja 1986, ok. 24 tys. mieszkańców (INE 2024), 40 km do lotniska Regionu Murcji, 60 km do Alicante-Elche, AP-7/N-332, pole Lo Romero: https://es.wikipedia.org/wiki/Pilar_de_la_Horadada ; plaże, ok. 5 km wybrzeża, wieża: https://murciatoday.com/beaches-of-pilar-de-la-horadada-alicante-province_1571941-a.html
- San Miguel de Salinas — 6798 mieszkańców, 54,6% obcokrajowców (INE 2023), najwyżej położona miejscowość Vega Baja, Blue Lagoon, Lomas del Golf: https://es.wikipedia.org/wiki/San_Miguel_de_Salinas
- Ciudad Quesada — Justo Quesada, 1972, La Marquesa Golf (1989/1994), ok. 6 km od morza, ok. 35 min do lotniska Alicante, Cuevas del Rodeo, Doña Pepa: https://mevilla.co.uk/costa-blanca-south/ciudad-quesada-costa-blanca-complete-guide.html

Bez widełek cen i obietnic rentowności — ceny odsyłają do aktualnych ogłoszeń.
