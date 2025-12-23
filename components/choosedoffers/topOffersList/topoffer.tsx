import React from "react";
import Image from "next/image";
import Data from "../../../data/formData.json";
import Link from "next/link";
import { useRouter } from "next/router";
import Properties from "../../../public/properties.json";

type Data = {
  handlePopUpClosing: any;
};

export default function Topoffer({ handlePopUpClosing }: Data) {
  const router = useRouter();

  const propsData = Data.map((p) => {
    const match = Properties.map((i) => {
      if (i.listingId === p.ref) {
        return (
          <Link
            href={{ pathname: "/choosedoffers", query: { offer: p.ref, id: "Galeria" } }}
            key={p.ref}
            className="block shadow-[0_0px_7px_0_rgba(0,0,0,0.3)] rounded-xl sm:w-[400px] h-auto my-[5px] p-[8px] lg:w-[300px] mx-[5px]"
            onClick={handlePopUpClosing}
          >
            <div className="w-full relative h-[200px]">
              <Image
                src={`https://img.asariweb.pl/normal/${i.images[0].id}`}
                alt="lala"
                fill
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="px-[10px]">
              <p className="text-[20px] my-[10px] h-[65px]">{i.headerAdvertisement}</p>
              <p className="text-[26px] my-[10px] text-right font-bold">
                <p className="text-[12px] inline">od</p>{" "}
                <p className="inline text-slate-700">{i.price.amount.toLocaleString()} € </p>
                <p className="text-[10px]">{p.ref}</p>
              </p>
              <div className="mx-auto block w-9/11 py-[5px] bg-orange-400 text-center text-white text-[22px] my-[20px] rounded-md">
                Więcej informacji
              </div>
            </div>
          </Link>
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
