import { useRouter } from "next/router";

export default function Bedrooms() {
  const router = useRouter();
  const setNewBedsFrom = (e: any) => {
    router.query.bedsmin = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const setNewBedsTo = (e: any) => {
    router.query.bedsmax = e.target.value;
    router.push(router, undefined, { shallow: true });
  };

  const bedsFrom = (
    <div>
      <select
        onChange={setNewBedsFrom}
        className="md:w-[60px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px] "
      >
        <option value="all">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  );

  const bedsTo = (
    <div>
      <select
        onChange={setNewBedsTo}
        className="md:w-[60px] w-[90vw] rounded-3xl outline-none border-yellow-500 border cursor-pointer pl-[3px] "
      >
        <option value="all">do</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </div>
  );

  // let SummaryBeds = [];

  //hide apply button after click and change value 'from' and 'to' in searchConditions

  return (
    <>
      <div className="relative min-h-[25px] border-gray-900/[0.4] rounded-[7px] lg:m-auto lg:mx-[4px] pb-[1px] lg:w-auto w-[90vw] mx-auto ">
        <div className="lg:w-auto w-full h-auto flex flex-col justify-center">
          <p className="mx-[5px] text-[12px]">Liczba sypialni</p>
          <div
            // ref={pricesInputs}
            className="InputsStyle h-auto xl:w-[px] lg:w-full w-full xl:items-center justify-center flex-row"
          >
            {bedsFrom}
            <div className="w-[5px] h-[1px] bg-yellow-500"></div>
            {bedsTo}
          </div>
        </div>
      </div>
    </>
  );
}
