import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useState } from "react";
import ChangeSite from "./changeSite";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";

export default function SearchResults() {
  const router = useRouter();

  const { page } = router.query;

  const [actualPage, setActualPage] = useState(parseInt(page as string) || 1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(6);
  const startProperty = (parseInt(page as string) - 1) * propertiesPerPage;
  const endProperty = startProperty + propertiesPerPage;

  console.log("data" + (parseInt(page as string) - 1 || actualPage));
  console.log(actualPage);

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

  let PropertiesSorted = Properties.sort(
    (a: any, b: any) =>
      new Date(b.actualisationDate).getTime() - new Date(a.actualisationDate).getTime(),
  );

  console.log(PropertiesSorted);

  let PropertiesSelected = PropertiesSorted.filter((p) => {
    // console.log(p);

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

  console.log(PropertiesDataSubSites);
  // console.log(bathsmax);

  return (
    <div className="mx-auto">
      <div className="h-full md:w-[800px] lg:w-auto flex items-center justify-center flex-wrap lg:mx-auto">
        {propertiesSliced.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      <ChangeSite
        PropertiesDataSubSites={PropertiesDataSubSites}
        actualPage={actualPage}
        setActualPage={setActualPage}
      />
    </div>
  );
}
