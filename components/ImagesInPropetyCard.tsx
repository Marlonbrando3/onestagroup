import React from "react";
import { useState } from "react";
import { propertyImageUrl } from "@/lib/propertyImages";

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
    <div className="flex w-full mt-[0px]">
      {images?.map((prop: any, index: any) => (
        <div
          key={prop}
          className={
            prop.showed === true
              ? "h-full w-[92.5vw] sm:w-32 lg:w-[160px] border-orange-500 sm:border-2 relative"
              : "h-full w-[92.5vw] sm:w-32 lg:w-[160px] border-orange-700/[0] sm:border-2 relative"
          }
        >
          <img
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            src={propertyImageUrl(prop.image)}
            onClick={() => handleActiveImage(index + 1)}
            alt="image"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );
}
