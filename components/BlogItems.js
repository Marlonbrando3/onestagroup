import React from "react";
import Link from "next/link";
import Blog from "../data/Blog.json";
import Image from "next/image";
import BlogTopics from "../data/BlogTopics.json";

export default function BlogItems() {
  return (
    <div className="flex justify-evenly flex-wrap lg:w-10/12 w-full mx-auto">
      <div className="lg:w-9/12 w-11/12 flex flex-wrap">
        {Blog.map((obj) => (
        <div key={obj} className="lg:w-1/2 w-full py-2">
            <div className="w-11/12 mx-auto rounded-[15px] shadow-xl">
              {" "}
              <div className="relative ">
                <div className="text-xl absolute top-[10px] left-[10px] text-orange-600 ">
                  <span className="bg-white text-[22px] font-semibold">{obj.title}</span>
                </div>
                <Image
                  className="h-52 object-cover rounded-t-[15px]"
                  src={obj.link}
                  width={900}
                  height={500}
                />
              </div>
              <div className="p-2">
                <div className="line-clamp-3">{obj.description}...</div>
                <button
                  className={
                    obj.status !== "wating"
                      ? "border-gray-500 mt-12 px-3 py-1 rounded-lg cursor-pointer shadow-md hover:bg-red-600 duration-100 hover:text-white bg-orange-500 text-white"
                      : "hidden"
                  }
                >
                  <Link href={{ pathname: `/blog/${obj.tag}` }}>Przeczytaj artykuł</Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-3/12 h-full hidden lg:block">
        <div>
          <div className="font-bold py-3 text-lg">Tematyka:</div>
          {BlogTopics.map((i) => (
            <div
              key={i.temat}
              className="p-1 border-b border-gray-600 cursor-pointer hover:bg-red-400 hover:text-white duration-300"
            >
              {i.temat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
