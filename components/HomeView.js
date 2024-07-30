import Image from "next/image";

function HomeView() {
  return (
    <div className="relative h-[600px] disable overflow-hidden">
      <div className="bottom-0 absolute w-screen h-[250px] bg-gradient-to-b from-transparent from-20% via-white via-70% to-white to-100% overflow-hidden"></div>
      {/* <div className='md:h-[730px] h-[100vh] lg:w-full w-screen mx-auto duration-500 sm:-mt-10 bg-cover bg-bottom bg-[url("/bg_calp_c.jpg")]'>
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div> */}
      <video autoPlay loop width="100%" height="600" preload="metadata" className="-mt-[40px]">
        <source src="/dji_720.mp4" type="video/mp4" />
        {/* <track src="/path/to/captions.vtt" kind="subtitles" srcLang="en" label="English" /> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
export default HomeView;
