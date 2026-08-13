import { BsArrowRightSquareFill } from "react-icons/bs";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import ContactInSlider from "../SearchEngine/ContactInSlider";
import { propertyImageUrl } from "@/lib/propertyImages";

type props = {
  images: any[];
  propertyDetails: any;
  showSlider: any;
  setShowSlider: any;
  choosedImage: any;
  setChoosedImage: any;
};

export default function Slider({
  images,
  propertyDetails,
  showSlider,
  setShowSlider,
  choosedImage,
  setChoosedImage,
}: props) {
  const handleNextImage = (e: any) => {
    e.stopPropagation();
    if (choosedImage < images.length - 1) setChoosedImage(choosedImage + 1);
  };

  const handleBeforeImage = (e: any) => {
    e.stopPropagation();
    if (choosedImage > 0) setChoosedImage(choosedImage - 1);
  };

  const handleClosingSlider = () => {
    setShowSlider(false);
  };

  if (!showSlider || !images.length) return null;

  const activeImage = images[choosedImage] ?? images[0];

  return (
    <div
      className="inset-0 w-full h-screen z-[100] fixed flex flex-wrap justify-center items-center transition-opacity"
    >
      <div
        className="absolute z-0 h-full w-full"
      ></div>
      <div className="bg-[#00102E] w-[100%] h-[100%] flex flex-wrap justify-start relative shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div
          className="h-[50px] w-screen text-[16px] leading-[44px] pl-[20px] font-[300] flex items-center cursor-pointer text-white"
          onClick={handleClosingSlider}
        >
          <FaArrowLeft />
          <p className="inline pl-[10px]">powrót do galerii</p>
        </div>
        <IoIosClose
          className="absolute right-3 top-1 w-[40px] h-[40px] text-black cursor-pointer"
          onClick={handleClosingSlider}
        />

        {/* <div className="h-full w-[230px]">
          <div className="h-[80vh] w-full flex p-[5px] h-[80vh]">
            <div className="flex w-full flex-wrap px-[10px] flex-row overflow-y-auto h-full">
              {imagesData}
            </div>
          </div>
        </div> */}
        <div className="flex w-full w-justify-between md:items-center items-start px-[20px]">
          <div className="md:w-[75%] w-full md:h-[90vh] h-[400px] mx-auto relative overflow-hidden">
            {" "}
            <div className="my-auto">
              <BsArrowLeftSquareFill
                className="absolute z-[110] left-4 text-white/[0.8] text-black w-[50px] h-[50px] top-0 bottom-0 my-auto cursor-pointer md:block select-none shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                onClick={(e) => handleBeforeImage(e)}
              />
            </div>
            <img
              src={propertyImageUrl(activeImage)}
              className="absolute inset-0 h-full w-full object-contain p-2"
              alt={`Zdjęcie nieruchomości ${choosedImage + 1}`}
              draggable={false}
              decoding="async"
            />
            <div className="absolute w-[110px] h-[35px] bottom-4 right-0 left-0 mx-auto rounded-2xl bg-white flex items-center justify-center text-[22px] font-[500]">
              {choosedImage + 1} z {images.length}
            </div>
            <div className="my-auto">
              <BsArrowRightSquareFill
                className="absolute z-[110] right-4 text-white/[0.8] w-[50px] h-[50px] top-0 bottom-0 my-auto cursor-pointer md:block  select-none shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                onClick={(e) => handleNextImage(e)}
              />
            </div>
          </div>
          <div className="w-[300px] h-auto hidden md:block">
            <ContactInSlider propertyRef={propertyDetails.external_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
