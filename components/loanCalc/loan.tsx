import React, { useEffect, useState } from "react";
import { Red_Hat_DisplayFont, OutfitSans } from "../../fonts/fonts";
import ContactForm from "../ContactForm";

type Props = {
  propertyId: any;
  propertyRef: any;
  propertyPrice: any;
};

export default function Loan({
  propertyRef,
  propertyId,
  propertyPrice,
}: Props) {
  const loanDurationSelect = 30;
  let i = 0;

  console.log(propertyPrice);

  const [loanValue, setLoanValue] = useState<number>(Number(propertyPrice));
  const [loanOwnPayment, setLoanOwnPayment] = useState(30);
  const [loanInterest, setLoanInterest] = useState(3.5);
  const [loanDuration, setLoanDuration] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  const options = Array.from({ length: loanDurationSelect }, (_, i) => (
    <option key={i} value={i + 1}>
      {i + 1} {(i == 0 && "rok") || (i < 4 && "lata") || (i < 30 && "lat")}
    </option>
  ));

  const calculate = () => {
    console.log(propertyPrice);
    const principal = loanValue - (loanValue * loanOwnPayment) / 100;

    const monthlyRate = loanInterest / 100 / 12;
    const months = loanDuration * 12;

    if (principal <= 0 || !months) {
      setMonthlyPayment(0);
      return;
    }

    if (monthlyRate === 0) {
      setMonthlyPayment(principal / months);
      return;
    }

    const factor = Math.pow(1 + monthlyRate, months);

    const monthlyPayment = principal * ((monthlyRate * factor) / (factor - 1));

    setMonthlyPayment(Math.ceil(monthlyPayment * 100) / 100);
  };

  const handleLeanParams = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(value);
    if (name === "ownMoney") {
      setLoanOwnPayment(Number(value));
    } else if (name === "interest") {
      setLoanInterest(Number(value));
    } else if (name === "duration") {
      setLoanDuration(Number(value));
    }
  };

  useEffect(() => {
    calculate();
  }, [loanValue, loanOwnPayment, loanInterest, loanDuration]);

  return (
    <div
      className={`${OutfitSans.className} my-[30px]  rounded-md p-4 tracking-[1.1px] `}
    >
      <div className="w-full border-b-[1px] border-gray-300 mb-[30px]"></div>
      <p className="font-bold text-[22px] font-[400]">Kalkulator kredytowy</p>
      <p className="mt-[20px] text-[14px] leading-[14px]">
        Kalkulacja, którą uzyskujesz jest orientacyjna, nie jest ofertą banku
        ani cześcią umowy. Aby uzyskać wiążącą ofertę wymagana jest weryfikacja
        w oddziale banku.
      </p>
      <div className="border-red-800 flex mt-[30px] w-full flex-col lg:flex-row">
        <div className="lg:w-full flex flex-col h-[300px] justify-between w-full">
          <div className="w-full">
            <p className="text-[14px] mb-[2px]">Wkład własny %</p>
            <input
              name="ownMoney"
              onChange={(e) => handleLeanParams(e)}
              type="number"
              min="30"
              max="100"
              className="w-full text-[18px] lg:w-full h-[40px] border-[0.5px] border-gray-600 rounded-md pl-[10px] font-bold"
              defaultValue={30}
            ></input>
          </div>
          <div className="w-full">
            <p className="text-[14px] mb-[2px]">Oprocentowanie kredytu:</p>
            <select
              defaultValue={loanInterest}
              name="interest"
              onChange={(e) => handleLeanParams(e)}
              className="text-[18px] font-bold w-full lg:w-full h-[40px] border-[0.5px] border-gray-600 rounded-md pl-[10px] bg-white"
            >
              <option value={3}>3 %</option>
              <option value={3.5}>3,5 %</option>
              <option value={4}>4 %</option>
            </select>
          </div>
          <div>
            <p className="text-[14px] mb-[2px]">Okres kredytowania:</p>
            <select
              name="duration"
              defaultValue={20}
              onChange={(e) => handleLeanParams(e)}
              className="text-[18px] w-full lg:w-full h-[40px] border-[0.5px] border-gray-600  rounded-[3px] pl-[10px] font-bold cursor-pointer bg-white"
            >
              {options}
            </select>
          </div>
          <div className="w-full h-auto">
            <p className="bg-yellow-400 mb-[10px] text-center rounded-md font-[500]">
              Miesięczna rata:
            </p>
            <p className="font-[700] text-[26px] text-yellow-600 text-center">
              {(Math.ceil(monthlyPayment * 100) / 100)
                .toString()
                .replace(".", ",")}{" "}
              €/m-c
            </p>
          </div>
        </div>
        {/* <div className="bg-orange-500 h-[300px] w-1/2"></div> */}
        {/* <ContactForm propertyId={propertyId} propertyRef={propertyRef} /> */}
      </div>
    </div>
  );
}
