"use client";
import { QuicksandSans } from "../../fonts/fonts";

import React from "react";
import { useState } from "react";
import { trackGoogleAdsContactConversion } from "@/analitycs/googleAdsConversion";
import type { SiteLocale } from "@/lib/i18n";

type FormProps = {
  locale?: SiteLocale;
};

const copy = {
  pl: {
    eyebrow: "Formularz kontaktowy",
    title: "Proszę o kontakt i więcej informacji",
    examplesLabel: "Proszę o przesłanie przykładowych ofert",
    no: "NIE",
    yes: "TAK",
    firstName: "Imię",
    lastName: "Nazwisko",
    email: "Adres e-mail",
    phone: "Telefon kontaktowy",
    dateLabel: "Kiedy (orientacyjnie) planujesz przylot?",
    message: "Twoja wiadomość",
    consent:
      "Wyrażam zgodę na przetwarzanie moich danych osobowych celem kontaktu ze mną oraz w celach marketingowych. Zgodnie z polityką prywatności.",
    submit: "Wyślij formularz",
    defaultDate: "do 12 września",
    options: [
      ["do 12 września", "do 12 września"],
      ["do 20 września", "do 20 września"],
      ["do 30 września", "do 30 września"],
      ["do 12 października", "do 12 października"],
      ["do 20 października", "do 20 października"],
      ["do 30 października", "do 30 października"],
      ["inny termin", "Inny termin"],
      ["jestem w Hiszpanii", "Jestem w Hiszpanii"],
    ],
  },
  en: {
    eyebrow: "Contact form",
    title: "Please contact me with more information",
    examplesLabel: "Please send me sample offers",
    no: "NO",
    yes: "YES",
    firstName: "First name",
    lastName: "Last name",
    email: "E-mail address",
    phone: "Phone number",
    dateLabel: "When are you roughly planning to arrive?",
    message: "Your message",
    consent:
      "I consent to the processing of my personal data for contact and marketing purposes, in accordance with the privacy policy.",
    submit: "Send form",
    defaultDate: "by 12 September",
    options: [
      ["by 12 September", "by 12 September"],
      ["by 20 September", "by 20 September"],
      ["by 30 September", "by 30 September"],
      ["by 12 October", "by 12 October"],
      ["by 20 October", "by 20 October"],
      ["by 30 October", "by 30 October"],
      ["other date", "Other date"],
      ["I am in Spain", "I am in Spain"],
    ],
  },
} as const;

export default function Form({ locale = "pl" }: FormProps) {
  const t = copy[locale];
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState<string>(t.defaultDate);
  const [examples, setExaples] = useState<string>(t.no);
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
          {t.eyebrow}
        </p>
        <h3 className="mt-2 text-2xl font-bold text-[#182334] md:text-3xl">
          {t.title}
        </h3>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.examplesLabel}
            </div>
            <select
              defaultValue="wybierz termin"
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={examples}
              onChange={(e: any) => setExaples(e.target.value)}
            >
              <option value={t.no}>{t.no}</option>
              <option value={t.yes}>{t.yes}</option>
            </select>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.firstName}
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            ></input>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.lastName}
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={lastName}
              onChange={(e: any) => setLastName(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.email}
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.phone}
            </div>
            <input
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={phone}
              onChange={(e: any) => setPhone(e.target.value)}
            ></input>
          </div>
          <div className="sm:col-span-2">
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.dateLabel}
            </div>
            <select
              className="h-12 w-full rounded-md border border-[#d8c8ad] bg-[#fbf8f2] px-3 text-[#182334] outline-none transition focus:border-[#b8954c]"
              value={date}
              onChange={(e: any) => setDate(e.target.value)}
            >
              {t.options.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div>
            <div className="mb-2 text-sm font-semibold text-[#334155]">
              {t.message}
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
          {t.consent}
        </p>
      </div>
      <button className="mt-6 h-12 w-full rounded-md bg-[#182334] px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#b8954c] md:w-auto">
        {t.submit}
      </button>
    </form>
  );
}
