import React from "react";
import DescAboutProperty from "./DescAboutProperty";
import DescAboutObiect from "./DescAboutObiect";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";
import ContactForm from "./ContactForm";
import Loan from "./loanCalc/loan";

type Props = {
  description: any;
  bedrooms: any;
  bathrooms: any;
  distance: any;
  pool: any;
  propertyId: any;
  propertyRef: any;
};

export default function Descryption({
  description,
  bedrooms,
  bathrooms,
  distance,
  pool,
  propertyId,
  propertyRef,
}: Props) {
  return (
    <div className="lg:flex lg:flex-wrap w-full rounded-md lg:w-[1150px] md:w-[780px] max-w-full lg:leading-7 mx-auto mt-[10px] relative filter">
      {/* container for 2 colums left:desc and contact form, right: contact with agent (only desktop) */}
      <div className="lg:flex lg:flex-col lg:w-[1100px] rounded-md justify-between bg-white lg:mr-3 p-8">
        <DescAboutObiect description={description} />
        <Loan propertyId={propertyId} propertyRef={propertyRef} />
        {/* <ContactForm propertyId={propertyId} propertyRef={propertyRef} /> */}
      </div>

      {/* <ContactOnPropertyCard propertyRef={propertyRef} /> */}
    </div>
  );
}
