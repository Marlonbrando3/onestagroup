import React from "react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";

export default function ContactFormMain() {
  const router = useRouter();
  const submitButton = useRef();

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
      alert("Musisz zaakceptować politykę prywatności.");
      return;
    }

    if (submitButton.current) {
      submitButton.current.innerHTML = "Wysyłam...";
      submitButton.current.style.backgroundColor = "yellow";
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
        console.warn(`Contact form returned status ${res.status}`);
      }

      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "form_main_site",
        });
      } catch (analyticsError) {
        console.error("Form sent, analytics failed:", analyticsError);
      }

      if (submitButton.current) {
        submitButton.current.style.backgroundColor = "green";
        submitButton.current.innerHTML = "Wiadomość wysłana!";
      }
    } catch (err) {
      console.error("Main contact form failed:", err);
      if (submitButton.current) {
        submitButton.current.innerHTML = "Błąd, spróbuj ponownie";
        submitButton.current.disabled = false;
      }
    }
  };

  return (
    <div
      id="contact"
      className={`${MontserratSans.className} relative flex flex-col w-full h-1/2 bg-center bg-cover bg-[url("/contactformbg.webp")] rounded-xl`}
    >
      <div className="absolute w-full h-full bg-gray-900/[0]"></div>

      <div className="h-11/12 lg:w-[1200px] w-full flex flex-col-reverse lg:flex-row lg:flex py-10 lg:mx-auto">
        {/* MOBILE DANE FIRMY */}
        <div className="flex lg:flex-col items-center z-10 lg:w-8/12 w-full justify-center lg:pt-0 pt-24 visible lg:hidden">
          <div className="text-xs sm:text-lg flex flex-col justify-center items-start lg:items-center h-1/2 w-5/12 text-white">
            <p className="font-bold">Siedziba firmy:</p>
            <p>Onesta Group sp. z o.o.</p>
            <p>53-148 Wrocław</p>
            <p>ul. Wolbromska 18/1b</p>
            <p>NIP: 899 292 23 78</p>
          </div>
          <div className="text-xs sm:text-lg flex flex-col md:justify-center items-start lg:items-center h-1/2 w-5/12 text-white">
            <p className="font-bold">Biuro dla klientów:</p>
            <p>45-865 Opole</p>
            <p>ul. Niemodlińska 58a</p>
            <div className="w-32 h-4"></div>
            <p>mail: biuro@onesta.com.pl</p>
            <p>tel.: +48 576 65 25 25</p>
          </div>
        </div>

        {/* FORM */}
        <div className="w-full lg:w-7/12">
          <form
            className="relative z-10 flex flex-col w-full mx-auto rounded-xl px-[20px]"
            onSubmit={handleSubmit}
          >
            <div className="py-4 font-[500] text-[32px] leading-[40px] text-white">
              Napisz jak możemy Ci pomóc, a my{" "}
              <span className="font-[800]">
                błyskawicznie oddzwonimy do Ciebie
              </span>
            </div>

            <input
              className="h-10 my-2 rounded-md pl-2 shadow-md"
              type="text"
              placeholder="Imię i nazwisko"
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Name: e.target.value })
              }
            />

            <input
              className="h-12 my-2 rounded-md pl-2 shadow-md"
              type="tel"
              placeholder="Numer telefonu"
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Phone: e.target.value })
              }
            />

            <input
              className="h-12 my-2 rounded-md pl-2 shadow-md"
              type="email"
              placeholder="Adres email"
              required
              onChange={(e) =>
                setDataForm({ ...dataForm, Email: e.target.value })
              }
            />

            <textarea
              className="h-40 my-2 rounded-md pl-2 p-3 shadow-md"
              placeholder="Opisz czego szukasz i jak możemy pomóc"
              onChange={(e) =>
                setDataForm({ ...dataForm, Message: e.target.value })
              }
            />

            {/* CHECKBOXY */}
            <div className="mt-4 space-y-3 text-sm text-white">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  required
                  checked={consents.privacy}
                  onChange={(e) =>
                    setConsents({ ...consents, privacy: e.target.checked })
                  }
                />
                <span>
                  Akceptuję{" "}
                  <Link href="/polityka-prywatnosci" className="underline">
                    politykę prywatności
                  </Link>
                  .
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={(e) =>
                    setConsents({ ...consents, marketing: e.target.checked })
                  }
                />
                <span>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych przez
                  Onesta Group Sp. z o.o. w celach marketingowych, w tym na
                  kontakt telefoniczny oraz mailowy w celu przedstawienia ofert
                  nieruchomości.
                </span>
              </label>
            </div>

            <button
              ref={submitButton}
              type="submit"
              className="mt-4 bg-[#275278] w-56 py-2 rounded-md text-white text-[16px] duration-300 border border-[#275278] font-[600] hover:bg-white hover:text-[#275278]"
            >
              Wyślij
            </button>
          </form>
        </div>

        {/* DESKTOP DANE FIRMY */}
        <div className="lg:flex lg:flex-col items-start z-10 lg:w-6/12 w-full justify-center lg:pt-0 pt-24 hidden">
          <div className="text-xs lg:text-lg flex flex-col justify-center items-start h-1/2 text-white px-[5px]">
            <p className="font-bold">Siedziba firmy:</p>
            <p>Onesta Group sp. z o.o.</p>
            <p>53-148 Wrocław</p>
            <p>ul. Wolbromska 18/1b</p>
            <p>NIP: 899 292 23 78</p>
          </div>
          <div className="text-xs lg:text-lg flex flex-col justify-center items-start h-1/2 text-white px-[5px]">
            <p className="font-bold">Biuro dla klientów:</p>
            <p>45-865 Opole</p>
            <p>ul. Niemodlińska 58a</p>
            <div className="w-32 h-4"></div>
            <p>mail: biuro@onesta.com.pl</p>
            <p>tel.: +48 576 75 25 25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
