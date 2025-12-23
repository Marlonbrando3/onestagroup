import React, { useRef, useState } from "react";
import { useRouter } from "next/router";

export default function FormPoUpIntrested() {
  const router = useRouter();
  const { offer } = router.query;

  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [email, setEMail] = useState();
  const [msg, setMsg] = useState("");
  const sendButton: any = useRef();

  const handleChangingValue = (e: any) => {
    const dataName = e.target.name;
    const dataValue = e.target.value;

    console.log(e.target.name);

    if (dataName === "name") {
      setName(dataValue);
    } else if (dataName === "phone") {
      setPhone(dataValue);
    } else if (dataName === "email") {
      setEMail(dataValue);
    } else if (dataName === "msg") {
      setMsg(dataValue);
    }
  };

  const handleSendingForm = async (e: any) => {
    e.preventDefault();
    console.log(name, phone, email, msg);
    console.log(offer);

    try {
      let res = await fetch("/api/sendFormIntresetedThisOneOffer", {
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
        sendButton.current.innerHTML = "Wysłano!";
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
    <div className="z-30 md:w-[800px] w-full h-[500px] bg-[url('/bg-form.png')] bg-[length:400px_auto] md:bg-cover overflow-hidden rounded-xl flex md:justify-end relative mx-auto">
      <form
        onSubmit={handleSendingForm}
        className="flex flex-col md:w-[500px] h-full items-center justify-evenly bg-white p-[20px]"
      >
        <p className="text-[20px]">Jakich informacji odnośnie nieruchomości potrzebujesz?</p>
        <input
          onChange={handleChangingValue}
          name="name"
          className="w-full h-[35px] border border-gray-600 rounded-[4px] pl-[10px]"
          placeholder="Imię i naziwsko"
          required
        ></input>
        <input
          onChange={handleChangingValue}
          name="phone"
          className="w-full h-[35px]  border border-gray-600 rounded-[4px] pl-[10px]"
          placeholder="Numer kontaktowy"
          required
        ></input>
        <input
          onChange={handleChangingValue}
          name="email"
          className="w-full h-[35px]  border border-gray-600 rounded-[4px] pl-[10px]"
          placeholder="Adres email"
          required
        ></input>
        <textarea
          onChange={handleChangingValue}
          name="msg"
          className="w-full h-[100px] border border-gray-600 rounded-[4px] p-[10px]"
          placeholder="Twoja wiadomość"
        ></textarea>
        <div className="w-full  h-auto text-[12px] flex">
          <input
            type="checkbox"
            className="border border-gray-60 w-[20px] h-[20px] cursor-pointer"
            required
          ></input>
          <p className="flex-1 ml-[5px]">
            Potwierdzam, że zapoznałem się i akceptuję regulamin i politykę prywatności (wymagane)
          </p>
        </div>
        <div className="w-full  h-auto text-[12px] flex">
          <input
            type="checkbox"
            className=" border-gray-60 w-[20px] h-[20px] cursor-pointer"
            required
          ></input>
          <p className="flex-1 ml-[5px]">
            Wrażam zgodę na otrzymywanie ofert w postaci mailowego newslettera.
          </p>
        </div>
        <button className="bg-green-500 place-content-center grid w-[180px] h-[40px] text-[20px] rounded-md text-white">
          <p ref={sendButton}>Wyślij</p>
        </button>
      </form>
    </div>
  );
}
