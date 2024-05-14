import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

type Images = {
  images: any;
  market: any;
  deliveryDate: any;
  propertyId: any;
  propertyTitle: any;
};

export default function ResultsSlider({
  propertyId,
  propertyTitle,
  images,
  market,
  deliveryDate,
}: Images) {
  const [start, setStart] = useState<any>();
  const [end, setEnd] = useState<any>();

  const router = useRouter();

  const image: any = useRef();
  const imagesContainer: any = useRef();

  const imgData = images.map((i: any, key: any) => {
    if (key < 4) {
      return (
        <Link
          href={{
            pathname: "/[country]/oferta",
            query: {
              country: router.query.country,
              id: propertyId,
              t: propertyTitle,
            },
          }}
          ref={image}
          key={key}
          className="md:h-[220px] h-[220px] sm:h-[300px] md:w-[370px] w-[92vw] relative object-cover text-sm"
        >
          <Image
            key={i}
            className="object-cover"
            src={`https://img.asariweb.pl/normal/${i.id}`}
            alt={i}
            fill
            priority
          />
        </Link>
      );
    }
    if (key === 4) {
      return (
        <Link
          key={i}
          href={{
            pathname: "/[country]/oferta",
            query: {
              country: router.query.country,
              id: propertyId,
              t: propertyTitle,
            },
          }}
        >
          <div
            ref={image}
            key={key}
            className="md:h-[220px] sm:h-[300px] h-[220px]  md:w-[370px] w-[92vw] flex items-center justify-center relative object-cover bg-red-500/[0.7] text-3xl text-white font-[700] cursor-pointer"
          >
            <p>Więcej zdjęć</p>
          </div>
        </Link>
      );
    }
  });

  const img = imgData.filter((i: any) => i !== undefined);

  const [margin, setMargin] = useState<any>(0);
  const [imgCounter, setImgCounter] = useState(0);

  const handleChangeSiteRight = () => {
    const ImagesLength: any = img.length - 1;
    const divPX = image.current.clientWidth;
    const newMargin = margin + divPX;

    if (imgCounter === 0) {
      console.log("opcja 1");
      setImgCounter(ImagesLength);
      console.log(newMargin);
      imagesContainer.current.style.marginLeft = `${-(ImagesLength * divPX)}px`;
      setMargin(-(ImagesLength * divPX));
    } else {
      console.log("opcja 2");
      console.log(newMargin);
      setImgCounter(imgCounter - 1);
      imagesContainer.current.style.marginLeft = `${newMargin}px`;
      setMargin(margin + divPX);
    }
  };

  const handleChangeSiteLeft = () => {
    console.log("clicked right");
    const ImagesLength = img.length;
    const divPX = image.current.clientWidth;
    const newMargin = margin - divPX;

    if (imgCounter < ImagesLength - 1) {
      setImgCounter(imgCounter + 1);
      console.log(margin);
      imagesContainer.current.style.marginLeft = `${newMargin}px`;
      setMargin(margin - divPX);
    } else {
      setImgCounter(0);
      imagesContainer.current.style.marginLeft = `0px`;
      setMargin(0);
    }
  };

  const Touchstart = (e: any) => {
    setStart(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientX);
  };

  const Touchend = (e: any) => {
    setEnd(e.changedTouches[0].clientX);
    console.log(e.changedTouches[0].clientX);
  };

  useEffect(() => {
    if (start - end > 50) {
      handleChangeSiteLeft();
    }
    if (start - end < -50) {
      handleChangeSiteRight();
    }
  }, [end]);

  return (
    <div className="h-full w-full relative bg-white">
      <div className="absolute text-[14px] z-20 bg-yellow-500 text-white top-2 px-[6px] font-bold rounded-r-xl h-[24px] leading-[24px] shadow-sm">
        {market}
      </div>
      <div className="bg-orange absolute z-20 text-[14px] bg-yellow-500 text-white bottom-0 px-[6px] font-bold rounded-r-xl h-[24px] leading-[24px] ">
        Data oddania {deliveryDate?.toString().slice(0, 7)}
      </div>
      <div
        onClick={handleChangeSiteLeft}
        className="flex items-center z-10 justify-center absolute w-10 h-full left-0 cursor-pointer bg-gray-900/[0.13] hover:bg-sky-900/[0.4] transition duration-450 hover:ease-in-out"
      >
        <FaChevronLeft className="w-[30px] h-[30px] text-white" />
      </div>
      <div
        onClick={handleChangeSiteRight}
        className={
          margin.length !== 0
            ? "flex items-center z-10 justify-center absolute w-10 h-full right-0 cursor-pointer group bg-gray-900/[0.13] hover:bg-sky-900/[0.4] transition duration-450 hover:ease-in-out"
            : "hidden"
        }
      >
        <FaChevronRight className="w-[30px] h-[30px] text-white" />
      </div>
      <div
        ref={imagesContainer}
        onTouchStart={Touchstart}
        onTouchEnd={Touchend}
        className="flex absolute duration-300"
      >
        {img}
      </div>
    </div>
  );
}
