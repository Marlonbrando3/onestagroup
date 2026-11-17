import { useEffect, useState } from "react";
import { FaCheck, FaRegHeart } from "react-icons/fa";

// „Interesuje mnie ta oferta” w prezentacji dla klienta: jeden klik = mail do agenta
// (pages/api/presentation-interest.ts). Kliknięte oferty pamiętamy w przeglądarce klienta.
type Props = { token: string; offerId: string; variant?: "card" | "wide"; parentOfferId?: string };

const storageKey = (token: string) => `onesta-interest-${token}`;

function readClicked(token: string): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(token)) || "[]");
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default function InterestButton({ token, offerId, variant = "card", parentOfferId }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (readClicked(token).includes(offerId)) setState("sent");
    // Na stronie oferty są dwa przyciski — po kliknięciu jednego drugi też pokazuje „wysłano”.
    const onSent = (event: Event) => {
      if ((event as CustomEvent<string>).detail === `${token}:${offerId}`) setState("sent");
    };
    window.addEventListener("onesta-interest-sent", onSent);
    return () => window.removeEventListener("onesta-interest-sent", onSent);
  }, [token, offerId]);

  const send = async () => {
    if (state === "sending" || state === "sent") return;
    setState("sending");
    try {
      const response = await fetch("/api/presentation-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, offerId, parentOfferId }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState("sent");
      window.dispatchEvent(new CustomEvent("onesta-interest-sent", { detail: `${token}:${offerId}` }));
      try {
        const clicked = readClicked(token);
        if (!clicked.includes(offerId)) {
          window.localStorage.setItem(storageKey(token), JSON.stringify([...clicked, offerId]));
        }
      } catch {
        /* brak dostępu do localStorage — nic nie szkodzi */
      }
    } catch {
      setState("error");
    }
  };

  const wide = variant === "wide";
  const base = `flex w-full items-center justify-center gap-2 rounded-full font-extrabold uppercase tracking-[0.08em] transition ${
    wide ? "min-h-[52px] px-6 text-[11px]" : "min-h-[46px] px-5 text-[10px]"
  }`;

  if (state === "sent") {
    return (
      <div className={wide ? "" : "px-1"}>
        <div className={`${base} cursor-default bg-[#e8f1ea] text-[#2f6b45]`} role="status">
          <FaCheck aria-hidden="true" /> Agent otrzymał informację
        </div>
        {wide ? null : (
          <p className="mt-2 text-center text-[11px] leading-5 text-slate-500">
            Dziękujemy! Agent prześle Ci więcej informacji o tej ofercie.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={wide ? "" : "px-1"}>
      <button
        type="button"
        onClick={send}
        disabled={state === "sending"}
        className={`${base} bg-[#8e2430] text-white shadow-[0_8px_22px_rgba(142,36,48,0.35)] hover:bg-[#6f1a24] hover:shadow-[0_10px_28px_rgba(142,36,48,0.45)] disabled:opacity-60`}
      >
        <FaRegHeart aria-hidden="true" />
        {state === "sending" ? "Wysyłanie…" : "Interesuje mnie ta oferta"}
      </button>
      {state === "error" || !wide ? (
        <p className={`mt-2 text-center text-[11px] leading-5 ${state === "error" ? "text-[#b4452f]" : "text-slate-500"}`}>
          {state === "error"
            ? "Nie udało się wysłać. Spróbuj ponownie lub zadzwoń do agenta."
            : "Kliknij, aby dać znać agentowi — prześle Ci więcej informacji."}
        </p>
      ) : null}
    </div>
  );
}
