import React from "react";
import ContactAgentInOffer from "./ContactAgentInOffer";
import Loan from "./loanCalc/loan";
import ContactOnPropertyCard from "./SearchEngine/ContactOnPropertyCard";

type props = {
  propertyPrice: any;
};

export default function ContactColumnInOffer({ propertyPrice }: props) {
  return (
    <div className="lg:w-[370px] h-full">
      <ContactAgentInOffer />
      <Loan propertyPrice={propertyPrice} />
      <ContactOnPropertyCard />
    </div>
  );
}
