import CrmLayout from "@/components/crm/CrmLayout";
import { crmCurrency } from "@/components/crm/types";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function CRMContactsPage() {
  const { contacts, isLoading, error } = useCrmContacts();
  const [query, setQuery] = useState("");

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return contacts;
    return contacts.filter((contact) =>
      [contact.name, contact.company, contact.email, contact.phone, contact.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [contacts, query]);

  return (
    <CrmLayout active="contacts">
      <section className="crmWorkspace">
        <header className="crmTopbar">
          <div>
            <p>Kontakty</p>
            <h1>Lista kontaktow</h1>
          </div>
          <Link className="crmPrimaryButton" href="/crm/dodaj-kontakt">
            Dodaj kontakt
          </Link>
        </header>

        <input
          className="crmSearch"
          placeholder="Szukaj kontaktu, firmy, telefonu..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {error ? <p className="crmError">{error}</p> : null}
        {isLoading ? <p className="crmMuted">Ladowanie kontaktow...</p> : null}

        <section className="crmTable" aria-label="Kontakty">
          <div className="crmTableHeader">
            <span>Kontakt</span>
            <span>Status</span>
            <span>Wartosc</span>
            <span>Telefon</span>
          </div>
          {filteredContacts.map((contact) => (
            <article className="crmContactLine" key={contact.id}>
              <div className="crmContactIdentity">
                <div className="crmAvatar">{contact.name.slice(0, 1)}</div>
                <div>
                  <Link href={`/crm/kontakt/${contact.id}`}>
                    <strong>{contact.name}</strong>
                  </Link>
                  <span>{contact.company}</span>
                </div>
              </div>
              <span className="crmStatusPill">{contact.status}</span>
              <strong>{crmCurrency.format(contact.value)}</strong>
              <div className="crmLinks">
                <a href={`tel:${contact.phone}`}>{contact.phone || "Brak telefonu"}</a>
                <a href={`mailto:${contact.email}`}>{contact.email || "Brak emaila"}</a>
              </div>
            </article>
          ))}
        </section>
      </section>
      <style jsx>{`
        .crmWorkspace {
          display: grid;
          gap: 20px;
          min-width: 0;
          padding: 24px;
        }

        .crmTopbar {
          align-items: center;
          display: flex;
          gap: 20px;
          justify-content: space-between;
        }

        .crmTopbar p {
          color: #216e63;
          font-size: 13px;
          font-weight: 800;
          margin: 0 0 4px;
          text-transform: uppercase;
        }

        .crmTopbar h1 {
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.08;
          margin: 0;
        }

        .crmPrimaryButton {
          background: #216e63;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 800;
          min-height: 44px;
          padding: 11px 16px;
        }

        .crmSearch {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          max-width: 680px;
          min-height: 44px;
          outline: 0;
          padding: 0 14px;
          width: 100%;
        }

        .crmTable {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
          overflow: hidden;
        }

        .crmTableHeader,
        .crmContactLine {
          display: grid;
          gap: 14px;
          grid-template-columns: minmax(260px, 1.4fr) 130px 140px minmax(220px, 1fr);
          padding: 14px 16px;
        }

        .crmTableHeader {
          background: #f9fafb;
          color: #667085;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .crmContactLine {
          align-items: center;
          border-top: 1px solid #d8dee7;
        }

        .crmContactIdentity {
          align-items: center;
          display: flex;
          gap: 12px;
          min-width: 0;
        }

        .crmContactIdentity span,
        .crmLinks a,
        .crmMuted {
          color: #667085;
          font-size: 13px;
        }

        .crmContactIdentity a {
          color: #17202a;
          display: inline-block;
          font-size: 16px;
        }

        .crmLinks {
          display: grid;
          gap: 4px;
        }

        .crmAvatar {
          align-items: center;
          background: #e8eef3;
          border-radius: 8px;
          color: #2f4658;
          display: flex;
          flex: 0 0 auto;
          font-weight: 800;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        .crmStatusPill {
          background: #e7f2ef;
          border-radius: 999px;
          color: #155149;
          display: inline-flex;
          font-size: 13px;
          font-weight: 800;
          justify-content: center;
          padding: 6px 10px;
        }

        .crmError {
          color: #b42318;
          margin: 0;
        }

        @media (max-width: 760px) {
          .crmTopbar {
            align-items: stretch;
            flex-direction: column;
          }

          .crmTableHeader {
            display: none;
          }

          .crmContactLine {
            grid-template-columns: 1fr;
          }

          .crmStatusPill {
            justify-self: start;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
