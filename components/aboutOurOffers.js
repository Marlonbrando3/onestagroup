import Image from "next/image";
import { BonheurRoyaleFont, Red_Hat_DisplayFont } from "../fonts/fonts";

export default function AboutOurOffers() {
  return (
    <div className={`${Red_Hat_DisplayFont.className} w-screen h-auto py-[180px]`}>
      <div className="lg:w-[90vw] w-[90vw] mx-auto lg:h-[600px] flex justify-end relative">
        <div className="absolute lg:h-full h-[750px] w-[90%] bg-[url('/bg_second.png')] bg-cover rounded-[4px] bg-fixed left-0"></div>
        <div className=" w-[96%] h-[94%] top-0 bottom-0 left-0 right-0 m-auto border-[1.6px] border-orange-500 rounded-[4px] absolute "></div>
        <div className="ml-[20px] w-[800px] md:h-[600px] h-[850px] text-[18px] md:mt-[80px] mt-auto bg-white rounded-[4px] shadow-[0_0px_10px_0_rgba(0,0,0,0.3)] relative">
          <h1 className="w-[90%] text-left text-[34px] py-[10px] leading-[35px] mx-auto mb-[30px]">
            {/* <span className="font-bold">Onesta Group</span> */}
            <br></br>
            <p className={`${Red_Hat_DisplayFont.className} text-[30px] text-[#2C2B5D] font-bold`}>
              Najlepsze oferty na rynku
            </p>
          </h1>
          <p className="md:pl-[40px] mr-[50px] ml-[10px]">
            <b>Czy Twoim celem jest znalezienie wyjątkowego apartamentu lub domu?</b>  <br></br>
            <br></br>Zapewniamy Ci dostęp do wszytkich wyjątkowych ogłoszeń z ryku pierwotnego na wybrzeżach Hiszpanii, Cypru (południowego) oraz Dominikany. Wybraliśmy nieruchomości przygotowywane pod wynajem lub stworzone dla komfortowego życia.
            Sprawdź oferty:
          </p><div className="ml-[50px] mt-[10px]">
          <div className="flex"><button className="px-[4px] mx-[2px] bg-[#2C2B5D] text-white">Hiszpania</button>
          <button className="px-[4px] mx-[2px] bg-[#2C2B5D] text-white">Cypr</button>
          <button className="px-[4px] mx-[2px] bg-[#2C2B5D] text-white">Dominikana</button></div></div>
          <br></br>
        </div>
      </div>
    </div>
  );
}
