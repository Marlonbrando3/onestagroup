import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MontserratSans } from "../../fonts/fonts";
import { FaRegCheckCircle } from "react-icons/fa";

type data = {
  handleConsultationPopUp: any;
  ConsultationsShowed: any;
};
export default function Consultation({
  handleConsultationPopUp,
  ConsultationsShowed,
}: data) {
  const router = useRouter();
  const { offer } = router.query;

  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [msg, setMsg] = useState("");
  const sendButton: any = useRef();
  const thankyoupopup: any = useRef();

  const handleChangingValue = (e: any) => {
    const dataName = e.target.name;
    const dataValue = e.target.value;

    console.log(e.target.name);

    if (dataName === "name") {
      setName(dataValue);
    } else if (dataName === "phone") {
      setPhone(dataValue);
    } else if (dataName === "email") {
      setEmail(dataValue);
    } else if (dataName === "msg") {
      setMsg(dataValue);
    }
  };

  const handleSendingForm = async (e: any) => {
    e.preventDefault();
    console.log(name, phone, email, msg);
    console.log(offer);

    try {
      let res = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer,
          name,
          phone,
          email,
          msg,
        }),
      });

      const data = await res.status;
      console.log(data);
      if (data === 200) {
        thankyoupopup.current.style.display = "flex";
        setTimeout(() => {
          handleConsultationPopUp();
          thankyoupopup.current.style.display = "none";
        }, 2000);
        // router.push("https://onesta.com.pl/form/thankyoupageform");
        // setPageNumber(2);

        // setTimeout(() => {
        //   intrestedPopUp.current.style.display = "none";
        // }, 2000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`${MontserratSans.className} ${
        ConsultationsShowed === true ? "block" : "hidden"
      }  z-50 md:w-[800px] w-[90vw] h-[500px] bg-[url('/consultationsPopUp.png')] bg-[length:[0px_1000px] md:bg-[position:440%_center] md:bg-[length:90%_auto] overflow-hidden rounded-xl fixed flex md:justify-end top-[15vh] left-0 right-0 mx-auto border shadow-xl`}
    >
      <IoCloseCircleOutline
        className="absolute mt-[10px] w-[25px] h-[25px] right-[10px] cursor-pointer z-20"
        onClick={handleConsultationPopUp}
      />
      <form
        onSubmit={handleSendingForm}
        className="flex flex-col md:w-[500px] h-full items-center justify-evenly bg-white p-[20px] font-[500] relative"
      >
        {" "}
        <div
          ref={thankyoupopup}
          className="hidden absolute z-20 w-full h-full bg-white flex flex-col items-center justify-center"
        >
          <FaRegCheckCircle className="w-[100px] h-[100px] text-green-600 mb-[40px]" />
          <p className="text-[18px] text-center font-[800] px-[10px]">
            Dziękujemy!<br></br>Wkrótce się z Tobą skontaktujemy.
            <br></br>
            <p>Do usłyszenia!</p>
          </p>
          <div
            className="mt-[150px] cursor-pointer"
            onClick={handleConsultationPopUp}
          >
            Zamknij okno
          </div>
        </div>
        <p className="text-[20px] font-[400]">
          Skorzystaj z 30 minutowej konsultacji.{" "}
          <span className="font-[600]">Sprawdź jak możemy Ci pomóc :)</span>
        </p>
        <input
          onChange={handleChangingValue}
          name="name"
          className="w-full h-[35px] border border-gray-600 rounded-[4px] pl-[10px] placeholder:text-gray-500"
          placeholder="Imię i nazwisko"
          required
        ></input>
        <input
          onChange={handleChangingValue}
          name="phone"
          className="w-full h-[35px]  border border-gray-600 rounded-[4px] pl-[10px] placeholder:text-gray-500"
          placeholder="Numer kontaktowy"
          required
        ></input>
        <input
          onChange={handleChangingValue}
          name="email"
          className="w-full h-[35px]  border border-gray-600 rounded-[4px] pl-[10px] placeholder:text-gray-500"
          placeholder="Adres email"
          required
        ></input>
        <textarea
          onChange={handleChangingValue}
          name="msg"
          className="w-full h-[100px] border border-gray-600 rounded-[4px] p-[10px] placeholder:text-gray-500"
          placeholder="Twoja wiadomość"
        ></textarea>
        <div className="w-full  h-auto text-[12px] flex">
          <input
            type="checkbox"
            className="border border-gray-60 w-[20px] h-[20px] cursor-pointer"
            required
          ></input>
          <p className="flex-1 ml-[5px] leading-[13px]">
            Potwierdzam, że zapoznałem się i akceptuję regulamin i politykę
            prywatności (wymagane)
          </p>
        </div>
        <div className="w-full  h-auto text-[12px] flex">
          <input
            type="checkbox"
            className=" border-gray-60 w-[20px] h-[20px] cursor-pointer"
            required
          ></input>
          <p className="flex-1 ml-[5px] leading-[13px]">
            Wrażam zgodę na otrzymywanie ofert w postaci mailowego newslettera.
          </p>
        </div>
        <button className="bg-green-500 place-content-center grid w-[180px] h-[40px] text-[16px] font-[600] rounded-md text-white uppercase">
          <p ref={sendButton}>Wyślij</p>
        </button>
      </form>
    </div>
  );
}
