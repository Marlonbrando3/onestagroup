import React from "react";
import { useRouter } from "next/router";
import DataCountry from "../../../data/DataCountry.json";

export default function CountrySearch({ activeRegionList, setActiveRegionList }) {
  const router = useRouter();

  const country = router.query.country;

  let RegionsList = [];
  DataCountry.map((obj) => {
    let regions = [];
    if (obj.country === country) {
      obj.region.map((v) => {
        regions = [...regions, v.region];
        // console.log(regions)
      });
    }
  });

  const handleShowCountryList = () => {
    setActiveRegionList((activeRegionList) => !activeRegionList);
  };

  const handleChooseThisRegion = (e) => {
    let Region = e.target.getAttribute("name");
    ShowChangedAreApply();
    setActiveRegionList((activeRegionList) => !activeRegionList);

    setSearchConditions(
      searchConditions.map((obj) => {
        if (obj.name === "region") {
          return {
            id: 1,
            name: obj.name,
            value: obj.value.map((v) => {
              if (v.region === Region) {
                return {
                  ...v,
                  isSearching: true,
                };
              } else return { ...v };
            }),
          };
        } else return { ...obj };
      }),
    );
  };

  return (
    <>
      <div className="InputsStyle w-full">
        <input
          readOnly
          onClick={handleShowCountryList}
          className="InputsProps w-full"
          autoComplete="off"
          name="country"
          placeholder="Wybierz region"
        ></input>
      </div>
      {activeRegionList && (
        <div className="ListWithChooseContainer w-full">
          {RegionsList.map((region) => (
            <li
              key={region}
              className="listToChoose"
              name={region}
              onClick={handleChooseThisRegion}
            >
              dupa
            </li>
          ))}
        </div>
      )}
    </>
  );
}
