import { useRef, useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import type { AgentOffer } from "@/lib/agentOffers";
import type { OfferPdfContact } from "@/lib/offerPdf";

type Props = {
  offer: AgentOffer;
  contact: OfferPdfContact;
  publicPath?: string;
  accessToken?: string;
};

export default function OfferPdfButton({
  offer,
  contact,
  publicPath,
  accessToken,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const running = useRef(false);

  const download = async () => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setMessage("");
    try {
      let fullOffer = offer;
      // Unsaved drafts contain only card fields; fetch details before exporting.
      if (accessToken && offer.descriptions === undefined) {
        const response = await fetch(
          `/api/agent/offer/${encodeURIComponent(offer.external_id)}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            signal: AbortSignal.timeout(20000),
          },
        );
        if (!response.ok)
          throw new Error(
            "Nie udało się pobrać szczegółów oferty. Spróbuj ponownie.",
          );
        const payload = await response.json();
        fullOffer = {
          ...payload.data,
          ...offer,
          descriptions: payload.data.descriptions,
          features: offer.features ?? payload.data.features,
          surface_plot: offer.surface_plot ?? payload.data.surface_plot,
        };
      }
      const { downloadOfferPdf } = await import("@/lib/offerPdf");
      const result = await downloadOfferPdf({
        offer: fullOffer,
        contact,
        publicUrl: publicPath
          ? new URL(publicPath, window.location.origin).href
          : undefined,
      });
      setMessage(
        result.missingImages
          ? "PDF pobrany. Część zdjęć była niedostępna i została pominięta."
          : "PDF pobrany.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Nie udało się wygenerować PDF. Spróbuj ponownie.",
      );
    } finally {
      running.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="max-w-full">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        aria-busy={busy}
        aria-label={`Pobierz PDF oferty ${offer.ref || offer.external_id}`}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#b8954c] bg-white px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#182334] transition hover:bg-[#f4efe6] disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? (
          <FaSpinner className="animate-spin" aria-hidden="true" />
        ) : (
          <FaFilePdf aria-hidden="true" />
        )}
        {busy ? "Przygotowuję PDF..." : "Pobierz PDF"}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={
          message
            ? "mt-2 max-w-[320px] text-[11px] leading-5 text-[#526173]"
            : "sr-only"
        }
      >
        {message}
      </p>
    </div>
  );
}
