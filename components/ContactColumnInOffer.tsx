import React from "react";
import ContactAgentInOffer from "./ContactAgentInOffer";
import Loan from "./loanCalc/loan";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";

type props = {
  propertyPrice: any;
  propertyRef: any;
};

export default function ContactColumnInOffer({
  propertyPrice,
  propertyRef,
}: props) {
  return (
    <div className="lg:w-[370px] h-full">
      <ContactAgentInOffer />
      <Loan propertyPrice={propertyPrice} />
      <ContactOnPropertyCard propertyRef={propertyRef} />
    </div>
  );
}
