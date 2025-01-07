"use client";

import { cookies } from "next/headers";
import React from "react";
import { useState } from "react";

export default function FormOsiedleLesne() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [massege, setMassege] = useState("");

  const sendForm = async (e: any) => {
    e.preventDefault();
    console.log(name, lastName, email, phone, massege);
    try {
      let res = await fetch("/api/contactform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          lastName,
          email,
          phone,
          massege,
        }),
      });

      const data = await res.status;
      // console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={sendForm} className="p-[30px] bg-[#e4c27e] rounded-[7px] mx-auto lg:w-[900px]">
      {/* <div className="text-white text-[25px] mb-[30px] w-[300px] font-bold">
        Jak możemy Ci pomóc?
      </div> */}
      <div className="flex justify-center flex-col lg:flex-row">
        <div className="flex lg:w-[420px] w-full flex-wrap h-[230px]">
          <div className="lg:w-[210px] w-full">
            <div className="text-white">Imię</div>
            <input
              className="lg:w-[200px] w-full rounded-[5px] h-[35px]"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            ></input>
          </div>
          <div className="lg:w-[210px] w-full">
            <div className="text-white">Nazwisko</div>
            <input
              className="lg:w-[200px] w-full rounded-[5px] h-[35px]"
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            ></input>
          </div>
          <div className="lg:w-[410px] w-full">
            <div className="text-white">Adres e-mail</div>
            <input
              className="lg:w-[410px] w-full rounded-[5px] h-[35px]"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="lg:w-[410px] w-full">
            <div className="text-white">Telefon kontaktowy (same cyfry)</div>
            <input
              className="lg:w-[410px] w-full rounded-[5px] h-[35px]"
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
            ></input>
          </div>
        </div>
        <div>
          <div className="lg:w-[410px] w-full mt-[5px] lg:mt-0">
            <div className="text-white">Twoja wiadomość</div>
            <textarea
              className="lg:w-[410px] w-full rounded-[5px] h-[189px]"
              value={massege}
              onChange={(e: any) => setMassege(e.target.value)}
            ></textarea>
          </div>
        </div>{" "}
      </div>
      <div className="flex">
        <input
          type="checkbox"
          className="w-[25px] h-[25px] text-orange-500 cursor-pointer"
          required
        ></input>
        <p className="text-white ml-[4px]">
          Wyrażam zgodę na przetwarzanie moich danych osobowych celem kontaktu ze mną oraz w celach
          marketingowych. Zgodnie z polityką prywatności.
        </p>
      </div>
      <button className="hover:text-white border-2 border-white p-[7px] rounded-[5px] hover:bg-[#d5a74c] w-[150px] mt-[15px] bg-white text-[#e4c27e] duration-200">
        Wyślij formularz
      </button>
    </form>
  );
}
