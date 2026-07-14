import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { supabaseServer } from "@/lib/supabaseClient";
import {
  getRequestIp,
  getRequestUserAgent,
  maskNewsletterEmail,
  newsletterSchemaErrorMessage,
  recordNewsletterEvent,
  sha256,
} from "@/lib/newsletterDoubleOptIn";

type ConfirmationState = "ready" | "confirmed" | "expired" | "invalid" | "error";

type Props = {
  token: string;
  initialState: ConfirmationState;
  maskedEmail: string;
  serverMessage: string;
  requiresConsentCheckbox: boolean;
};

export default function NewsletterConfirmationPage({
  token,
  initialState,
  maskedEmail,
  serverMessage,
  requiresConsentCheckbox,
}: Props) {
  const [state, setState] = useState<ConfirmationState>(initialState);
  const [message, setMessage] = useState(serverMessage);
  const [submitting, setSubmitting] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);

  async function confirmSubscription() {
    if (submitting || state !== "ready") return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, consentAccepted }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Nie udało się potwierdzić zapisu.");
      setState("confirmed");
    } catch (error: any) {
      setMessage(error?.message || "Nie udało się potwierdzić zapisu.");
      setState("error");
    } finally {
      setSubmitting(false);
    }
  }

  const confirmed = state === "confirmed";
  const ready = state === "ready";

  return (
    <>
      <Head>
        <title>Potwierdzenie newslettera — Onesta</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb] px-4 py-12 text-[#182334]">
        <section className="w-full max-w-xl border border-[#e5dac7] bg-white shadow-[0_24px_70px_rgba(24,35,52,0.16)]">
          <header className="bg-[#182334] px-7 py-8 text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d8b66a]">
              Newsletter Onesta
            </p>
            <h1 className="mt-4 text-3xl font-semibold">
              {confirmed ? "Zapis został potwierdzony" : "Potwierdź swój zapis"}
            </h1>
          </header>
          <div className="px-7 py-8 sm:px-10 sm:py-10">
            {confirmed ? (
              <>
                <p className="text-base leading-7 text-[#4f5d6d]">
                  Adres {maskedEmail || "e-mail"} został zapisany do newslettera. Zgoda została
                  zarejestrowana wraz z technicznym potwierdzeniem.
                </p>
                <Link
                  href="/"
                  className="mt-7 inline-flex bg-[#182334] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c]"
                >
                  Wróć na stronę Onesta
                </Link>
              </>
            ) : ready ? (
              <>
                <p className="text-base leading-7 text-[#4f5d6d]">
                  Potwierdzasz zapis adresu <strong>{maskedEmail}</strong>. Samo otwarcie tej strony
                  nie aktywowało subskrypcji.
                </p>
                {requiresConsentCheckbox ? (
                  <label className="mt-6 flex cursor-pointer items-start gap-3 border border-[#e5dac7] bg-[#fbf8f2] p-4 text-sm leading-6 text-[#4f5d6d]">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={(event) => setConsentAccepted(event.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[#b8954c]"
                    />
                    <span>
                      Wyrażam zgodę na otrzymywanie od Onesta Group Sp. z o.o. newslettera oraz
                      informacji handlowych i marketingowych drogą elektroniczną na podany adres
                      e-mail. Wiem, że zgodę mogę wycofać w każdej chwili. Zapoznałem/am się z{" "}
                      <Link href="/polityka-prywatnosci" target="_blank" className="underline">
                        Polityką Prywatności
                      </Link>
                      .
                    </span>
                  </label>
                ) : null}
                <button
                  type="button"
                  onClick={confirmSubscription}
                  disabled={submitting || (requiresConsentCheckbox && !consentAccepted)}
                  className="mt-7 bg-[#182334] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c] disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? "Potwierdzanie…" : "Potwierdzam zapis"}
                </button>
              </>
            ) : (
              <>
                <p className="text-base leading-7 text-[#4f5d6d]">
                  {message || "Ten link nie może zostać wykorzystany."}
                </p>
                <Link href="/" className="mt-7 inline-block text-sm font-semibold underline">
                  Wróć na stronę główną
                </Link>
              </>
            )}
            {state === "error" && message ? (
              <p className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</p>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  context.res.setHeader("Cache-Control", "no-store, max-age=0");
  context.res.setHeader("Referrer-Policy", "no-referrer");
  const token = typeof context.query.token === "string" ? context.query.token.trim() : "";
  if (!token || token.length > 200 || !supabaseServer) {
    return {
      props: {
        token: "",
        initialState: "invalid",
        maskedEmail: "",
        serverMessage: "Link potwierdzający jest nieprawidłowy.",
        requiresConsentCheckbox: false,
      },
    };
  }

  const tokenHash = sha256(token);
  try {
    const { data: subscription, error } = await supabaseServer
      .from("newsletter_subscriptions")
      .select("id,email_normalized,status,token_expires_at,confirmation_email_message_id,initiation_type")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (error) throw error;
    if (!subscription) {
      return {
        props: {
          token: "",
          initialState: "invalid",
          maskedEmail: "",
          serverMessage: "Link potwierdzający jest nieprawidłowy.",
          requiresConsentCheckbox: false,
        },
      };
    }

    const ip = getRequestIp(context.req);
    const userAgent = getRequestUserAgent(context.req);
    await recordNewsletterEvent({
      subscriptionId: subscription.id,
      email: subscription.email_normalized,
      eventType: "confirmation_page_opened",
      tokenHash,
      providerMessageId: subscription.confirmation_email_message_id,
      requestMethod: "GET",
      ip,
      userAgent,
      payload: { note: "Otwarcie strony nie jest równoznaczne z udzieleniem zgody." },
    });

    if (subscription.status === "confirmed") {
      return {
        props: {
          token,
          initialState: "confirmed",
          maskedEmail: maskNewsletterEmail(subscription.email_normalized),
          serverMessage: "",
          requiresConsentCheckbox: false,
        },
      };
    }
    if (subscription.status !== "pending") {
      return {
        props: {
          token: "",
          initialState: "invalid",
          maskedEmail: maskNewsletterEmail(subscription.email_normalized),
          serverMessage: "Ta subskrypcja nie oczekuje na potwierdzenie.",
          requiresConsentCheckbox: false,
        },
      };
    }
    if (new Date(subscription.token_expires_at).getTime() < Date.now()) {
      return {
        props: {
          token: "",
          initialState: "expired",
          maskedEmail: maskNewsletterEmail(subscription.email_normalized),
          serverMessage: "Link potwierdzający wygasł. Zapisz się ponownie, aby otrzymać nowy link.",
          requiresConsentCheckbox: false,
        },
      };
    }

    return {
      props: {
        token,
        initialState: "ready",
        maskedEmail: maskNewsletterEmail(subscription.email_normalized),
        serverMessage: "",
        requiresConsentCheckbox: subscription.initiation_type === "crm_phone_request",
      },
    };
  } catch (error: any) {
    return {
      props: {
        token: "",
        initialState: "error",
        maskedEmail: "",
        serverMessage: newsletterSchemaErrorMessage(error),
        requiresConsentCheckbox: false,
      },
    };
  }
};
