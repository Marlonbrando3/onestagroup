import PropertyCard from "./PropertyCard";
import PropertyCardHorizontal from "./PropertyCardHorizontal";
import { useEffect, useState } from "react";
import { Red_Hat_DisplayFont } from "@/fonts/fonts";
import Properties from "../../public/properties.json";
import { useRouter } from "next/router";
import PropertyCardSkeleton from "../../components/SearchEngine/propertycardsceleton";
import { MdOutlineIosShare } from "react-icons/md";

export default function SearchResults(props: any) {
  const router = useRouter();

  const { properties, loader, setLoader, count } = props;
  const [sort, setSort] = useState<string>("price_asc");

  const handleShareResults = async () => {
    try {
      const encoded = Buffer.from(JSON.stringify(router.query)).toString(
        "base64url",
      );

      const shortUrl = `${window.location.origin}/s/${encoded}`;

      await navigator.clipboard.writeText(shortUrl);

      alert("Link skopiowany");
    } catch (err) {
      console.error(err);
      alert("Błąd kopiowania linku");
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const sortParam = (router.query.sort as string) || "price_asc";
      setSort(sortParam);
    }
  }, [router.isReady, router.query.sort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    setLoader(true);

    const query = { ...router.query, sort: newSort };

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: false, scroll: false },
    );
  };

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} w-[90vw] max-w-[1300px] mx-auto`}
    >
      <div id="summary" className="flex justify-between items-center mb-[20px]">
        <div className="font-[600] text-[16px]">
          Znaleziono {count} ogłoszeń
        </div>

        <div className="flex items-center">
          {" "}
          <MdOutlineIosShare className="mr-[10px] w-[19px] h-[20px] cursor-pointer" />
          <select
            value={sort}
            onChange={handleSortChange}
            className="pr-5 pl-2 py-2 border border-gray-300 rounded-md text-[14px] bg-white cursor-pointer left"
          >
            <option value="price_asc">Od najniższej ceny</option>
            <option value="price_desc">Od najwyższej ceny</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-7">
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
