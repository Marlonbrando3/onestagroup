import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OutfitSans, TenorsSans } from "../../fonts/fonts";
import { MdOutlineSend } from "react-icons/md";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

type Props = {
  propertyRef: any;
  locale?: "pl" | "en";
};

export default function ContactInFooterMobile({
  propertyRef,
  locale = "pl",
}: Props) {
  const router = useRouter();
  const isEn = locale === "en";

  const { id } = router.query;

  const [Name, setName] = useState();
  const [Phone, setPhone] = useState();
  const [Mail, setMail] = useState();
  const [massege, setMessage] = useState(
    isEn
      ? "I am interested in this listing.\nPlease contact me with details or to arrange a meeting. Listing ref. "
      : "Zainteresowało mnie to ogłoszenie.\nProszę o kontakt w celu przekazania szczegółów lub ustalenia terminu spotkania. Nr. ogłoszenia ",
  );

  const submitButton: any = useRef();

  const handleChangingForm = (e: any) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "phone") {
      setPhone(e.target.value);
    }
    if (e.target.name === "email") {
      setMail(e.target.value);
    }
    if (e.target.name === "msg") {
      setMessage(e.target.value);
    }
  };

  const handleSendingProperty = async (e: any) => {
    e.preventDefault();
    let query = JSON.stringify({
      id,
      name: Name,
      phone: Phone,
      mail: Mail,
      massege: `${massege} (${propertyRef})`,
      ref: propertyRef,
    });

    let res = await fetch("/api/formFromProperty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: query,
    });

    const results = await res.json();

    if (results.status === 200) {
      trackGoogleAdsContactConversion();
      submitButton.current.innerHTML = isEn ? "Sent" : "Wysłano";
      submitButton.current.style.backgroundColor = "green";
    } else {
      submitButton.current.innerHTML = isEn
        ? "Error, please try again"
        : "Błąd, spróbuj jeszcze raz";
      submitButton.current.style.backgroundColor = "red";
      setTimeout(() => {
        submitButton.current.innerHTML = isEn ? "Send again" : "Wyślij ponownie";
        submitButton.current.style.backgroundColor = "yellow";
      }, 1500);
    }
  };
  return (
    <div className={`${OutfitSans.className} h-auto `}>
      <div className=" bg-white rounded-md p-4 h-[480px] md:hidden block z-40 bg-yellow-400/[0.8]">
        <p className="font-[500] pb-4 text-[20px]">
          {isEn ? "I am interested" : " Jestem zainteresowany"}
        </p>
        <p className="font-[300] pb-4 text-[16px] leading-[18px]">
          {isEn
            ? "Contact us by completing the form below"
            : " Skontaktuj się z nami wypełniając formularz kontaktowy"}
        </p>

        <form
          className="w-full flex flex-col h-[340px] justify-between mt-[10px]"
          onSubmit={handleSendingProperty}
        >
          <input
            onChange={handleChangingForm}
            name="name"
            type="text"
            value={Name}
            placeholder={isEn ? "Name (required)" : "Imię (wymagane)"}
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <input
            name="phone"
            value={Phone}
            onChange={handleChangingForm}
            placeholder={isEn ? "Phone number" : "Numer telefonu"}
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <input
            name="email"
            type="email"
            value={Mail}
            onChange={handleChangingForm}
            placeholder={isEn ? "Email address" : "Adres emial"}
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <textarea
            name="msg"
            value={`${massege} ${propertyRef}.`}
            onChange={handleChangingForm}
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[150px]"
          ></textarea>
          <button
            ref={submitButton}
            className="bg-yellow-600 rounded-md text-white font-bold h-[40px] flex items-center justify-center "
          >
            <MdOutlineSend className="mr-[10px]" />
            {isEn ? "SEND MESSAGE" : "WYŚLIJ WIADOMOŚĆ"}
          </button>
        </form>
      </div>
    </div>
  );
}
