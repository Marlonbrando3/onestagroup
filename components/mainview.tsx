import React from "react";
import Image from "next/image";
import { QuicksandSans } from "../fonts/fonts";

export default function Mainview() {
  return (
    <div
      className={`${QuicksandSans.className} md:w-full w-[90vw] h-[400px] bg-[url('/main_bg.png')] bg-cover bg-center flex items-center justify-center`}
    >
      <span className="bg-orange-400 text-white md:w-[500px] w-[90vw] mx-auto md:text-[24px] text-[20px] text-center rounded-xl">
        <p className="md:text-[40px] text-[28px] font-bold">Pobyt inwestorski</p>najefektywniejsza
        forma zakupu nieruchomości w Hiszpanii
      </span>
    </div>
  );
}
