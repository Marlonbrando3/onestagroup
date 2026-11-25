import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

// Menu pod inicjałem w prawym górnym rogu: ustawienia konta / powiadomień i wylogowanie.
export default function CrmAccountMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileTop, setMobileTop] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  async function logout() {
    await supabase.auth.signOut();
    router.push("/logincrm");
  }

  return (
    <div className="crmAccount" ref={wrapperRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Moje konto"
        className="crmAccountButton"
        title={name}
        type="button"
        onClick={() => {
          const rect = wrapperRef.current?.getBoundingClientRect();
          setMobileTop(window.innerWidth <= 760 && rect ? Math.round(rect.bottom + 8) : null);
          setIsOpen((current) => !current);
        }}
      >
        {name.slice(0, 1)}
      </button>
      {isOpen ? (
        <section
          className="crmAccountPanel"
          style={mobileTop !== null ? { position: "fixed", left: 12, right: 12, top: mobileTop, width: "auto" } : undefined}
        >
          <header>
            <strong>{name}</strong>
            <small>{email}</small>
          </header>
          <button type="button" onClick={() => router.push("/crm/konto")}>
            <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="16">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
              <path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" />
            </svg>
            Ustawienia powiadomień
          </button>
          <button className="danger" type="button" onClick={logout}>
            <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" width="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Wyloguj
          </button>
        </section>
      ) : null}
      <style jsx>{`
        .crmAccount {
          position: relative;
        }
        .crmAccountButton {
          align-items: center;
          background: #216e63;
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          font-size: 13px;
          font-weight: 800;
          height: 32px;
          justify-content: center;
          width: 32px;
        }
        .crmAccountButton:hover {
          box-shadow: 0 0 0 3px rgba(33, 110, 99, 0.18);
        }
        .crmAccountPanel {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          box-shadow: 0 16px 40px rgba(21, 32, 43, 0.18);
          display: grid;
          padding: 6px;
          position: absolute;
          right: 0;
          top: 42px;
          white-space: normal;
          width: 250px;
          z-index: 150;
        }
        .crmAccountPanel header {
          border-bottom: 1px solid #eef0f2;
          display: grid;
          gap: 1px;
          margin-bottom: 4px;
          padding: 8px 10px 10px;
        }
        .crmAccountPanel header strong {
          color: #21232c;
          font-size: 14px;
        }
        .crmAccountPanel header small {
          color: #747678;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .crmAccountPanel button {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          display: flex;
          font: inherit;
          font-size: 13px;
          gap: 10px;
          padding: 9px 10px;
          text-align: left;
        }
        .crmAccountPanel button:hover {
          background: #f3f5f7;
        }
        .crmAccountPanel button.danger {
          color: #c0392b;
        }
      `}</style>
    </div>
  );
}
