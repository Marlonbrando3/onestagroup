import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MontserratSans } from "../../fonts/fonts";
import { FaRegCheckCircle } from "react-icons/fa";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

type data = {
  handleConsultationPopUp: any;
  ConsultationsShowed: any;
};
export default function Consultation({
  handleConsultationPopUp,
  ConsultationsShowed,
}: data) {
  const router = useRouter();
  const { offer } = router.query;

  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [msg, setMsg] = useState("");
  const sendButton: any = useRef();
  const thankyoupopup: any = useRef();

  const handleChangingValue = (e: any) => {
    const dataName = e.target.name;
    const dataValue = e.target.value;

    if (dataName === "name") {
      setName(dataValue);
    } else if (dataName === "phone") {
      setPhone(dataValue);
    } else if (dataName === "email") {
      setEmail(dataValue);
    } else if (dataName === "msg") {
      setMsg(dataValue);
    }
  };

  const handleSendingForm = async (e: any) => {
    e.preventDefault();

    try {
      let res = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer,
          name,
          phone,
          email,
          msg,
        }),
      });

      const data = await res.status;

      if (data === 200) {
        trackGoogleAdsContactConversion();
        thankyoupopup.current.style.display = "flex";
        setTimeout(() => {
          handleConsultationPopUp();
          thankyoupopup.current.style.display = "none";
        }, 2000);
        // router.push("https://onesta.com.pl/form/thankyoupageform");
        // setPageNumber(2);

        // setTimeout(() => {
        //   intrestedPopUp.current.style.display = "none";
        // }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fieldClass =
    "h-11 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-4 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c]";

  return (
    <div
      className={`${MontserratSans.className} ${
        ConsultationsShowed === true ? "block" : "hidden"
      } fixed left-0 right-0 top-[8vh] z-50 mx-auto max-h-[86vh] w-[92vw] max-w-[920px] overflow-y-auto bg-[#111827] shadow-2xl md:top-[10vh] lg:overflow-visible`}
    >
      <IoCloseCircleOutline
        className="absolute right-4 top-4 z-30 h-8 w-8 cursor-pointer text-white md:text-[#182334]"
        onClick={handleConsultationPopUp}
      />
      <form
        onSubmit={handleSendingForm}
        className="relative grid min-h-[490px] font-[500] md:grid-cols-[0.85fr_1.15fr]"
      >
        <div
          ref={thankyoupopup}
          className="absolute inset-0 z-20 hidden bg-white flex-col items-center justify-center"
        >
          <FaRegCheckCircle className="mb-10 h-24 w-24 text-green-600" />
          <p className="px-6 text-center text-[18px] font-[800] text-[#182334]">
            Dziękujemy!<br></br>Wkrótce się z Tobą skontaktujemy.
            <br></br>
            <span className="block">Do usłyszenia!</span>
          </p>
          <div
            className="mt-16 cursor-pointer text-sm font-bold uppercase tracking-wide text-[#9b7a36]"
            onClick={handleConsultationPopUp}
          >
            Zamknij okno
          </div>
        </div>

        <aside className="relative min-h-[230px] overflow-hidden p-7 text-white md:min-h-full md:p-8">
          <div className="absolute inset-0 bg-[url('/consultationsPopUp.png')] bg-cover bg-center opacity-35" />
          <div className="absolute inset-0 bg-[#111827]/84" />
          <div className="relative flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
                Bezpłatna konsultacja
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-[34px]">
                30 minut konkretnej rozmowy o Twoim zakupie.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/76">
                Sprawdzimy cel, budżet, kraj i etap decyzji. Po rozmowie będziesz
                wiedzieć, czy i jak możemy realnie pomóc.
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-white/82">
              {[
                "wstępna selekcja kierunku",
                "omówienie ryzyk i kosztów",
                "kolejny krok bez presji sprzedażowej",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <FaRegCheckCircle className="mt-1 shrink-0 text-[#d6b36a]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="bg-white p-6 md:p-7 lg:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8954c]">
            Formularz
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-tight text-[#182334]">
            Skorzystaj z 30 minutowej konsultacji.
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#5f6b7a]">
            Sprawdź, jak możemy Ci pomóc.
          </p>

          <div className="mt-5 grid gap-3">
            <input
              onChange={handleChangingValue}
              name="name"
              className={fieldClass}
              placeholder="Imię i nazwisko"
              required
            ></input>
            <input
              onChange={handleChangingValue}
              name="phone"
              className={fieldClass}
              placeholder="Numer kontaktowy"
              required
            ></input>
            <input
              onChange={handleChangingValue}
              name="email"
              className={fieldClass}
              placeholder="Adres email"
              required
            ></input>
            <textarea
              onChange={handleChangingValue}
              name="msg"
              className="min-h-[88px] w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] p-4 text-[#182334] outline-none transition placeholder:text-[#8a94a3] focus:border-[#b8954c]"
              placeholder="Twoja wiadomość"
            ></textarea>
          </div>

          <div className="mt-4 flex text-[12px] leading-5 text-[#475569]">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#b8954c]"
              required
            ></input>
            <p className="flex-1 pl-3">
              Zapoznałem się i akceptuję{" "}
              <a
                href="/polityka-prywatnosci"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                politykę prywatności
              </a>
              . (wymagane)
            </p>
          </div>
          <div className="mt-3 flex text-[12px] leading-5 text-[#475569]">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#b8954c]"
            ></input>
            <p className="flex-1 pl-3">
              Wyrażam zgodę na przetwarzanie moich danych osobowych przez Onesta
              Group Sp. z o.o. w celach marketingowych, w tym na kontakt mailowy
              w celu przedstawienia ofert nieruchomości.
            </p>
          </div>
          <button className="mt-5 h-11 w-full rounded-md bg-[#182334] px-7 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c] md:w-auto">
            <p ref={sendButton}>Wyślij zgłoszenie</p>
          </button>
        </div>
      </form>
    </div>
  );
}
