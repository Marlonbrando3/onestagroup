import React, { useRef, useEffect } from "react";
import Link from "next/link";

export default function Blogbuttonoffers() {
  const showPropertiesOffers = useRef();

  useEffect(() => {
    setTimeout(() => {
      showPropertiesOffers.current.style.top = "60px";
    }, 5000);
  }, []);

  return (
    <div ref={showPropertiesOffers} className="fixed right-[10px] top-[10px] duration-200">
      <Link
        href="/nieruchomosci/hiszpania/wszystkie-regiony"
        className="text-white md:text-[20px] text-[12px] font-normal flex items-center py-[5px] rounded-b-2xl justify-center bg-red-500 md:w-[330px] md:px-0 px-[5px] shadow-xl mb-[200px] mx-auto z-[999] md:z-auto"
      >
        Oferty nieruchomości
      </Link>
    </div>
  );
}
