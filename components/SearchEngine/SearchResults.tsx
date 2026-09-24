import { queryFromUrl } from "@/lib/catalogRouting";
import PropertyCard from "./PropertyCard";
import { useEffect, useState } from "react";
import { HomeRedHatDisplayFont as Red_Hat_DisplayFont } from "@/fonts/homeFonts";
import { useRouter } from "next/router";
import PropertyCardSkeleton from "../../components/SearchEngine/propertycardsceleton";
import { MdOutlineIosShare } from "react-icons/md";

export default function SearchResults(props: any) {
  const router = useRouter();

  const { properties, loader, setLoader, count, locale = "pl" } = props;
  const isEn = locale === "en";
  const [sort, setSort] = useState<string>("recommended");

  const handleShareResults = async () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(router.query)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const shortUrl = `${window.location.origin}/s/${encoded}`;

      await navigator.clipboard.writeText(shortUrl);

      alert(isEn ? "Link copied" : "Link skopiowany");
    } catch (err) {
      console.error(err);
      alert(isEn ? "Error copying link" : "Błąd kopiowania linku");
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const sortParam =
        router.query.sort === "price_asc" || router.query.sort === "price_desc"
          ? router.query.sort
          : "recommended";
      setSort(sortParam);
    }
  }, [router.isReady, router.query.sort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSort(newSort);
    setLoader(true);

    const query: Record<string, string | string[] | undefined> = {
      ...queryFromUrl(router.asPath),
      sort: newSort,
    };
    delete query.page;

    router.push(
      {
        pathname: router.asPath.split("?")[0],
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
      <div
        id="summary"
        className="mb-6 flex flex-col gap-4 border-b border-[#e5dac7] p-4 shadow-sm md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
            {isEn ? "Search results" : "Wyniki wyszukiwania"}
          </p>
          <div className="mt-1 text-[18px] font-bold text-[#182334]">
            {isEn ? `Found ${count} listings` : `Znaleziono ${count} ogłoszeń`}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={handleShareResults}
            aria-label="Udostępnij wyniki"
            className="flex h-11 w-11 items-center justify-center border border-[#d7c8ad] bg-[#f7f3ec] text-[#182334] transition hover:border-[#b8954c] hover:text-[#9b7a36]"
          >
            <MdOutlineIosShare className="h-5 w-5" />
          </button> */}
          <select
            value={sort}
            onChange={handleSortChange}
            className="h-11 border border-[#d7c8ad] bg-white px-3 text-[14px] font-semibold text-[#182334] outline-none transition focus:border-[#b8954c]"
          >
            <option value="recommended">
              {isEn ? "Recommended" : "Rekomendowane"}
            </option>
            <option value="price_asc">
              {isEn ? "Lowest price first" : "Od najniższej ceny"}
            </option>
            <option value="price_desc">
              {isEn ? "Highest price first" : "Od najwyższej ceny"}
            </option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loader
          ? Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={`sk-${i}`} />
            ))
          : properties.map((property: any, index: number) => (
              <PropertyCard
                key={property.external_id}
                property={property}
                locale={locale}
                imagePriority={index === 0}
                appearance="cbtop"
              />
            ))}
      </div>
    </div>
  );
}
