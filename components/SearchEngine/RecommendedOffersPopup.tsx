import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  IoArrowForward,
  IoCheckmark,
  IoClose,
  IoMailOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

type PopupStep = "initial" | "form";

interface FormData {
  budgetMax: string;
  email: string;
  rodoConsent: boolean;
  marketingConsent: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale?: "pl" | "en";
}

const inputClassName =
  "mt-2 h-12 w-full border border-[#d8c8ad] bg-[#fbf8f2] px-4 text-[15px] text-[#182334] outline-none transition placeholder:text-[#9aa2ad] focus:border-[#b8954c] focus:ring-2 focus:ring-[#b8954c]/15";

export default function RecommendedOffersPopup({
  isOpen,
  onClose,
  locale = "pl",
}: Props) {
  const t = (pl: string, en: string) => (locale === "en" ? en : pl);
  const [step, setStep] = useState<PopupStep>("initial");
  const [formData, setFormData] = useState<FormData>({
    budgetMax: "",
    email: "",
    rodoConsent: false,
    marketingConsent: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const closePopup = useCallback(() => {
    onClose();
    setStep("initial");
    setError(null);
    setSuccess(false);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePopup, isOpen]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.email.trim())
      return t("Email jest wymagany", "Email is required");
    if (!formData.email.includes("@"))
      return t("Podaj prawidłowy adres email", "Enter a valid email address");
    if (!formData.budgetMax.trim())
      return t("Budżet jest wymagany", "Budget is required");
    if (isNaN(Number(formData.budgetMax)) || Number(formData.budgetMax) <= 0)
      return t("Podaj prawidłową kwotę", "Enter a valid amount");
    if (!formData.rodoConsent)
      return t(
        "Musisz zaakceptować politykę prywatności",
        "You must accept the privacy policy",
      );
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sendRecommendedOffers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(
          (locale === "pl" && data.error) ||
            t("Błąd wysyłania", "Could not send your request"),
        );
        return;
      }

      trackGoogleAdsContactConversion();
      setSuccess(true);
      setTimeout(() => {
        closePopup();
        setFormData({
          budgetMax: "",
          email: "",
          rodoConsent: false,
          marketingConsent: false,
        });
      }, 2000);
    } catch (submissionError) {
      setError(
        t(
          "Błąd połączenia. Spróbuj ponownie.",
          "Connection error. Please try again.",
        ),
      );
      console.error(submissionError);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1424]/75 p-3 backdrop-blur-[3px] sm:p-6`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative grid max-h-[calc(100dvh-24px)] w-full max-w-[900px] overflow-y-auto bg-white shadow-[0_30px_90px_rgba(5,13,27,0.38)] md:max-h-[calc(100dvh-48px)] md:grid-cols-[0.82fr_1.18fr]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closePopup}
          aria-label={t("Zamknij okno", "Close window")}
          className="absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center border border-white/25 bg-white/95 text-[#182334] shadow-sm transition hover:bg-[#f3eee5] focus:outline-none focus:ring-2 focus:ring-[#d6b36a] md:right-5 md:top-5"
        >
          <IoClose className="h-6 w-6" />
        </button>

        <aside className="relative min-h-[205px] overflow-hidden p-6 text-white sm:p-8 md:min-h-[590px] md:p-9">
          <div className="absolute inset-0 bg-[url('/bg_calp_c.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/72 via-[#111827]/88 to-[#111827]/95" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e2c477]">
                Onesta Selection
              </p>
              <h3 className="mt-3 max-w-[310px] text-[27px] font-semibold leading-[1.1] sm:text-[31px]">
                {t(
                  "Oferty dopasowane do Ciebie, nie do algorytmu.",
                  "Property choices tailored to your plans.",
                )}
              </h3>
              <p className="mt-4 max-w-[320px] text-sm leading-6 text-white/78">
                {t(
                  "Przejrzymy rynek i wybierzemy nieruchomości, które naprawdę odpowiadają Twoim planom.",
                  "We will review the market and select properties that fit your plans.",
                )}
              </p>
            </div>

            <div className="mt-6 hidden space-y-3 text-sm text-white/82 md:block">
              {(locale === "en"
                ? ["TOP 10 shortlist", "selected locations", "no obligation"]
                : [
                    "selekcja TOP 10",
                    "sprawdzone lokalizacje",
                    "bez zobowiązań",
                  ]
              ).map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center border border-[#d6b36a]/60 bg-[#d6b36a]/10 text-[#e2c477]">
                    <IoCheckmark className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-[455px] flex-col justify-center p-6 sm:p-9 md:p-11">
          {step === "initial" ? (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                {t("Bezpłatne rekomendacje", "Free recommendations")}
              </p>
              <h2
                id={titleId}
                className="mt-3 text-[32px] font-bold leading-[1.06] tracking-[-0.035em] text-[#182334] sm:text-[40px]"
              >
                {t("Nie wiesz, co wybrać?", "Not sure what to choose?")}
              </h2>
              <p
                id={descriptionId}
                className="mt-4 max-w-[460px] text-[15px] leading-6 text-[#5f6b7a] sm:text-base"
              >
                {t(
                  "Podaj budżet i adres e-mail. Przygotujemy zestaw 10 ofert, od których warto zacząć.",
                  "Tell us your budget and email address. We will prepare a shortlist of 10 properties to get you started.",
                )}
              </p>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="group flex h-14 w-full items-center justify-between bg-[#b8954c] px-5 text-left font-bold text-white transition hover:bg-[#9b7a36] focus:outline-none focus:ring-2 focus:ring-[#b8954c] focus:ring-offset-2"
                >
                  <span>
                    {t(
                      "Chcę otrzymać TOP 10 ofert",
                      "Send me the TOP 10 properties",
                    )}
                  </span>
                  <IoArrowForward className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={closePopup}
                  className="h-12 w-full border border-[#d8c8ad] bg-white px-5 font-semibold text-[#5f6b7a] transition hover:border-[#b8954c] hover:bg-[#fbf8f2] hover:text-[#182334] focus:outline-none focus:ring-2 focus:ring-[#b8954c]/30"
                >
                  {t("Tylko przeglądam", "Just browsing")}
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs leading-5 text-[#7c8796]">
                <IoShieldCheckmarkOutline className="h-4 w-4 shrink-0 text-[#9b7a36]" />
                <span>
                  {t(
                    "Bez spamu. Kontaktujemy się wyłącznie w sprawie ofert.",
                    "No spam. We will only contact you about properties.",
                  )}
                </span>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setStep("initial");
                  setError(null);
                }}
                className="mb-5 w-fit text-xs font-bold uppercase tracking-[0.14em] text-[#9b7a36] hover:text-[#182334]"
              >
                {t("← Wróć", "← Back")}
              </button>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                {t("Twój punkt wyjścia", "Your starting point")}
              </p>
              <h2
                id={titleId}
                className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.03em] text-[#182334]"
              >
                {t(
                  "Przygotujmy Twoją listę.",
                  "Let us prepare your shortlist.",
                )}
              </h2>
              <p
                id={descriptionId}
                className="mt-2 text-sm leading-6 text-[#5f6b7a]"
              >
                {t(
                  "Wystarczą dwie informacje. Resztą zajmiemy się my.",
                  "Just two details. We will take care of the rest.",
                )}
              </p>

              {success && (
                <div className="mt-5 flex items-start gap-3 border border-[#b8d9c7] bg-[#eff8f3] p-4 text-sm text-[#24633f]">
                  <IoCheckmark className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    {t(
                      "Dziękujemy! Wkrótce otrzymasz rekomendacje.",
                      "Thank you! Your recommendations will follow soon.",
                    )}
                  </span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 border border-[#efc1bd] bg-[#fff3f2] p-3 text-sm text-[#9b2922]"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <label className="block text-sm font-semibold text-[#344054]">
                  {t("Maksymalny budżet (€)", "Maximum budget (€)")}
                  <input
                    type="number"
                    name="budgetMax"
                    value={formData.budgetMax}
                    onChange={handleInputChange}
                    min="1"
                    inputMode="numeric"
                    placeholder={t("np. 350 000", "e.g. 350,000")}
                    required
                    className={inputClassName}
                  />
                </label>

                <label className="block text-sm font-semibold text-[#344054]">
                  {t("Adres e-mail", "Email address")}
                  <span className="relative block">
                    <IoMailOutline className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#9b7a36]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      placeholder={t("twoj@email.pl", "you@example.com")}
                      required
                      className={`${inputClassName} pl-11`}
                    />
                  </span>
                </label>

                <div className="space-y-3 pt-1">
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#5f6b7a]">
                    <input
                      type="checkbox"
                      name="rodoConsent"
                      checked={formData.rodoConsent}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#b8954c]"
                    />
                    <span>
                      {t("Akceptuję ", "I accept the ")}
                      <a
                        href="https://onesta.com.pl/polityka-prywatnosci"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#9b7a36] underline underline-offset-2"
                      >
                        {t("politykę prywatności", "privacy policy")}
                      </a>
                      . <span className="text-[#9b2922]">*</span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#5f6b7a]">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleInputChange}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#b8954c]"
                    />
                    <span>
                      {t(
                        "Zgadzam się na kontakt marketingowy w celu przedstawienia ofert nieruchomości.",
                        "I agree to marketing contact to present property offers.",
                      )}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex min-h-[52px] w-full items-center justify-center gap-3 bg-[#182334] px-5 font-bold text-white transition hover:bg-[#27364b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {loading
                    ? t("Wysyłanie…", "Sending…")
                    : t(
                        "Wyślij i odbierz TOP 10",
                        "Send and receive the TOP 10",
                      )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
