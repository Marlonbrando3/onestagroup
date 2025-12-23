import React from "react";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { FaPhotoVideo } from "react-icons/fa";
import { TbViewportWide } from "react-icons/tb";
import { FaRegListAlt } from "react-icons/fa";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { Dancing, TenorsSans, GreatVibes } from "../../fonts/fonts";
import { MdOutlineRecommend } from "react-icons/md";
import Link from "next/link";

type Page = {
  PageNumber: any;
  setPageNumber: any;
  name: any;
  setName: any;
  phone: any;
  setPhone: any;
  msg: any;
  setMsg: any;
  email: any;
  setEmail: any;
};

export default function Firstview({
  PageNumber,
  setPageNumber,
  name,
  setName,
  phone,
  setPhone,
  msg,
  setMsg,
  email,
  setEmail,
}: Page) {
  const router = useRouter();
  const { offer, id } = router.query;

  //personal details

  const emptyFieldPopUp: any = useRef();

  const handlingDataChanges = (e: any) => {
    e.target.style.color = "black";
    const name = e.target.id;

    if (name === "fullname") {
      setName(e.target.value);
    }
    if (name === "phone") {
      setPhone(e.target.value);
    }
    if (name === "mail") {
      setEmail(e.target.value);
    }
    if (name === "country") {
      setMsg(e.target.value);
    }
  };

  const handlingMassegeSend = async (e: any) => {
    e.preventDefault();

    try {
      let res = await fetch("/api/sendFormPL1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer,
          name,
          phone,
          email,
          msg,
        }),
      });

      const data = await res.status;
      console.log(data);
      if (data === 200) {
        router.push({
          pathname: router.pathname,
          query: { offer: offer, id: id, site: "thankyoupage" },
        });
        setPageNumber(2);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="md:w-[800px] md:h-auto w-full py-[20px] bg-white mx-auto flex flex-col items-center justify-center mt-[110px] md:mt-[110px] rounded-[30px]">
      <Link href="#form" className="w-full flex flex-col items-center justify-center relative ">
        <div className="h-[4px] w-[130px] absolute bg-gray-700 z-20 top-4 rounded-[10px] md:hidden"></div>
        <p className="text-[20px] md:text-[30px] md:w-[500px] w-[90%] text-center lg:leading-[35px] leading-[23px] mt-[20px] md:mt-auto">
          Wyświetl i <p className="text-orange-500 font-bold inline">wyślij natychmiast </p>
          <strong>szczegółowe informacje</strong> o wybranej inwestycji tj:
          {/* <span className="text-red-600 font-bold"> w Hiszpanii</span> */}
        </p>
        <div className="md:w-[80%] w-[90%] h-auto mt-[30px] flex flex-wrap justify-center items-center">
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <FaPhotoVideo className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Galeria zdjęć i wizualizacji
            </p>
          </div>{" "}
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <TbViewportWide className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Plany i/lub rzuty apartamentów
            </p>
          </div>{" "}
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <FaRegListAlt className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Aktualne ceny i dostepność
            </p>
          </div>{" "}
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <MdOutlineVideoLibrary className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Materiały video (jeśli dostępne)
            </p>
          </div>{" "}
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <MdOutlineLocationOn className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Lokalizację całej inwestycji
            </p>
          </div>{" "}
          <div className="text-[20px] md:text-[22px] md:w-[50%] w-[45%] md:text-left font-normal leading-[24px] md:leading-[30px] text-center md:flex mb-[20px]">
            <MdOutlineRecommend className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] text-green-700 mx-auto" />
            <p className="text-[20px] md:text-[22px] md:w-[60%] w-full md:text-left font-normal leading-[24px] md:leading-[30px] text-center">
              Inne podobne oferty
            </p>
          </div>
          {/* <Link href="#form" scroll={false} className="mx-auto">
            <div className="bg-green-600 text-white text-[26px] mx-auto my-[40px] px-[10px] rounded-md">
              Więcej informacji
            </div>
          </Link> */}
        </div>
      </Link>
      <form
        id="form"
        onSubmit={handlingMassegeSend}
        className={`flex flex-col md:w-[550px] w-[90%] mt-[30px] mx-auto`}
      >
        <p className="text-[24px] text-center my-[20px] font-normal">
          Uzupełnij{" "}
          <span className="inline bg-orange-400 text-white px-[4px] font-semibold">
            poniższy formularz
          </span>{" "}
          aby otrzymać materiały.
        </p>
        <div className="flex flex-col h-[60px] justify-evenly ">
          <input
            id="fullname"
            className="border rounded-[5px] border-gray-600 text-[20px] pl-[8px] h-[50px]"
            placeholder="Imię i nazwisko"
            onChange={handlingDataChanges}
            required
          ></input>
        </div>
        <div className="flex flex-col h-[60px] justify-evenly">
          <input
            id="phone"
            className="border rounded-[5px] border-gray-600 text-[20px] pl-[8px] h-[50px]"
            placeholder="Twój numer telefonu"
            onChange={handlingDataChanges}
            required
          ></input>
        </div>
        <div className="flex flex-col h-[60px] justify-evenly ">
          <input
            id="mail"
            className="border rounded-[5px] border-gray-600 text-[20px] pl-[8px] h-[50px]"
            placeholder="E-mail"
            onChange={handlingDataChanges}
            required
          ></input>
        </div>
        <div className="flex flex-col h-[180px] justify-evenly ">
          <textarea
            id="msg"
            className="border rounded-[5px] border-gray-600 text-[20px] pl-[8px] pt-[5px] h-[170px]"
            placeholder="Twoja wiadomość"
            onChange={handlingDataChanges}
          ></textarea>
        </div>
        <div className="flex h-[60px] md:h-auto mb-[30px] items-start justify-start ">
          {" "}
          <input
            type="checkbox"
            required
            className="md:w-[30px] md:h-[30px] h-[30px] w-[73px] md:-mt-[2px] -mt-[2px] cursor-pointer"
          ></input>
          <p className="font-semibold pl-[4px] text-[11px]">
            Akceptuję politykę prywatności Onesta Group Sp. z o.o. oraz wyrażam zgodę na kontakt,
            przesłanie oraz przedstawienie ofert zgodnych z treścią mojego zapytania.
          </p>
        </div>
        <button
          type="submit"
          className="uppercase border border-white w-[200px] mx-auto bg-yellow-500 text-white text-[22px] rounded-xl mt-[5px] cursor-pointer py-[5px] hover:bg-white hover:text-black duration-150 hover:border hover:border-black"
        >
          Wyślij
        </button>
      </form>
    </div>
  );
}
