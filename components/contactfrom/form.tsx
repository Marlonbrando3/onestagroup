"use client";
import { QuicksandSans } from "../../fonts/fonts";

import React from "react";
import { useState } from "react";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";

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

    try {
      let res = await fetch("/api/form", {
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
      if (data === 200) trackGoogleAdsContactConversion();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={sendForm}
      className={`${QuicksandSans.className} w-full border border-white/12 bg-white p-6 shadow-2xl md:p-8`}
    >
      <div className="mb-8 w-full">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8954c]">
          Formularz kontaktowy
        </p>
        <h3 className="mt-2 text-2xl font-bold text-[#182334] md:text-3xl">
          Proszę o kontakt i więcej informacji
        </h3>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Proszę o przesłanie przykładowych ofert
            </div>
            <select
              defaultValue="wybierz termin"
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={examples}
              onChange={(e: any) => setExaples(e.target.value)}
            >
              <option value="nie">NIE</option>
              <option value="tak">TAK</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">Imię</div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            ></input>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Nazwisko
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Adres e-mail
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Telefon kontaktowy
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Kiedy (orientacyjnie) planujesz przylot?
            </div>
            <select
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={date}
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
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              Twoja wiadomość
            </div>
            <textarea
              className="min-h-[280px] w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 py-3 text-[#182334] outline-none transition focus:border-[#b8954c] lg:min-h-[392px]"
              value={massege}
              onChange={(e: any) => setMassege(e.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 cursor-pointer accent-[#b8954c]"
          required
        ></input>
        <p className="text-sm leading-6 text-[#475569]">
          Wyrażam zgodę na przetwarzanie moich danych osobowych celem kontaktu
          ze mną oraz w celach marketingowych. Zgodnie z polityką prywatności.
        </p>
      </div>
      <button className="mt-6 h-12 w-full rounded-md bg-[#182334] px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c] md:w-auto">
        Wyślij formularz
      </button>
    </form>
  );
}
