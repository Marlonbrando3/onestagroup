import CrmLayout from "@/components/crm/CrmLayout";
import { CrmStatus, crmStatuses } from "@/components/crm/types";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import { FormEvent, useState } from "react";

export default function CRMAddContactPage() {
  const { addContact, error } = useCrmContacts();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    maxBudget: "",
    country: "",
    bedrooms: "",
    bathrooms: "",
    coast: "",
    purchaseTimeline: "",
    status: "Zakwalifikowano" as CrmStatus,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    const normalizedPhone = form.phone.replace(/[\s\u00a0]+/g, "");
    setForm((current) => ({ ...current, phone: normalizedPhone }));
    const contact = await addContact({
      name: form.name,
      company: "Bez firmy",
      email: form.email,
      phone: normalizedPhone,
      value: Number(form.maxBudget || 0),
      maxBudget: Number(form.maxBudget || 0),
      country: form.country,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      coast: form.coast,
      purchaseTimeline: form.purchaseTimeline,
      status: form.status,
    });
    if (!contact) return;
    setSaved(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      maxBudget: "",
      country: "",
      bedrooms: "",
      bathrooms: "",
      coast: "",
      purchaseTimeline: "",
      status: "Zakwalifikowano",
    });
  }

  return (
    <CrmLayout active="add">
      <section className="crmWorkspace">
        <header className="crmTopbar">
          <div>
            <p>Kontakt</p>
            <h1>Dodaj kontakt</h1>
          </div>
        </header>

        <form className="crmForm" onSubmit={handleSubmit}>
          <input
            placeholder="Imie i nazwisko"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            placeholder="Telefon"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <input
            inputMode="numeric"
            placeholder="Kwota max EUR"
            value={form.maxBudget}
            onChange={(event) => setForm({ ...form, maxBudget: event.target.value })}
          />
          <input
            placeholder="Kraj"
            value={form.country}
            onChange={(event) => setForm({ ...form, country: event.target.value })}
          />
          <input
            placeholder="Sypialnie"
            value={form.bedrooms}
            onChange={(event) => setForm({ ...form, bedrooms: event.target.value })}
          />
          <input
            placeholder="Łazienki"
            value={form.bathrooms}
            onChange={(event) => setForm({ ...form, bathrooms: event.target.value })}
          />
          <input
            placeholder="Wybrzeże"
            value={form.coast}
            onChange={(event) => setForm({ ...form, coast: event.target.value })}
          />
          <input
            placeholder="Termin zakupu"
            value={form.purchaseTimeline}
            onChange={(event) => setForm({ ...form, purchaseTimeline: event.target.value })}
          />
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as CrmStatus })}
          >
            {crmStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button type="submit">Dodaj kontakt</button>
          {saved ? <p className="crmSaved">Kontakt zapisany.</p> : null}
          {error ? <p className="crmError">{error}</p> : null}
        </form>
      </section>
      <style jsx>{`
        .crmWorkspace {
          align-content: start;
          display: grid;
          gap: 20px;
          max-width: 760px;
          min-width: 0;
          padding: 24px;
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

        .crmForm {
          background: #ffffff;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          box-shadow: 0 14px 34px rgba(21, 32, 43, 0.08);
          display: grid;
          gap: 12px;
          padding: 18px;
        }

        .crmForm input,
        .crmForm select {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          min-height: 44px;
          outline: 0;
          padding: 0 12px;
          width: 100%;
        }

        .crmForm button {
          background: #216e63;
          border: 0;
          border-radius: 8px;
          color: #ffffff;
          font-weight: 800;
          min-height: 44px;
          padding: 0 16px;
        }

        .crmSaved {
          color: #155149;
          margin: 0;
        }

        .crmError {
          color: #b42318;
          margin: 0;
        }
      `}</style>
    </CrmLayout>
  );
}
