import CrmLayout from "@/components/crm/CrmLayout";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Lead Manager – konfiguracja techniczna (tylko superadmin): Meta Lead Ads, SMSAPI, testy, dziennik.
// Leady z Facebooka trafiają od razu do lejka CRM, właściciel dostaje push.

type Settings = {
  companyName: string;
  leadOwnerEmail: string;
  meta: {
    enabled: boolean;
    appId: string;
    appSecret: string;
    verifyToken: string;
    pageAccessToken: string;
    graphApiVersion: string;
    hasAppSecret?: boolean;
    hasPageAccessToken?: boolean;
  };
  sms: {
    enabled: boolean;
    simulationMode: boolean;
    apiToken: string;
    senderName: string;
    clientTemplate: string;
    basicTemplate: string;
    hasApiToken?: boolean;
  };
  consents: { requireSmsConsent: boolean; smsKey: string; phoneKey: string };
  updatedAt: string | null;
};
type LogRow = { id: string; level: "info" | "success" | "error"; title: string; detail: string | null; created_at: string };
type LeadRow = {
  id: string;
  created_at: string;
  source: string;
  name: string;
  phone: string;
  form_name: string | null;
  crm_contact_id: string | null;
  duplicate_of_existing: boolean;
  consents?: Array<{ key: string; checked: boolean }>;
};
type SmsRow = { id: string; created_at: string; audience: string; recipient: string; status: string; error: string | null };

type SecretKey = "appSecret" | "pageAccessToken" | "apiToken";
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

const WEBHOOK_URL = "https://onesta.com.pl/api/leadmanager/meta-webhook";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

