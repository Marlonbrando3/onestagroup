import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { IoCheckmarkDone, IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import Link from "next/link";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

export default function Newsletter() {
  const router = useRouter();

  const name = useRef();
  const email = useRef();
  const phone = useRef();
  const newsletter = useRef();
  const newsletterMiniButton = useRef();
  const newsletterConfirmation = useRef();

  const [newsletterWasClosed, setNewsletterWasClosed] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState(
    "Wysłaliśmy wiadomość z linkiem potwierdzającym. Otwórz ją i dokończ zapis.",
  );

  const handleForm = (e) => {
    const nameData = e.target.name;

    if (nameData === "name") {
      name.current.value = e.target.value;
    }

    if (nameData === "email") {
      email.current.value = e.target.value;
    }
  };

  const newNewsletter = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const results = await fetch("/api/newNewsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.current.value,
          email: email.current.value,
          consentAccepted,
          sourceUrl: window.location.href,
        }),
      });

      const result = await results.json();
      if (!results.ok) throw new Error(result.error || "Nie udało się rozpocząć zapisu.");
      trackGoogleAdsContactConversion();
      setConfirmationMessage(result.message || "Sprawdź skrzynkę e-mail i potwierdź zapis.");
      newsletterConfirmation.current.style.display = "flex";
    } catch (error) {
      setSubmitError(error?.message || "Nie udało się rozpocząć zapisu.");
    } finally {
      setSubmitting(false);
    }
  };

  const hideNewsletter = () => {
    newsletter.current.style.visibility = "hidden";
    newsletterConfirmation.current.style.display = "none";
    newsletterMiniButton.current.style.display = "flex";
    setNewsletterWasClosed(true);
  };

  const showNewsletter = () => {
    newsletter.current.style.visibility = "visible";
    newsletterMiniButton.current.style.display = "none";
  };

  const closeNewsletterConfirmation = () => {
    newsletter.current.style.visibility = "hidden";
  };

  useEffect(() => {
    // if (!router.asPath.includes("/blog")) {
    setTimeout(() => {
      if (newsletterMiniButton.current.style.display === "") {
        newsletter.current.style.visibility = "visible";
      }
      if (newsletterMiniButton.current.style.display === "flex") {
        newsletter.current.style.visibility = "hidden";
      } else {
        newsletter.current.style.visibility = "visible";
      }
    }, 20000);
    // } else {
    //   const options = { passive: true }; // options must match add/remove event
    //   const scroll = (event) => {
    //     const { pageYOffset, scrollY } = window;
    //     console.log("yOffset", pageYOffset, "scrollY", scrollY);
    //     // setNewsletterWasClosed(true);
    //     if (scrollY > 400 && newsletterWasClosed === false) {
    //       newsletter.current.style.visibility = "visible";
    //     }
    //   };
    //   window.addEventListener("scroll", scroll, options);
    //   // remove event on unmount to prevent a memory leak
    //   () => window.removeEventListener("scroll", scroll, options);
    // }
  }, []);

  return (
    <>
      <button
        type="button"
        ref={newsletterMiniButton}
        onClick={showNewsletter}
        className="fixed bottom-5 left-5 z-50 hidden items-center justify-center border border-[#d7c8ad] bg-[#182334] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_34px_rgba(24,35,52,0.22)] transition hover:border-[#b8954c] hover:bg-[#243449] lg:bottom-auto lg:top-[150px] lg:h-[220px] lg:w-[44px] lg:px-0 lg:py-0"
      >
        <span className="whitespace-nowrap lg:rotate-90">Newsletter</span>
      </button>
      <div
        ref={newsletter}
        className="invisible fixed left-0 right-0 top-[88px] z-[60] mx-[14px] overflow-hidden border border-[#e5dac7] bg-[#fbf8f2] text-[#182334] shadow-[0_24px_70px_rgba(24,35,52,0.24)] md:mx-auto md:w-[640px] lg:top-[120px]"
      >
        <div
          ref={newsletterConfirmation}
          className="absolute inset-0 z-30 hidden flex-col items-center justify-center bg-[#182334] px-8 text-center"
        >
          <IoCheckmarkDone className="h-16 w-16 text-[#d8b66a]" />
          <p className="mt-4 text-2xl font-semibold text-white">
            Sprawdź swoją skrzynkę
          </p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
            {confirmationMessage}
          </p>
          <button
            type="button"
            onClick={hideNewsletter}
            className="mt-7 border border-white/20 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#182334] transition hover:bg-[#d8b66a]"
          >
            Zamknij
          </button>
        </div>

        <button
          type="button"
          onClick={hideNewsletter}
          aria-label="Zamknij newsletter"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#e5dac7] bg-white text-[#182334] transition hover:border-[#b8954c]"
        >
          <IoClose className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <aside className="bg-[#182334] px-6 py-7 text-white md:px-8 md:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d8b66a]">
              Newsletter Onesta
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight">
              Wiedza, która pomaga kupować spokojniej.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/72">
              Wysyłamy tylko konkretne materiały: poradniki, zmiany formalne, nowe kierunki i praktyczne wskazówki przed zakupem nieruchomości za granicą.
            </p>
            <div className="mt-7 space-y-3 text-sm text-white/80">
              <p className="border-l border-[#d8b66a] pl-4">
                Proces zakupu i dokumenty
              </p>
              <p className="border-l border-[#d8b66a] pl-4">
                Hiszpania, Cypr i kolejne rynki
              </p>
              <p className="border-l border-[#d8b66a] pl-4">
                Bez spamu i przypadkowych ofert
              </p>
            </div>
          </aside>

          <form className="flex flex-col bg-white px-5 py-7 md:px-8 md:py-10" onSubmit={newNewsletter}>
            <div className="mb-6 pr-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
                Dołącz do listy
              </p>
              <p className="mt-3 text-sm leading-6 text-[#5f6b7a]">
                Zostaw dane, a wyślemy Ci najważniejsze materiały bez informacyjnego szumu.
              </p>
            </div>

          <div className="mb-4 flex flex-col text-[15px]">
            <input
              ref={name}
              name="name"
              onChange={handleForm}
              className="h-12 border border-[#d7c8ad] bg-[#fbf8f2] px-4 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c] focus:bg-white"
              placeholder="Imię"
              required
            ></input>
          </div>
          <div className="mb-4 flex flex-col text-[15px]">
            <input
              ref={email}
              name="email"
              type="email"
              autoComplete="email"
              onChange={handleForm}
              className="h-12 border border-[#d7c8ad] bg-[#fbf8f2] px-4 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c] focus:bg-white"
              placeholder="Adres e-mail"
              required
            ></input>
          </div>
          {/* <div className="flex flex-col mb-[20px] text-[19px]">
            <input
              ref={phone}
              name="phone"
              onChange={handleForm}
              className="h-[40px] rounded-md border-2 border-gray-600 pl-3 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Numer telefonu (opcjonalnie)"
            ></input>
          </div> */}
          <label className="mb-5 flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-[#5f6b7a]">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(event) => setConsentAccepted(event.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#b8954c]"
              required
            ></input>
            <span>
              Wyrażam zgodę na otrzymywanie od Onesta Group Sp. z o.o. newslettera oraz informacji
              handlowych i marketingowych drogą elektroniczną na podany adres e-mail. Wiem, że zgodę
              mogę wycofać w każdej chwili. Zapoznałem/am się z{" "}
              <Link href="/polityka-prywatnosci" className="underline" target="_blank">
                polityką prywatności
              </Link>
              .
            </span>
          </label>
          {submitError ? (
            <p className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              disabled={submitting}
              className="h-12 bg-[#182334] px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c] disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Wysyłanie…" : "Zapisz mnie"}
            </button>
            <button
              type="button"
              onClick={hideNewsletter}
              className="h-12 border border-[#d7c8ad] bg-white px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#182334] transition hover:border-[#182334]"
            >
              Później
            </button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
}
