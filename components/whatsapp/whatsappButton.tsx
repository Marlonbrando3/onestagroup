import React from "react";
import Link from "next/link";
import { RiWhatsappFill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

export default function WhatsAppButton() {
  const hideWA = () => {
    console.log("lalal");
  };

  return (
    <>
      <div className="relative">
        <Link
          href="https://wa.me/+48576652525"
          className="cursor-pointer fixed w-auto min-h-[50px] bottom-2 right-2 bg-white shadow-[0px_5px_20px_-5px_rgba(0,0,0,0.3)] z-30 flex rounded-[8px] px-[20px] py-[5px] items-center border border-orange-500 hover:bg-orange-400 duration-200 hover:text-white"
        >
          {" "}
          {/* <div
            onClick={hideWA}
            className="w-[30px] h-[30px] absolute -top-[30px] right-0 border bg-white"
          >
            <IoMdClose className="w-full h-full" />
          </div> */}
          <p className="mr-[9px] leading-6 hover:text-white duration-200">
            Porozmawiajmy na <br></br>
            <b className="text-[18px] leading-2">Whats App</b>
          </p>
          <RiWhatsappFill className="w-[40px] h-[40px] text-green-500" />
        </Link>
      </div>
    </>
  );
}
