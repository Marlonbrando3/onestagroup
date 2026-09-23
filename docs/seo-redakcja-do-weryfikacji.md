# Fragmenty wymagające weryfikacji redakcyjnej

Stan: 23.09.2026. Poniższe twierdzenia istniały przed zmianami SEO. Nie dodano nowych stawek podatkowych, prognoz zysku ani gwarancji. Zmiany nagłówków, pisowni, metadanych i linków nie oznaczają aktualizacji merytorycznej prawa ani analizy finansowej. Daty aktualizacji zmienionych artykułów odzwierciedlają faktyczne zmiany redakcyjne.

| Plik / miejsce | Konkretny fragment | Potrzebne sprawdzenie |
|---|---|---|
| `data/Abc.json`, pytanie 1 | koszty życia „ok 19% droższy”, różnica cen 30–60 tys. EUR | Źródło, data i porównywalne lokalizacje. |
| `data/Abc.json`, pytanie 6 | wszystkie oferowane nieruchomości mają lub mogą uzyskać licencję turystyczną | Weryfikacja właściwa dla konkretnego lokalu i aktualnych regulacji. |
| `data/Abc.json`, pytania 8–9 | wzrost wartości 5–7% rocznie, średnio 7% netto po wszystkich opłatach | Udokumentowana próba, okres, koszty, ryzyko i metodologia; nie przedstawiać jako gwarancji. |
| `data/Abc.json`, pytanie 14 | usunięcie okupantów w dwa tygodnie; alarm upoważnia policję do usunięcia osoby | Aktualna weryfikacja prawna. |
| `content/blog/jak-kupic-nieruchomosc-w-hiszpanii.mdx` | „Te kryteria gwarantują […] 7% netto”; spadek zysku automatycznie do 6/5% | Źródła, kalkulacja i usunięcie nieuzasadnionej gwarancji po przeglądzie redakcyjnym. |
| `content/blog/nieruchomosci-costa-blanca.mdx` i `hiszpania-apartamenty-na-sprzedaz.mdx` | wzrost 7% rocznie, „ZAWSZE” dwukrotnie większy zarobek, kredyt 3,5%, podatek 19% | Aktualne źródła i konkretne założenia przykładu. Występuje też błąd rachunkowy: zapis `170 000 * 5% = 11 900`; wartość nie wynika z tego działania. Nie przeliczano całego modelu bez ustalenia zamierzonych założeń. |
| `content/blog/jak-kupic-nieruchomosc-w-hiszpanii-pigulka.mdx` | ITP 10%, AJD 1,2%, finansowanie do 70%, obowiązkowy tłumacz przysięgły | Przegląd aktualnych źródeł i warunków; istniejący poradnik kosztów ma własny stan prawny z 08.09.2026 i nie został przepisany. |
| `content/blog/nieruchomosci-costa-blanca-old.mdx` | ceny za m² bez daty, ROI 6–7%, San Pedro del Pinatar przypisane do Costa Blanca | Archiwum wycofane z publikacji i przekierowane; nie przeniesiono nieweryfikowalnych kwot ani błędnego przypisania geograficznego. |
| `pages/index.tsx`, `pages/en/index.tsx` | statystyki 90% / 100% rynku i istniejące opinie klientów | Potwierdzenie źródła i zgód na istniejące opinie. Nie dodawano nowych opinii, realizacji ani danych o doświadczeniu. |

## Role poradników

- `nieruchomosci-w-hiszpanii-jak-wyglada-proces`: główny opis procesu; linki do kosztów i aktualnego katalogu.
- `jak-kupic-nieruchomosc-w-hiszpanii`: określenie potrzeb i kryteriów wyboru.
- `jak-kupic-nieruchomosc-w-hiszpanii-pigulka`: zwięzła checklista; nagłówki etapów i odnośnik do pełnego procesu. Część finansowo-prawna wymaga wskazanej wyżej aktualizacji.
- `koszty-zakupu-nieruchomosci-hiszpania-costa-blanca`: poradnik kosztów z zachowanym URL i treścią.
- `nieruchomosci-costa-blanca`: poradnik regionalny; połączony z katalogiem wybrzeża i miast.
- `torrevieja-apartamenty-na-sprzedaz`: poradnik miejscowości; połączony z katalogiem Torrevieja.

Zachowano istniejące poradniki zamiast automatycznie scalać podobne tematy. Artykuły `nieruchomosci-costa-blanca` i `hiszpania-apartamenty-na-sprzedaz` mają duże podobieństwo fragmentów — wymagają dalszego uporządkowania merytorycznego; bez GSC nie wybrano arbitralnego przekierowania. Archiwum `-old` jest wyjątkiem: samo jego dotychczasowe frontmatter wskazywało na zastąpioną wersję.
