import React from "react";

type Phone = {
  phone: any;
};

export default function Phones({ phone }: Phone) {
  return (
    <div className="w-full h-full text-white font-bold flex justify-center items-center text-[13px] md:text-auto">
      <a href={`tel:${phone}`}>{phone}</a>
    </div>
  );
}
