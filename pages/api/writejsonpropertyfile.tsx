import fs from "fs";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Możesz zwiększyć do większej wartości, np. '50mb'
    },
  },
};

export default async function POST(req: any, res: any, properties: any) {
  const mapped = properties.map((property: any) => ({
    source: "ASARI",
    external_id: property.ListingId.toString(),
    complex_id: property.complex_id ?? null,

    price: Number(property.price),
    currency: property.currency,
    price_freq: property.price.amount,

    part_ownership: Boolean(property.part_ownership),
    leasehold: Boolean(property.leasehold) ?? null,
    new_build: property.mortgageMarket === "Primary" ? true : false,

    type: property.apartmentTypeList[0].toLowerCase(),
    town: property.foreignStreet,
    province: property.foreignLocation,
    country: property.country.name,
    ref: property.ref,

    surface_built: property.totalArea ?? null,
    surface_plot: property.surface_area?.plot ?? null,

    latitude: property.geoLat ?? null,
    longitude: property.geoLng ?? null,

    beds: property.noOfRooms,
    baths: property.noOfBathrooms,
    pool: property.availableNeighborhoodList.indluces("Pool") ? true : false,

    urls: property.url ?? {},
    descriptions: property.desc ?? {},
    features: property.features?.feature ?? [],
    images:
      property.images?.map((img: any) => ({
        id: img.id,
        url: `https://img.asariweb.pl/normal/${img.id}`,
      })) ?? [],

    date: property.changePriceDate,
    updated_at: new Date(),
  }));

  fs.writeFileSync(
    "./public/properties.json",
    JSON.stringify(req.body.properties),
  );
  res.json(200);
}
