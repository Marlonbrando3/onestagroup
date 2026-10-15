# Limit Netlify Functions (15.10.2026)

Netlify zawiesił stronę po przekroczeniu 125 tys. wywołań funkcji w okresie rozliczeniowym
(~20 tys./dzień, 96% „Next.js Server Handler”, ruch całą dobę). CRM/onesari/panel agenta
miały w bazie minimalną aktywność, więc to nie one.

## Przyczyna
- 23.09 strony katalogu i ofert dostały `noStore` (CDN ignorował parametry zapytania i
  serwował zły `?id=` z cache). Od tego czasu każde wejście, także bota, = wywołanie funkcji.
- Zdjęcia ofert szły przez `/api/property-image` → funkcja przy każdym rozmiarze obrazka.
- Boty (AI, narzędzia SEO) chodziły po nieskończonych kombinacjach filtrów.

## Zmiany
- Zdjęcia z hostów z listy idą bezpośrednio do `next/image` → Netlify Image CDN, bez funkcji.
  Lista hostów: `lib/propertyImageSources.ts` **oraz** `netlify.toml` (`[images] remote_images`)
  — przy dodaniu nowego feedu trzeba zaktualizować oba miejsca.
- `publicCache()` w `lib/publicSeo.ts`: cache CDN z `Netlify-Vary: query` (każdy `?id=`
  ma osobny wpis — to naprawia problem z 23.09). Katalogi 24 h, oferty 7 dni (zmiana 15.10 po starcie — limit ważniejszy niż świeżość)
  (+ stale-while-revalidate). 404/500/przekierowania nadal `no-store`.
  Przeglądarka zawsze pyta o świeżą wersję (`max-age=0`).
- robots.txt: blokada kombinacji filtrów (`?location=`, `?type=`, `?priceMin=`…), blokada
  botów treningowych AI i narzędzi SEO; cache CDN 24 h. Sitemapy: cache CDN 6 h.
- Bez zmian: /agent, /crm, /onesari, /oferty/[token], API.

## Do sprawdzenia
Function metrics po 2–3 dniach od wdrożenia. Usunięta/sprzedana oferta może być widoczna
do 7 dni (potem 404) — jeśli to przeszkadza, skrócić czas lub dodać purge po imporcie.
