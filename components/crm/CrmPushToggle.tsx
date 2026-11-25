import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useRef, useState } from "react";

// Przycisk „Powiadomienia na telefon” (PWA). Na czas testów widoczny tylko dla wybranych osób.
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

type Status = "loading" | "hidden" | "unsupported" | "needsInstall" | "off" | "on" | "blocked";

export default function CrmPushToggle() {
  const [status, setStatus] = useState<Status>("loading");
  const [isOpen, setIsOpen] = useState(false);
  const [mobileTop, setMobileTop] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const api = useCallback(async (init?: RequestInit) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch("/api/crm/push", {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Błąd powiadomień.");
    return result;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const info = await api();
      if (!info.enabledForUser) return setStatus("hidden");
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        return setStatus(isIos && !isStandalone ? "needsInstall" : "unsupported");
      }
      if (Notification.permission === "denied") return setStatus("blocked");
      const registration = await navigator.serviceWorker.getRegistration("/crm");
      const subscription = await registration?.pushManager.getSubscription();
      setStatus(subscription ? "on" : "off");
    } catch {
      setStatus("hidden");
    }
  }, [api]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isOpen) return;
    function close(event: PointerEvent) {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isOpen]);

  async function enable() {
    setBusy(true);
    setMessage("");
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) throw new Error("Brak klucza powiadomień w konfiguracji strony.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "off");
        throw new Error("Nie udzielono zgody na powiadomienia.");
      }
      const registration =
        (await navigator.serviceWorker.getRegistration("/crm")) ||
        (await navigator.serviceWorker.register("/crm-sw.js", { scope: "/crm" }));
      await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));
      await api({ method: "POST", body: JSON.stringify({ subscription: subscription.toJSON() }) });
      setStatus("on");
      setMessage("Powiadomienia włączone na tym urządzeniu.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się włączyć powiadomień.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/crm");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await api({ method: "DELETE", body: JSON.stringify({ endpoint: subscription.endpoint }) });
        await subscription.unsubscribe();
      }
      setStatus("off");
      setMessage("Powiadomienia wyłączone na tym urządzeniu.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się wyłączyć.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    try {
      const result = await api({ method: "POST", body: JSON.stringify({ action: "test" }) });
      setMessage(result.sent ? "Wysłano powiadomienie testowe." : "Brak zapisanych urządzeń albo kluczy na serwerze.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się wysłać.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading" || status === "hidden") return null;

  return (
    <div className="crmPush" ref={wrapperRef}>
      <button
        aria-label="Powiadomienia na telefon"
        className={`crmPushButton ${status === "on" ? "on" : ""}`}
        title="Powiadomienia na telefon"
        type="button"
        onClick={() => {
          const rect = wrapperRef.current?.getBoundingClientRect();
          setMobileTop(window.innerWidth <= 760 && rect ? Math.round(rect.bottom + 8) : null);
          setIsOpen((current) => !current);
        }}
      >
        <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="18">
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
          <path d="M11 18.5h2" />
        </svg>
        {status === "on" ? <span /> : null}
      </button>
      {isOpen ? (
        <section
          className="crmPushPanel"
          style={mobileTop !== null ? { position: "fixed", left: 12, right: 12, top: mobileTop, width: "auto" } : undefined}
        >
          <strong>Powiadomienia na telefon</strong>
          {status === "needsInstall" ? (
            <p>
              Na iPhonie: otwórz CRM w <b>Safari</b> → Udostępnij → <b>„Do ekranu początkowego”</b>, uruchom aplikację z
              ikonki i wróć tutaj.
            </p>
          ) : status === "unsupported" ? (
            <p>Ta przeglądarka nie obsługuje powiadomień. Na iPhonie użyj Safari i zainstaluj CRM na ekranie początkowym.</p>
          ) : status === "blocked" ? (
            <p>Powiadomienia są zablokowane. Włącz je w Ustawieniach telefonu → Powiadomienia → Onesta CRM.</p>
          ) : status === "on" ? (
            <>
              <p>Włączone na tym urządzeniu. Dostaniesz powiadomienie o aktywności klientów i 15 min przed zadaniem.</p>
              <div className="crmPushActions">
                <button disabled={busy} type="button" onClick={sendTest}>
                  Wyślij test
                </button>
                <button className="secondary" disabled={busy} type="button" onClick={disable}>
                  Wyłącz
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Włącz, aby dostawać powiadomienia o aktywności klientów w prezentacjach i przypomnienia o zadaniach.</p>
              <div className="crmPushActions">
                <button disabled={busy} type="button" onClick={enable}>
                  {busy ? "Włączanie…" : "Włącz powiadomienia"}
                </button>
              </div>
            </>
          )}
          {message ? <small>{message}</small> : null}
        </section>
      ) : null}
      <style jsx>{`
        .crmPush {
          position: relative;
        }
        .crmPushButton {
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
        .crmPushButton:hover {
          background: #f1f3f5;
          color: #21232c;
        }
        .crmPushButton.on {
          color: #08a742;
        }
        .crmPushButton span {
          background: #08a742;
          border: 2px solid #ffffff;
          border-radius: 999px;
          height: 9px;
          position: absolute;
          right: 4px;
          top: 4px;
          width: 9px;
        }
        .crmPushPanel {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          box-shadow: 0 16px 40px rgba(21, 32, 43, 0.18);
          display: grid;
          gap: 8px;
          padding: 14px;
          position: absolute;
          right: -80px;
          top: 42px;
          white-space: normal;
          width: 300px;
          z-index: 150;
        }
        .crmPushPanel strong {
          color: #21232c;
          font-size: 14px;
        }
        .crmPushPanel p {
          color: #5b5f66;
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
        }
        .crmPushPanel small {
          color: #2b4ba1;
          font-size: 12px;
        }
        .crmPushActions {
          display: flex;
          gap: 8px;
        }
        .crmPushActions button {
          background: #216e63;
          border: 0;
          border-radius: 6px;
          color: #ffffff;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          min-height: 34px;
          padding: 0 12px;
        }
        .crmPushActions button.secondary {
          background: #ffffff;
          border: 1px solid #c6c8cc;
          color: #21232c;
        }
        .crmPushActions button:disabled {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}
