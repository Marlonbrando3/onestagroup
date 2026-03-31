import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useEffect, useState } from "react";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import ChangeSite from "./changeSite";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";
import AboutSpain from "../aboutSpain";
import AboutCyprus from "../aboutCyprus";
import HowToSearch from "../howToSearch";
import FaqSpainMain from "../faqSpainMain/faqSpainMain";

export default function SearchResults(props: any) {
  const router = useRouter();

  const { properties } = props;

  const [actualPage, setActualPage] = useState(1);
  const [temptSubSite, setTempSubSite] = useState();

  const propertiesSafe = Array.isArray(properties) ? properties : [];

  const { page } = router.query;

  const propertiesSubSitesLength = 100;

  const handleFiltering = (event: any) => {
    const value = event.target.value;
    if (value === "cheap") {
      let data = [...Properties].sort(
        (a: any, b: any) => b.price.amount - a.price.amount,
      );
    }

    if (value === "expensive") {
      let data = [...Properties].sort(
        (a: any, b: any) => a.price.amount - b.price.amount,
      );
    }
  };

  return (
    <div className={`${Red_Hat_DisplayFont.className} mx-auto`}>
      <div className="border-1 md:w-[800px] lg:w-[1160px] h-[40px] mb-[20px] mt-[3px] lg:mx-auto flex justify-end">
        <div className="w-[300px] h-full bg-white border flex items-center justify-evenly rounded-xl">
          <div className="pr-[10px]">Filtruj:</div>
          <div className="">
            <select
              className="text-left font-semibold"
              onChange={handleFiltering}
            >
              <option value="recomended">od popularnych</option>
              <option value="expensive">od najtańszych</option>
              <option value="cheap">od najdroższych</option>
              {/* <option value="recomnded">najpierw rekomendowane</option>
              <option value="delivery">najszybsza data oddania</option> */}
            </select>
          </div>
        </div>
      </div>
      <div className="h-full md:w-[800px] lg:w-[1160px] lg:w-[99vw] w-full flex items-center justify-center flex-wrap lg:mx-auto">
        {properties.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <ChangeSite
        actualPage={actualPage}
        setActualPage={setActualPage}
        temptSubSite={temptSubSite}
        setTempSubSite={setTempSubSite}
        count={props.count}
      />
      {/* {country === "hiszpania" && <FaqSpainMain />}
      {country === "cypr" && <AboutCyprus />}
      {country === "hiszpania" && <AboutSpain />}
      {country === "hiszpania" && <HowToSearch />} */}
    </div>
  );
}
