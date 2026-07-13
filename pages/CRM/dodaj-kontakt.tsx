import CrmLayout from "@/components/crm/CrmLayout";
import {
  CrmPipeline,
  CrmStatus,
  defaultCrmPipeline,
} from "@/components/crm/types";
import { useCrmContacts } from "@/components/crm/useCrmContacts";
import { supabase } from "@/lib/supabaseClient";
import { FormEvent, useEffect, useState } from "react";

const emptyContactForm = {
  name: "",
  email: "",
  phone: "",
  maxBudget: "",
  country: "",
  bedrooms: "",
  bathrooms: "",
  coast: "",
  purchaseTimeline: "",
  label: "",
};

export default function CRMAddContactPage() {
  const { addContact, error } = useCrmContacts();
  const [form, setForm] = useState(emptyContactForm);
  const [pipelines, setPipelines] = useState<CrmPipeline[]>([defaultCrmPipeline]);
  const [selectedPipelineId, setSelectedPipelineId] = useState(defaultCrmPipeline.id);
  const [selectedStage, setSelectedStage] = useState<CrmStatus>(
    defaultCrmPipeline.stages[0] || "Zakwalifikowano",
  );
  const [formError, setFormError] = useState("");
  const [pipelinesError, setPipelinesError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedPipeline =
    pipelines.find((pipeline) => pipeline.id === selectedPipelineId) || defaultCrmPipeline;
  const selectedPipelineStages = selectedPipeline.stages.length
    ? selectedPipeline.stages
    : defaultCrmPipeline.stages;
  const selectedStageIndex = Math.max(0, selectedPipelineStages.indexOf(selectedStage));

  useEffect(() => {
    let ignore = false;

    async function loadPipelines() {
      setPipelinesError("");
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setPipelinesError("Zaloguj sie, aby pobrac lejki.");
        return;
      }

      const response = await fetch("/api/crm/pipelines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (ignore) return;
      if (!response.ok) {
        setPipelinesError(result.error || "Nie udalo sie pobrac lejka.");
        return;
      }

      const loadedPipelines = result.pipelines?.length
        ? (result.pipelines as CrmPipeline[])
        : [defaultCrmPipeline];
      setPipelines(loadedPipelines);
      setSelectedPipelineId((current) =>
        loadedPipelines.some((pipeline) => pipeline.id === current)
          ? current
          : loadedPipelines[0].id,
      );
    }

    loadPipelines();
    return () => {
      ignore = true;
    };
  }, []);

  function changePipeline(pipelineId: string) {
    const nextPipeline =
      pipelines.find((pipeline) => pipeline.id === pipelineId) || defaultCrmPipeline;
    const nextStages = nextPipeline.stages.length
      ? nextPipeline.stages
      : defaultCrmPipeline.stages;
    setSelectedPipelineId(nextPipeline.id);
    setSelectedStage((current) =>
      nextStages.includes(current) ? current : nextStages[0] || "Zakwalifikowano",
    );
    setSaved(false);
  }

  function resetForm() {
    setForm(emptyContactForm);
    setFormError("");
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    if (!form.name.trim()) {
      setFormError("Imie i nazwisko jest wymagane.");
      return;
    }

    const normalizedPhone = form.phone.replace(/[\s\u00a0]+/g, "");
    if (!normalizedPhone) {
      setFormError("Numer telefonu jest wymagany.");
      return;
    }
    if (!normalizedPhone.startsWith("+")) {
      setFormError("Numer telefonu musi zaczynac sie od prefixu +.");
      return;
    }

    setFormError("");
    setForm((current) => ({ ...current, phone: normalizedPhone }));
    setIsSaving(true);
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
      pipelineId: selectedPipelineId === defaultCrmPipeline.id ? null : selectedPipelineId,
      status: selectedStage,
    });
    setIsSaving(false);
    if (!contact) return;

    setForm(emptyContactForm);
    setSaved(true);
  }

  return (
    <CrmLayout active="add">
      <section className="crmWorkspace">
        <form className="crmPipelineContactForm" onSubmit={handleSubmit}>
          <header className="crmPipelineContactHeader">
            <p>Nowa szansa sprzedaży</p>
            <strong>{selectedStage}</strong>
          </header>

          <div className="crmPipelineContactColumns">
            <div className="crmPipelineContactColumn">
              <label>
                <span>Imię i nazwisko</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label>
                <span>Adres email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                <span>Numer telefonu</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>
              <label>
                <span>Termin zakupu</span>
                <input
                  value={form.purchaseTimeline}
                  onChange={(event) => setForm({ ...form, purchaseTimeline: event.target.value })}
                />
              </label>
              <label>
                <span>Lejek</span>
                <select
                  value={selectedPipelineId}
                  onChange={(event) => changePipeline(event.target.value)}
                >
                  {pipelines.map((pipeline) => (
                    <option key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="crmPipelineStageField">
                <legend>Etap w lejku</legend>
                <div className="crmPipelineStagePicker">
                  {selectedPipelineStages.map((status, index) => (
                    <button
                      aria-label={`Etap w lejku: ${status}`}
                      className={`${index <= selectedStageIndex ? "filled" : ""} ${
                        selectedStage === status ? "selected" : ""
                      }`}
                      data-stage={status}
                      key={status}
                      title={status}
                      type="button"
                      onClick={() => {
                        setSelectedStage(status);
                        setSaved(false);
                      }}
                    >
                      <span>{status}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <label>
                <span>Etykiety</span>
                <select
                  value={form.label}
                  onChange={(event) => setForm({ ...form, label: event.target.value })}
                >
                  <option value="">Brak etykiety</option>
                  <option value="Gorący lead">Gorący lead</option>
                  <option value="Do kontaktu">Do kontaktu</option>
                  <option value="VIP">VIP</option>
                  <option value="Inwestor">Inwestor</option>
                </select>
              </label>
            </div>

            <div className="crmPipelineContactColumn">
              <label>
                <span>Kraj</span>
                <input
                  value={form.country}
                  onChange={(event) => setForm({ ...form, country: event.target.value })}
                />
              </label>
              <label>
                <span>Wybrzeże</span>
                <input
                  value={form.coast}
                  onChange={(event) => setForm({ ...form, coast: event.target.value })}
                />
              </label>
              <label>
                <span>Sypialnie</span>
                <input
                  value={form.bedrooms}
                  onChange={(event) => setForm({ ...form, bedrooms: event.target.value })}
                />
              </label>
              <label>
                <span>Łazienki</span>
                <input
                  value={form.bathrooms}
                  onChange={(event) => setForm({ ...form, bathrooms: event.target.value })}
                />
              </label>
              <label>
                <span>Kwota max EUR</span>
                <input
                  inputMode="numeric"
                  value={form.maxBudget}
                  onChange={(event) => setForm({ ...form, maxBudget: event.target.value })}
                />
              </label>
            </div>
          </div>

          {formError ? <p className="crmPipelineContactError">{formError}</p> : null}
          {error ? <p className="crmPipelineContactError">{error}</p> : null}
          {pipelinesError ? <p className="crmPipelineContactError">{pipelinesError}</p> : null}
          {saved ? <p className="crmPipelineContactSaved">Kontakt zapisany.</p> : null}

          <div className="crmPipelineContactActions">
            <button disabled={isSaving} type="button" onClick={resetForm}>
              Anuluj
            </button>
            <button disabled={isSaving} type="submit">
              {isSaving ? "Zapisywanie..." : "Dodaj kontakt"}
            </button>
          </div>
        </form>
      </section>

      <style jsx>{`
        .crmWorkspace {
          align-content: start;
          background: #ffffff;
          display: grid;
          min-height: 100vh;
          min-width: 0;
          padding: 24px;
        }

        .crmPipelineContactForm {
          background: #ffffff;
          border: 0;
          border-radius: 0;
          box-shadow: none;
          color: #17202a;
          display: grid;
          gap: 12px;
          max-width: 820px;
          padding: 0;
          width: 100%;
        }

        .crmPipelineContactHeader {
          display: grid;
          gap: 3px;
        }

        .crmPipelineContactHeader p {
          color: #216e63;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0;
          margin: 0;
          text-transform: uppercase;
        }

        .crmPipelineContactHeader strong {
          font-size: 18px;
          line-height: 1.15;
        }

        .crmPipelineContactColumns {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .crmPipelineContactColumn {
          align-content: start;
          display: grid;
          gap: 9px;
          min-width: 0;
        }

        .crmPipelineContactForm label {
          color: #4b5563;
          display: grid;
          font-size: 11px;
          font-weight: 900;
          gap: 4px;
          margin: 0;
        }

        .crmPipelineContactForm label span,
        .crmPipelineStageField legend {
          color: #4b5563;
          font-size: 11px;
          font-weight: 900;
        }

        .crmPipelineContactForm input,
        .crmPipelineContactForm select {
          background: #f9fafb;
          border: 1px solid #d8dee7;
          border-radius: 8px;
          color: #17202a;
          font: inherit;
          font-size: 13px;
          min-height: 40px;
          outline: 0;
          padding: 0 12px;
          width: 100%;
        }

        .crmPipelineStageField {
          border: 0;
          display: grid;
          gap: 6px;
          margin: 0;
          min-width: 0;
          padding: 0;
        }

        .crmPipelineStagePicker {
          display: flex;
          height: 59px;
          min-width: 0;
          overflow-x: auto;
          overflow-y: visible;
          padding: 10px 0;
        }

        .crmPipelineStagePicker button {
          background: transparent;
          border: 0;
          color: transparent;
          flex: 0 0 42px;
          height: 30px;
          margin-right: -8px;
          min-width: 42px;
          overflow: visible;
          padding: 0;
          position: relative;
        }

        .crmPipelineStagePicker button::before {
          background: #dedede;
          border-radius: 4px;
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 50%,
            calc(100% - 10px) 100%,
            0 100%,
            10px 50%
          );
          content: "";
          inset: 0;
          position: absolute;
          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }

        .crmPipelineStagePicker button:first-child::before {
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 50%,
            calc(100% - 10px) 100%,
            0 100%
          );
        }

        .crmPipelineStagePicker button:last-child {
          margin-right: 0;
        }

        .crmPipelineStagePicker button:last-child::before {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 10px 50%);
        }

        .crmPipelineStagePicker button.filled::before {
          background: #2f8b4f;
        }

        .crmPipelineStagePicker button.selected::before {
          background: #007f39;
        }

        .crmPipelineStagePicker button:hover::before,
        .crmPipelineStagePicker button:focus-visible::before {
          transform: translateY(-1px);
        }

        .crmPipelineStagePicker button::after {
          background: #24242a;
          border-radius: 4px;
          color: #ffffff;
          content: attr(data-stage);
          font-size: 11px;
          font-weight: 800;
          left: 50%;
          line-height: 0;
          opacity: 0;
          padding: 6px 8px;
          pointer-events: none;
          position: absolute;
          top: calc(100% + 6px);
          transform: translateX(-50%);
          transition: opacity 0.12s ease;
          white-space: nowrap;
          z-index: 8;
        }

        .crmPipelineStagePicker button:hover::after,
        .crmPipelineStagePicker button:focus-visible::after {
          opacity: 1;
        }

        .crmPipelineStagePicker button span {
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }

        .crmPipelineContactError,
        .crmPipelineContactSaved {
          font-size: 12px;
          font-weight: 800;
          margin: 0;
        }

        .crmPipelineContactError {
          color: #b42318;
        }

        .crmPipelineContactSaved {
          color: #155149;
        }

        .crmPipelineContactActions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .crmPipelineContactActions button {
          border: 0;
          border-radius: 8px;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          min-height: 40px;
          padding: 0 14px;
        }

        .crmPipelineContactActions button:first-child {
          background: #e4e7ec;
          color: #344054;
        }

        .crmPipelineContactActions button:last-child {
          background: #216e63;
          color: #ffffff;
        }

        .crmPipelineContactActions button:disabled {
          cursor: not-allowed;
          opacity: 0.72;
        }

        @media (max-width: 760px) {
          .crmWorkspace {
            padding: 16px;
          }

          .crmPipelineContactColumns {
            grid-template-columns: 1fr;
          }

          .crmPipelineContactActions {
            justify-content: stretch;
          }

          .crmPipelineContactActions button {
            flex: 1 1 0;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
