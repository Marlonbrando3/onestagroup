import React from "react";
import { useRouter } from "next/router";

type Params = {
  searchBtn: any;
  slugify: any;
  dataRegion: any;
};

export default function CountrySearch({
  searchBtn,
  slugify,
  dataRegion,
}: Params) {
  const router = useRouter();
  const countryQuery = Array.isArray(router.query.country)
    ? router.query.country[0]
    : router.query.country;

  const pushCountry = (e: any) => {
    // searchBtn.current.style.pointerEvents = "none";
    const country = slugify(e.target.value);

    router.push({ pathname: `/nieruchomosci/${country}` }).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center lg:w-[170px] w-[90vw] mt-[17px]">
      <p className="text-[16px] h-[35px] border-yellow-600 bg-yellow-600 rounded-l-[3px] text-white px-[5px] place-items-center grid border">
        Kraj
      </p>
      <div className="w-[140px] flex justify-center text-[20px]">
        <div className="relative w-full flex justify-center items-center">
          <select
            onChange={(e) => pushCountry(e)}
            autoComplete="off"
            className="rounded-r-[2px] rounded-l-[2px] h-[35px] border-yellow-600 border-[0.8px] w-full mx-auto cursor-pointer text-[17px] pl-[10px]  outline-none"
            name="country"
            defaultValue={countryQuery}
            value={countryQuery}
          >
            <option data-name="hiszpania" value="hiszpania">
              Hiszpania
            </option>
            {/* <option name="portugalia" value="portugalia">
              Portugalia
            </option> */}
            <option data-name="chorwacja" value="cypr">
              Cypr
            </option>
            <option data-name="dominikana" value="dominikana">
              Dominikana
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
