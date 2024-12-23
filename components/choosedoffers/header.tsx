import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="w-full bg-white">
      <div className="h-[80px] w-[1100px] mx-auto ">
        <div className="w-[260px] h-[60px] bg-white rounded-b-xl place-content-center ">
          <div className="w-[90%] h-[80%] relative mx-auto">
            <Image src="/logotype_full.png" fill objectFit="contain" alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
