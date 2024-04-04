import Image from "next/image";

function HomeView() {
  return (
    <div className="relative">
      <div className="bottom-0 absolute w-screen h-[350px] bg-gradient-to-b from-transparent from-20% via-white via-70% to-white to-100%"></div>
      <div className='md:h-[730px] h-[100vh] lg:w-[94vw] w-screen mx-auto duration-500 sm:-mt-20 bg-cover bg-bottom bg-[url("/bg_beach.jpeg")]'>
        <div className="absolute transition-transform bg-white z-20 w-full h-full -top-full"></div>
      </div>
    </div>
  );
}
export default HomeView;
