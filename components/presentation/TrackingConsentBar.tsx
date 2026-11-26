import { useState } from "react";

// Zgoda na zapisywanie oglądanych ofert – pokazywana na prezentacji, gdy wiemy, czyja to prezentacja
// (prezentacja przypisana do klienta w CRM albo wzorzec z linkiem leada), a zgody jeszcze nie ma.
// Bez zgody prezentacja działa normalnie, tylko nic nie zapisujemy.
type Props = {
  token: string;
  leadKey?: string;
  consent: boolean;
  onChange: (consent: boolean) => void;
  variant?: "bar" | "note";
};

export const TRACKING_CONSENT_TEXT =
  "Czy możemy zapisywać, które z przesłanych Ci ofert oglądasz i które oznaczysz? Dzięki temu doradca lepiej dopasuje kolejne propozycje. Zgodę możesz wycofać w każdej chwili.";

async function send(token: string, leadKey: string | undefined, granted: boolean, withdraw = false) {
  await fetch("/api/presentation-consent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, k: leadKey || undefined, granted, withdraw }),
  }).catch(() => undefined);
}

export default function TrackingConsentBar({ token, leadKey, consent, onChange, variant = "bar" }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);

  if (consent) {
    return (
      <p className="mx-auto mt-6 w-11/12 max-w-7xl text-center text-[11px] leading-5 text-slate-500">
        Zapisujemy, które z tych ofert oglądasz, aby doradca lepiej dopasował propozycje.{" "}
        <button
          type="button"
          className="font-bold text-[#7b6844] underline underline-offset-2 hover:text-[#182334]"
          onClick={async () => {
            setBusy(true);
            await send(token, leadKey, false, true);
            setBusy(false);
            setDismissed(true);
            onChange(false);
          }}
          disabled={busy}
        >
          Wyłącz zapisywanie
        </button>{" "}
        ·{" "}
        <a className="underline underline-offset-2 hover:text-[#182334]" href="/polityka-prywatnosci" target="_blank" rel="noreferrer">
          Polityka prywatności
        </a>
      </p>
    );
  }

  if (dismissed || variant === "note") return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-[680px] rounded-2xl border border-[#ded5c8] bg-white/97 p-4 shadow-[0_18px_50px_rgba(24,35,52,0.22)] backdrop-blur sm:bottom-5 sm:p-5">
      <p className="text-[13px] leading-6 text-[#334155]">
        {TRACKING_CONSENT_TEXT}{" "}
        <a className="font-semibold text-[#7b6844] underline underline-offset-2" href="/polityka-prywatnosci" target="_blank" rel="noreferrer">
          Szczegóły
        </a>
      </p>
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await send(token, leadKey, false);
            setBusy(false);
            setDismissed(true);
          }}
          className="min-h-[42px] rounded-full border border-[#c9bfb0] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#334155] transition hover:border-[#182334]"
        >
          Nie, dziękuję
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await send(token, leadKey, true);
            setBusy(false);
            onChange(true);
          }}
          className="min-h-[42px] rounded-full bg-[#182334] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#b8954c]"
        >
          Zgadzam się
        </button>
      </div>
    </div>
  );
}
