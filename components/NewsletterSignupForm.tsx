import Link from "next/link";
import { FormEvent, useState } from "react";

type NewsletterSignupFormProps = {
  className?: string;
};

export default function NewsletterSignupForm({ className = "" }: NewsletterSignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/newNewsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          consentAccepted,
          sourceUrl: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Nie udało się rozpocząć zapisu.");
      setMessage(result.message || "Sprawdź skrzynkę e-mail i potwierdź zapis.");
      setName("");
      setEmail("");
      setConsentAccepted(false);
    } catch (caught: any) {
      setError(caught?.message || "Nie udało się rozpocząć zapisu.");
    } finally {
      setSubmitting(false);
    }
  }

  if (message) {
    return (
      <div className={`border border-[#d8b66a]/60 bg-white p-7 md:p-9 ${className}`} role="status">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
          Jeszcze jeden krok
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-[#182334]">Sprawdź swoją skrzynkę</h3>
        <p className="mt-4 leading-7 text-[#5f6b7a]">{message}</p>
      </div>
    );
  }

  return (
    <form className={`border border-[#e5dac7] bg-white p-6 shadow-[0_18px_50px_rgba(24,35,52,0.10)] md:p-9 ${className}`} onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#5f6b7a]">
          Imię
          <input
            type="text"
            autoComplete="given-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 border border-[#d7c8ad] bg-[#fbf8f2] px-4 text-base font-normal normal-case tracking-normal text-[#182334] outline-none transition focus:border-[#b8954c] focus:bg-white"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#5f6b7a]">
          Adres e-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 border border-[#d7c8ad] bg-[#fbf8f2] px-4 text-base font-normal normal-case tracking-normal text-[#182334] outline-none transition focus:border-[#b8954c] focus:bg-white"
          />
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-6 text-[#5f6b7a]">
        <input
          type="checkbox"
          required
          checked={consentAccepted}
          onChange={(event) => setConsentAccepted(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#b8954c]"
        />
        <span>
          Wyrażam zgodę na otrzymywanie od Onesta Group Sp. z o.o. newslettera oraz informacji
          handlowych i marketingowych drogą elektroniczną na podany adres e-mail. Wiem, że zgodę
          mogę wycofać w każdej chwili. Zapoznałem/am się z{" "}
          <Link href="/polityka-prywatnosci" target="_blank" className="font-semibold underline">
            Polityką Prywatności
          </Link>
          .
        </span>
      </label>

      {error ? <p className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 h-12 bg-[#182334] px-7 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Wysyłanie…" : "Zapisuję się"}
      </button>
      <p className="mt-4 text-xs leading-5 text-[#7c8796]">
        Zapis aktywujemy dopiero po kliknięciu przycisku potwierdzającego w wiadomości e-mail.
      </p>
    </form>
  );
}
