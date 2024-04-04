import React from "react";
import DescAboutProperty from "./DescAboutProperty";
import DescAboutObiect from "./DescAboutObiect";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";
import ContactForm from "./ContactForm";

type Props = {
  description: any;
  bedrooms: any;
  bathrooms: any;
  distance: any;
  pool: any;
  propertyId: any;
};

export default function Descryption({
  description,
  bedrooms,
  bathrooms,
  distance,
  pool,
  propertyId,
}: Props) {
  return (
    <div className="lg:flex lg:flex-wrap w-full rounded-md lg:w-10/12 lg:leading-7 mx-auto">
      {/* container for 2 colums left:desc and contact form, right: contact with agent (only desktop) */}
      <div className="lg:flex lg:flex-col lg:w-8/12 rounded-md justify-between bg-white lg:mr-3 p-8">
        <DescAboutObiect description={description} />
        <DescAboutProperty
          description={description}
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          distance={distance}
          pool={pool}
        />
        <ContactForm propertyId={propertyId} />
      </div>
      <ContactOnPropertyCard />
    </div>
  );
}
