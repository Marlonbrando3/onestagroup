import React from "react";
import FormOsiedleLesne from "./formOsiedleLesne";
import { TenorsSans } from "../../fonts/fonts";

export default function ContactformOsiedleLesne() {
  return (
    <div id="c" className={`${TenorsSans.className} lg:w-[1020px] w-[90vw] mx-auto my-[60px]`}>
      <p className="lg:text-[32px] text-[28px] w-[90vw] lg:w-[900px] leading-[35px] text-[#723C19] mb-[30px] mx-auto">
        Jak możemy Ci pomóc?
      </p>
      <FormOsiedleLesne />
    </div>
  );
}
