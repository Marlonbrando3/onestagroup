import React from "react";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import { IoIosArrowDropright } from "react-icons/io";

type data = {
  handleConsultationPopUp: any;
};

export default function ContactFormMiddleMail({
  handleConsultationPopUp,
}: data) {
  return (
    <div
      className={`${MontserratSans.className} bg-[#275278] w-screen md:h-[580px] flex items-center justify-center my-[150px] py-[20px] md:py-0`}
    >
      <div className="w-[550px] h-[90%] md:text-[40px] text-[36px] text-white md:leading-[45px] leading-[40px] md:pr-[110px] px-[30px]">
        Zapytaj nas jak możemy Ci pomóc na{" "}
        <span className="font-[700]">Twoim etapie poszukiwań.</span>
        <p className="text-[20px] leading-[23px] mt-[30px]">
          Bez względu na to czy dopiero zaczynasz poszukiwnia, masz określone
          prefernecje lub może dopiero starasz się zrozumieć jak funkcjonują
          rynki zagraniczne i zrozumieć ich atrakcyjność inwestycyjną -{" "}
          <span className="font-[800]">
            chętnie uzupełnimy Twoją widzę podczas 30 minutowej bezpłatnej
            konsultacji.
          </span>
        </p>
        <div
          onClick={handleConsultationPopUp}
          className="bg-white text-[#275278] md:text-[24px] text-[20px] px-[30px] py-[15px] font-[500] flex justify-center items-center rounded-[5px] cursor-pointer mt-[40px] leading-[23px] "
        >
          Zamów bezpłatną konsultację
          <IoIosArrowDropright className="w-[75px] h-[65px] mx-[10px] text-[#E9B75F]" />
        </div>
      </div>

      <div className="hidden md:block xl:w-[700px] lg:flex-1 xl:flex-none h-[90%] bg-[url('/freeconsultation.png')] bg-cover rounded-xl"></div>
    </div>
  );
}
