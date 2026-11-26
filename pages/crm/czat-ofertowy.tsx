import CrmLayout from "@/components/crm/CrmLayout";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Czat ofertowy (link „wygeneruj oferty” z SMS-a powitalnego): asystent, pytania, reguły → wzorce prezentacji.
// Tylko superadmin. Osobna zakładka – wcześniej część strony Lead Managera.
type ChatOption = { id: string; label: string };
type ChatQuestion = { id: string; text: string; options: ChatOption[] };
type ChatConfig = {
  enabled: boolean;
  agentName: string;
  agentSubtitle: string;
  greeting: string;
  questions: ChatQuestion[];
  rules: Record<string, string>;
  defaultListId: string;
  finalText: string;
};
type ChatPresentation = { id: string; name: string; token: string; offersCount: number };

const optionId = () => Math.random().toString(36).slice(2, 8);

export default function OfferChatSettingsPage() {
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);
  const [chatPresentations, setChatPresentations] = useState<ChatPresentation[]>([]);
  const [chatMessage, setChatMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSavingChat, setIsSavingChat] = useState(false);
  const [error, setError] = useState("");

  const api = useCallback(async (url: string, init?: RequestInit) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Zaloguj się ponownie.");
    const response = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Wystąpił błąd.");
    return result;
  }, []);

  useEffect(() => {
    api("/api/crm/leadmanager/chat-config")
      .then((result) => {
        setChatConfig(result.config);
        setChatPresentations(result.presentations || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Błąd."));
  }, [api]);

  async function saveChat() {
    if (!chatConfig) return;
    setIsSavingChat(true);
    setChatMessage(null);
    try {
      const result = await api("/api/crm/leadmanager/chat-config", {
        method: "PUT",
        body: JSON.stringify({ config: chatConfig }),
      });
      setChatConfig(result.config);
      setChatMessage({ ok: true, text: "Zapisano czat ofertowy." });
    } catch (reason) {
      setChatMessage({ ok: false, text: reason instanceof Error ? reason.message : "Nie udało się zapisać." });
    } finally {
      setIsSavingChat(false);
    }
  }

  function updateQuestion(index: number, patch: Partial<ChatQuestion>) {
    if (!chatConfig) return;
    setChatConfig({
      ...chatConfig,
      questions: chatConfig.questions.map((question, current) => (current === index ? { ...question, ...patch } : question)),
    });
  }

  return (
    <CrmLayout active="chat">
      <section className="lmPage">
        <header className="lmHeader">
          <Link href="/crm/leadmanager">← Lead Manager</Link>
          <h1>Czat ofertowy</h1>
          <p>
            Link {"{{chatLink}}"} w SMS-ie powitalnym otwiera czat: powitanie, dwa pytania i wstępnie dobrane oferty (wzorzec
            prezentacji przypisany do odpowiedzi).
          </p>
        </header>

        {error ? <p className="lmError">{error}</p> : null}

            <div className="lmCard">
              <div className="lmCardHead">
                <h2>Ustawienia czatu</h2>
                {chatConfig ? (
                  <label className="lmSwitch">
                    <input
                      checked={chatConfig.enabled}
                      type="checkbox"
                      onChange={(event) => setChatConfig({ ...chatConfig, enabled: event.target.checked })}
                    />
                    <span>Włączony</span>
                  </label>
                ) : null}
              </div>
              <p className="lmHint">
                Wstaw {"{{chatLink}}"} w treść SMS-a powitalnego. Klient po kliknięciu odpowiada na 2 pytania i dostaje prezentację
                przypisaną do jego odpowiedzi, z linkiem rozpoznającym leada (widzisz w CRM, co ogląda, i dostajesz push).
                Pula = wzorce ze strefy agenta (Prezentacje → zakładka „Wzorce (czat)”). Wzorzec nie jest przypisywany do klienta –
                w karcie widać tylko, co oglądał z linku z czatu.
              </p>
              {chatConfig ? (
                <>
                  <div className="lmGrid">
                    <label className="lmField">
                      <span>Imię i nazwisko w nagłówku czatu</span>
                      <input
                        value={chatConfig.agentName}
                        onChange={(event) => setChatConfig({ ...chatConfig, agentName: event.target.value })}
                      />
                    </label>
                    <label className="lmField">
                      <span>Podpis pod imieniem</span>
                      <input
                        value={chatConfig.agentSubtitle}
                        onChange={(event) => setChatConfig({ ...chatConfig, agentSubtitle: event.target.value })}
                      />
                    </label>
                    <label className="lmField lmWide">
                      <span>Powitanie ({"{{firstName}}"} = „, Jan” – imię klienta z przecinkiem)</span>
                      <textarea
                        rows={3}
                        value={chatConfig.greeting}
                        onChange={(event) => setChatConfig({ ...chatConfig, greeting: event.target.value })}
                      />
                    </label>
                  </div>

                  {chatConfig.questions.map((question, questionIndex) => (
                    <div className="lmQuestion" key={questionIndex}>
                      <label className="lmField">
                        <span>Pytanie {questionIndex + 1}</span>
                        <input value={question.text} onChange={(event) => updateQuestion(questionIndex, { text: event.target.value })} />
                      </label>
                      <div className="lmOptions">
                        {question.options.map((option, optionIndex) => (
                          <div className="lmOption" key={option.id}>
                            <input
                              value={option.label}
                              onChange={(event) =>
                                updateQuestion(questionIndex, {
                                  options: question.options.map((item, current) =>
                                    current === optionIndex ? { ...item, label: event.target.value } : item,
                                  ),
                                })
                              }
                            />
                            <button
                              aria-label="Usuń odpowiedź"
                              disabled={question.options.length <= 2}
                              type="button"
                              onClick={() =>
                                updateQuestion(questionIndex, { options: question.options.filter((_, current) => current !== optionIndex) })
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          className="lmLink"
                          disabled={question.options.length >= 8}
                          type="button"
                          onClick={() =>
                            updateQuestion(questionIndex, { options: [...question.options, { id: optionId(), label: "Nowa odpowiedź" }] })
                          }
                        >
                          + Dodaj odpowiedź
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="lmField">
                    <span>Która prezentacja dla jakich odpowiedzi</span>
                    <div className="lmRules">
                      {chatConfig.questions[0].options.flatMap((first) =>
                        chatConfig.questions[1].options.map((second) => {
                          const key = `${first.id}|${second.id}`;
                          return (
                            <div className="lmRule" key={key}>
                              <span>
                                {first.label} <b>+</b> {second.label}
                              </span>
                              <select
                                value={chatConfig.rules[key] || ""}
                                onChange={(event) => {
                                  const rules = { ...chatConfig.rules };
                                  if (event.target.value) rules[key] = event.target.value;
                                  else delete rules[key];
                                  setChatConfig({ ...chatConfig, rules });
                                }}
                              >
                                <option value="">— jak domyślna —</option>
                                {chatPresentations.map((presentation) => (
                                  <option key={presentation.id} value={presentation.id}>
                                    {presentation.name} ({presentation.offersCount})
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        }),
                      )}
                      <div className="lmRule lmRuleDefault">
                        <span>Domyślna (gdy nic nie przypisano)</span>
                        <select
                          value={chatConfig.defaultListId}
                          onChange={(event) => setChatConfig({ ...chatConfig, defaultListId: event.target.value })}
                        >
                          <option value="">— brak —</option>
                          {chatPresentations.map((presentation) => (
                            <option key={presentation.id} value={presentation.id}>
                              {presentation.name} ({presentation.offersCount})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {!chatPresentations.length ? (
                      <small>Brak wzorców – w strefie agenta wybierz oferty i w edytorze ustaw „Rodzaj prezentacji: Wzorzec (czat)”.</small>
                    ) : null}
                  </div>

                  <label className="lmField">
                    <span>Wiadomość przed linkiem do prezentacji</span>
                    <textarea
                      rows={2}
                      value={chatConfig.finalText}
                      onChange={(event) => setChatConfig({ ...chatConfig, finalText: event.target.value })}
                    />
                  </label>

                  <div className="lmActions">
                    <a className="lmPreview" href="/czat" rel="noreferrer" target="_blank">
                      Podgląd czatu ↗
                    </a>
                    <small>Podgląd bez linku z SMS-a nie zapisuje nic w CRM.</small>
                  </div>
                </>
              ) : (
                <p className="lmHint">Ładowanie…</p>
              )}
            </div>

        <div className="lmSaveBar">
          {chatMessage ? <span className={chatMessage.ok ? "" : "lmSaveError"}>{chatMessage.text}</span> : null}
          <button className="primary" disabled={isSavingChat || !chatConfig} type="button" onClick={saveChat}>
            {isSavingChat ? "Zapisywanie…" : "Zapisz czat"}
          </button>
        </div>
      </section>
      <style jsx global>{`
        .lmPage {
          align-content: start;
          background: #f7f7f8;
          color: #21232c;
          display: grid;
          gap: 14px;
          min-height: 100vh;
          padding: 22px clamp(12px, 4vw, 40px) 60px;
        }
        .lmHeader,
        .lmCard,
        .lmSaveBar,
        .lmError {
          max-width: 860px;
          width: 100%;
        }
        .lmHeader {
          display: grid;
          gap: 6px;
        }
        .lmHeader a {
          color: #3c61c4;
          font-size: 13px;
          text-decoration: none;
        }
        .lmHeader h1 {
          font-size: 24px;
          margin: 4px 0 0;
        }
        .lmHeader p,
        .lmHint {
          color: #5b5f66;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }
        .lmPills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .lmPill {
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
        }
        .lmPill.on {
          background: #e6f6ec;
          color: #1f7a48;
        }
        .lmPill.warn {
          background: #fff4d6;
          color: #8a6100;
        }
        .lmPill.off {
          background: #eef0f2;
          color: #5b5f66;
        }
        .lmError {
          background: #fdeeee;
          border-radius: 8px;
          color: #a83434;
          margin: 0;
          padding: 10px 12px;
        }
        .lmCard {
          background: #ffffff;
          border: 1px solid #e3e6ea;
          border-radius: 10px;
          display: grid;
          gap: 12px;
          padding: 16px 18px;
        }
        .lmCard h2 {
          font-size: 16px;
          margin: 0;
        }
        .lmCardHead {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
        }
        .lmGrid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .lmWide {
          grid-column: 1 / -1;
        }
        .lmField {
          display: grid;
          gap: 5px;
        }
        .lmField > span {
          color: #5b5f66;
          font-size: 12px;
          font-weight: 600;
        }
        .lmField small {
          color: #8a8d93;
          font-size: 11px;
        }
        .lmPage input:not([type="checkbox"]),
        .lmPage textarea {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          font: inherit;
          font-size: 13px;
          min-height: 36px;
          padding: 7px 10px;
        }
        .lmPage textarea {
          line-height: 1.5;
          resize: vertical;
        }
        .lmPage input:focus,
        .lmPage textarea:focus {
          border-color: #3c61c4;
          box-shadow: 0 0 0 3px rgba(60, 97, 196, 0.14);
          outline: none;
        }
        .lmSecret {
          display: flex;
          gap: 6px;
        }
        .lmSecret input {
          flex: 1 1 auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          min-width: 0;
        }
        .lmSecret button {
          flex: 0 0 auto;
          padding: 0 10px;
        }
        .lmKey {
          background: #eef0f2;
          border-radius: 4px;
          font-size: 12px;
          margin: 0 4px;
          padding: 1px 6px;
        }
        .lmTagYes {
          background: #e6f6ec !important;
          color: #1f7a48 !important;
        }
        .lmTagNo {
          background: #fdeeee !important;
          color: #a83434 !important;
        }
        .lmQuestion {
          border-top: 1px solid #eef0f2;
          display: grid;
          gap: 8px;
          padding-top: 12px;
        }
        .lmOptions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .lmOption {
          display: flex;
          gap: 4px;
        }
        .lmOption input {
          width: 170px;
        }
        .lmOption button {
          padding: 0 10px;
        }
        .lmRules {
          border: 1px solid #e3e6ea;
          border-radius: 8px;
          display: grid;
        }
        .lmRule {
          align-items: center;
          border-top: 1px solid #eef0f2;
          display: grid;
          gap: 10px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          padding: 8px 10px;
        }
        .lmRule:first-child {
          border-top: 0;
        }
        .lmRule span {
          font-size: 13px;
        }
        .lmRule b {
          color: #8a8d93;
          font-weight: 600;
        }
        .lmRuleDefault {
          background: #f7f8fa;
        }
        .lmPage select {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          font: inherit;
          font-size: 13px;
          min-height: 36px;
          padding: 0 8px;
          width: 100%;
        }
        .lmPreview {
          color: #3c61c4;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }
        .lmCollapsible > summary {
          align-items: center;
          cursor: pointer;
          display: flex;
          flex-wrap: wrap;
          gap: 4px 10px;
          list-style: none;
        }
        .lmCollapsible > summary::-webkit-details-marker {
          display: none;
        }
        .lmCollapsible > summary small {
          color: #8a8d93;
          flex: 1 1 200px;
          font-size: 12px;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lmRefresh {
          justify-self: start;
        }
        .lmCount {
          background: #eef0f2;
          border-radius: 999px;
          color: #5b5f66;
          font-size: 12px;
          font-weight: 700;
          padding: 1px 8px;
        }
        .lmChevron {
          color: #8a8d93;
          font-size: 20px;
          line-height: 1;
          margin-left: auto;
          transition: transform 0.15s ease;
        }
        .lmCollapsible[open] .lmChevron {
          transform: rotate(90deg);
        }
        .lmCopy {
          align-items: center;
          background: #f4f6f8;
          border: 1px solid #e3e6ea;
          border-radius: 6px;
          display: flex;
          gap: 8px;
          justify-content: space-between;
          padding: 6px 6px 6px 10px;
        }
        .lmCopy code {
          font-size: 12px;
          overflow-wrap: anywhere;
        }
        .lmSwitch {
          align-items: center;
          cursor: pointer;
          display: inline-flex;
          font-size: 13px;
          font-weight: 600;
          gap: 8px;
        }
        .lmSwitch input {
          accent-color: #2f9e62;
          height: 16px;
          width: 16px;
        }
        .lmSim {
          font-weight: 500;
        }
        .lmActions {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .lmActions small {
          color: #8a8d93;
          font-size: 12px;
        }
        .lmPage button {
          background: #ffffff;
          border: 1px solid #d5d9de;
          border-radius: 6px;
          color: #21232c;
          cursor: pointer;
          font: inherit;
          font-size: 13px;
          font-weight: 600;
          min-height: 36px;
          padding: 0 14px;
        }
        .lmPage button:hover {
          background: #f4f6f8;
        }
        .lmPage button:disabled {
          cursor: default;
          opacity: 0.55;
        }
        .lmPage button.primary {
          background: #2f9e62;
          border-color: #2f9e62;
          color: #ffffff;
        }
        .lmPage button.lmLink {
          background: transparent;
          border: 0;
          color: #3c61c4;
          min-height: 0;
          padding: 0;
        }
        .lmSaveBar {
          align-items: center;
          background: rgba(247, 247, 248, 0.94);
          bottom: 0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 8px 0;
          position: sticky;
          z-index: 5;
        }
        .lmSaveBar span.lmSaveError {
          color: #a83434;
        }
        .lmSaveBar span {
          color: #1f7a48;
          font-size: 13px;
          font-weight: 600;
        }
        .lmResult {
          white-space: pre-line;
          border-radius: 6px;
          font-size: 13px;
          margin: 0;
          padding: 8px 10px;
        }
        .lmResult.ok {
          background: #e8f6ee;
          color: #1f7a48;
        }
        .lmResult.fail {
          background: #fdeeee;
          color: #a83434;
        }
        .lmList {
          display: grid;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .lmList li {
          align-items: center;
          border-top: 1px solid #eef0f2;
          display: flex;
          font-size: 13px;
          gap: 10px;
          justify-content: space-between;
          padding: 8px 0;
        }
        .lmList li:first-child {
          border-top: 0;
        }
        .lmList li > div {
          align-items: baseline;
          display: flex;
          flex-wrap: wrap;
          gap: 4px 8px;
        }
        .lmList small {
          color: #8a8d93;
          flex-basis: 100%;
          font-size: 12px;
        }
        .lmList a {
          color: #3c61c4;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
        }
        .lmTag {
          background: #eef0f2;
          border-radius: 4px;
          color: #5b5f66;
          font-size: 11px;
          font-style: normal;
          font-weight: 700;
          padding: 1px 6px;
        }
        .lmDot {
          align-self: center;
          background: #9aa3ad;
          border-radius: 999px;
          display: inline-block;
          height: 8px;
          width: 8px;
        }
        .lmDot.success,
        .lmDot.sent {
          background: #2f9e62;
        }
        .lmDot.error,
        .lmDot.failed {
          background: #c94a4a;
        }
        .lmDot.simulated {
          background: #d9a400;
        }
        @media (max-width: 700px) {
          .lmGrid {
            grid-template-columns: 1fr;
          }
          .lmActions input {
            flex: 1 1 100%;
          }
          .lmRule {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </CrmLayout>
  );
}
