import React, { useState } from "react";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import ContactForm from "../ContactForm";

type Props = {
  propertyId: any;
  propertyRef: any;
};

export default function Loan({ propertyRef, propertyId }: Props) {
  const loanDurationSelect = 30;
  let i = 0;

  const [loanValue, setLoanValue] = useState<number>(250000);
  const [loanOwnPayment, setLoanOwnPayment] = useState(90000);
  const [loanInterest, setLoanInterest] = useState(3.5);
  const [loanDuration, setLoanDuration] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  const options = Array.from({ length: loanDurationSelect }, (_, i) => (
    <option key={i} value={i + 1}>
      {i + 1} {(i == 0 && "rok") || (i < 4 && "lata") || (i < 30 && "lat")}
    </option>
  ));

  const calculate = () => {
    const InterestMonthly = loanInterest / 100 / 12;
    const LoanDurationMonths = loanDuration * 12;
    const finalLoanValue = loanValue - loanOwnPayment || 0;
    const CalulationMonthlyPayment =
      finalLoanValue *
      ((InterestMonthly * (1 + InterestMonthly) ** LoanDurationMonths) /
        ((1 + InterestMonthly) ** LoanDurationMonths - 1));

    setMonthlyPayment(CalulationMonthlyPayment);
  };

  const handleLeanParams = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "ownMoney") {
      setLoanOwnPayment(value);
    } else if (name === "price") {
      setLoanValue(value);
    } else if (name === "interest") {
      setLoanInterest(value);
    } else if (name === "duration") {
      setLoanDuration(value);
    }

    console.log(value);
  };

  return (
    <div className={`${Red_Hat_DisplayFont.className} my-[30px]`}>
      <p className="font-bold text-[20px]">Kalkulator kredytowy</p>
      <p className="mt-[20px] italic">
        Kalkulacja, którą uzyskasz jest orientacyjna, nie jest ofertą ofertą banku ani cześcią
        umowy. Aby uzyskać wiążącą ofertę wymagana jest weryfikacja w oddziale banku.
      </p>
      <div className="border-red-800 flex mt-[30px] w-full flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col h-[480px] justify-between w-full">
          <div className="w-full">
            <p className="text-[18px] mb-[2px]">Kwota zakupu:</p>
            <input
              name="price"
              onChange={(e) => handleLeanParams(e)}
              type="number"
              className="w-full text-[20px] lg:w-[400px] h-[50px] border border-gray-800 rounded-[3px] pl-[10px] font-bold"
              defaultValue={loanValue}
            ></input>
          </div>
          <div className="w-full">
            <p className="text-[18px] mb-[2px]">Wpłata własna:</p>
            <input
              name="ownMoney"
              onChange={(e) => handleLeanParams(e)}
              type="number"
              className="text-[20px] w-full lg:w-[400px] h-[50px] border border-gray-800 rounded-[3px] pl-[10px] font-bold"
              defaultValue={loanOwnPayment}
            ></input>
          </div>
          <div className="w-full">
            <p className="text-[18px] mb-[2px]">Oprocentowanie:</p>
            <input
              defaultValue={loanInterest}
              name="interest"
              onChange={(e) => handleLeanParams(e)}
              className="text-[20px] font-bold w-full lg:w-[400px] h-[50px] border border-gray-800 rounded-[3px] pl-[10px]"
            ></input>
          </div>
          <div>
            <p className="text-[18px] mb-[2px]">Okres kredytowania:</p>
            <select
              name="duration"
              defaultValue={20}
              onChange={(e) => handleLeanParams(e)}
              className="text-[20px] w-full lg:w-[400px] h-[50px] border border-gray-800 rounded-[3px] pl-[10px] font-bold cursor-pointer"
            >
              {options}
            </select>
          </div>
          <button
            onClick={calculate}
            className="w-full lg:w-[400px] h-[50px] bg-orange-500 mt-[20px] text-[20px] text-white rounded-[3px]"
          >
            Oblicz
          </button>
          <div>
            <p className="text-[18px] mb-[2px]">Prognozowane m-czne raty:</p>
            <div className="text-[24px] italic font-bold w-full lg:w-[400px] h-[50px] border border-gray-800 rounded-[3px] pl-[10px] place-content-center">
              {(monthlyPayment !== 0 ? Math.round(monthlyPayment * 100) / 100 : "") ||
                monthlyPayment === null}
            </div>
          </div>
        </div>
        {/* <div className="bg-orange-500 h-[300px] w-1/2"></div> */}
        <ContactForm propertyId={propertyId} propertyRef={propertyRef} />
      </div>
    </div>
  );
}
