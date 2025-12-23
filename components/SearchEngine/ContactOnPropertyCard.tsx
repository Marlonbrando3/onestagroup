import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { CiPhone } from "react-icons/ci";
import { IoMailOutline } from "react-icons/io5";

type Props = {
  propertyRef: any;
};

export default function ContactOnPropertyCard({ propertyRef }: Props) {
  const router = useRouter();

  const { id } = router.query;

  const [Name, setName] = useState();
  const [Phone, setPhone] = useState();
  const [massege, setMessage] = useState("Proszę o kontakt w sprawie tej nieruchomości");

  const submitButton: any = useRef();

  const handleChangingForm = (e: any) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    }
    if (e.target.name === "contact") {
      setPhone(e.target.value);
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
      massege: `${massege} (${propertyRef})`,
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
    <div className="h-auto grow">
      <div className=" bg-white rounded-md p-4 h-[600px] hidden lg:block z-40">
        <p className="font-[800] pb-4 text-[20px]"> Więcej informacji</p>
        <div className="flex items-center mb-[30px]">
          <Image src="/Maro_fota_strona.png" width={70} height={70} alt="foto"></Image>
          <p className="pl-[5px] font-bold text-[20px]">Marek</p>
        </div>
        <div className="flex items-center">
          <CiPhone /> <p className="pl-[8px]">+48 576 65 25 25</p>
        </div>
        <div className="flex items-center">
          <IoMailOutline /> <p className="pl-[8px]">biuro@onesta.com.pl</p>
        </div>
        <form
          className="w-full flex flex-col h-[300px] justify-between mt-[30px]"
          onSubmit={handleSendingProperty}
        >
          <input
            onChange={handleChangingForm}
            name="name"
            value={Name}
            placeholder="Imię (wymagane)"
            className="border rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <input
            name="contact"
            value={Phone}
            onChange={handleChangingForm}
            placeholder="Numer telefonu lub email"
            className="border rounded-md border-gray-600 pl-[5px] h-[40px]"
            required
          ></input>
          <textarea
            name="msg"
            value={`${massege} (${propertyRef})`}
            onChange={handleChangingForm}
            className="border rounded-md border-gray-600 pl-[5px] h-[150px]"
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
