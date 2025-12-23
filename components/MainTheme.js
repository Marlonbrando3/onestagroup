import { useState, useEffect } from "react";

export default function MainTheme({ searchShow }) {
  const [search, setSearch] = useState([
    "Hiszpanii",
    "Portugalii",
    "Chorwacji",
    "Polsce",
    "Tajlandii",
    "Grecji",
  ]);
  const [ActualCountry, setActualCountry] = useState(search[0]);
  const [visible, setVisible] = useState(true);
  let index = 0;

  useEffect(() => {
    setInterval(() => {
      if (index <= 6) {
        setVisible(true);
        setActualCountry(search[index]);
        index = index + 1;
      } else if (index > 6) {
        setVisible(true);
        setActualCountry(search[0]);
        index = 1;
      }
      setTimeout(() => {
        setVisible(false);
      }, 1600);
    }, 2000);
  }, [index]);

  return (
    <div className={searchShow ? "hidden transition duration-500" : "hidden lg:block border"}>
      <div className="md:block flex flex-col transition absolute text-white lg:top-64 md:top-24 md:ml-12 top-44 left-0 right-0 mx-auto h-66 lg:w-[1100px] lg:mx-auto w-full border lg:border-l-4 border-l-4 z-96 lg:pl-4 pl-1">
        <p className="lg:text-[60px] font-bold lg:leading-[50px] text-xl 2xl:text-[50px] border">
          Znajdź swój<br></br>
          <span className="text-[60px] lg:leading-[1px]">nowy dom</span>
          <br></br>
          <span className="text-[43.5px] lg:leading-[1px]">w słonecznym kraju</span>
          <br></br>
          <span className="text-[39.6px] lg:leading-[0px]">Mieszkaj, inwestuj, zarabiaj.</span>
        </p>
      </div>
    </div>
  );
}
