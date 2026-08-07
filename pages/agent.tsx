import Head from "next/head";
import { useRouter } from "next/router";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaClipboardCheck,
  FaFilter,
  FaPlus,
  FaRegTrashAlt,
} from "react-icons/fa";
import AgentHeader from "@/components/agent/AgentHeader";
import PropertyCard from "@/components/SearchEngine/PropertyCard";
import { HomeMontserratSans } from "@/fonts/homeFonts";
import { AgentOffer, agentOfferLabel } from "@/lib/agentOffers";
import { supabase } from "@/lib/supabaseClient";

type AgentIdentity = {
  id: string;
  email: string;
  name: string;
};

type Filters = {
  search: string;
  country: string;
  province: string;
  type: string;
  market: string;
  bedsMin: string;
  priceMin: string;
  priceMax: string;
  sort: string;
};

const emptyFilters: Filters = {
  search: "",
  country: "all",
  province: "all",
  type: "all",
  market: "all",
  bedsMin: "",
  priceMin: "",
  priceMax: "",
  sort: "updated_desc",
};

const provinceOptions = [
  "Malaga",
  "Alicante",
  "Murcia",
  "Almería",
  "Cádiz",
  "Castellón",
  "Granada",
  "Valencia",
  "Cypr Południowy",
  "Samana",
];

const typeOptions = [
  "Apartment",
  "Penthouse",
  "Villa",
  "Town House",
  "Bungalow",
  "Finca",
];

