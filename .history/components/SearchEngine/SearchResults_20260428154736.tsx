import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useEffect, useState } from "react";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import ChangeSite from "./Pagination";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";
import AboutSpain from "../aboutSpain";
import AboutCyprus from "../aboutCyprus";
import HowToSearch from "../howToSearch";
import FaqSpainMain from "../faqSpainMain/faqSpainMain";
import LocationsMap from "./googlemaps";
import PropertyCardSkeleton from "@/components/SearchEngine/propertycardsceleton";

export default function SearchResults(props: any) {
  const router = useRouter();

  const { properties, loader, setLoader } = props;

  const [actualPage, setActualPage] = useState(1);
  const [temptSubSite, setTempSubSite] = useState();

  const propertiesSafe = Array.isArray(properties) ? properties : [];

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

  useEffect(() => {
    setLoader(false);
  }, [properties, setLoader]);

  return (
    <div className={`${Red_Hat_DisplayFont.className} mx-auto`}>
      <div className="w-[90vw] max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {count} */}
        {loader
          ? Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={`sk-${i}`} />
            ))
          : properties.map((property: any) => (
              <PropertyCard key={property.external_id} property={property} />
            ))}
      </div>
    </div>
  );
}
