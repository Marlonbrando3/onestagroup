import React from "react";
import Link from "next/link";

type data = {
  icon: any;
  country: any;
  d: any;
  region: any;
  number: any;
  query: any;
  img: any;
};

export default function RegionsMainPageElement({
  img,
  number,
  query,
  country,
  d,
  region,
}: data) {
  return (
    <Link
      href={`/nieruchomosci/${country.toLowerCase()}?region=${query}`}
      className={`lg:w-[23%] w-[48%] lg:h-[70%] h-[49.5%] bg-[#275278] relative ovrflow-hidden border md:mt-[${parseInt(
        number
      )}px] rounded-md overflow-hidden group cursor-pointer`}
    >
      <div className="w-full h-[80px] mx-auto grid place-items-left text-black md:px-[30px] pl-[6px] absolute top-0 text-white font-[700] text-[35px] pt-[10px]">
        <p className="md:text-[26px] text-[24px]">{country}</p>
        <p className="-mt-[10px] leading-[34px] text-[20px]">{region}</p>
      </div>
      <div
        style={{ backgroundImage: `url(/${img})` }}
        className={`cursor-pointer font-[800] h-full w-full text-left text-[20px] px-[35px] text-[#275278] bg-[url('/${img}')] bg-center absolute top-[100px] -right-0 bg-cover rounded-tl-[200px]  group-hover:rounded-l-[300px] transition-all duration-[0.5s] group-hover:w-[90%] group-hover:top-[90px]`}
      ></div>
    </Link>
  );
}
