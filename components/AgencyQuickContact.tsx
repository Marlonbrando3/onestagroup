import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";
import styles from "@/styles/polishAgency.module.css";

export default function AgencyQuickContact({ variant = "region" }: { variant?: "region" | "conversation" } = {}) {
  const isConversation = variant === "conversation";
  const idPrefix = isConversation ? "conversation-contact" : "region-contact";
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
          Ref: isConversation
            ? "Polskie biuro nieruchomości w Hiszpanii — pierwsza rozmowa"
            : "Polskie biuro nieruchomości w Hiszpanii — wybór regionu",
          dataForm: {
            Name: String(fields.get("name") || "").trim(),
            Phone: String(fields.get("phone") || "").trim(),
            Email: "",
            Message: isConversation
              ? "Proszę o kontakt telefoniczny po polsku w sprawie zakupu nieruchomości w Hiszpanii."
              : "Proszę o kontakt telefoniczny po polsku i pomoc w wyborze regionu Hiszpanii.",
          },
          consents: { privacy: fields.get("privacy") === "on", marketing: false },
          source: window.location.pathname + window.location.search,
          timestamp: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Contact request failed");
      trackGoogleAdsContactConversion();
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section id={isConversation ? "pierwsza-rozmowa" : "pomoc-w-wyborze-regionu"} className={styles.quickContactSection} aria-labelledby={`${idPrefix}-heading`}>
      <div className={`${styles.container} ${styles.quickContactInner}`}>
        <div>
          {!isConversation && <p className={styles.eyebrow}>Wybierzmy razem</p>}
          <h2 id={`${idPrefix}-heading`}>{isConversation ? "Każdy nasz klient zaczął od rozmowy" : <>Nie wiesz jeszcze,<br />który region wybrać?</>}</h2>
          <p>Zostaw numer. Porozmawiamy o Twoich planach po polsku.</p>
        </div>
        {status === "success" ? (
          <div className={styles.quickContactSuccess} role="status">
            <FiCheckCircle aria-hidden="true" />
            <div><strong>Dziękujemy za kontakt.</strong><p>{isConversation ? "Oddzwonimy, aby porozmawiać o Twoich planach." : "Oddzwonimy i pomożemy wybrać kierunek poszukiwań."}</p></div>
          </div>
        ) : (
          <form method="post" onSubmit={submit} className={styles.quickContactForm} aria-busy={status === "sending"}>
            <div className={styles.quickContactFields}>
              <label htmlFor={`${idPrefix}-name`}>
                <span>Twoje imię</span>
                <input id={`${idPrefix}-name`} name="name" autoComplete={`section-${idPrefix} given-name`} placeholder="Imię" required maxLength={100} />
              </label>
              <label htmlFor={`${idPrefix}-phone`}>
                <span>Numer telefonu</span>
                <input id={`${idPrefix}-phone`} name="phone" type="tel" autoComplete={`section-${idPrefix} tel`} placeholder="+48" required minLength={7} maxLength={25} />
              </label>
              <button type="submit" className={styles.button} disabled={status === "sending"}>
                {status === "sending" ? "Wysyłamy…" : "Proszę o kontakt"}<FiArrowRight aria-hidden="true" />
              </button>
            </div>
            <label className={styles.quickContactConsent}>
              <input type="checkbox" name="privacy" required />
              <span>Akceptuję <Link href="/polityka-prywatnosci">politykę prywatności</Link> i proszę o kontakt w sprawie mojego zapytania.</span>
            </label>
            {status === "error" && <p role="alert" className={styles.quickContactError}>Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub zadzwoń: <a href="tel:+48576652525">+48 576 65 25 25</a>.</p>}
          </form>
        )}
      </div>
    </section>
  );
}
