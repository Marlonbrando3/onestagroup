import React from "react";
import Image from "next/image";
import { useState } from "react";

type Property = {
  mainImage: any;
  images: any;
  setImages: any;
};

export default function ImagesInPropetyCard({ images, setImages }: Property) {
  const [activeImgNumber, setActiveImgNumber] = useState(1);

  const handleActiveImage = (indexfromClick: any) => {
    setImages(
      images.map((img: any, index: any) => {
        if (img.showed === false && index + 1 === indexfromClick) {
          return {
            ...img,
            showed: true,
          };
        }
        if (img.showed === true && index + 1 === indexfromClick) {
          return {
            ...img,
            showed: true,
          };
        } else
          return {
            ...img,
            showed: false,
          };
      }),
    );
  };

  return (
    <div className="flex border w-full">
      {images?.map((prop: any, index: any) => (
        <div
          key={prop}
          className={
            prop.showed === true
              ? "h-full sm:w-32 w-[92.2vw] border-red-700 sm:border-2 relative"
              : "h-full sm:w-32 w-[92.2vw] border-red-700/[0] sm:border-2 relative"
          }
        >
          <Image
            className="cursor-pointer object-cover"
            src={prop.image}
            // width={1000}
            // height={500}
            fill
            onClick={() => handleActiveImage(index + 1)}
            // number={index + 1}
            alt="image"
          ></Image>
        </div>
      ))}
    </div>
  );
}