export default function AgentPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [agent, setAgent] = useState<AgentIdentity | null>(null);
  const [properties, setProperties] = useState<AgentOffer[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<AgentOffer[]>([]);
  const [selectionHydrated, setSelectionHydrated] = useState(false);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) {
        router.replace("/agentlogin?redirect=/agent");
        return;
      }
      setAccessToken(data.session.access_token);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/agentlogin?redirect=/agent");
        return;
      }
      setAccessToken(session.access_token);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleUnauthorized = useCallback(
    async (status: number) => {
      if (status === 401 || status === 403) {
        await supabase.auth.signOut();
        router.replace(
          status === 403
            ? "/agentlogin?error=access"
            : "/agentlogin?redirect=/agent",
        );
        return true;
      }
      return false;
    },
    [router],
  );

  useEffect(() => {
    if (!accessToken) return;
    let active = true;

    const loadProperties = async () => {
      setLoading(true);
      setErrorMessage("");

      const params = new URLSearchParams({ page: String(page) });
      Object.entries(appliedFilters).forEach(([key, value]) => {
        if (value && value !== "all") params.set(key, value);
      });

      try {
        const response = await fetch(`/api/agent/properties?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const payload = await response.json();

        if (!response.ok) {
          if (await handleUnauthorized(response.status)) return;
          throw new Error(payload?.error || "Nie udało się pobrać ofert");
        }
        if (!active) return;

        setProperties(payload.data || []);
        setTotalPages(payload.totalPages || 1);
        setTotalCount(payload.count || 0);
        setAgent(payload.agent || null);
      } catch (error: any) {
        if (active) setErrorMessage(error?.message || "Nie udało się pobrać ofert");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadProperties();
    return () => {
      active = false;
    };
  }, [accessToken, appliedFilters, handleUnauthorized, page]);

  useEffect(() => {
    if (!agent || selectionHydrated) return;
    try {
      const saved = window.sessionStorage.getItem(`agent-offers:${agent.id}`);
      const parsed = saved ? JSON.parse(saved) : [];
      setSelectedOffers(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSelectedOffers([]);
    }
    setSelectionHydrated(true);
  }, [agent, selectionHydrated]);

  useEffect(() => {
    if (!agent || !selectionHydrated) return;
    window.sessionStorage.setItem(
      `agent-offers:${agent.id}`,
      JSON.stringify(selectedOffers),
    );
  }, [agent, selectedOffers, selectionHydrated]);

  const selectedIndexes = useMemo(
    () =>
      new Map(
        selectedOffers.map((offer, index) => [String(offer.external_id), index]),
      ),
    [selectedOffers],
  );

  const toggleOffer = (offer: AgentOffer) => {
    const externalId = String(offer.external_id);
    setSelectedOffers((current) => {
      const exists = current.some(
        (selected) => String(selected.external_id) === externalId,
      );
      return exists
        ? current.filter((selected) => String(selected.external_id) !== externalId)
        : [...current, offer];
    });
  };

  const applyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const openPresentationEditor = () => {
    if (!selectedOffers.length) return;
    window.sessionStorage.setItem(
      "agent-presentation-draft",
      JSON.stringify(selectedOffers),
    );
    router.push("/agent/prezentacja/nowa");
  };

  const pageNumbers = Array.from(
    new Set(
      [1, page - 1, page, page + 1, totalPages].filter(
        (value) => value >= 1 && value <= totalPages,
      ),
    ),
  );

  return (
    <>
      <Head>
        <title>Panel agenta | Onesta Group</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className={`${HomeMontserratSans.className} min-h-screen bg-[#f4f1eb] text-[#182334]`}>
        <AgentHeader active="offers" agentName={agent?.name} />

        <main className="mx-auto grid max-w-[1600px] items-start gap-6 px-4 py-7 lg:grid-cols-[310px_minmax(0,1fr)] lg:px-8">
          <aside className="sticky top-[100px] z-20 overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white shadow-[0_16px_45px_rgba(24,35,52,0.08)]">
            <div className="bg-[#182334] px-5 py-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#d6b66f]">Tworzona lista</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <strong className="text-[34px] leading-none">{selectedOffers.length}</strong>
                  <span className="ml-2 text-[12px] text-slate-300">wybranych ofert</span>
                </div>
                <FaClipboardCheck className="text-[24px] text-[#d6b66f]" aria-hidden="true" />
              </div>
            </div>

            <div className="max-h-[330px] overflow-y-auto px-3 py-3">
              {selectedOffers.length ? (
                <ol className="grid gap-2">
                  {selectedOffers.map((offer, index) => (
                    <li key={offer.external_id} className="grid grid-cols-[28px_minmax(0,1fr)_30px] items-center gap-2 rounded-xl bg-[#f7f3ec] p-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d8bb78] text-[11px] font-extrabold text-[#182334]">{index + 1}</span>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-[#26364b]">{agentOfferLabel(offer)}</p>
                        <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.08em] text-[#7b8796]">ref. {offer.external_id}</p>
                      </div>
                      <button type="button" onClick={() => toggleOffer(offer)} aria-label={`Usuń ofertę ${index + 1}`} className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] text-slate-400 transition hover:bg-white hover:text-red-600">
                        <FaRegTrashAlt aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="px-4 py-10 text-center">
                  <FaPlus className="mx-auto text-[21px] text-[#b8954c]" aria-hidden="true" />
                  <p className="mt-3 text-[12px] font-semibold leading-5 text-slate-500">Kliknij plus przy ofercie, aby dodać ją do listy dla klienta.</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#e5ddd2] p-4">
              <button type="button" onClick={openPresentationEditor} disabled={!selectedOffers.length} className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#182334] px-5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#b8954c] disabled:cursor-not-allowed disabled:opacity-40">
                <FaCheck aria-hidden="true" />
                Zapisz wybór i konfiguruj
              </button>
              <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">Zmiana filtrów i stron nie usuwa wybranych ofert.</p>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b7a36]">Baza Onesta</p>
                <h1 className="mt-2 text-[30px] font-extrabold tracking-[-0.03em] sm:text-[38px]">Wybierz oferty dla klienta</h1>
                <p className="mt-2 text-[12px] text-slate-500">Dostępnych ofert: {totalCount.toLocaleString("pl-PL")}</p>
              </div>
            </div>

            <form onSubmit={applyFilters} className="mb-7 rounded-2xl border border-[#ddd3c4] bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#7b6844]">
                <FaFilter aria-hidden="true" /> Filtry ofert
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Miasto, prowincja lub numer ref." className="agentFilterInput xl:col-span-2" />
                <select value={filters.country} onChange={(event) => setFilters((current) => ({ ...current, country: event.target.value }))} className="agentFilterInput">
                  <option value="all">Wszystkie kraje</option><option value="hiszpania">Hiszpania</option><option value="cypr">Cypr</option>
                </select>
                <select value={filters.province} onChange={(event) => setFilters((current) => ({ ...current, province: event.target.value }))} className="agentFilterInput">
                  <option value="all">Wszystkie regiony</option>{provinceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))} className="agentFilterInput">
                  <option value="all">Wszystkie typy</option>{typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                <select value={filters.market} onChange={(event) => setFilters((current) => ({ ...current, market: event.target.value }))} className="agentFilterInput">
                  <option value="all">Każdy rynek</option><option value="primary">Rynek pierwotny</option><option value="secondary">Rynek wtórny</option>
                </select>
                <select value={filters.bedsMin} onChange={(event) => setFilters((current) => ({ ...current, bedsMin: event.target.value }))} className="agentFilterInput">
                  <option value="">Dowolna liczba sypialni</option><option value="1">Od 1 sypialni</option><option value="2">Od 2 sypialni</option><option value="3">Od 3 sypialni</option><option value="4">Od 4 sypialni</option>
                </select>
                <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))} className="agentFilterInput">
                  <option value="updated_desc">Najnowsze</option><option value="price_asc">Cena rosnąco</option><option value="price_desc">Cena malejąco</option>
                </select>
                <input type="number" min="0" value={filters.priceMin} onChange={(event) => setFilters((current) => ({ ...current, priceMin: event.target.value }))} placeholder="Cena od €" className="agentFilterInput" />
                <input type="number" min="0" value={filters.priceMax} onChange={(event) => setFilters((current) => ({ ...current, priceMax: event.target.value }))} placeholder="Cena do €" className="agentFilterInput" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="submit" className="rounded-full bg-[#182334] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#b8954c]">Zastosuj filtry</button>
                <button type="button" onClick={clearFilters} className="rounded-full border border-[#d7cbbc] bg-white px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#526173] transition hover:border-[#182334]">Wyczyść</button>
              </div>
            </form>

            {errorMessage ? <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">{errorMessage}</div> : null}

            {loading ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-[#ddd3c4] bg-white"><div className="h-9 w-9 animate-spin rounded-full border-4 border-[#eadbbd] border-t-[#182334]" /></div>
            ) : properties.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => {
                  const selectedIndex = selectedIndexes.get(String(property.external_id));
                  const selected = selectedIndex !== undefined;
                  return (
                    <div key={property.external_id} className={`relative min-w-0 transition ${selected ? "ring-4 ring-[#d6b66f] ring-offset-2" : ""}`}>
                      <PropertyCard property={property} />
                      <button type="button" onClick={() => toggleOffer(property)} aria-label={selected ? "Usuń ofertę z listy" : "Dodaj ofertę do listy"} className={`absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 text-[17px] shadow-lg transition ${selected ? "border-white bg-[#182334] text-white" : "border-[#182334] bg-white text-[#182334] hover:bg-[#d6b66f]"}`}>
                        {selected ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                      </button>
                      {selected ? <span className="absolute bottom-3 right-3 z-30 flex h-9 min-w-9 items-center justify-center rounded-full bg-[#d6b66f] px-2 text-[12px] font-extrabold text-[#182334] shadow-lg">{selectedIndex + 1}</span> : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#ddd3c4] bg-white px-6 py-20 text-center text-[14px] font-semibold text-slate-500">Brak ofert pasujących do filtrów.</div>
            )}

            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginacja ofert">
              <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="agentPageButton" aria-label="Poprzednia strona"><FaChevronLeft /></button>
              {pageNumbers.map((pageNumber, index) => (
                <span key={pageNumber} className="contents">
                  {index > 0 && pageNumber - pageNumbers[index - 1] > 1 ? <span className="px-1 text-slate-400">…</span> : null}
                  <button type="button" onClick={() => setPage(pageNumber)} className={`agentPageButton ${pageNumber === page ? "active" : ""}`}>{pageNumber}</button>
                </span>
              ))}
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="agentPageButton" aria-label="Następna strona"><FaChevronRight /></button>
            </nav>
          </section>
        </main>

        <style jsx global>{`
          .agentFilterInput { min-height: 44px; width: 100%; border: 1px solid #d9d0c4; border-radius: 10px; background: #fcfbf8; padding: 0 12px; color: #26364b; font-size: 12px; font-weight: 600; outline: none; }
          .agentFilterInput:focus { border-color: #b8954c; box-shadow: 0 0 0 3px rgba(184,149,76,.12); }
          .agentPageButton { display: flex; height: 40px; min-width: 40px; align-items: center; justify-content: center; border: 1px solid #d9d0c4; border-radius: 999px; background: white; padding: 0 11px; color: #334155; font-size: 12px; font-weight: 800; }
          .agentPageButton.active { border-color: #182334; background: #182334; color: white; }
          .agentPageButton:disabled { cursor: not-allowed; opacity: .35; }
          @media (max-width: 1023px) { main > aside { position: static !important; } }
        `}</style>
      </div>
    </>
  );
}
