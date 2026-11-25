import { CrmPresentationEvent } from "@/components/crm/types";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

// Dzwonek w nagłówku CRM: aktywność klientów w powiązanych prezentacjach.
function describe(event: CrmPresentationEvent) {
  if (event.type === "interest") return { verb: "kliknął „Interesuje mnie”", detail: event.offerTitle };
  if (event.type === "offer_view") return { verb: "obejrzał ofertę", detail: event.offerTitle };
  return { verb: "otworzył prezentację", detail: event.presentationName };
}

function timeAgo(value: string) {
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return "przed chwilą";
  if (minutes < 60) return `${minutes} min temu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} godz. temu`;
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

export default function CrmActivityBell() {
  const router = useRouter();
  const [items, setItems] = useState<CrmPresentationEvent[]>([]);
  const [unread, setUnread] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileTop, setMobileTop] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getToken = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || "";
  }, []);

  const load = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const response = await fetch("/api/crm/activity-feed", { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) return;
      const result = await response.json();
      setItems(result.items || []);
      setUnread(result.unread || 0);
    } catch {
      // brak sieci – spróbujemy przy następnym odświeżeniu
    }
  }, [getToken]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 60000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!isOpen) return;
    function close(event: PointerEvent) {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setIsOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  async function toggle() {
    const next = !isOpen;
    // Na telefonie panel na całą szerokość ekranu, tuż pod przyciskiem.
    const rect = wrapperRef.current?.getBoundingClientRect();
    setMobileTop(window.innerWidth <= 760 && rect ? Math.round(rect.bottom + 8) : null);
    setIsOpen(next);
    if (next) {
      await load();
      if (unread > 0) {
        const token = await getToken();
        if (token) {
          fetch("/api/crm/activity-feed", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(
            () => undefined,
          );
        }
        setUnread(0);
      }
    } else {
      setItems((current) => current.map((item) => ({ ...item, unread: false })));
    }
  }

  return (
    <div className="crmBell" ref={wrapperRef}>
      <button
        aria-expanded={isOpen}
        aria-label={`Powiadomienia${unread ? ` (${unread} nowych)` : ""}`}
        className={`crmBellButton ${unread ? "hasUnread" : ""}`}
        title="Aktywność klientów w prezentacjach"
        type="button"
        onClick={toggle}
      >
        <svg aria-hidden="true" fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="20">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
          <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
        </svg>
        {unread ? <span>{unread > 99 ? "99+" : unread}</span> : null}
      </button>
      {isOpen ? (
        <section
          className="crmBellPanel"
          aria-label="Powiadomienia"
          style={
            mobileTop !== null
              ? { position: "fixed", left: 12, right: 12, top: mobileTop, width: "auto", maxHeight: `calc(100vh - ${mobileTop + 16}px)` }
              : undefined
          }
        >
          <header>
            <strong>Aktywność klientów</strong>
            <small>w powiązanych prezentacjach</small>
          </header>
          {items.length ? (
            <ul>
              {items.map((item) => {
                const text = describe(item);
                return (
                  <li className={`${item.unread ? "unread" : ""} ${item.type}`} key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        if (item.contactId) router.push(`/crm/kontakt/${item.contactId}`);
                      }}
                    >
                      <span className="crmBellDot" aria-hidden="true" />
                      <span className="crmBellText">
                        <span>
                          <strong>{item.contactName}</strong> {text.verb}
                        </span>
                        {text.detail ? <em>{text.detail}</em> : null}
                        <small>{timeAgo(item.createdAt)}</small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>
              Brak aktywności. Skojarz klienta z prezentacją na jego karcie, a tu zobaczysz, kiedy ją otwiera i co
              klika.
            </p>
          )}
        </section>
      ) : null}
      <style jsx>{`
        .crmBell {
          position: relative;
        }
        .crmBellButton {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 999px;
          color: #5b5f66;
          cursor: pointer;
          display: flex;
          height: 34px;
          justify-content: center;
          position: relative;
          width: 34px;
        }
        .crmBellButton:hover {
          background: #f1f3f5;
          color: #21232c;
        }
        .crmBellButton.hasUnread {
          color: #21232c;
        }
        .crmBellButton span {
          background: #e5484d;
          border: 2px solid #ffffff;
          border-radius: 999px;
          color: #ffffff;
          font-size: 10px;
          font-weight: 800;
          line-height: 1;
          min-width: 18px;
          padding: 2px 4px;
          position: absolute;
          right: -3px;
          text-align: center;
          top: -3px;
        }
        .crmBellPanel {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          box-shadow: 0 16px 40px rgba(21, 32, 43, 0.18);
          max-height: min(520px, calc(100vh - 90px));
          overflow: hidden;
          position: absolute;
          right: -40px;
          top: 42px;
          white-space: normal;
          width: 380px;
          z-index: 150;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr);
        }
        .crmBellPanel header {
          border-bottom: 1px solid #e3e6ea;
          display: grid;
          gap: 1px;
          padding: 12px 14px;
        }
        .crmBellPanel header strong {
          color: #21232c;
          font-size: 14px;
        }
        .crmBellPanel header small {
          color: #747678;
          font-size: 12px;
        }
        .crmBellPanel ul {
          list-style: none;
          margin: 0;
          overflow-y: auto;
          padding: 4px 0;
        }
        .crmBellPanel li button {
          align-items: start;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: grid;
          font: inherit;
          gap: 10px;
          grid-template-columns: 8px minmax(0, 1fr);
          padding: 10px 14px;
          text-align: left;
          width: 100%;
        }
        .crmBellPanel li button:hover {
          background: #f5f7fb;
        }
        .crmBellPanel li.unread button {
          background: #f2f6ff;
        }
        .crmBellDot {
          background: #c6c8cc;
          border-radius: 999px;
          height: 8px;
          margin-top: 6px;
          width: 8px;
        }
        .crmBellPanel li.unread .crmBellDot {
          background: #3c61c4;
        }
        .crmBellPanel li.interest .crmBellDot {
          background: #08a742;
        }
        .crmBellText {
          color: #3b3f45;
          display: grid;
          font-size: 13px;
          gap: 2px;
          line-height: 1.35;
          min-width: 0;
        }
        .crmBellText strong {
          color: #21232c;
        }
        .crmBellText em {
          color: #5b5f66;
          font-style: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .crmBellText small {
          color: #9ea2a8;
          font-size: 11px;
        }
        .crmBellPanel > p {
          color: #747678;
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
          padding: 16px 14px;
        }
      `}</style>
    </div>
  );
}
