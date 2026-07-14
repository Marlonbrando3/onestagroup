import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { useState } from "react";
import { supabaseServer } from "@/lib/supabaseClient";
import {
  maskNewsletterEmail,
  parseNewsletterUnsubscribeToken,
  sha256,
  verifyNewsletterUnsubscribeToken,
} from "@/lib/newsletterDoubleOptIn";

type Props = { token: string; maskedEmail: string; valid: boolean; alreadyUnsubscribed: boolean };

export default function UnsubscribePage({ token, maskedEmail, valid, alreadyUnsubscribed }: Props) {
  const [done, setDone] = useState(alreadyUnsubscribed);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function unsubscribe() {
    if (!valid || done || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Nie udało się wypisać adresu.");
      setDone(true);
    } catch (caught: any) {
      setError(caught?.message || "Nie udało się wypisać adresu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Wypisanie z newslettera — Onesta</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="referrer" content="no-referrer" />
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1eb] px-4 py-12 text-[#182334]">
        <section className="w-full max-w-xl border border-[#e5dac7] bg-white shadow-[0_24px_70px_rgba(24,35,52,0.16)]">
          <header className="bg-[#182334] px-7 py-8 text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d8b66a]">Newsletter Onesta</p>
            <h1 className="mt-4 text-3xl font-semibold">{done ? "Adres został wypisany" : "Wypisz się z newslettera"}</h1>
          </header>
          <div className="px-7 py-8 sm:px-10 sm:py-10">
            {done ? (
              <p className="text-base leading-7 text-[#4f5d6d]">Nie będziemy już wysyłać newslettera na adres {maskedEmail || "e-mail"}.</p>
            ) : valid ? (
              <>
                <p className="text-base leading-7 text-[#4f5d6d]">Kliknij przycisk, aby wypisać adres <strong>{maskedEmail}</strong>. Samo otwarcie strony niczego nie zmienia.</p>
                <button type="button" onClick={unsubscribe} disabled={submitting} className="mt-7 bg-[#182334] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white disabled:opacity-60">
                  {submitting ? "Wypisywanie…" : "Wypisz mnie"}
                </button>
              </>
            ) : (
              <p className="text-base leading-7 text-[#4f5d6d]">Link wypisania jest nieprawidłowy.</p>
            )}
            {error ? <p className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
            <Link href="/" className="mt-7 inline-block text-sm font-semibold underline">Wróć na stronę główną</Link>
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
  const parsed = token.length <= 300 ? parseNewsletterUnsubscribeToken(token) : null;
  if (!parsed || !supabaseServer) return { props: { token: "", maskedEmail: "", valid: false, alreadyUnsubscribed: false } };
  const { data } = await supabaseServer
    .from("newsletter_subscriptions")
    .select("id,email_normalized,status,unsubscribe_token_hash")
    .eq("id", parsed.subscriptionId)
    .maybeSingle();
  const valid = Boolean(
    data &&
      verifyNewsletterUnsubscribeToken(token, data.email_normalized) === data.id &&
      (!data.unsubscribe_token_hash || data.unsubscribe_token_hash === sha256(token)),
  );
  return {
    props: {
      token: valid ? token : "",
      maskedEmail: valid ? maskNewsletterEmail(data!.email_normalized) : "",
      valid,
      alreadyUnsubscribed: valid && data!.status === "unsubscribed",
    },
  };
};
