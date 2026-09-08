import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";
import { MontserratSans } from "@/fonts/fonts";

const emptyForm = (temat) => ({
  Id: temat || "Wpis blogowy",
  Name: "",
  Phone: "",
  Email: "",
  Message: "",
});

export default function ContactFormBlogPost({ temat }) {
  const router = useRouter();
  const [dataForm, setDataForm] = useState(() => emptyForm(temat));
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Ref: temat || "Wpis blogowy",
          dataForm,
          consents: { privacy: privacyAccepted, marketing: false },
          source: router.asPath,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Form submission failed");

      trackGoogleAdsContactConversion();
      setDataForm(emptyForm(temat));
      setPrivacyAccepted(false);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldClassName =
    "w-full border border-[#ded5c8] bg-white px-4 py-2.5 text-sm text-[#182334] outline-none transition placeholder:text-[#7b8490] focus:border-[#b8954c] focus:ring-2 focus:ring-[#b8954c]/15";

  return (
    <section
      className={`${MontserratSans.className} overflow-hidden border border-[#ded5c8] bg-white shadow-[0_24px_70px_rgba(24,35,52,0.12)]`}
      aria-label="Formularz kontaktowy"
    >
      <div className="h-1.5 bg-[#b8954c]" />

      <div className="bg-[#182334] px-5 py-3.5 text-white sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
          Bezpłatna konsultacja
        </p>
      </div>

      <form className="space-y-3 p-5 sm:p-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="blog-contact-name"
            className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5f6b7a]"
          >
            Imię i nazwisko
          </label>
          <input
            id="blog-contact-name"
            className={fieldClassName}
            onChange={handleChange}
            value={dataForm.Name}
            type="text"
            name="Name"
            autoComplete="name"
            placeholder="Jan Kowalski"
            required
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <label
              htmlFor="blog-contact-phone"
              className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5f6b7a]"
            >
              Telefon
            </label>
            <input
              id="blog-contact-phone"
              className={fieldClassName}
              onChange={handleChange}
              value={dataForm.Phone}
              type="tel"
              name="Phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+48 500 000 000"
            />
          </div>

          <div>
            <label
              htmlFor="blog-contact-email"
              className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5f6b7a]"
            >
              E-mail
            </label>
            <input
              id="blog-contact-email"
              className={fieldClassName}
              onChange={handleChange}
              value={dataForm.Email}
              type="email"
              name="Email"
              autoComplete="email"
              placeholder="adres@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="blog-contact-message"
            className="mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#5f6b7a]"
          >
            Wiadomość
          </label>
          <textarea
            id="blog-contact-message"
            className={`${fieldClassName} min-h-20 resize-y`}
            onChange={handleChange}
            value={dataForm.Message}
            name="Message"
            placeholder="Napisz, czego szukasz lub o co chcesz zapytać…"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#5f6b7a]">
          <input
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#182334]"
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
            required
          />
          <span>
            Oświadczam, że zapoznałem/am się z{" "}
            <Link
              className="font-semibold text-[#182334] underline decoration-[#b8954c] underline-offset-2"
              href="/polityka-prywatnosci"
            >
              Polityką Prywatności
            </Link>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="group flex w-full items-center justify-between bg-[#182334] px-5 py-3.5 text-left text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c] disabled:cursor-wait disabled:opacity-65"
        >
          <span>{status === "sending" ? "Wysyłamy…" : "Wyślij wiadomość"}</span>
          <FiArrowRight
            aria-hidden="true"
            className="text-lg transition-transform group-hover:translate-x-1"
          />
        </button>

        {status === "success" && (
          <p
            className="flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm leading-5 text-emerald-800"
            role="status"
          >
            <FiCheck className="mt-0.5 shrink-0" aria-hidden="true" />
            Dziękujemy. Wiadomość została wysłana — skontaktujemy się z Tobą.
          </p>
        )}

        {status === "error" && (
          <p
            className="border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-800"
            role="alert"
          >
            Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń pod
            numer +48 576 65 25 25.
          </p>
        )}
      </form>
    </section>
  );
}
