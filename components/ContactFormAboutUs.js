import React from "react";
import { useState, useRef } from "react";
import Link from "next/link";

export default function ContactFormAboutUs({ temat }) {
  const fastContact = useRef();

  const [dataForm, setDataForm] = useState({
    Id: temat,
    Name: "",
    Phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dataForm);
    console.log("Sending");

    fastContact.current.innerHTML = "Wysyłam";

    fetch("/api/fastcontact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    }).then((res) => {
      console.log(res.json());
      if (res.status === 200) {
        console.log("Response succeeded!");
        fastContact.current.innerHTML = "Wysłano!";
        fastContact.current.style.backgroundColor = "green";

        setDataForm({
          Name: e.target.value,
          Phone: e.target.value,
        });
      }
    });
  };

  return (
    <div className="w-screen py-[50px]">
      <div className="lg:flex w-10/12 md:h-[170px] lg:w-[800px] mx-auto bg-slate-900/[0.9] px-2 lg:px-10 rounded-md border">
        <form
          className="flex flex-col lg:w-full lg:p-0 px-[20px] md:px-[0px]"
          onSubmit={handleSubmit}
        >
          {" "}
          <div className="py-4 font-bold text-md text-white w-[800px] uppercase">
            Proszę o kontakt
          </div>
          <div className="flex justify-between flex-col md:flex-row pb-[10px]">
            <p className="py-2 font-bold text-white hidden">
              Ogłoszenie o nr ref.{" "}
              <input className="bg-gray-900/[0.0]" type="text" value={temat} name="id"></input>
            </p>
            {/* <label id="name">Imię i naziwsko</label> */}
            <div className="w-full md:w-[70%]">
              <div className="w-full flex flex-col md:flex-row justify-between">
                <input
                  className="cf-input-property-card pl-2 py-1 md:w-[49%] w-full"
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
                  className="cf-input-property-card pl-2 py-1 md:w-[49%] w-full"
                  onChange={(e) => {
                    setDataForm({ ...dataForm, Phone: e.target.value });
                  }}
                  type="number"
                  name="phone"
                  placeholder="Numer telefonu"
                ></input>
              </div>
              <div className="checkbox sm:flex my-2 flex">
                <input
                  className="w-[25px] h-[25px] cursor-pointer"
                  type="checkbox"
                  name="rodo"
                  required
                ></input>
                <p className="block ml-2 text-white">
                  Akceptuję regulamin i{" "}
                  <Link className="underline-offset-1" href="#">
                    politykę prywatności (wymagane)
                  </Link>
                </p>
              </div>
            </div>
            <div className="md:w-[30%] flex justify-end items-start h-[42px]">
              <button
                ref={fastContact}
                type="submit"
                className="bg-red-600 w-full h-full rounded-md py-2 md:py-[0px] text-white md:w-[150px]"
              >
                Wyślij
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
