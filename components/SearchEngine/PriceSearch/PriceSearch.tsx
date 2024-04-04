import { useRef } from "react";
import { useRouter } from "next/router";

export default function PriceSearch() {
  const router = useRouter();

  const pricesInputs = useRef<any>();

  const setNewPriceFrom = (e: any) => {
    router.query.priceFrom = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const setNewPriceTo = (e: any) => {
    router.query.priceTo = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const PriceSearchFrom = (
    <div>
      <select
        onChange={setNewPriceFrom}
        className="md:w-[170px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px]"
      >
        <option value="all-prices">od najniższej</option>
        <option value="200000">od 200 000 €</option>
        <option value="250000">od 250 000 €</option>
        <option value="300000">od 300 000 €</option>
        <option value="500000">od 500 000 €</option>
      </select>
    </div>
  );

  const PriceSearchTo = (
    <div>
      <select
        onChange={setNewPriceTo}
        className="md:w-[170px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px] "
      >
        <option value="all-prices">do najwyższej</option>
        <option value="300000">do 300 000 €</option>
        <option value="350000">od 350 000 €</option>
        <option value="400000">od 400 000 €</option>
        <option value="450000">od 500 000 €</option>
        <option value="500000 i więcej">do 500 000 € i więcej</option>
      </select>
    </div>
  );

  return (
    <>
      <div className=" border-gray-900/[0.4] min-h-[25px]  pb-[1px] lg:w-auto w-[90vw] rounded-[7px]">
        <div className="duration-150 lg:w-auto w-full flex flex-col justify-center mx-auto">
          <p className="mx-[5px] text-[12px]">Cena(euro)</p>
          <div
            ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {PriceSearchFrom}
            <div className="w-[10px] h-[1px] bg-yellow-500"></div>
            {PriceSearchTo}
          </div>
        </div>
      </div>
    </>
  );
}
