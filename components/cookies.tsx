import React, { useRef } from "react";
import { MdCookie } from "react-icons/md";

type AppProps = {
  cookiesWindow: any;
};

export default function Cookies({ cookiesWindow }: AppProps) {
  const setting = useRef<any>();

  const handleShowingSettings = () => {
    setting.current.style.display = "block";
  };

  const handleSavingUncommonSettings = () => {
    setting.current.style.display = "none";
  };

  const handleAcceptingCookies = async () => {
    setting.current.style.display = "none";
    cookiesWindow.current.style.display = "none";

    let res = await fetch("/api/setClientCookie", {
      // method: "POST",
      // headers: { "Content-Type": "application/json" },
    });

    console.log(await res.json());
  };

  return (
    <div
      ref={cookiesWindow}
      className="fixed w-screen h-full bg-gray-900/[0.8] z-50 overflow-y-hidden hidden"
    >
      <div className="lg:w-[800px] w-[90vw] rounded-xl shadow-3xl bg-white z-50 mx-auto mt-[30vh] flex flex-col justify-center items-start p-[40px]">
        <div className="h-[60px] text-[24px] leading-[24px] flex">
          <p className="mr-[10px] font-bold">Ciasteczka smakują wszystkim</p>
          <MdCookie className="text-yellow-500" />
        </div>
        <div className="font-semibold">
          Nasza strona gromadzi i korzysta z ciasteczek aby umożliwić Ci korzystanie z niektórych
          funkcji na stronie oraz pomóc nam w dopasowaniu ofert. Pliki gromadzimy w celach
          analitycznych oraz marketingowych. Mogą być gromadzone Twoje dane osobowe.
        </div>
        <div className="flex mt-[40px] justify-end w-full">
          <div
            onClick={handleShowingSettings}
            className="pr-[10px] text-[20px] py-[3px] rounded-md cursor-pointer"
          >
            Ustawienia
          </div>
          <div
            onClick={handleAcceptingCookies}
            className="bg-blue-500 px-[10px] py-[3px] text-[20px] text-white font-semibold rounded-sm cursor-pointer"
          >
            Akceptuję wszystkie
          </div>
        </div>
        <div ref={setting} className="border px-[8px] mt-[10px] rounded-md overflow-hidden hidden">
          <div className="flex leading-5 my-[15px] items-center">
            <input
              type="checkbox"
              className="w-[30px] h-[30px] mr-[10px] cursor-pointer"
              defaultChecked
              disabled
            ></input>
            <div>
              Podstawe pliki cookie, niezbędny do poprawnego działania strony, nie mogą zostać
              wyłączone, a użytkowanie serwisu w pełni nie jest bez nich możliwe.
            </div>
          </div>
          <div className="w-full bg-gray-900 h-[1px]"></div>
          <div className="flex leading-5 my-[15px]">
            <input type="checkbox" className="w-[30px] h-[30px] mr-[10px] cursor-pointer"></input>
            <div>
              Pliki cookies służace do analityki oraz marketingu. Używane są do profilowania
              zachowań oraz ruchu na stronie oraz dopasowywaniu ofert i komunikatów.
            </div>
          </div>
          <div
            onClick={handleSavingUncommonSettings}
            className="bg-blue-500 px-[10px] py-[3px] w-[200px] text-center text-[20px] text-white font-semibold rounded-sm cursor-pointer"
          >
            Zapisz ustawienia
          </div>
        </div>
      </div>
    </div>
  );
}
