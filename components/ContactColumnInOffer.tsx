import React from "react";
import ContactAgentInOffer from "./ContactAgentInOffer";
import Loan from "./loanCalc/loan";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";

type props = {
  propertyPrice: any;
  propertyRef: any;
  locale?: "pl" | "en";
};

export default function ContactColumnInOffer({
  propertyPrice,
  propertyRef,
  locale = "pl",
}: props) {
  return (
    <div className="lg:w-[370px] h-full">
      <ContactAgentInOffer locale={locale} />
      <Loan propertyPrice={propertyPrice} locale={locale} />
      <ContactOnPropertyCard propertyRef={propertyRef} locale={locale} />
    </div>
  );
}
