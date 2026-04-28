import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useEffect, useState } from "react";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";
import PropertyCardSkeleton from "./components/SearchEngine/propertycardsceleton";

export default function SearchResults(props: any) {
  const router = useRouter();

  const { properties, loader, setLoader, count } = props;

  return (
    <div className={`${Red_Hat_DisplayFont.className} mx-auto`}>
      <div className="font-[600] mb-[20px] text-[16px]">
        Znaleziono {count} ogłoszeń{" "}
      </div>
      <div className="w-[90vw] max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
