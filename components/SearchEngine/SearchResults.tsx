import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useEffect, useState } from "react";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import ChangeSite from "./changeSite";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";

export default function SearchResults() {
  const router = useRouter();

  const { page } = router.query;

  const [actualPage, setActualPage] = useState(parseInt(page as string) || 1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(18);
  const startProperty = (parseInt(page as string) - 1) * propertiesPerPage;
  const endProperty = startProperty + propertiesPerPage;

  const {
    country,
    type,
    region,
    market,
    bathsmin,
    bathsmax,
    bedsmin,
    bedsmax,
    pricemin,
    pricemax,
  } = router.query;
  // console.log(Properties[0].apartmentTypeList);

  console.log("load");

  const [PropertiesSorted, setPropertiesSorted] = useState(
    Properties.sort(
      (a: any, b: any) =>
        new Date(b.actualisationDate).getTime() - new Date(a.actualisationDate).getTime(),
    ),
  );

  let PropertiesSelected = PropertiesSorted.filter((p) => {
    console.log(p.price);
    console.log(p.listingId);

    if (
      p.country.name.toLowerCase() == (country as string) &&
      (p.section === type || type === "All" || type === undefined) &&
      (p.foreignLocation === region || region === undefined || region === "All") &&
      (p.mortgageMarket === market || market === undefined || market === "All") &&
      (p.noOfBathrooms >= parseInt(bathsmin as string) ||
        bathsmin === undefined ||
        bathsmin === "All") &&
      (p.noOfBathrooms <= parseInt(bathsmax as string) ||
        bathsmax === undefined ||
        bathsmax === "All") &&
      (p.noOfRooms >= parseInt(bathsmin as string) || bedsmin === undefined || bedsmin === "All") &&
      (p.noOfRooms <= parseInt(bedsmax as string) || bedsmax === undefined || bedsmax === "All") &&
      (p.price.amount >= parseInt(pricemin as string) ||
        pricemin === undefined ||
        pricemin === "All") &&
      (p.price.amount <= parseInt(pricemax as string) ||
        pricemax === undefined ||
        pricemax === "All")
    )
      return true;
  });

  const propertiesSliced = PropertiesSelected.slice(startProperty, endProperty);
  const propertiesSubSitesLengt = PropertiesSelected.length / propertiesPerPage;
  const PropertiesDataSubSites = propertiesSliced.filter(
    (p, index) => index <= propertiesSubSitesLengt,
  );

  const handleFiltering = (event: any) => {
    const value = event.target.value;
    if (value === "cheap") {
      console.log(value);
      let data = [...Properties].sort((a: any, b: any) => b.price.amount - a.price.amount);
      console.log(data);
      setPropertiesSorted(data);
    }

    if (value === "expensive") {
      console.log("expensive");
      let data = [...Properties].sort((a: any, b: any) => a.price.amount - b.price.amount);
      console.log(data);
      setPropertiesSorted(data);
    }
  };

  return (
    <div className={`${Red_Hat_DisplayFont.className} mx-auto`}>
      <div className="border-1 md:w-[800px] lg:w-[1160px] h-[40px] mb-[20px] mt-[3px] lg:mx-auto flex justify-end">
        <div className="w-[300px] h-full bg-white border flex items-center justify-evenly rounded-xl">
          <div className="pr-[10px]">Filtruj:</div>
          <div className="">
            <select className="text-left font-semibold" onChange={handleFiltering}>
              <option value="recomended">od popularnych</option>
              <option value="expensive">od najtańszych</option>
              <option value="cheap">od najdroższych</option>
              {/* <option value="recomnded">najpierw rekomendowane</option>
              <option value="delivery">najszybsza data oddania</option> */}
            </select>
          </div>
        </div>
      </div>
      <div className="h-full md:w-[800px] lg:w-[1160px] w-full flex items-center justify-center flex-wrap lg:mx-auto">
        {propertiesSliced.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <ChangeSite
        propertiesSubSitesLengt={propertiesSubSitesLengt}
        actualPage={actualPage}
        setActualPage={setActualPage}
      />
    </div>
  );
}
