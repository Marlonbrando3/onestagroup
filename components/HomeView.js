import Image from "next/image";
import { IoIosArrowDropdownCircle } from "react-icons/io";

function HomeView() {
  return (
    <div className="relative lg:h-[600px] h-screen disable overflow-hidden">
      <div className="bottom-0 absolute w-screen h-[250px] bg-gradient-to-b from-transparent from-20% via-white via-70% to-white to-100% overflow-hidden"></div>
      <div className='md:h-[730px] h-[100vh] lg:w-full w-screen mx-auto duration-500 sm:-mt-10 bg-cover bg-top bg-[url("/bg_calp_c.jpg")] lg:hidden visibile'>
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div>
      <div className="w-[180vw] lg:w-screen lg:h-auto hidden">
        <video autoPlay loop width="100%" height="900" preload="metadata" className="-mt-[40px]">
          <source src="/dji_720.mp4" type="video/mp4" />
          {/* <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" /> */}
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="w-[70px] h-[70px] z-50 absolute bottom-32 left-0 right-0 mx-auto md:hidden visible">
        <IoIosArrowDropdownCircle className="text-orange-400 w-full h-full" />
      </div>
      <IoIosArrowDropdownCircle />
    </div>
  );
}
export default HomeView;
