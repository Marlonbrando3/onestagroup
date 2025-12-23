"use client";

import axios from "axios";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { env } from "process";

type Forms = {
  dataToShow: any;
  setDataToShow: any;
};

export default function FacebookGetForms({ dataToShow, setDataToShow }: Forms) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const formsData: any = useRef(null);
  const formsDataHide: any = useRef();

  const hideFormList = () => {
    if (
      formsData.current.style.marginLeft !== "-890px" ||
      formsData.current.style.marginLeft === null
    ) {
      formsData.current.style.marginLeft = "-890px";
      formsDataHide.current.innerHTML = "Rozwiń listę formularzy";
    } else {
      formsData.current.style.marginLeft = "0px";
      formsDataHide.current.innerHTML = "Zwiń listę formularzy";
    }
  };

  const handleGeneratingDivs = (data: any) => {
    let leadsToShow = (
      <div ref={formsData} className="relative w-[850px] duration-100">
        <div
          ref={formsDataHide}
          onClick={hideFormList}
          className="text-center absolute bg-green-600 -right-[170px] top-[190px] w-[300px] cursor-pointer rotate-90 text-[22px] text-white"
        >
          Zwiń listę formularzy
        </div>
        {data.map((i: any) => (
          <div key={i.id} className="flex border w-full justify-start">
            <div className="w-[250px]">
              Form ID: <p className="font-bold inline">{i.id}</p>
            </div>
            <div>
              Form name: <p className="font-bold inline">{i.name}</p>
            </div>
          </div>
        ))}
      </div>
    );
    setDataToShow(leadsToShow);
  };

  const fetchLeads = async () => {
    console.log("start");
    try {
      const response = await axios.get("/api/leadsForms/leadsForms"); // Wywołanie endpointu API w aplikacji
      console.log(await response.data);
      handleGeneratingDivs(response.data.data);
      setLeads(response.data.leads);
    } catch (error) {
      setError("Nie udało się pobrać danych.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div
        onClick={fetchLeads}
        className="mx-[10px] h-[50px] w-[200px]  bg-blue-900 text-white place-content-center grid cursor-pointer"
      >
        Ściągnij formularze
      </div>
    </div>
  );
}
