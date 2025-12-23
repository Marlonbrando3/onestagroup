import React from "react";
import cities from "../../../data/cities.json";

export default function City() {
  const city = cities.filter((i) => i.city === "San Pedro del Pinatar");
  console.log(city);

  return <div className="flex w-[90%] mx-auto">{city[0].description}</div>;
}
