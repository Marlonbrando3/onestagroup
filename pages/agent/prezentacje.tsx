import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  FaCopy,
  FaEdit,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import AgentHeader from "@/components/agent/AgentHeader";
import { HomeMontserratSans } from "@/fonts/homeFonts";
import { supabase } from "@/lib/supabaseClient";

type AgentIdentity = {
  id: string;
  email: string;
  name: string;
};

type PresentationSummary = {
  id: string;
  public_token: string;
  agent_email: string;
  agent_name: string | null;
  presentation_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
  offersCount: number;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function AgentPresentationsPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [agent, setAgent] = useState<AgentIdentity | null>(null);
  const [presentations, setPresentations] = useState<PresentationSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) {
        router.replace("/agentlogin?redirect=/agent/prezentacje");
        return;
      }
      setAccessToken(data.session.access_token);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/agentlogin?redirect=/agent/prezentacje");
        return;
      }
      setAccessToken(session.access_token);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;

    const loadPresentations = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await fetch("/api/agent/lists", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const payload = await response.json();

        if (response.status === 401 || response.status === 403) {
          await supabase.auth.signOut();
          router.replace(
            response.status === 403
              ? "/agentlogin?error=access"
              : "/agentlogin?redirect=/agent/prezentacje",
          );
          return;
        }
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać prezentacji");
        }
        if (!active) return;
        setPresentations(payload.data || []);
        setAgent(payload.agent || null);
      } catch (error: any) {
        if (active) {
          setErrorMessage(error?.message || "Nie udało się pobrać prezentacji");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPresentations();
    return () => {
      active = false;
    };
  }, [accessToken, router]);

  const visiblePresentations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return presentations;
    return presentations.filter((presentation) =>
      [
        presentation.contact_name,
        presentation.presentation_name,
        presentation.contact_email,
        presentation.contact_phone,
        presentation.agent_name,
        presentation.agent_email,
        presentation.public_token,
      ].some((value) => String(value || "").toLowerCase().includes(query)),
    );
  }, [presentations, search]);

  const copyPublicLink = async (presentation: PresentationSummary) => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/oferty/${presentation.public_token}`,
    );
    setCopiedId(presentation.id);
    window.setTimeout(() => setCopiedId(""), 1600);
  };

  return (
    <>
      <Head>
        <title>Prezentacje agentów | Onesta Group</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className={`${HomeMontserratSans.className} min-h-screen bg-[#f4f1eb] text-[#182334]`}>
        <AgentHeader active="presentations" agentName={agent?.name} />
        <main className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b7a36]">
                Wspólny panel zespołu
              </p>
              <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.04em] sm:text-[42px]">
                Wszystkie prezentacje
              </h1>
              <p className="mt-3 text-[12px] text-slate-500">
                Każdy uprawniony agent może otworzyć i edytować dowolną prezentację.
              </p>
            </div>
            <Link href="/agent" className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#182334] px-6 text-[10px] font-extrabold uppercase tracking-[0.11em] text-white transition hover:bg-[#b8954c]">
              <FaPlus aria-hidden="true" /> Nowa prezentacja
            </Link>
          </div>

          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#ddd3c4] bg-white p-4 shadow-sm">
            <FaSearch className="shrink-0 text-[#9b7a36]" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Szukaj po agencie, e-mailu, telefonie lub linku..."
              className="h-10 min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-[#334155] outline-none placeholder:text-slate-400"
            />
            <span className="shrink-0 rounded-full bg-[#f2eee7] px-3 py-2 text-[10px] font-extrabold text-[#526173]">
              {visiblePresentations.length}
            </span>
          </div>

          {errorMessage ? (
            <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-7 flex min-h-[360px] items-center justify-center rounded-2xl border border-[#ddd3c4] bg-white">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadbbd] border-t-[#182334]" />
            </div>
          ) : visiblePresentations.length ? (
            <div className="mt-7 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {visiblePresentations.map((presentation) => (
                <article key={presentation.id} className="overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white shadow-[0_12px_35px_rgba(24,35,52,0.07)]">
                  <div className="flex items-start justify-between gap-4 border-b border-[#e8e0d5] px-5 py-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#182334] text-[#d6b66f]">
                        <FaLayerGroup aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-[16px] font-extrabold text-[#182334]">
                          {presentation.presentation_name || "Prezentacja bez nazwy"}
                        </h2>
                        <p className="mt-1 truncate text-[10px] font-semibold text-slate-500">
                          {presentation.contact_name || presentation.agent_name || "Onesta Group"}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl bg-[#f4efe6] px-3 py-2 text-center">
                      <strong className="block text-[19px] leading-none text-[#9b7a36]">
                        {presentation.offersCount}
                      </strong>
                      <span className="text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#7b6844]">
                        ofert
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2 px-5 py-4 text-[10px] text-slate-500">
                    <p>
                      Utworzył: <strong className="text-[#334155]">{presentation.agent_name || presentation.agent_email}</strong>
                    </p>
                    <p>Ostatnia zmiana: {formatDate(presentation.updated_at || presentation.created_at)}</p>
                    {presentation.contact_phone ? <p>Telefon w prezentacji: {presentation.contact_phone}</p> : null}
                  </div>

                  <div className="grid grid-cols-3 border-t border-[#e8e0d5] bg-[#fbf8f2]">
                    <Link href={`/agent/prezentacja/${presentation.id}`} className="flex min-h-[50px] items-center justify-center gap-2 border-r border-[#e8e0d5] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#182334] transition hover:bg-[#182334] hover:text-white">
                      <FaEdit /> Edytuj
                    </Link>
                    <a href={`/oferty/${presentation.public_token}`} target="_blank" rel="noreferrer" className="flex min-h-[50px] items-center justify-center gap-2 border-r border-[#e8e0d5] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#182334] transition hover:bg-[#182334] hover:text-white">
                      <FaExternalLinkAlt /> Otwórz
                    </a>
                    <button type="button" onClick={() => copyPublicLink(presentation)} className="flex min-h-[50px] items-center justify-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#182334] transition hover:bg-[#d6b66f]">
                      <FaCopy /> {copiedId === presentation.id ? "Gotowe" : "Kopiuj"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-[#ddd3c4] bg-white px-6 py-20 text-center">
              <FaLayerGroup className="mx-auto text-[30px] text-[#b8954c]" aria-hidden="true" />
              <p className="mt-4 text-[14px] font-bold text-slate-500">
                {search ? "Brak prezentacji pasujących do wyszukiwania." : "Nie ma jeszcze zapisanych prezentacji."}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
