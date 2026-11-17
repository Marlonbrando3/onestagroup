import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaBell, FaRegHeart } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

// Dzwonek w nagłówku strefy agenta: kto i w której prezentacji kliknął „Interesuje mnie ta oferta”.
type AgentNotification = {
  id: string;
  kind: string;
  presentation_id: string | null;
  presentation_name: string | null;
  public_token: string | null;
  offer_external_id: string | null;
  offer_ref: string | null;
  offer_title: string | null;
  created_at: string;
  read_at: string | null;
};

const REFRESH_MS = 60 * 1000;

function timeAgo(value: string) {
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "przed chwilą";
  if (minutes < 60) return `${minutes} min temu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;
  return new Date(value).toLocaleString("pl-PL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function authHeaders(): Promise<Record<string, string> | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : null;
}

export default function AgentNotifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AgentNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const headers = await authHeaders();
    if (!headers) return;
    try {
      const response = await fetch("/api/agent/notifications", { headers });
      if (!response.ok) return;
      const data = await response.json();
      setItems(Array.isArray(data.notifications) ? data.notifications : []);
      setUnread(Number(data.unread) || 0);
      setLoaded(true);
    } catch {
      /* brak sieci — spróbujemy przy następnym odświeżeniu */
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // keepHighlight: po otwarciu listy oznaczamy nowe jako przeczytane na serwerze,
  // ale do zamknięcia listy zostają podświetlone, żeby było widać, co doszło.
  const markRead = async (body: { ids?: string[]; all?: boolean }, keepHighlight = false) => {
    const headers = await authHeaders();
    if (!headers) return;
    const now = new Date().toISOString();
    if (!keepHighlight) {
      setItems((current) =>
        current.map((item) => (body.all || body.ids?.includes(item.id) ? { ...item, read_at: item.read_at || now } : item)),
      );
    }
    setUnread((current) => (body.all ? 0 : Math.max(0, current - (body.ids?.length || 0))));
    try {
      await fetch("/api/agent/notifications", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      /* odświeżenie listy przywróci stan z serwera */
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false);
            // Po zamknięciu nowe przestają być podświetlone.
            setItems((current) => current.map((item) => (item.read_at ? item : { ...item, read_at: new Date().toISOString() })));
            return;
          }
          setOpen(true);
          if (unread > 0) markRead({ all: true }, true);
          else load();
        }}
        aria-label={unread ? `Powiadomienia: ${unread} nowych` : "Powiadomienia"}
        aria-expanded={open}
        className="relative flex h-10 items-center gap-2 rounded-full border border-[#d8d0c3] bg-white px-4 text-[10px] font-bold uppercase tracking-[0.09em] transition hover:border-[#182334]"
      >
        <FaBell aria-hidden="true" className={unread ? "text-[#8e2430]" : ""} />
        <span className="hidden sm:inline">Powiadomienia</span>
        {unread > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#8e2430] px-1.5 text-[10px] font-extrabold tracking-normal text-white shadow">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[min(400px,92vw)] overflow-hidden rounded-2xl border border-[#ddd3c4] bg-white shadow-[0_20px_50px_rgba(24,35,52,0.18)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#eee6da] px-5 py-3.5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#182334]">Powiadomienia</p>
            <p className="text-[10px] text-slate-400">ostatnie {items.length || 0}</p>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {!loaded ? (
              <p className="px-5 py-8 text-center text-[12px] text-slate-500">Ładowanie…</p>
            ) : items.length === 0 ? (
              <p className="px-5 py-8 text-center text-[12px] leading-5 text-slate-500">
                Brak powiadomień. Gdy klient kliknie „Interesuje mnie ta oferta” w Twojej prezentacji, zobaczysz to tutaj.
              </p>
            ) : (
              items.map((item) => {
                const isNew = !item.read_at;
                const offerHref =
                  item.public_token && item.offer_external_id
                    ? `/oferty/${encodeURIComponent(item.public_token)}/${encodeURIComponent(item.offer_external_id)}`
                    : null;
                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 border-b border-[#f1ebe2] px-5 py-4 last:border-b-0 ${isNew ? "bg-[#fdf6f5]" : ""}`}
                  >
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] ${isNew ? "bg-[#8e2430] text-white" : "bg-[#f3ede4] text-[#9b7a36]"}`}>
                      <FaRegHeart aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1 text-[12px] leading-5 text-[#334155]">
                      <p>
                        Prezentacja <strong className="text-[#182334]">{item.presentation_name || "bez nazwy"}</strong>: klient
                        kliknął „Interesuje mnie ta oferta”.
                      </p>
                      <p className="mt-1 font-bold text-[#182334]">
                        {offerHref ? (
                          <Link href={offerHref} target="_blank" className="underline decoration-[#d6b66f] underline-offset-2 hover:text-[#8e2430]">
                            {item.offer_external_id}
                          </Link>
                        ) : (
                          item.offer_external_id
                        )}
                      </p>
                      {item.offer_title ? <p className="truncate text-[11px] text-slate-500">{item.offer_title}</p> : null}
                      <div className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-400">
                        <span>{timeAgo(item.created_at)}</span>
                        {item.presentation_id ? (
                          <Link href={`/agent/prezentacja/${item.presentation_id}`} className="font-bold uppercase tracking-[0.06em] text-[#9b7a36] hover:text-[#182334]">
                            Otwórz prezentację
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    {isNew ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#8e2430]" aria-label="Nowe" /> : null}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
