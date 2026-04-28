import React, { useCallback, useRef, useState, useEffect } from "react";

export default function AsariCrm() {
  const rawProperties: any = [];
  const [progress, setProgress] = useState<number>(0);
  const [oneOfferId, setOneOfferId] = useState();
  const spinner = useRef<any>();
  const finish = useRef<any>();

  let i = 0;
  let percent = 0;

  const prog = useCallback(() => {
    return `${progress} %`;
  }, [progress]);

  const handleDownloadingAllProperties = async (propertiesId: any) => {
    for (const id of propertiesId.slice(230, 270)) {
      await new Promise(async (resolve, reject) => {
        let resultProperty = await fetch("/api/asarigetproperties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id }),
        });
        const result = await resultProperty.json();
        if (
          result.list.data.country.name !== "Polska" &&
          result.list.data.country.name !== "Hiszpania"
        ) {
          rawProperties.push(result.list.data);
          console.log(result.list.data.country.name + " Dodano nieruchomość");
        } else {
          console.log(
            result.list.data.country.name + " Odrzucono nieruchomość",
          );
        }
        i = i + 1;
        setProgress(Math.round(i / propertiesId.length) * 100);
        console.log(id);
        await delay(4000);
        resolve(console.log("Zrealizowne"));
      });
    }

    const properties = rawProperties.map((property: any) => ({
      source: "ASARI",
      external_id: `ASR-${property.listingId}`,
      complex_id: null,

      price: Number(property.price.amount),
      currency: property.price.currency,
      price_freq: "sale",

      part_ownership: Boolean(false),
      leasehold: Boolean(false),
      new_build: property.mortgageMarket === "Primary" ? true : false,

      type: property?.apartmentTypeList?.[0]?.toLowerCase() ?? "no-data",
      town: property.foreignStreet,
      province: property.foreignLocation,
      country: property.country.name,
      ref: property.listingId,

      surface_built: property.totalArea ?? null,
      surface_plot: property.surface_area?.plot ?? null,

      latitude: property.geoLat ?? null,
      longitude: property.geoLng ?? null,

      beds: property.noOfRooms,
      baths: property.noOfBathrooms,
      pool: property.availableNeighborhoodList.includes("Pool") ? true : false,

      urls: (property.url ?? {}) || null,
      descriptions: { pl: property.description },
      features: property.features?.feature ?? [],
      images:
        property.images?.map((img: any, index: any) => ({
          ["id_@"]: index + 1,
          url: `https://img.asariweb.pl/normal/${img.id}`,
        })) ?? [],

      date: property.changePriceDate,
      updated_at: new Date(),
    }));

    console.log(properties);

    // save properties in supabase

    await fetch("/api/asariToSupabase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ properties }),
    });

    finish.current.style.display = "block";
    spinner.current.style.display = "none";
  };

  const delay = async (time: any) => {
    await new Promise((resolve) =>
      setTimeout(() => resolve(console.log("-------")), time),
    );
  };

  const handleDownloadingDataFromAsari = async () => {
    finish.current.style.display = "hidden";
    spinner.current.style.display = "flex";
    const propertiesId: any = [];

    try {
      let res = await fetch("/api/asarigetid", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const resultsData = await res.json();
      resultsData.list.data.map((propId: any) => {
        propertiesId.push(propId.id);
      });

      await handleDownloadingAllProperties(propertiesId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckingOneOffer = async () => {
    finish.current.style.display = "hidden";
    spinner.current.style.display = "flex";
    const propertiesId: any = [];

    try {
      let res = await fetch("/api/asarigetListingId", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: oneOfferId }),
      });
      // const resultsData = await res.json();
      // resultsData.list.data.map((propId: any) => {
      //   propertiesId.push(propId.id);
      // });

      await handleDownloadingAllProperties(propertiesId);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChosingOneOffer = (e: any) => {
    setOneOfferId(e.target.value);
  };

  const handleMetaInmo = () => {
    const req = fetch("/api/metainmoToSupabase");
  };

  return (
    <div>
      <div
        onClick={handleDownloadingDataFromAsari}
        className="bg-blue-500 text-white w-[200px] text-center cursor-pointer"
      >
        Ściągnij dane z Asari
      </div>
      <input
        className="border-2 mt-[20px] w-[200px]"
        onChange={handleChosingOneOffer}
      ></input>
      <div
        onClick={handleCheckingOneOffer}
        className="bg-green-600 text-white w-[200px] text-center cursor-pointer"
      >
        Sprawdź jedną ofertę
      </div>
      <div
        onClick={handleMetaInmo}
        className="bg-orange-600 text-white w-[200px] text-center cursor-pointer mt-[40px]"
      >
        Aktualizuj Metainmo
      </div>
      <div
        ref={spinner}
        className="hidden justify-evenly items-center w-[180px] py-[20px]"
      >
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-[40px] h-[40px] text-gray-200 animate-spin dark:text-white-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
        <div>Sciagam dane...</div>
      </div>
      {/* <div className="border w-[300px] h-[30px] text-center">
        <div className={`w-[${progress}%] bg-red-500 overflow-hidden`}>{prog()}</div>
      </div> */}
      <div ref={finish} className="py-[20px] hidden">
        Dane ściągniete!
      </div>
    </div>
  );
}
