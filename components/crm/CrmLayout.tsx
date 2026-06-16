import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { canAccessCrm } from "./users";

type CrmLayoutProps = {
  active: "contacts" | "add" | "pipeline";
  children: ReactNode;
};

function ContactsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

function AddContactIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10" cy="9" r="3" />
      <path d="M4 19c.8-3.1 3-5 6-5s5.2 1.9 6 5" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  );
}

function PipelineIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 3 5-7" />
      <path d="M15 7h4v4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  );
}

export default function CrmLayout({ active, children }: CrmLayoutProps) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push(`/logincrm?redirect=${encodeURIComponent(router.asPath)}`);
        return;
      }
      if (!canAccessCrm(data.user.email)) {
        supabase.auth.signOut().finally(() => {
          router.push("/logincrm");
        });
        return;
      }
      setIsCheckingAuth(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/logincrm");
  }

  if (isCheckingAuth) {
    return (
      <main className="crmShell">
        <aside className="crmSidebar" aria-label="CRM">
          <div className="crmBrand">
            <div className="crmBrandMark">O</div>
            <div>
              <strong>Onesta CRM</strong>
              <span>Kontakty</span>
            </div>
          </div>
        </aside>
        <section className="crmAuthCheck">Sprawdzanie dostepu...</section>
        <style jsx>{`
          .crmShell {
            background: #f4f6f8;
            color: #17202a;
            display: grid;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
            grid-template-columns: 64px minmax(0, 1fr);
            min-height: 100vh;
          }

          .crmSidebar {
            background: #18232f;
            color: #eef4f7;
            padding: 13px 0;
          }

          .crmBrand {
            align-items: center;
            display: flex;
            justify-content: center;
          }

          .crmBrandMark {
            align-items: center;
            background: #216e63;
            border-radius: 6px;
            display: flex;
            font-weight: 800;
            height: 29px;
            justify-content: center;
            width: 29px;
          }

          .crmBrand strong,
          .crmBrand span {
            display: block;
          }

          .crmBrand span {
            color: #b7c5cf;
            font-size: 14px;
          }

          .crmBrand > div:last-child {
            display: none;
          }

          .crmAuthCheck {
            padding: 24px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="crmShell">
      <aside className="crmSidebar" aria-label="CRM">
        <div className="crmBrand">
          <div className="crmBrandMark">O</div>
          <div className="crmBrandText">
            <strong>Onesta CRM</strong>
            <span>Kontakty</span>
          </div>
        </div>
        <nav className="crmNav">
          <Link
            aria-label="Kontakty"
            className={`crmNavItem ${active === "contacts" ? "active" : ""}`}
            href="/crm"
            title="Kontakty"
          >
            <ContactsIcon />
            <span className="crmTooltip">Kontakty</span>
          </Link>
          <Link
            aria-label="Dodaj klienta"
            className={`crmNavItem ${active === "add" ? "active" : ""}`}
            href="/crm/dodaj-kontakt"
            title="Dodaj klienta"
          >
            <AddContactIcon />
            <span className="crmTooltip">Dodaj klienta</span>
          </Link>
          <Link
            aria-label="Lejek"
            className={`crmNavItem ${active === "pipeline" ? "active" : ""}`}
            href="/crm/lejek"
            title="Lejek"
          >
            <PipelineIcon />
            <span className="crmTooltip">Lejek</span>
          </Link>
        </nav>
        <button aria-label="Wyloguj" className="crmLogout" type="button" onClick={handleLogout} title="Wyloguj">
          <LogoutIcon />
          <span className="crmTooltip">Wyloguj</span>
        </button>
      </aside>
      {children}
      <style jsx>{`
        .crmShell {
          background: #f4f6f8;
          color: #17202a;
          display: grid;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
            sans-serif;
          grid-template-columns: 64px minmax(0, 1fr);
          min-height: 100vh;
        }

        .crmSidebar {
          background: #18232f;
          color: #eef4f7;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow: visible;
          padding: 13px 0;
          position: relative;
          z-index: 40;
        }

        .crmBrand {
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .crmBrandMark {
          align-items: center;
          background: #216e63;
          border-radius: 6px;
          display: flex;
          font-weight: 800;
          height: 29px;
          justify-content: center;
          width: 29px;
        }

        .crmBrandText {
          display: none;
        }

        .crmNav {
          align-items: center;
          display: grid;
          gap: 13px;
          justify-items: center;
        }

        :global(.crmNavItem),
        .crmLogout {
          align-items: center;
          border-radius: 6px;
          color: #ffffff;
          display: flex;
          height: 39px;
          justify-content: center;
          padding: 0;
          position: relative;
          width: 39px;
        }

        :global(.crmTooltip) {
          background: #17202a;
          border-radius: 6px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          left: calc(100% + 12px);
          line-height: 1;
          opacity: 0;
          padding: 8px 10px;
          pointer-events: none;
          position: absolute;
          top: 50%;
          transform: translateY(-50%) translateX(-4px);
          transition:
            opacity 0.14s ease,
            transform 0.14s ease;
          white-space: nowrap;
          z-index: 100;
        }

        :global(.crmNavItem:hover .crmTooltip),
        :global(.crmNavItem:focus-visible .crmTooltip),
        :global(.crmLogout:hover .crmTooltip),
        :global(.crmLogout:focus-visible .crmTooltip) {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        :global(.crmNavItem.active),
        :global(.crmNavItem:hover),
        :global(.crmNavItem:focus-visible) {
          background: #654de6;
          color: #ffffff;
        }

        .crmNav :global(svg),
        .crmLogout :global(svg) {
          fill: none;
          height: 21px;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 2;
          width: 21px;
        }

        .crmLogout {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #eef4f7;
          font: inherit;
          margin-top: auto;
        }

        .crmLogout:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        @media (max-width: 900px) {
          .crmShell {
            grid-template-columns: 1fr;
          }

          .crmSidebar {
            flex-direction: row;
            overflow-x: auto;
            padding: 12px;
          }

          .crmNav {
            display: flex;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
