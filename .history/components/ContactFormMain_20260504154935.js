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

    submitButton.current.innerHTML = "Wysyłam...";
    submitButton.current.style.backgroundColor = "yellow";

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

      if (res.status === 200) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "form_main_site",
        });

        submitButton.current.style.backgroundColor = "green";
        submitButton.current.innerHTML = "Wiadomość wysłana!";
      } else {
        submitButton.current.innerHTML = "Błąd, spróbuj ponownie";
      }
    } catch (err) {
      submitButton.current.innerHTML = "Błąd, spróbuj ponownie";
    }
  };

  return (
    <div
      id="contact"
      className={`${MontserratSans.className} relative flex flex-col w-full h-1/2 bg-center bg-cover bg-[url("/contactformbg.webp")] rounded-xl`}
    >
      <div className="absolute w-full h-full bg-gray-900/[0]"></div>

      <div className="h-11/12 lg:w-[1200px] w-full flex flex-col-reverse lg:flex-row py-10 lg:mx-auto">
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
              {/* PRIVACY */}
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
                  Zapoznałem się z{" "}
                  <Link href="/polityka-prywatnosci" className="underline">
                    polityką prywatności
                  </Link>{" "}
                  i akceptuję jej treść.
                </span>
              </label>

              {/* MARKETING */}
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={(e) =>
                    setConsents({ ...consents, marketing: e.target.checked })
                  }
                />
                <span>
                  Wyrażam zgodę na kontakt telefoniczny oraz mailowy w celu
                  przedstawienia ofert nieruchomości.
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
      </div>
    </div>
  );
}
