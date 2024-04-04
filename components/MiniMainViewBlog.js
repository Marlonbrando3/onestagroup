import React from "react";

export default function MiniMainViewBlog() {
  return (
    <div className="w-full lg:h-96 h-36 flex">
      <div className="xl:w-5/12 w-full lg:pl-36 lg:px-20 px-5 flex flex-col justify-center">
        <p className="lg:text-6xl text-2xl py-1 font-bold">Witaj na Blogu.</p>
        <p className="lg:text-2xl text-base">
          {" "}
          Staramy się publikować obszerne wyjaśnienia i odpowiedzi na pytania, które chciałbyś zadać
          expertowi.{" "}
        </p>
      </div>
      <div className='relative w-7/12 bg-center bg-contain bg-no-repeat xl:block hidden bg-[url("../components/images/knowladge_max.png")]'>
        <div className="-rotate-45 bg-white lg:absolute hidden lg:block bottom-0 right-0 w-0 h-0 border-l-[90px] border-r-[90px] border-t-[90px] border-l-transparent border-r-transparent border-t-white -mx-12 -mb-4"></div>
      </div>
    </div>
  );
}
