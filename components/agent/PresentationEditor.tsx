import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FaArrowLeft,
  FaCheck,
  FaCopy,
  FaExternalLinkAlt,
  FaRegTrashAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import AgentHeader from "@/components/agent/AgentHeader";
import PropertyCard from "@/components/SearchEngine/PropertyCard";
import { HomeMontserratSans } from "@/fonts/homeFonts";
import type { AgentOffer } from "@/lib/agentOffers";
import { supabase } from "@/lib/supabaseClient";

type AgentIdentity = {
  id: string;
  email: string;
  name: string;
};

type PresentationEditorProps = {
  presentationId?: string;
};

export default function PresentationEditor({
  presentationId,
}: PresentationEditorProps) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [agent, setAgent] = useState<AgentIdentity | null>(null);
  const [currentId, setCurrentId] = useState(presentationId || "");
  const [offers, setOffers] = useState<AgentOffer[]>([]);
  const [presentationName, setPresentationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (!data.session) {
        router.replace(`/agentlogin?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }
      setAccessToken(data.session.access_token);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace(`/agentlogin?redirect=${encodeURIComponent(router.asPath)}`);
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

    const load = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const endpoint = presentationId
          ? `/api/agent/presentation/${presentationId}`
          : "/api/agent/lists";
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const payload = await response.json();

        if (response.status === 401 || response.status === 403) {
          await supabase.auth.signOut();
          router.replace(
            response.status === 403
              ? "/agentlogin?error=access"
              : `/agentlogin?redirect=${encodeURIComponent(router.asPath)}`,
          );
          return;
        }
        if (!response.ok) {
          throw new Error(payload?.error || "Nie udało się pobrać prezentacji");
        }
        if (!active) return;

        setAgent(payload.agent || null);
        if (presentationId) {
          const presentation = payload.data;
          setOffers(Array.isArray(presentation?.offers) ? presentation.offers : []);
          setPresentationName(presentation?.presentation_name || "");
          setContactName(presentation?.contact_name || presentation?.agent_name || "");
          setContactEmail(presentation?.contact_email || presentation?.agent_email || "");
          setContactPhone(presentation?.contact_phone || "");
        } else {
          const stored = window.sessionStorage.getItem("agent-presentation-draft");
          const parsed = stored ? JSON.parse(stored) : [];
          setOffers(Array.isArray(parsed) ? parsed : []);
          setContactName((current) => current || payload.agent?.name || "");
          setContactEmail((current) => current || payload.agent?.email || "");
        }
      } catch (error: any) {
        if (active) {
          setErrorMessage(error?.message || "Nie udało się pobrać prezentacji");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [accessToken, presentationId, router]);

  useEffect(() => {
    const savedToken =
      typeof router.query.saved === "string" ? router.query.saved : "";
    if (!presentationId || !savedToken || typeof window === "undefined") return;

    setGeneratedUrl(`${window.location.origin}/oferty/${savedToken}`);
    void router.replace(`/agent/prezentacja/${presentationId}`, undefined, {
      shallow: true,
    });
  }, [presentationId, router, router.query.saved]);

  const removeOffer = (externalId: string) => {
    setGeneratedUrl("");
    setOffers((current) =>
      current.filter((offer) => String(offer.external_id) !== externalId),
    );
  };

  const savePresentation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!offers.length || !accessToken || saving) return;

    setSaving(true);
    setErrorMessage("");
    try {
      const editingId = currentId || presentationId;
      const response = await fetch(
        editingId ? `/api/agent/presentation/${editingId}` : "/api/agent/lists",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            presentationName,
            contactName,
            contactEmail,
            contactPhone,
            propertyIds: offers.map((offer) => offer.external_id),
          }),
        },
      );
      const payload = await response.json();

      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        router.replace(response.status === 403 ? "/agentlogin?error=access" : "/agentlogin");
        return;
      }
      if (!response.ok) {
        throw new Error(payload?.error || "Nie udało się zapisać prezentacji");
      }

      const savedId = payload.id || payload.data?.id || editingId;
      const token = payload.token || payload.data?.public_token;
      window.sessionStorage.removeItem("agent-presentation-draft");
      if (!editingId) {
        if (agent?.id) {
          window.sessionStorage.removeItem(`agent-offers:${agent.id}`);
        }
        await router.replace(`/agent/prezentacja/${savedId}?saved=${token}`);
        return;
      }

      setCurrentId(savedId);
      setGeneratedUrl(`${window.location.origin}/oferty/${token}`);
    } catch (error: any) {
      setErrorMessage(error?.message || "Nie udało się zapisać prezentacji");
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (loading) {
    return (
      <div className={`${HomeMontserratSans.className} min-h-screen bg-[#f4f1eb] text-[#182334]`}>
        <AgentHeader active="editor" agentName={agent?.name} />
        <div className="flex min-h-[65vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#eadbbd] border-t-[#182334]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${HomeMontserratSans.className} min-h-screen bg-[#f4f1eb] text-[#182334]`}>
      <AgentHeader active="editor" agentName={agent?.name} />
      <main className="mx-auto max-w-[1500px] px-4 py-8 lg:px-8">
        <button
          type="button"
          onClick={() => router.push(presentationId ? "/agent/prezentacje" : "/agent")}
          className="mb-6 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7b6844]"
        >
          <FaArrowLeft aria-hidden="true" />
          {presentationId ? "Wróć do prezentacji" : "Wróć do wyboru ofert"}
        </button>

        <div className="grid items-start gap-7 xl:grid-cols-[370px_minmax(0,1fr)]">
          <form
            onSubmit={savePresentation}
            className="sticky top-[104px] overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white shadow-[0_16px_45px_rgba(24,35,52,0.08)]"
          >
            <div className="bg-[#182334] px-6 py-6 text-white">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#d6b66f]">
                {presentationId ? "Edycja prezentacji" : "Ostatni krok"}
              </p>
              <h1 className="mt-2 text-[27px] font-extrabold leading-tight">
                Dane kontaktowe agenta
              </h1>
              <p className="mt-3 text-[11px] leading-5 text-slate-300">
                Te dane zobaczy klient na swojej publicznej liście ofert.
              </p>
            </div>

            <div className="grid gap-4 p-6">
              <label className="grid gap-2 text-[11px] font-bold text-[#334155]">
                Nazwa prezentacji
                <input
                  required
                  maxLength={160}
                  value={presentationName}
                  onChange={(event) => setPresentationName(event.target.value)}
                  className="presentationInput"
                  placeholder="np. Apartamenty dla Państwa Kowalskich"
                />
                <span className="text-[9px] font-medium leading-4 text-slate-400">
                  Nazwa jest widoczna w panelu prezentacji i pomaga ją później odnaleźć.
                </span>
              </label>

              <div className="my-1 border-t border-[#e8e0d5]" />

              <label className="grid gap-2 text-[11px] font-bold text-[#334155]">
                Imię i nazwisko
                <input
                  required
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className="presentationInput"
                  placeholder="Jan Kowalski"
                />
              </label>
              <label className="grid gap-2 text-[11px] font-bold text-[#334155]">
                Adres e-mail
                <input
                  required
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  className="presentationInput"
                  placeholder="agent@onesta.com.pl"
                />
              </label>
              <label className="grid gap-2 text-[11px] font-bold text-[#334155]">
                Numer telefonu
                <input
                  required
                  type="tel"
                  value={contactPhone}
                  onChange={(event) => setContactPhone(event.target.value)}
                  className="presentationInput"
                  placeholder="+48 500 000 000"
                />
              </label>

              <div className="rounded-xl bg-[#f5f1ea] px-4 py-3 text-[11px] font-semibold text-[#526173]">
                W prezentacji: <strong className="text-[#182334]">{offers.length} ofert</strong>
              </div>

              {errorMessage ? (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-700">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!offers.length || saving}
                className="mt-1 flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#d6b66f] px-5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#182334] transition hover:bg-[#182334] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaSave aria-hidden="true" />
                {saving
                  ? "Zapisywanie..."
                  : currentId || presentationId
                    ? "Zapisz zmiany i link"
                    : "Zapisz i wygeneruj link"}
              </button>
            </div>
          </form>

          <section className="min-w-0">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9b7a36]">
                  Podgląd zawartości
                </p>
                <h2 className="mt-2 text-[30px] font-extrabold tracking-[-0.03em]">
                  Oferty w prezentacji
                </h2>
              </div>
              <p className="text-[11px] leading-5 text-slate-500">
                Usuń ofertę krzyżykiem, jeśli nie ma trafić do klienta.
              </p>
            </div>

            {offers.length ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {offers.map((offer, index) => (
                  <div key={offer.external_id} className="relative min-w-0">
                    <PropertyCard property={offer} />
                    <span className="absolute left-3 top-3 z-30 flex h-9 min-w-9 items-center justify-center rounded-full bg-[#d6b66f] px-2 text-[11px] font-extrabold text-[#182334] shadow-lg">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOffer(String(offer.external_id))}
                      aria-label={`Usuń ofertę ${index + 1} z prezentacji`}
                      className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#182334] text-[14px] text-white shadow-lg transition hover:bg-red-700"
                    >
                      <FaRegTrashAlt aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#ddd3c4] bg-white px-6 py-20 text-center">
                <p className="text-[14px] font-bold text-slate-500">
                  Prezentacja nie zawiera już żadnych ofert.
                </p>
                <button type="button" onClick={() => router.push("/agent")} className="mt-5 rounded-full bg-[#182334] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                  Wróć do wyboru ofert
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {generatedUrl ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-[620px] rounded-[24px] bg-white p-7 shadow-[0_30px_90px_rgba(0,0,0,0.3)] sm:p-10">
            <button type="button" onClick={() => setGeneratedUrl("")} aria-label="Zamknij" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ede7] text-[#182334]">
              <FaTimes />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e9f3ee] text-[21px] text-[#216e63]">
              <FaCheck />
            </div>
            <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#9b7a36]">
              Prezentacja zapisana
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.03em]">
              Publiczny link dla klienta
            </h2>
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#d9d0c4] bg-[#faf8f4] p-2 pl-4">
              <input readOnly value={generatedUrl} className="min-w-0 flex-1 bg-transparent text-[12px] font-semibold text-[#334155] outline-none" />
              <button type="button" onClick={copyLink} className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#182334] px-4 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white">
                <FaCopy /> {copied ? "Skopiowano" : "Kopiuj"}
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href={generatedUrl} target="_blank" rel="noreferrer" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#b8954c] text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#182334]">
                <FaExternalLinkAlt /> Otwórz prezentację
              </a>
              <button type="button" onClick={() => router.push("/agent/prezentacje")} className="h-12 flex-1 rounded-full bg-[#d6b66f] text-[10px] font-extrabold uppercase tracking-[0.11em] text-[#182334]">
                Wszystkie prezentacje
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .presentationInput { min-height: 48px; width: 100%; border: 1px solid #d9d0c4; border-radius: 10px; background: #fcfbf8; padding: 0 13px; color: #26364b; font-size: 12px; font-weight: 600; outline: none; }
        .presentationInput:focus { border-color: #b8954c; box-shadow: 0 0 0 3px rgba(184,149,76,.12); }
        @media (max-width: 1279px) { form.sticky { position: static; } }
      `}</style>
    </div>
  );
}
