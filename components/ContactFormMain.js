import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";

export default function ContactFormMain() {
  const router = useRouter();

  const submitButton = useRef();

  const [URLafterFromSending, setURLafterFormSending] = useState();

  const [dataForm, setDataForm] = useState({
    Name: "",
    Phone: "",
    Email: "",
    Message: "",
  });

  const confirmation = useRef();

  console.log(dataForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setURLafterFormSending("https://onesta.com.pl" + router.asPath);

    console.log("Sending");
    submitButton.current.innerHTML = "Wysyłam...";
    submitButton.current.style.backgroundColor = "green";

    await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Ref: "Strona główna", dataForm }),
    })
      .then((res) => {
        console.log("Response received");
        if (res.status === 200) {
          console.log("Response succeeded!");
        } else {
          console.log("Response failed!");
        }
      })
      .then(
        router.push({
          pathname: "https://onesta.com.pl/thankyoupage",
        }),
      );
  };

  return (
    <div
      id="contact"
      className='relative flex flex-col w-full h-1/2 bg-center bg-cover bg-[url("/palmyBGform.jpeg")] rounded-xl'
    >
      <div className="absolute w-full h-full bg-gray-900/[0]"></div>
      <div className="h-11/12 lg:w-[1200px] w-full flex flex-col-reverse lg:flex-row lg:flex py-10 lg:mx-auto">
        <div className="flex lg:flex-col items-center z-10 lg:w-8/12 w-full justify-center lg:pt-0 pt-24 visible lg:hidden">
          <div className="text-xs sm:text-lg flex flex-col justify-center items-start lg:items-center h-1/2 w-5/12 text-white">
            <p className="font-bold">Siedziba firmy:</p>
            <p>Onesta Group sp. z o.o.</p>
            <p>53-148 Wrocław</p>
            <p>ul. Wolbromska 18/1b</p>
            <p>NIP: 899 292 23 78</p>
          </div>
          <div className="text-xs sm:text-lg flex flex-col md:justify-center items-start lg:items-center h-1/2 w-5/12 text-white">
            <p className="font-bold">Biuro dla klientów:</p>
            <p>45-706 Opole</p>
            <p>pl. Piłsudskiego 14/3</p>
            <div className="w-32 h-4"></div>
            <p>mail: biuro@onesta.com.pl</p>
            <p>tel.: + 48 576 65 25 25</p>
          </div>
        </div>
        <div className="w-full lg:w-7/12">
          <form
            className="relative z-10 lg:flex w-full flex flex-col mx-auto rounded-xl px-[20px]"
            onSubmit={handleSubmit}
            method="post"
          >
            <div className="py-4 font-normal text-xl text-white">
              Nie znalazłeś nic dla siebie?<br></br>
              <span className="font-bold text-2xl">Napisz do nas</span> o niepublikowane oferty lub
              każdą inną sprawę:
            </div>
            <input
              className="h-10 my-2 rounded-xl pl-2 placeholder:pl-3 shadow-md"
              onChange={(e) => {
                setDataForm({ ...dataForm, Name: e.target.value });
              }}
              type="text"
              name="name"
              placeholder="Imię i nazwisko"
              required
            ></input>
            <input
              className="h-12 my-2 rounded-xl pl-2 placeholder:pl-3 shadow-md"
              onChange={(e) => {
                setDataForm({ ...dataForm, Phone: e.target.value });
              }}
              type="number"
              name="phone"
              placeholder="Numer telefonu"
              required
            ></input>
            <input
              className="h-12 my-2 rounded-xl pl-2 placeholder:pl-3 shadow-md"
              onChange={(e) => {
                setDataForm({ ...dataForm, Email: e.target.value });
              }}
              type="text"
              name="mail"
              placeholder="Adres email"
              required
            ></input>
            <textarea
              className="h-40 my-2 rounded-xl pl-2 placeholder:p-3 shadow-md"
              onChange={(e) => {
                setDataForm({ ...dataForm, Message: e.target.value });
              }}
              type="text"
              name="massage"
              placeholder="Opisz nam czego szukasz i jak mozemy pomóc"
            ></textarea>
            <div className="flex items-center h-10 w-full">
              <input
                className="w-6 h-6 cursor-pointer"
                type="checkbox"
                name="mail"
                required
              ></input>
              <p className="text-md text-white block ml-2">
                Akceptuję regulamin i{" "}
                <a className="underline-offset-1" href="#">
                  politykę prywatności (wymagane)
                </a>
              </p>
            </div>
            <button
              ref={submitButton}
              type="submit"
              className="bg-white w-56 py-2 mx-auto rounded-md text-gray-900 text-xl duration-300 border-2 border-white font-normal hover:bg-red-700 hover:text-white hover:border-2"
            >
              Wyślij
            </button>
          </form>
        </div>
        <div className="lg:flex lg:flex-col items-start z-10 lg:w-6/12 w-full justify-center lg:pt-0 pt-24 hidden">
          <div className="text-xs lg:text-lg flex flex-col justify-center items-start h-1/2 text-white px-[5px]">
            <p className="font-bold">Siedziba firmy:</p>
            <p>Onesta Group sp. z o.o.</p>
            <p>53-148 Wrocław</p>
            <p>ul. Wolbromska 18/1b</p>
            <p>NIP: 899 292 23 78</p>
          </div>
          <div className="text-xs lg:text-lg flex flex-col justify-center items-start h-1/2 text-white px-[5px]">
            <p className="font-bold">Biuro dla klientów:</p>
            <p>45-706 Opole</p>
            <p>pl. Piłsudskiego 14/3</p>
            <div className="w-32 h-4"></div>
            <p>mail: biuro@onesta.com.pl</p>
            <p>tel.: + 48 576 75 25 25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
