import PropertyCard from "./PropertyCard";
import ChangeSite from "./ChangeSite";
import Properties from "../../public/properties.json";

export default function SearchResults() {
  return (
    <div className="mx-auto">
      <div className="h-3/3 md:w-[800px] lg:w-[1300px] md:mr-5 flex items-center justify-center flex-wrap lg:mx-auto">
        {Properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {/* <ChangeSite
      sitesArray={sitesArray}
      setSitesArray={setSitesArray}
      actualSite={actualSite}
      setActualSite={setActualSite}
      searchConditions={searchConditions}
      setSearchConditions={setSearchConditions}
      sitesArraycounter={sitesArraycounter}
      /> */}
    </div>
  );
}
