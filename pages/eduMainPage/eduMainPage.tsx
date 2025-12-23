import React from "react";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import { TbReportMoney } from "react-icons/tb";
import { PiMoneyWavyLight } from "react-icons/pi";
import { PiOfficeChairLight } from "react-icons/pi";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { PiBook } from "react-icons/pi";

export default function EduMainPage() {
  return (
    <div
      className={`${Red_Hat_DisplayFont.className} lg:w-[1100px] max-w-[94%] flex w-[95vw] mx-auto justify-evenly h-auto my-[130px]`}
    >
      <div className="border w-1/2 h-[300px] relative hidden md:block">
        <span className="absolute z-10 bottom-[10px] left-[10px] lg:text-[36px] text-[30px] text-white leading-[46px] font-semibold">
          Skorzystaj z najszej<br></br> rynkowej{" "}
          <span className="bg-orange-500 text-white lg:text-[36px] text-[30px] px-[5px] leading-[36px] font-bold">
            wiedzy
          </span>
        </span>
        <Image
          src="/edu_main_photo.png"
          fill
          objectFit="cover"
          className="object-bottom"
          alt="properties"
        ></Image>
      </div>
      <div className="md:w-[600px] w-[94%] md:h-[300px] h-[350px] flex flex-col justify-between pl-[5px] lg:text-[20px] text-[16px]">
        <span className="z-10 bottom-[10px] left-[10px] lg:text-[36px] text-[25px] md:text-white text-black md:leading-[46px] font-semibold uppercase mb-[20px] md:hidden block">
          Skorzystaj z najszej<br></br> rynkowej{" "}
          <span className="bg-orange-500 text-white lg:text-[36px] md:text-[18px] text-[25px] px-[5px] leading-[36px] font-bold">
            wiedzy
          </span>
        </span>
        <Link
          href="/blog/nieruchomosci-w-hiszpanii-jak-wyglada-proces"
          className="border-[1.5px] border-gray-600 w-full md:h-[23%] h-[16%] font-semibold rounded-[3px] flex items-center cursor-pointer hover:border-gray-400 duration-100"
        >
          <PiMoneyWavyLight className="w-[80px] h-[50px] px-[20px]" />
          <p className="w-[90%]">Jak kupić nieruchomość w Hiszpanii - poradnik</p>
        </Link>
        <Link
          href="/blog/polskie-biuro-nieruchomosci-w-hiszpanii"
          className="border-[1.5px] border-gray-600  w-full md:h-[23%] h-[16%] font-semibold rounded-[3px] flex items-center cursor-pointer hover:border-gray-400 duration-100"
        >
          <PiOfficeChairLight className="w-[80px] h-[50px] px-[20px]" />
          <p className="w-[90%]">
            Polskie biuro nieruchomości w Hiszpanii <br></br>- czy warto korzystać?
          </p>
        </Link>
        <Link
          href="/blog/jak-kupic-nieruchomosc-w-portugalii"
          className="border-[1.5px] border-gray-600  w-full md:h-[23%] h-[16%]  font-semibold rounded-[3px] flex items-center cursor-pointer hover:border-gray-400 duration-100"
        >
          <HiOutlineDocumentChartBar className="w-[80px] h-[50px] px-[20px]" />
          <p className="w-[90%]">Jak kupić nieruchomość w Portugalii - pigułka</p>
        </Link>
        <Link
          href="/nieruchomosci-w-hiszpanii-poradnik-comp.pdf"
          className="border-[1.5px] border-orange-500  w-full md:h-[23%] h-[16%] font-semibold rounded-[3px] flex items-center cursor-pointer hover:bg-orange-400 duration-100 bg-orange-500"
        >
          <PiBook className="w-[80px] h-[50px] px-[20px] text-white" />
          <p className="w-[90%] text-white">
            Formalności zakupu nieruchomości w Hiszpanii - pobierz e-book
          </p>
        </Link>
      </div>
    </div>
  );
}
