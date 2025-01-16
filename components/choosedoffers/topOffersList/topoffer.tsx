import React from "react";
import Image from "next/image";
import Data from "../../../data/formData.json";
import Link from "next/link";
import { useRouter } from "next/router";
import Properties from "../../../public/properties.json";

export default function Topoffer() {
  const router = useRouter();

  const propsData = Data.map((p) => {
    const match = Properties.map((i) => {
      if (i.listingId === p.ref) {
        // console.log(p.ref);
        return (
          <div className="shadow-xl sm:w-[400px] h-auto my-[5px] rounded-md p-[5px] lg:w-[300px]">
            <div className="w-full relative h-[200px]">
              <Image
                src={`https://img.asariweb.pl/normal/${i.images[0].id}`}
                alt="lala"
                fill
                objectFit="cover"
              />
              {i.price.amount}
            </div>
            <div className="px-[10px]">
              <p className="text-[22px] my-[10px]">{i.headerAdvertisement}</p>
              <p className="text-[26px] my-[10px] text-right font-bold">
                od {i.price.amount.toLocaleString()} €
              </p>
              <Link
                href={{ pathname: "/choosedoffers", query: { offer: p.ref, id: "Galeria" } }}
                className="mx-auto block w-[210px] py-[5px] bg-blue-600 text-center text-white text-[22px] my-[20px] rounded-md"
              >
                Więcej informacji
              </Link>
            </div>
          </div>
        );
      }
    });
    return match;
  });

  return (
    <div className="w-[90vw] h-auto mx-auto flex flex-col md:flex-row md:flex-wrap justify-center">
      {propsData}
    </div>
  );
}
