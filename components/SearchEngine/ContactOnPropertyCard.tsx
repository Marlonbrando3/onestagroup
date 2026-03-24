import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { OutfitSans, TenorsSans } from "../../fonts/fonts";

type Props = {
  propertyRef: any;
};

export default function ContactOnPropertyCard({ propertyRef }: Props) {
  const router = useRouter();

  const { id } = router.query;

  const [Name, setName] = useState();
  const [Phone, setPhone] = useState();
  const [Mail, setHandleMarginSlider] = useState();
  const [massege, setMessage] = useState(
    "Zainteresowało mnie to ogłoszenie.\nProszę o kontakt w celu przekazania szczegółów lub ustalenia terminu spotkania. Nr. ogłoszenia ",
  );

  const submitButton: any = useRef();

  const handleChangingForm = (e: any) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "phone") {
      setPhone(e.target.value);
    }
    if (e.target.name === "msg") {
      setMessage(e.target.value);
    }
    if (e.target.name === "email") {
      setHandleMarginSlider(e.target.value);
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
      submitButton.current.innerHTML = "Wysłano";
      submitButton.current.style.backgroundColor = "green";
    } else {
      submitButton.current.innerHTML = "Błąd, spróbuj jeszcze raz";
      submitButton.current.style.backgroundColor = "red";
      setTimeout(() => {
        submitButton.current.innerHTML = "Wyślij ponownie";
        submitButton.current.style.backgroundColor = "yellow";
      }, 1500);
    }
  };
  return (
    <div className={`${OutfitSans.className} h-auto grow`}>
      <div className=" bg-white rounded-md p-4 h-[480px] hidden lg:block z-40 bg-yellow-300/[0.2]">
        <p className="font-[500] pb-4 text-[20px]"> Jestem zainteresowany</p>
        <p className="font-[300] pb-4 text-[16px] leading-[18px]">
          {" "}
          Skontaktuj się z nami wypełniając formularz kontaktowy
        </p>

        <form
          className="w-full flex flex-col h-[340px] justify-between mt-[10px]"
          onSubmit={handleSendingProperty}
        >
          <input
            onChange={handleChangingForm}
            name="name"
            value={Name}
            placeholder="Imię (wymagane)"
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <input
            name="phone"
            value={Phone}
            onChange={handleChangingForm}
            placeholder="Numer telefonu"
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <input
            name="email"
            type="email"
            value={Mail}
            onChange={handleChangingForm}
            placeholder="Adres emial"
            className="border-[0.5px] rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <textarea
            name="msg"
            value={`${massege} ${propertyRef}`}
            onChange={handleChangingForm}
            className="border-[0.5px] rounded-md border-gray-600 pl-2 h-[150px] leading-[22px] p-2"
          ></textarea>
          <button
            ref={submitButton}
            className="bg-yellow-500 rounded-md text-white font-bold h-[40px]"
          >
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
}
