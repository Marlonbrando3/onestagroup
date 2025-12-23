import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Properties from "../../public/properties.json";

type Data = {
  handlePopUpOpen: any;
};

export default function Header({ handlePopUpOpen }: Data) {
  const router = useRouter();
  const { offer, menu } = router.query;

  const title = Properties.find((i) => i.listingId === offer);

  return (
    <div className="w-full bg-white overflow-hidden">
      <div className="h-[80px] lg:w-[1100px] mx-auto flex items-center">
        <div className="w-[260px] h-[70px] bg-white rounded-b-xl place-content-center">
          <div
            onClick={handlePopUpOpen}
            className="md:w-[90%] w-[79%] md:h-[50%] h-[60%] relative md:mx-auto cursor-pointer"
          >
            <Image src="/logotype_full.png" fill objectFit="contain" alt="logo" />
          </div>
        </div>{" "}
        {menu !== "false" && (
          <p className="md:text-[22px] md:ml-[60px] ml-[20px] font-bold">
            {title?.headerAdvertisement}
          </p>
        )}
      </div>
    </div>
  );
}
