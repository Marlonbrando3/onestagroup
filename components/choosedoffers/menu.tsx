import React from "react";
import MenuFormElements from "../../data/MenuFormElements.json";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const MenuElements = MenuFormElements.map((i) => {
    const handleChangingQuery = () => {
      router.push({
        pathname: router.pathname, // Zachowuje aktualną ścieżkę
        query: { ...router.query, id: i.title }, // Dodaje/zmienia parametr id
      });
    };

    return (
      <div
        onClick={handleChangingQuery}
        key={i.id}
        className={`${
          i.title === id
            ? "font-bold h-[40px] -mt-[10px] border rounded-md bg-white text-black"
            : `bg-${i.color}-600 text-white`
        }  border-l border-b w-[100px] rounded-l-[5px] rounded-b-[0px] place-content-center grid border-gray-700 -ml-[2px] cursor-pointer  hover:bg-white hover:text-black duration-200 top-[50px]`}
      >
        {i.title}
      </div>
    );
  });

  return (
    <div className="h-[30px] w-full flex justify-end absolute md:top-[50px] top-[80px]">
      {MenuElements}
    </div>
  );
}