export default function LeadManagerPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [masks, setMasks] = useState({ appSecret: "", pageAccessToken: "", apiToken: "" });
  const [secrets, setSecrets] = useState({ appSecret: "", pageAccessToken: "", apiToken: "" });
  const [diag, setDiag] = useState<{ log: LogRow[]; leads: LeadRow[]; sms: SmsRow[] }>({ log: [], leads: [], sms: [] });
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<Record<string, { ok: boolean; message: string }>>({});
  const [busyAction, setBusyAction] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testLead, setTestLead] = useState({ name: "Test Lead Manager", phone: "", email: "" });
  const [copied, setCopied] = useState(false);
  const [chatConfig, setChatConfig] = useState<ChatConfig | null>(null);
  const [chatPresentations, setChatPresentations] = useState<ChatPresentation[]>([]);
  const [chatMessage, setChatMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isSavingChat, setIsSavingChat] = useState(false);
  const [metaPages, setMetaPages] = useState<Array<{ id: string; name: string; subscribed: boolean }>>([]);
  const [revealed, setRevealed] = useState<Record<SecretKey, boolean>>({ appSecret: false, pageAccessToken: false, apiToken: false });
  const [revealBusy, setRevealBusy] = useState<SecretKey | "">("");
  const [copiedSecret, setCopiedSecret] = useState<SecretKey | "">("");

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

  const applySettings = (value: Settings) => {
    setSettings(value);
    setMasks({ appSecret: value.meta.appSecret, pageAccessToken: value.meta.pageAccessToken, apiToken: value.sms.apiToken });
    setSecrets({ appSecret: "", pageAccessToken: "", apiToken: "" });
    setRevealed({ appSecret: false, pageAccessToken: false, apiToken: false });
  };

  // „Pokaż”: pobiera zapisaną wartość i wstawia ją do pola (można ją skopiować albo poprawić)
  async function toggleReveal(key: SecretKey) {
    if (revealed[key]) {
      setRevealed((current) => ({ ...current, [key]: false }));
      return;
    }
    if (!secrets[key] && masks[key]) {
      setRevealBusy(key);
      try {
        const result = await api(`/api/crm/leadmanager/settings?reveal=${key}`);
        setSecrets((current) => ({ ...current, [key]: result.value || "" }));
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Nie udało się pobrać tokenu.");
        setRevealBusy("");
        return;
      }
      setRevealBusy("");
    }
    setRevealed((current) => ({ ...current, [key]: true }));
  }

  function copySecret(key: SecretKey) {
    if (!secrets[key]) return;
    navigator.clipboard?.writeText(secrets[key]).then(() => {
      setCopiedSecret(key);
      window.setTimeout(() => setCopiedSecret(""), 1500);
    });
  }

  function secretInput(key: SecretKey, emptyPlaceholder: string) {
    return (
      <div className="lmSecret">
        <input
          autoComplete="new-password"
          data-1p-ignore
          data-lpignore="true"
          name={`lm-${key}`}
          placeholder={masks[key] ? `${masks[key]} – zostaw puste, aby nie zmieniać` : emptyPlaceholder}
          spellCheck={false}
          type={revealed[key] ? "text" : "password"}
          value={secrets[key]}
          onChange={(event) => setSecrets({ ...secrets, [key]: event.target.value })}
        />
        <button disabled={revealBusy === key || (!masks[key] && !secrets[key])} type="button" onClick={() => toggleReveal(key)}>
          {revealBusy === key ? "…" : revealed[key] ? "Ukryj" : "Pokaż"}
        </button>
        {revealed[key] && secrets[key] ? (
          <button type="button" onClick={() => copySecret(key)}>
            {copiedSecret === key ? "Skopiowano" : "Kopiuj"}
          </button>
        ) : null}
      </div>
    );
  }

  const loadDiagnostics = useCallback(async () => {
    try {
      setDiag(await api("/api/crm/leadmanager/diagnostics"));
    } catch {
      // dziennik jest pomocniczy
    }
  }, [api]);

  useEffect(() => {
    api("/api/crm/leadmanager/settings")
      .then((result) => applySettings(result.settings))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Błąd."));
    loadDiagnostics();
    api("/api/crm/leadmanager/chat-config")
      .then((result) => {
        setChatConfig(result.config);
        setChatPresentations(result.presentations || []);
      })
      .catch(() => undefined);
  }, [api, loadDiagnostics]);

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

  async function save() {
    if (!settings) return;
    setIsSaving(true);
    setSaveMessage("");
    setError("");
    try {
      const result = await api("/api/crm/leadmanager/settings", {
        method: "PUT",
        body: JSON.stringify({
          ...settings,
          meta: { ...settings.meta, appSecret: secrets.appSecret, pageAccessToken: secrets.pageAccessToken },
          sms: { ...settings.sms, apiToken: secrets.apiToken },
        }),
      });
      applySettings(result.settings);
      setSaveMessage("Zapisano konfigurację.");
      loadDiagnostics();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Nie udało się zapisać.");
    } finally {
      setIsSaving(false);
    }
  }

  async function runTest(action: string, payload: Record<string, unknown> = {}) {
    setBusyAction(action);
    try {
      const result = await api("/api/crm/leadmanager/diagnostics", {
        method: "POST",
        body: JSON.stringify({ action, ...payload }),
      });
      setTestResult((current) => ({ ...current, [action]: { ok: Boolean(result.ok), message: result.message || "" } }));
      if (action === "check_subscription") setMetaPages(result.pages || []);
      if (action === "subscribe_page") {
        const check = await api("/api/crm/leadmanager/diagnostics", {
          method: "POST",
          body: JSON.stringify({ action: "check_subscription" }),
        }).catch(() => null);
        if (check?.pages) setMetaPages(check.pages);
      }
      if (action === "simulate_lead" && result.contactId) {
        setTestResult((current) => ({
          ...current,
          simulate_lead: { ok: true, message: `${result.message} Karta: /crm/kontakt/${result.contactId}` },
        }));
      }
    } catch (reason) {
      setTestResult((current) => ({
        ...current,
        [action]: { ok: false, message: reason instanceof Error ? reason.message : "Błąd testu." },
      }));
    } finally {
      setBusyAction("");
      loadDiagnostics();
    }
  }

  const result = (action: string) =>
    testResult[action] ? (
      <p className={`lmResult ${testResult[action].ok ? "ok" : "fail"}`}>{testResult[action].message}</p>
    ) : null;

  const metaStatus = settings?.meta.enabled ? (settings.meta.hasPageAccessToken && settings.meta.hasAppSecret ? "on" : "warn") : "off";
  const smsStatus = !settings?.sms.enabled ? "off" : settings.sms.simulationMode ? "warn" : "on";

  return (
    <CrmLayout active="leadmanager">
      <section className="lmPage">
        <header className="lmHeader">
          <Link href="/crm">← Wróć do lejka</Link>
          <h1>Lead Manager</h1>
          <p>
            Leady z formularzy Facebooka trafiają od razu do Twojego lejka (etap „Zakwalifikowano”). Imię i nazwisko, telefon i
            e-mail wypełniają kartę klienta, pozostałe odpowiedzi z ankiety trafiają do „Podsumowania informacji o kliencie”.
            Klient dostaje SMS powitalny, Ty – powiadomienie push.
          </p>
          {settings ? (
            <div className="lmPills">
              <span className={`lmPill ${metaStatus}`}>
                Meta: {metaStatus === "on" ? "aktywna" : metaStatus === "warn" ? "brak tokenów" : "wyłączona"}
              </span>
              <span className={`lmPill ${smsStatus}`}>
                SMS: {smsStatus === "on" ? "wysyłka na żywo" : smsStatus === "warn" ? "tryb symulacji" : "wyłączony"}
              </span>
            </div>
          ) : null}
        </header>

        {error ? <p className="lmError">{error}</p> : null}

        {settings ? (
          <>
            <div className="lmCard">
              <div className="lmCardHead">
                <h2>Meta Lead Ads (Facebook / Instagram)</h2>
                <label className="lmSwitch">
                  <input
                    checked={settings.meta.enabled}
                    type="checkbox"
                    onChange={(event) => setSettings({ ...settings, meta: { ...settings.meta, enabled: event.target.checked } })}
                  />
                  <span>Odbieraj leady</span>
                </label>
              </div>
              <div className="lmField">
                <span>Callback URL (wklej w Meta → Webhooks → Page → leadgen)</span>
                <div className="lmCopy">
                  <code>{WEBHOOK_URL}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(WEBHOOK_URL).then(() => {
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1500);
                      });
                    }}
                  >
                    {copied ? "Skopiowano" : "Kopiuj"}
                  </button>
                </div>
              </div>
              <div className="lmGrid">
                <label className="lmField">
                  <span>Verify Token (dowolny, ten sam co w Meta)</span>
                  <input
                    autoComplete="off"
                    name="lm-verify-token"
                    spellCheck={false}
                    value={settings.meta.verifyToken}
                    onChange={(event) => setSettings({ ...settings, meta: { ...settings.meta, verifyToken: event.target.value } })}
                  />
                </label>
                <label className="lmField">
                  <span>App ID</span>
                  <input
                    autoComplete="off"
                    inputMode="numeric"
                    name="lm-app-id"
                    placeholder="np. 1234567890123456"
                    value={settings.meta.appId}
                    onChange={(event) => setSettings({ ...settings, meta: { ...settings.meta, appId: event.target.value } })}
                  />
                </label>
                <div className="lmField">
                  <span>App Secret {settings.meta.hasAppSecret ? "✓ zapisany" : ""}</span>
                  {secretInput("appSecret", "Wklej App Secret")}
                </div>
                <label className="lmField">
                  <span>Wersja Graph API</span>
                  <input
                    value={settings.meta.graphApiVersion}
                    onChange={(event) =>
                      setSettings({ ...settings, meta: { ...settings.meta, graphApiVersion: event.target.value } })
                    }
                  />
                </label>
                <div className="lmField lmWide">
                  <span>Page Access Token {settings.meta.hasPageAccessToken ? "✓ zapisany" : ""}</span>
                  {secretInput("pageAccessToken", "Wklej token strony")}
                </div>
              </div>
              <div className="lmActions">
                <button disabled={busyAction === "test_meta"} type="button" onClick={() => runTest("test_meta")}>
                  {busyAction === "test_meta" ? "Sprawdzam…" : "Testuj token Meta"}
                </button>
                <button
                  disabled={busyAction === "check_subscription"}
                  type="button"
                  onClick={() => runTest("check_subscription")}
                >
                  {busyAction === "check_subscription" ? "Sprawdzam…" : "Sprawdź subskrypcję strony"}
                </button>
                <small>Najpierw zapisz zmiany – testy używają zapisanej konfiguracji.</small>
              </div>
              {result("test_meta")}
              {result("check_subscription")}
              {metaPages.length ? (
                <ul className="lmList">
                  {metaPages.map((page) => (
                    <li key={page.id}>
                      <div>
                        <span className={`lmDot ${page.subscribed ? "success" : "error"}`} />
                        <strong>{page.name}</strong>
                        <small>
                          {page.subscribed ? "Podłączona – leady trafiają do CRM" : "Niepodłączona – Meta nie wysyła z niej leadów"} · ID{" "}
                          {page.id}
                        </small>
                      </div>
                      {!page.subscribed ? (
                        <button
                          disabled={busyAction === "subscribe_page"}
                          type="button"
                          onClick={() => runTest("subscribe_page", { pageId: page.id })}
                        >
                          {busyAction === "subscribe_page" ? "Podłączam…" : "Podłącz"}
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {result("subscribe_page")}
            </div>

            <div className="lmCard">
              <div className="lmCardHead">
                <h2>SMS powitalny do klienta (SMSAPI)</h2>
                <label className="lmSwitch">
                  <input
                    checked={settings.sms.enabled}
                    type="checkbox"
                    onChange={(event) => setSettings({ ...settings, sms: { ...settings.sms, enabled: event.target.checked } })}
                  />
                  <span>Wysyłaj</span>
                </label>
              </div>
              <label className="lmSwitch lmSim">
                <input
                  checked={settings.sms.simulationMode}
                  type="checkbox"
                  onChange={(event) =>
                    setSettings({ ...settings, sms: { ...settings.sms, simulationMode: event.target.checked } })
                  }
                />
                <span>Tryb symulacji – SMS-y nie wychodzą, tylko zapis w dzienniku</span>
              </label>
              <div className="lmGrid">
                <div className="lmField">
                  <span>Token SMSAPI {settings.sms.hasApiToken ? "✓ zapisany" : ""}</span>
                  {secretInput("apiToken", "Wklej token OAuth SMSAPI")}
                </div>
                <label className="lmField">
                  <span>Nadawca (pole nadawcy SMSAPI, maks. 11 znaków)</span>
                  <input
                    autoComplete="off"
                    maxLength={11}
                    name="lm-sender"
                    value={settings.sms.senderName}
                    onChange={(event) => setSettings({ ...settings, sms: { ...settings.sms, senderName: event.target.value } })}
                  />
                </label>
                <label className="lmField lmWide">
                  <span>
                    Treść SMS-a powitalnego. Zmienne: {"{{name}}"} (imię i nazwisko),{" "}
                    {"{{firstName}}"} (imię), {"{{company}}"}, {"{{chatLink}}"} (czat „wygeneruj oferty”), {"{{cbTopLink}}"} (TOP 20)
                  </span>
                  <textarea
                    rows={8}
                    value={settings.sms.clientTemplate}
                    onChange={(event) =>
                      setSettings({ ...settings, sms: { ...settings.sms, clientTemplate: event.target.value } })
                    }
                  />
                  <small>{settings.sms.clientTemplate.length} znaków</small>
                </label>

              </div>
              <div className="lmActions">
                <input
                  placeholder="+48 …"
                  value={testPhone}
                  onChange={(event) => setTestPhone(event.target.value)}
                />
                <button
                  disabled={busyAction === "test_sms" || !testPhone.trim()}
                  type="button"
                  onClick={() => runTest("test_sms", { phone: testPhone })}
                >
                  {busyAction === "test_sms" ? "Wysyłam…" : "Wyślij test SMS"}
                </button>
              </div>
              {result("test_sms")}
            </div>

            <div className="lmSaveBar">
              {saveMessage ? <span>{saveMessage}</span> : null}
              <button className="primary" disabled={isSaving} type="button" onClick={save}>
                {isSaving ? "Zapisywanie…" : "Zapisz konfigurację"}
              </button>
            </div>

            <div className="lmCard">
              <div className="lmCardHead">
                <h2>Czat ofertowy (link „wygeneruj oferty” w SMS-ie)</h2>
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
                    <button className="primary" disabled={isSavingChat} type="button" onClick={saveChat}>
                      {isSavingChat ? "Zapisywanie…" : "Zapisz czat"}
                    </button>
                    <a className="lmPreview" href="/czat" rel="noreferrer" target="_blank">
                      Podgląd czatu ↗
                    </a>
                    <small>Podgląd bez linku z SMS-a nie zapisuje nic w CRM.</small>
                  </div>
                  {chatMessage ? <p className={`lmResult ${chatMessage.ok ? "ok" : "fail"}`}>{chatMessage.text}</p> : null}
                </>
              ) : (
                <p className="lmHint">Ładowanie…</p>
              )}
            </div>

            <div className="lmCard">
              <h2>Testy przepływu</h2>
              <p className="lmHint">
                Lead testowy przechodzi całą ścieżkę: tworzy szansę sprzedaży w Twoim lejku, wysyła push i SMS (albo jego
                symulację). Wpisz swój numer – na numer, który już jest w CRM, ankieta dopisze się do istniejącego kontaktu.
              </p>
              <div className="lmActions">
                <input
                  placeholder="Imię i nazwisko"
                  value={testLead.name}
                  onChange={(event) => setTestLead({ ...testLead, name: event.target.value })}
                />
                <input
                  placeholder="Telefon"
                  value={testLead.phone}
                  onChange={(event) => setTestLead({ ...testLead, phone: event.target.value })}
                />
                <input
                  placeholder="E-mail (opcjonalnie)"
                  value={testLead.email}
                  onChange={(event) => setTestLead({ ...testLead, email: event.target.value })}
                />
                <button
                  disabled={busyAction === "simulate_lead" || !testLead.phone.trim()}
                  type="button"
                  onClick={() => runTest("simulate_lead", testLead)}
                >
                  {busyAction === "simulate_lead" ? "Tworzę…" : "Utwórz lead testowy"}
                </button>
              </div>
              {result("simulate_lead")}
              <div className="lmActions">
                <button disabled={busyAction === "test_push"} type="button" onClick={() => runTest("test_push")}>
                  Wyślij testowy push „Nowy lead”
                </button>
              </div>
              {result("test_push")}
            </div>

            <details className="lmCard lmCollapsible">
              <summary>
                <h2>Ostatnie leady</h2>
                <span className="lmCount">{diag.leads.length}</span>
                {diag.leads[0] ? (
                  <small>
                    ostatni: {diag.leads[0].name} · {formatTime(diag.leads[0].created_at)}
                  </small>
                ) : null}
                <span className="lmChevron" aria-hidden="true">
                  ›
                </span>
              </summary>
              <button className="lmLink lmRefresh" type="button" onClick={loadDiagnostics}>
                Odśwież
              </button>
              {diag.leads.length ? (
                <ul className="lmList">
                  {diag.leads.map((lead) => (
                    <li key={lead.id}>
                      <div>
                        <strong>{lead.name}</strong> · {lead.phone}
                        {lead.source === "diagnostic" ? <em className="lmTag">test</em> : null}
                        {lead.duplicate_of_existing ? <em className="lmTag">ponowne</em> : null}
                        {(lead.consents || []).map((item) => (
                          <em className={`lmTag ${item.checked ? "lmTagYes" : "lmTagNo"}`} key={item.key}>
                            {item.key}: {item.checked ? "✓" : "✗"}
                          </em>
                        ))}
                        <small>{[lead.form_name, formatTime(lead.created_at)].filter(Boolean).join(" · ")}</small>
                      </div>
                      {lead.crm_contact_id ? <Link href={`/crm/kontakt/${lead.crm_contact_id}`}>Karta →</Link> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="lmHint">Jeszcze nie ma leadów w nowym Lead Managerze.</p>
              )}
            </details>

            <details className="lmCard lmCollapsible">
              <summary>
                <h2>Wysłane SMS-y</h2>
                <span className="lmCount">{diag.sms.length}</span>
                {diag.sms[0] ? (
                  <small>
                    ostatni: {diag.sms[0].recipient} ·{" "}
                    {diag.sms[0].status === "sent" ? "wysłany" : diag.sms[0].status === "simulated" ? "symulacja" : "błąd"} ·{" "}
                    {formatTime(diag.sms[0].created_at)}
                  </small>
                ) : null}
                <span className="lmChevron" aria-hidden="true">
                  ›
                </span>
              </summary>
              {diag.sms.length ? (
                <ul className="lmList">
                  {diag.sms.map((row) => (
                    <li key={row.id}>
                      <div>
                        <span className={`lmDot ${row.status}`} />
                        {row.recipient} · {row.audience === "test" ? "test" : "powitalny"} ·{" "}
                        {row.status === "sent" ? "wysłany" : row.status === "simulated" ? "symulacja" : "błąd"}
                        <small>
                          {formatTime(row.created_at)}
                          {row.error ? ` · ${row.error}` : ""}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="lmHint">Brak wysyłek.</p>
              )}
            </details>

            <details className="lmCard lmCollapsible">
              <summary>
                <h2>Dziennik</h2>
                <span className="lmCount">{diag.log.length}</span>
                {diag.log[0] ? (
                  <small>
                    ostatni wpis: {diag.log[0].title} · {formatTime(diag.log[0].created_at)}
                  </small>
                ) : null}
                <span className="lmChevron" aria-hidden="true">
                  ›
                </span>
              </summary>
              {diag.log.length ? (
                <ul className="lmList">
                  {diag.log.map((row) => (
                    <li key={row.id}>
                      <div>
                        <span className={`lmDot ${row.level}`} />
                        <strong>{row.title}</strong>
                        <small>
                          {formatTime(row.created_at)}
                          {row.detail ? ` · ${row.detail}` : ""}
                        </small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="lmHint">Dziennik jest pusty.</p>
              )}
            </details>
          </>
        ) : !error ? (
          <p className="lmHint">Ładowanie…</p>
        ) : null}
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
