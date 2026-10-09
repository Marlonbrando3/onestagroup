import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";
import styles from "@/styles/propertyManagement.module.css";

export default function PropertyManagementContact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || status === "success") return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    submitting.current = true;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Ref: "Zarządzanie nieruchomością w Hiszpanii — HOLASTAY",
          dataForm: {
            Name: String(fields.get("name") || "").trim(),
            Phone: String(fields.get("phone") || "").trim(),
            Email: String(fields.get("email") || "").trim(),
            Message: `Lokalizacja: ${String(fields.get("location") || "Nie podano").trim()}\n${String(fields.get("message") || "").trim()}`,
          },
          consents: { privacy: fields.get("privacy") === "on", marketing: false },
          source: window.location.pathname,
          timestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Contact request failed");
      form.reset();
      setStatus("success");
      try { trackGoogleAdsContactConversion(); } catch { /* The enquiry was already sent. */ }
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  if (status === "success") return (
    <div className={styles.contactSuccess} role="status">
      <FiCheckCircle aria-hidden="true" />
      <h3>Dziękujemy za wiadomość.</h3>
      <p>Skontaktujemy się z Tobą, aby omówić nieruchomość i możliwy zakres opieki.</p>
    </div>
  );

  return (
    <form className={styles.contactForm} onSubmit={submit} aria-busy={status === "sending"}>
      <div className={styles.contactFields}>
        <label htmlFor="management-name">Twoje imię<input id="management-name" name="name" autoComplete="given-name" placeholder="Jak się do Ciebie zwracać?" required maxLength={100} /></label>
        <label htmlFor="management-phone">Telefon<input id="management-phone" name="phone" type="tel" autoComplete="tel" placeholder="+48" required minLength={7} maxLength={25} /></label>
        <label htmlFor="management-email">E-mail<input id="management-email" name="email" type="email" autoComplete="email" placeholder="twoj@email.pl" required maxLength={200} /></label>
        <label htmlFor="management-location">Lokalizacja nieruchomości<input id="management-location" name="location" placeholder="np. Torrevieja, San Javier" maxLength={200} /></label>
        <label htmlFor="management-message" className={styles.fullField}>Kilka słów o apartamencie<textarea id="management-message" name="message" rows={3} placeholder="Liczba sypialni, wyposażenie, planowany termin rozpoczęcia wynajmu…" maxLength={3000} /></label>
      </div>
      <label className={styles.consent}><input type="checkbox" name="privacy" required /><span>Akceptuję <Link href="/polityka-prywatnosci">politykę prywatności</Link> i proszę Onesta Group o kontakt w sprawie mojego zapytania.</span></label>
      <button type="submit" className={styles.button} disabled={status === "sending"}>{status === "sending" ? "Wysyłamy…" : "Porozmawiajmy o zarządzaniu"}<FiArrowRight aria-hidden="true" /></button>
      {status === "error" && <p role="alert" className={styles.formError}>Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń: <a href="tel:+48576652525">+48 576 65 25 25</a>.</p>}
    </form>
  );
}
