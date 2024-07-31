import Image from "next/image";
import { IoIosArrowDropdownCircle } from "react-icons/io";

function HomeView() {
  return (
    <div className="relative lg:h-[600px] md:w-[1500px] h-screen disable overflow-hidden mx-auto">
      <div className="bottom-0 absolute w-screen h-[250px] bg-gradient-to-b from-transparent from-20% via-white via-70% to-white to-100% overflow-hidden"></div>
      <div className='md:h-full h-[100vh] lg:w-full w-screen mx-auto duration-500 sm:-mt-10 bg-cover bg-top bg-[url("/bg_calp_c.jpg")] md:hidden visibile'>
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div>
      <div className="w-[180vw] md:w-screen md:h-screen bg-transparent z-20 absolute"></div>
      <iframe
        width="100%"
        height="845"
        src="https://www.youtube.com/embed/YdGdmLXjaK4?si=k2HZL3B6xM_j9fVq&autoplay=1&mute=1&showinfo=0&controls=0&vq=hd1080&loop=1&playlist=YdGdmLXjaK4"
        title="YouTube video player"
        frameborder="0"
        autoplay
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
        className="-mt-[20px] hidden md:block"
      ></iframe>
      {/* </div> */}
      {/* <div className="w-[70px] h-[70px] z-50 absolute bottom-32 left-0 right-0 mx-auto md:hidden visible">
        <IoIosArrowDropdownCircle className="text-orange-400 w-full h-full" />
      </div> */}
      <IoIosArrowDropdownCircle />
    </div>
  );
}
export default HomeView;
