import React from "react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { HomeMontserratSans as MontserratSans } from "../fonts/homeFonts";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

export default function ContactFormMain({ locale = "pl" }) {
  const router = useRouter();
  const submitButton = useRef();
  const isEn = locale === "en";

  const [dataForm, setDataForm] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Message: "",
  });

  const [consents, setConsents] = useState({
    privacy: false,
    marketing: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consents.privacy) {
      alert(
        isEn
          ? "You must accept the privacy policy."
          : "Musisz zaakceptować politykę prywatności.",
      );
      return;
    }

    if (submitButton.current) {
      submitButton.current.innerHTML = isEn ? "Sending..." : "Wysyłam...";
      submitButton.current.style.backgroundColor = "#d6b36a";
      submitButton.current.disabled = true;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Ref: "Strona główna",
          dataForm,
          consents,
          source: router.asPath,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Contact form failed with status ${res.status}`);
      }

      trackGoogleAdsContactConversion();

      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "form_main_site",
        });
      } catch (analyticsError) {
        console.error("Form sent, analytics failed:", analyticsError);
      }

      if (submitButton.current) {
        submitButton.current.style.backgroundColor = "#15803d";
        submitButton.current.innerHTML = isEn
          ? "Message sent"
          : "Wiadomość wysłana";
      }
    } catch (err) {
      console.error("Main contact form failed:", err);
      if (submitButton.current) {
        submitButton.current.innerHTML = isEn
          ? "Error, please try again"
          : "Błąd, spróbuj ponownie";
        submitButton.current.disabled = false;
      }
    }
  };

  const inputClass =
    "h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-4 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c]";

  return (
    <div
      id="contact"
      className={`${MontserratSans.className} overflow-hidden bg-[#111827] shadow-2xl`}
    >
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="relative min-h-[360px] p-8 text-white lg:p-10">
          <div className="absolute inset-0 bg-[url('/contactformbg.webp')] bg-cover bg-center opacity-35" />
          <div className="absolute inset-0 bg-[#111827]/82" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
              Onesta Group
            </p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight">
              {isEn
                ? "Let’s talk about a safe property purchase abroad."
                : "Porozmawiajmy o bezpiecznym zakupie nieruchomości."}
            </h3>
            <div className="mt-10 space-y-7 text-sm leading-7 text-white/78">
              <div>
                <p className="font-bold text-white">
                  {isEn ? "Client office" : "Biuro dla klientów"}
                </p>
                <p>45-865 Opole</p>
                <p>ul. Niemodlińska 58a</p>
              </div>
              <div>
                <p className="font-bold text-white">
                  {isEn ? "Company registered office" : "Siedziba firmy"}
                </p>
                <p>Onesta Group sp. z o.o.</p>
                <p>53-148 Wrocław, ul. Wolbromska 18/1b</p>
                <p>NIP: 899 292 23 78</p>
              </div>
              <div>
                <p>
                  <a href="mailto:biuro@onesta.com.pl">
                    biuro@onesta.com.pl
                  </a>
                </p>
                <p>
                  <a href="tel:+48576652525">+48 576 65 25 25</a>
                </p>
              </div>
            </div>
          </div>
        </aside>

        <form className="bg-white p-6 md:p-8 lg:p-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8954c]">
              {isEn ? "Contact form" : "Formularz kontaktowy"}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-[#182334] md:text-3xl">
              {isEn
                ? "Tell us what you are looking for. We will reply with specific guidance."
                : "Napisz, czego szukasz. Oddzwonimy z konkretną odpowiedzią."}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className={inputClass}
              type="text"
              placeholder={isEn ? "Full name" : "Imię i nazwisko"}
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Name: e.target.value })
              }
            />

            <input
              className={inputClass}
              type="tel"
              placeholder={isEn ? "Phone number" : "Numer telefonu"}
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Phone: e.target.value })
              }
            />

            <input
              className={`${inputClass} md:col-span-2`}
              type="email"
              placeholder={isEn ? "Email address" : "Adres email"}
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Email: e.target.value })
              }
            />

            <textarea
              className="min-h-[170px] w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-4 py-3 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c] md:col-span-2"
              placeholder={
                isEn
                  ? "Describe your budget, country, timing and purchase goal"
                  : "Opisz budżet, kraj, termin i cel zakupu"
              }
              onChange={(e) =>
                setDataForm({ ...dataForm, Message: e.target.value })
              }
            />
          </div>

          <div className="mt-6 space-y-3 text-sm leading-6 text-[#475569]">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={consents.privacy}
                className="mt-1 h-5 w-5 accent-[#b8954c]"
                onChange={(e) =>
                  setConsents({ ...consents, privacy: e.target.checked })
                }
              />
              <span>
                {isEn ? "I accept the " : "Akceptuję "}
                <Link href="/polityka-prywatnosci" className="underline">
                  {isEn ? "privacy policy" : "politykę prywatności"}
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consents.marketing}
                className="mt-1 h-5 w-5 accent-[#b8954c]"
                onChange={(e) =>
                  setConsents({ ...consents, marketing: e.target.checked })
                }
              />
              <span>
                {isEn
                  ? "I consent to the processing of my personal data by Onesta Group Sp. z o.o. for marketing purposes, including contact by phone and email to present property offers."
                  : "Wyrażam zgodę na przetwarzanie moich danych osobowych przez Onesta Group Sp. z o.o. w celach marketingowych, w tym na kontakt telefoniczny oraz mailowy w celu przedstawienia ofert nieruchomości."}
              </span>
            </label>
          </div>

          <button
            ref={submitButton}
            type="submit"
            className="mt-7 h-12 w-full rounded-md bg-[#182334] px-7 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c] md:w-auto"
          >
            {isEn ? "Send message" : "Wyślij wiadomość"}
          </button>
        </form>
      </div>
    </div>
  );
}
