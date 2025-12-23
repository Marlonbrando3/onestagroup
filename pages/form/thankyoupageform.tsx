import React from "react";
import { Dancing, TenorsSans, GreatVibes } from "../../fonts/fonts";

export default function Thankyoupageform() {
  return (
    <div className="h-screen md:w-full w-[90vw] mx-auto flex items-center justify-center">
      <div className="text-center text-[24px]">
        <p
          className={`${GreatVibes.className} md:text-[80px] text-[50px] mb-[20px] text-yellow-700 md:leading-[90px] leading-[60px]`}
        >
          Welcome in<br></br> Onesta Group!
        </p>
        <p className={`${TenorsSans.className}`}>
          Thank you for your trust! <br />
          We will contact you as soon as possible!
        </p>
      </div>
    </div>
  );
}
