import React from "react";
import MenuFormElements from "../../data/MenuFormElements.json";
import { useRouter } from "next/router";

export default function Menu() {
  const router = useRouter();
  const { id, menu } = router.query;

  const MenuElements = MenuFormElements.map((i) => {
    const handleChangingQuery = () => {
      router.push({
        pathname: router.pathname, // Zachowuje aktualną ścieżkę
        query: { ...router.query, id: i.title }, // Dodaje/zmienia parametr id
      });
    };

    return (
      <>
        {menu !== "false" && (
          <div
            onClick={handleChangingQuery}
            key={i.id}
            className={`${
              i.title === id
                ? "font-bold h-[40px] border rounded-md bg-white text-black rounded-b-md"
                : `bg-${i.color}-600 text-white rounded-l-[5px] rounded-b-[0px]`
            }  border-l border-b md:w-[100px] w-1/4  place-content-center grid border-gray-700 md:-ml-[2px] cursor-pointer hover:bg-white hover:text-black duration-200 top-[50px]`}
          >
            {i.title}
          </div>
        )}
      </>
    );
  });

  return (
    <div className="h-[30px] w-full flex justify-end absolute md:top-[50px] top-[80px]">
      {MenuElements}
    </div>
  );
}
