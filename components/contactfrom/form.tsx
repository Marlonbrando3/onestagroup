"use client";
import { QuicksandSans } from "../../fonts/fonts";

import { cookies } from "next/headers";
import React from "react";
import { useState } from "react";

export default function Form() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("do 12 września");
  const [examples, setExaples] = useState("NIE");
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
          date,
          examples,
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
    <form
      onSubmit={sendForm}
      className={`${QuicksandSans.className} p-[30px] bg-blue-400 rounded-[7px] mx-auto lg:w-[900px]`}
    >
      <div className="text-white lg:text-[32px] text-[28px] mb-[30px] w-full font-bold">
        Proszę kontakt i więcej informacji
      </div>
      <div className="flex justify-center flex-col lg:flex-row">
        <div className="flex lg:w-[420px] w-full flex-wrap h-[430px]">
          <div className="lg:w-[410px] w-full">
            <div className="text-white">Proszę o przesłanie przykładowych ofert</div>
            <select
              defaultValue="wybierz termin"
              className="lg:w-[410px] w-full rounded-[5px] h-[35px]"
              value={phone}
              onChange={(e: any) => setExaples(e.target.value)}
            >
              <option value="nie">NIE</option>
              <option value="tak">TAK</option>
            </select>
          </div>
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
          <div className="lg:w-[410px] w-full">
            <div className="text-white">Kiedy (orientacyjnie) planujesz przylot?</div>
            <select
              className="lg:w-[410px] w-full rounded-[5px] h-[35px]"
              value={phone}
              onChange={(e: any) => setDate(e.target.value)}
            >
              <option value="do 12 września">do 12 września</option>
              <option value="do 20 września">do 20 września</option>
              <option value="do 30 września">do 30 września</option>
              <option value="do 12 października">do 12 października</option>
              <option value="do 20 października">do 20 października</option>
              <option value="do 30 października">do 30 października</option>
              <option value="inny termin">Inny termin</option>
              <option value="jestem w Hiszpanii">Jestem w Hiszpanii</option>
            </select>
          </div>
        </div>
        <div>
          <div className="lg:w-[410px] w-full mt-[5px] lg:mt-0">
            <div className="text-white">Twoja wiadomość</div>
            <textarea
              className="lg:w-[410px] w-full rounded-[5px] h-[189px] md:h-[381px] "
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
      <button className="text-white p-[7px] rounded-[5px] bg-orange-500 w-[150px] mt-[15px] hover:bg-blue-500 duration-200">
        Wyślij formularz
      </button>
    </form>
  );
}
