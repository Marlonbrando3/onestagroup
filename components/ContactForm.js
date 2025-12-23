import React from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";

export default function ContactForm({ propertyId, propertyRef }) {
  const router = useRouter();

  const submitButton = useRef();

  const [dataForm, setDataForm] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Message: "",
  });

  // setURLafterFormSending('http://localhost:3000'+router.asPath.toString())

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending");

    submitButton.current.innerHTML = "Wysyłam...";
    submitButton.current.style.backgroundColor = "green";

    await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Ref: propertyRef, dataForm }),
    })
      .then((res) => {
        console.log("Response received");
        if (res.status === 200) {
          console.log("Response succeeded!");
        } else {
          submitButton.current.innerHTML = "Coś poszło nie tak";
          submitButton.current.style.backgroundColor = "red";
          setTimeout(() => {
            submitButton.current.innerHTML = "Wyślij";
            submitButton.current.style.backgroundColor = "yellow";
          });
        }
      })
      .then(
        router.push({
          // pathname: "localhost:3000/thankyoupage",
          pathname: "https://onesta.com.pl/thankyoupage",
        })
      );
  };

  useEffect(() => {
    setDataForm({ ...dataForm, Ref: propertyRef });
  }, [router]);

  return (
    <div
      id="contact"
      className={`${MontserratSans.className} lg:flex w-full bg-[url('/palmyBGform.jpg')] bg-center bg-cover lg:px-10 rounded-md md:mt-1 lg:w-full lg:ml-[60px] mt-[40px]`}
    >
      <form
        className="flex flex-col lg:w-full lg:p-2 p-2"
        onSubmit={handleSubmit}
      >
        <div className="py-4 font-bold text-2xl text-white">
          Proszę o więcej informacji o tej ofercie:
        </div>
        <p className="py-2 font-bold text-white">
          Ogłoszenie o nr ref.{" "}
          <input
            className="bg-gray-900/[0.0]"
            type="text"
            value={propertyRef}
            name="id"
          ></input>
        </p>
        {/* <label id="name">Imię i naziwsko</label> */}
        <input
          className="cf-input-property-card pl-2 py-1"
          onChange={(e) => {
            setDataForm({ ...dataForm, Name: e.target.value });
          }}
          type="text"
          name="name"
          placeholder="Imię i nazwisko"
          required
        ></input>
        {/* <label id="phone">Numer telefonu</label> */}
        <input
          className="cf-input-property-card pl-2 py-1"
          onChange={(e) => {
            setDataForm({ ...dataForm, Phone: e.target.value });
          }}
          type="number"
          name="phone"
          placeholder="Numer telefonu"
        ></input>
        {/* <label id="mail">Adres e-mail</label> */}
        <input
          className="cf-input-property-card pl-2 py-1"
          onChange={(e) => {
            setDataForm({ ...dataForm, Email: e.target.value });
          }}
          type="email"
          name="mail"
          placeholder="Email"
          required
        ></input>
        {/* <label id="massage">Wiadomość</label> */}
        <textarea
          className="cf-input-property-card pl-2 pt-1 h-[140px]"
          onChange={(e) => {
            setDataForm({ ...dataForm, Message: e.target.value });
          }}
          type="text"
          name="massage"
          placeholder="Wiadomość"
        ></textarea>
        <div className="checkbox flex my-2">
          <input
            className="w-6 h-6 cursor-pointer"
            type="checkbox"
            name="mail"
            required
          ></input>
          <p className="block ml-2 text-white">
            Akceptuję regulamin i{" "}
            <Link className="underline-offset-1" href="#">
              politykę prywatności (wymagane)
            </Link>
          </p>
        </div>
        <button
          ref={submitButton}
          type="submit"
          className="bg-yellow-500 w-full rounded-md py-2 text-white"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
