# Wdrożenie SEO Onesta — 09.10.2026

Gałąź: `seo/2026-10-09` (od `main`). Pierwszy commit (`WIP: lokalny stan…`) to niezacommitowana wcześniej praca lokalna — bez zmian merytorycznych. Kolejne commity to zmiany SEO poniżej. Nic nie zostało wypchnięte ani opublikowane.

## Zmiany

| Obszar | Co | Pliki |
|---|---|---|
| Metadane ofert | Koniec z „Sypialnie: 0” (0 w feedzie = studio albo brak danych → pomijamy); odmiana „2 sypialnie / 5 sypialni”, łazienki, „na sprzedaż”, rynek pierwotny, „0% prowizji dla kupującego”. Kod ref. zostaje w title (rozróżnia oferty o tej samej nazwie). | `lib/publicSeo.ts`, test w `scripts/seo/routing.test.cjs` |
| robots.txt | Blokada stref prywatnych: /api/ (z wyjątkiem /api/property-image — zdjęcia ofert), /admin, /agent*, /crm, /onesari, /login*, /leadforms, /choosedoffers, /test-1. Katalogi i filtry świadomie nieblokowane (noindex,follow). | `pages/robots.txt.js` |
| Mega-menu | Zamiast wszystkich miejscowości z feedu (133 na Costa Blanca, w tym błędne wpisy typu „Istanbul”) — lista kluczowych miejscowości na wybrzeże; landingi miast nadal podpinane automatycznie. Cypr bez zmian. | `lib/propertyNavigation.ts` (`MENU_TOWNS`) |
| Dane strukturalne | Strona główna PL/EN: RealEstateAgent (zamiast Organization) z NIP, językami, obszarem działania i biurami Opole + San Javier; to samo `@id` co na /polskie-biuro-…, więc Google łączy opisy. | `lib/organizationSchema.ts`, `pages/index.tsx`, `pages/en/index.tsx` |
| Zaufanie | Licznik „1 skutecznych procesów” → „0% prowizji dla kupującego”; karta Dominikany → #contact zamiast /aboutus; e-mail Karoliny w ofertach (fenomen.nieruchomosci.pl) → biuro@onesta.com.pl. | `pages/index.tsx`, `components/ContactAgentInOffer.tsx` |
| Blog | Polskie znaki w tytułach/opisach; tytuły i keywords przestawione z fraz ofertowych na informacyjne. `/blog/nieruchomosci-w-hiszpanii` → 308 `/nieruchomosci/hiszpania` (artykuł celował w „nieruchomości Hiszpania”); pigułka → 308 do poradnika procesu. Link w katalogu zaktualizowany. Pozostałe slugi bez zmian. | `content/blog/*.mdx`, `next.config.ts`, `components/SpainCatalogContent.tsx` |

## Świadomie NIE zmienione

- Format URL ofert `?id=` — działa poprawnie po wdrożeniu z 23.09 (canonical z ID, 404 dla złego ID). Masowa migracja ~9 tys. URL PL/EN bez wyraźnej korzyści.
- Angielskie slugi typów (`/apartments`, `/villas`) — do rozważenia razem z nowymi landingami typów.
- FAQPage na katalogu — FAQ jest w JSX; duplikowanie tekstów do schema (bez rich results w Google od 2023) grozi rozjazdem treści.

## Weryfikacja

- `node --test scripts/seo/routing.test.cjs` — 7/7 PASS.
- `tsc --noEmit` — brak błędów w zmienionych plikach (10 zastanych błędów w `lib/catalogRouting.ts`, bez zmian; build ma `ignoreBuildErrors`).
- `next build` (kopia robocza na Linuksie; czcionki Google podmienione atrapą, bo środowisko testowe nie ma dostępu do fonts.googleapis.com) — PASS.
- HTTP lokalnie: robots.txt OK; 308 dla 3 adresów bloga OK; strona główna: RealEstateAgent, brak „skutecznych”, kafel 0%; lista bloga z nowymi tytułami; menu: 60 linków `?location=` łącznie dla wszystkich wybrzeży. Katalog i oferty nietestowane lokalnie (brak połączenia z Supabase ze środowiska testowego) — sprawdzić na preview.

## Po publikacji

1. Preview: `/nieruchomosci/hiszpania`, przykładowa oferta, menu desktop i mobile.
2. GSC: ponowne zgłoszenie sitemapy; inspekcja `/nieruchomosci/hiszpania` i `/polskie-biuro-nieruchomosci-w-hiszpanii`.
3. Rich Results Test strony głównej (RealEstateAgent).
