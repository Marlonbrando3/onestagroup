import React from "react";

export default function DescAboutObiect({ description }) {
  const desc = { html: description };

  return (
    <div className="rounded-md lg:w-auto lg:mr-2 bg-white">
      <p className="font-bold text-xl my-4"> Opis nieruchomości</p>
      <p dangerouslySetInnerHTML={{ __html: description }}></p>
    </div>
  );
}
