import React from "react";
import DescAboutProperty from "./DescAboutProperty";
import DescAboutObiect from "./DescAboutObiect";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";
import ContactForm from "./ContactForm";
import Loan from "./loanCalc/loan";
import ContactColumnInOffer from "./ContactColumnInOffer";

type Props = {
  features: any;
  description: any;
  bedrooms: any;
  bathrooms: any;
  distance: any;
  pool: any;
  propertyId: any;
  propertyRef: any;
  localization: any;
  propertyPrice: any;
};

export default function Descryption({
  features,
  description,
  localization,
  bedrooms,
  bathrooms,
  distance,
  pool,
  propertyId,
  propertyRef,
  propertyPrice,
}: Props) {
  return (
    <div className="lg:flex lg:flex-wrap w-full rounded-md lg:w-[1580px] md:w-[95vw] max-w-full lg:leading-7 mx-auto mt-[10px] relative filter">
      {/* container for 2 colums left:desc and contact form, right: contact with agent (only desktop) */}
      <div className="lg:flex lg:w-full rounded-md justify-between bg-white lg:mr-3 pt-8">
        <DescAboutObiect
          description={description}
          features={features}
          localization={localization}
          bedrooms={bathrooms}
          bathrooms={bathrooms}
          pool={pool}
          propertyPrice={propertyPrice}
        />
        <ContactColumnInOffer propertyPrice={propertyPrice} />
      </div>

      {/* <ContactOnPropertyCard propertyRef={propertyRef} /> */}
    </div>
  );
}
