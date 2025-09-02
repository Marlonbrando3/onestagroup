import React from "react";
import Image from "next/image";
import LogoType from "./images/logotype.png";
import MenuFooter from "./menuFooterElement/menuFooter";
import MenuData from "../data/menu.json";
import Link from "next/link";
import { Red_Hat_DisplayFont } from "../fonts/fonts";
import { FaRegCopyright } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { CiMapPin } from "react-icons/ci";

const MenuFotterData = MenuData.menu.map((i, index) => (
  <Link
    key={i}
    href={`${MenuData.links[index]}`}
    className="place-content-center w-[190px] cursor-pointer"
  >
    {i}
  </Link>
));

export default function Footer() {
  return (
    <>
      <div
        className={`${Red_Hat_DisplayFont.className} w-screen lg:py-2 lg:text-sm text-xs flex z-20 items-center bg-[#fcf7f4] mt-10 justify-between text-white md:h-[400px] h-auto py-[20px] bg-[url('/bg-footer.jpg')] bg-cover bg-center relative`}
      >
        <div className="absolute w-full h-full bg-[#EEEAE7]/[0.8] bg-gradient-to-r from-white from-0% to-#EEEAE7"></div>
        <div className="lg:w-[1150px] w-full mx-auto flex z-10 lg:flex-row flex-col">
          <div className="border-black w-[300px] h-[200px]">
            <Image
              src={LogoType}
              objectFit="contian"
              className="w-[200px] h-[100px]"
              alt="logo_onesta"
              layout="intrinsic"
            />
            <p className="uppercase text-black mt-[30px] tracking-[1px]">
              Obserwuj nas na social media
            </p>
            <div className="flex w-[63px] justify-between mt-[10px]">
              <Link href="https://www.facebook.com/profile.php?id=100071864003899">
                <FaFacebookSquare className="text-blue-600 w-[30px] h-[30px]" />
              </Link>
              {/* <FaSquareInstagram className="text-[#FF1057] w-[30px] h-[30px]" /> */}
            </div>
          </div>
          <div className="w-full md:w-[700px] md:flex md:flex-row text-black flex-col">
            <div className="border-black h-[200px] md:w-[500px] w-full p-[10px]">
              <p className="text-[24px] uppercase font-semibold">Menu</p>
              <div className="uppercase h-[100px] lg:w-[400px] flex flex-wrap mt-[40px]">
                {MenuFotterData}
              </div>
            </div>
            <div className=" border-black w-full h-[200px] p-[10px] md:w-[500px]">
              <p className="text-[24px] uppercase font-semibold">Kontakt</p>
              <div className="lowercase h-[100px] md:w-[400px] w-full flex flex-col flex-wrap mt-[40px] justify-between">
                <div className="flex items-center">
                  <CiPhone className="text-black w-[25px] h-[25px]" />
                  <Link href="tel:+48576652525" className="pl-[4px]">
                    +48 576 65 25 25
                  </Link>
                </div>
                <div className="flex items-center">
                  <CiMail className="text-black w-[25px] h-[25px]" />
                  <Link href="mailto:biuro@onesta.com.pl" className="pl-[4px]">
                    biuro@onesta.com.pl
                  </Link>
                </div>
                <div className="flex items-center normal-case">
                  <CiMapPin className="text-black w-[25px] h-[25px]" />
                  <p className="pl-[4px]">53-148 Wrocław, ul. Wolbromska 18/1b</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-500 w-full h-[40px] text-white text-[10px]">
        <div className="lg:w-[1150px] w-full h-full mx-auto flex items-center">
          <FaRegCopyright />
          <p className="pl-[5px]">ONESTA GROUP SP. Z O. O. WSZYSTKIE PRAWA ZASTRZEŻONE</p>
        </div>
      </div>
    </>
  );
}
