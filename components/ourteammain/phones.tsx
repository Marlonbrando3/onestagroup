import React from "react";
import Link from "next/link";

type Phone = {
  phone: any;
};

export default function Phones({ phone }: Phone) {
  return (
    <div className="w-full h-full text-white font-bold flex justify-center items-center text-[13px] md:text-auto">
      <Link href={`tel:${phone}`}>{phone}</Link>
    </div>
  );
}
