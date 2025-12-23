import React from "react";

export default function MiniMainViewBlog() {
  return (
    <div className="w-full lg:h-96 h-36 flex bg-[url('/bg_blog_main.png')] bg-cover mb-[80px] -mt-[30px]">
      <div className="xl:w-8/12 w-full lg:pl-36 lg:px-20 px-5 flex flex-col justify-center">
        <div>
          <span className="lg:text-6xl text-2xl py-1 font-bold bg-orange-500 text-white px-[5px]">
            Witaj na Blogu.
          </span>{" "}
          <br></br> <br></br>
          <span className="lg:text-2xl text-base bg-white text-black">
            {" "}
            Publikujemy tutaj obszerne wyjaśnienia i odpowiedzi na pytania, które chciałbyś zadać
            expertowi.{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
