import React from "react";
import MenuFormElements from "../../data/MenuFormElements.json";

export default function Menu() {
  const MenuElements = MenuFormElements.map((i) => {
    return (
      <div
        key={i.id}
        className={`bg-${i.color}-600 border-l border-b w-[100px] rounded-l-[5px] rounded-b-[0px] place-content-center grid border-gray-700 -ml-[2px] cursor-pointer text-white hover:bg-white hover:text-black duration-200 top-[50px]`}
      >
        {i.title}
      </div>
    );
  });

  return <div className="h-[30px] w-full flex justify-end absolute top-[50px]">{MenuElements}</div>;
}
