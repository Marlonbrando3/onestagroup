import React from "react";
import { useRouter } from "next/router";
import { Dancing, TenorsSans, GreatVibes } from "../../../fonts/fonts";

type Page = {
  PageNumber: any;
  ArrowTime: any;
  ArrowTypes: any;
  ArrowRegions: any;
  ArrowBudget: any;
  name: any;
  phone: any;
  msg: any;
  email: any;
};

export default function Thankyoupageafter({
  PageNumber,
  ArrowTime,
  ArrowTypes,
  ArrowRegions,
  ArrowBudget,
  name,
  phone,
  msg,
  email,
}: Page) {
  const router = useRouter();
  const { offer } = router.query;

  const handlingMassegeSend = async (e: any) => {
    e.preventDefault();

    try {
      let res = await fetch("/api/sendFormSurveyCompleted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer,
          name,
          phone,
          email,
          msg,
          region: ArrowRegions,
          type: ArrowTypes,
          price: ArrowBudget,
          time: ArrowTime,
        }),
      });

      const data = await res.status;
      console.log(data);
      if (data === 200) {
        handlepPassingToOffer();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlepPassingToOffer = () => {
    setTimeout(() => {
      router.push({
        pathname: "/choosedoffers",
        query: { offer: offer, id: "Galeria" },
      });
    }, 2000);
  };

  return (
    <div className="h-screen md:w-full w-full mx-auto flex items-center justify-center py-[40px]">
      <div className="text-center w-[90vw] md:w-[50%] text-[24px] border py-[30px] bg-white rounded-xl">
        <p
          className={`${GreatVibes.className} md:text-[80px] text-[50px] mb-[20px] text-yellow-600 md:leading-[90px] leading-[60px]`}
        >
          Zapraszamy!
        </p>
        <div className="h-[1px] w-[70%] bg-gray-600 mx-auto mb-[10px]"></div>
        <p className={`text-[20px] leading-[24px] md:px-[80px] mx-auto `}>
          <br />
          Przejdź do szczegółów ogłoszeń i jednocześnie <br></br>
          <strong className="font-semibold">
            wyślij szczegóły wybranych ogłoszeń na wskazny wcześniej adres mailowy.
          </strong>
        </p>
        <div
          onClick={handlingMassegeSend}
          className="duration-200 border bg-green-500 border-green-500 w-[300px] rounded-md mx-auto text-white mt-[40px] cursor-pointer hover:bg-white hover:text-black hover:border-gray-900"
        >
          Przejdź do ogłoszeń
        </div>
      </div>
    </div>
  );
}
