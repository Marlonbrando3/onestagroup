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

type Page = {
  PageNumber: any;
  setPageNumber: any;
};

export default function Firstview({ PageNumber, setPageNumber }: Page) {
  const router = useRouter();

  //personal details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");

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

    // try {
    //   let res = await fetch("/api/sendFormPL1", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name,
    //       phone,
    //       email,
    //       msg,
    //     }),
    //   });

    //   const data = await res.status;
    //   console.log(data);
    //   if (data === 200) {
    //     // router.push("https://onesta.com.pl/form/thankyoupageform");
        setPageNumber(2);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <div className="md:w-[800px] md:h-auto w-full py-[20px] bg-white mx-auto flex flex-col items-center justify-center mt-[180px] md:mt-[110px] rounded-[30px] relative">
      <div className="h-[4px] w-[130px] absolute bg-gray-700 z-20 top-4 rounded-[10px] md:hidden"></div>
      <p className="text-[20px] md:text-[30px] md:w-[500px] w-[90%] text-center lg:leading-[35px] leading-[23px] mt-[20px] md:mt-auto">
        Wyświetl i pobierz <strong>szczegółowe informacje</strong> o wybranej inwestycji tj:
        {/* <span className="text-red-600 font-bold"> w Hiszpanii</span> */}
      </p>
      <div className="md:w-[90%] w-[90%] h-auto mt-[30px] flex flex-wrap justify-start items-center">
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <FaPhotoVideo className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px] md:leading-[30px]">
            Galeria zdjęć i wizualizacji
          </p>
        </div>{" "}
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <TbViewportWide className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px] md:leading-[30px]">
            Plany i/lub rzuty apartamentów
          </p>
        </div>{" "}
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <FaRegListAlt className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px md:leading-[30px]]">
            Aktualne ceny wraz z dostępnością
          </p>
        </div>{" "}
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <MdOutlineVideoLibrary className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px] md:leading-[30px]">
            Materiały video (jeśli dostępne)
          </p>
        </div>{" "}
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <MdOutlineLocationOn className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px]">
            Lokalizację całej inwestycji
          </p>
        </div>{" "}
        <div className="w-full md:w-[50%] flex items-center justify-evenly my-[20px]">
          <MdOutlineRecommend className="w-[50px] h-[50px] text-green-700" />
          <p className="text-[20px] md:text-[22px] w-[60%] text-left font-normal leading-[24px]">
            Inne podobne oferty
          </p>
        </div>{" "}
      </div>
      <div>
        <form
          onSubmit={handlingMassegeSend}
          className={`${TenorsSans.className} flex flex-col md:w-[550px] w-[90%] mt-[30px] mx-auto`}
        >
          <p className="text-[22px] text-center my-[20px]">
            Uzupełnij formularz aby otrzymać materiały.
          </p>
          <div className="flex flex-col h-[60px] justify-evenly ">
            <input
              id="fullname"
              className="border rounded-[8px] border-gray-400 text-[20px] pl-[5px] h-[40px]"
              placeholder="Imię i nazwisko"
              onChange={handlingDataChanges}
              required
            ></input>
          </div>
          <div className="flex flex-col h-[60px] justify-evenly">
            <input
              id="phone"
              className="border rounded-[8px] border-gray-400 text-[20px] pl-[5px] h-[40px]"
              placeholder="Twój numer telefonu"
              onChange={handlingDataChanges}
              required
            ></input>
          </div>
          <div className="flex flex-col h-[60px] justify-evenly ">
            <input
              id="mail"
              className="border rounded-[8px] border-gray-400 text-[20px] pl-[5px] h-[40px]"
              placeholder="E-mail"
              onChange={handlingDataChanges}
              required
            ></input>
          </div>
          <div className="flex flex-col h-[180px] justify-evenly ">
            <textarea
              id="msg"
              className="border rounded-[8px] border-gray-400 text-[20px] pl-[5px] h-[160px]"
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
            className="border border-white w-[200px] mx-auto bg-yellow-500 text-white text-[26px] rounded-xl mt-[5px] cursor-pointer py-[5px] hover:bg-white hover:text-black duration-150 hover:border hover:border-black"
          >
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
}
