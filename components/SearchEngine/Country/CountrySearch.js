import React from "react";
import { useRouter } from "next/router";

export default function CountrySearch() {
  const router = useRouter();
  const country = router.query.country;

  const pushCountry = (e) => {
    // console.log(country);
    router.push({
      pathname: `/${e.target.value}`,
      query: { page: 1 },
    });
  };

  return (
    <div className="flex items-center md:w-[170px] w-[90vw] mt-[17px]">
      <p className="text-[16px] h-[35px] bg-yellow-500 border-yellow-500 rounded-l-md text-white px-[3px] place-items-center grid border">
        Kraj
      </p>
      <div className="w-[140px] flex justify-center text-[20px]">
        <div className="relative w-full flex justify-center items-center">
          <select
            onChange={(e) => pushCountry(e)}
            autoComplete="off"
            className="rounded-r-md rounded-l-[0px] h-[35px] border-yellow-500/[0.9] border-[0.8px] w-full mx-auto cursor-pointer text-[16px] border-gray-600 outline-none"
            name="country"
            defaultValue={country}
          >
            <option name="hiszpania" value="hiszpania">
              Hiszpania
            </option>
            {/* <option name="portugalia" value="portugalia">
              Portugalia
            </option> */}
            {/* <option name="chorwacja" value="chorwacja">
              Chorwacja
            </option> */}
            <option name="dominikana" value="dominikana">
              Dominikana
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
