import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { IoCheckmarkDone } from "react-icons/io5";
import { useRouter } from "next/router";

export default function Newsletter() {
  const router = useRouter();

  const name = useRef();
  const email = useRef();
  const phone = useRef();
  const newsletter = useRef();
  const newsletterMiniButton = useRef();
  const newsletterConfirmation = useRef();

  const [newsletterWasClosed, setNewsletterWasClosed] = useState(false);

  const handleForm = (e) => {
    const nameData = e.target.name;

    if (nameData === "name") {
      name.current.value = e.target.value;
    }

    if (nameData === "email") {
      email.current.value = e.target.value;
    }
  };

  const newNewsletter = async (e) => {
    e.preventDefault();

    let results = await fetch("/api/newNewsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.current.value,
        email: email.current.value,
      }),
    });

    const resultStatus = await results.json();

    if (resultStatus.status === 200) {
      newsletterConfirmation.current.style.display = "flex";
    } else {
    }
  };

  console.log(newsletterWasClosed);

  const hideNewsletter = () => {
    newsletter.current.style.visibility = "hidden";
    newsletterConfirmation.current.style.display = "none";
    newsletterMiniButton.current.style.display = "flex";
    setNewsletterWasClosed(true);
  };

  const showNewsletter = () => {
    newsletter.current.style.visibility = "visible";
    newsletterMiniButton.current.style.display = "none";
  };

  const closeNewsletterConfirmation = () => {
    newsletter.current.style.visibility = "hidden";
  };

  useEffect(() => {
    // if (!router.asPath.includes("/blog")) {
    setTimeout(() => {
      if (newsletterMiniButton.current.style.display === "") {
        newsletter.current.style.visibility = "visible";
      }
      if (newsletterMiniButton.current.style.display === "flex") {
        newsletter.current.style.visibility = "hidden";
      } else {
        newsletter.current.style.visibility = "visible";
      }
    }, 20000);
    // } else {
    //   const options = { passive: true }; // options must match add/remove event
    //   const scroll = (event) => {
    //     const { pageYOffset, scrollY } = window;
    //     console.log("yOffset", pageYOffset, "scrollY", scrollY);
    //     // setNewsletterWasClosed(true);
    //     if (scrollY > 400 && newsletterWasClosed === false) {
    //       newsletter.current.style.visibility = "visible";
    //     }
    //   };
    //   window.addEventListener("scroll", scroll, options);
    //   // remove event on unmount to prevent a memory leak
    //   () => window.removeEventListener("scroll", scroll, options);
    // }
  }, []);

  return (
    <>
      <div
        ref={newsletterMiniButton}
        onClick={showNewsletter}
        className="hover:bg-red-600 duration-150 cursor-pointer hidden rounded-r-xl items-center justify-center fixed lg:h-[250px] h-[30px] lg:w-[40px] w-[160px] bottom-0 left-0 lg:top-[150px] top-[55px] bg-green-600 z-50"
      >
        <p className="lg:rotate-90 whitespace-nowrap w-[300px] h-[30px] text-[20px] pl-[10px] md:pl-auto text-white font-[500]">
          Newsletter
        </p>
      </div>
      <div
        ref={newsletter}
        className="rounded-md mx-[5px] md:mx-auto invisible lg:w-[600px] lg:h-[380px] bg-white border-red-500 lg:top-[120px] top-[95px] left-0 right-0 z-[60] fixed shadow-2xl overflow-hidden"
      >
        <div
          ref={newsletterConfirmation}
          className="hidden aboslute w-full h-full bg-green-700 z-30 flex-col justify-center items-center"
        >
          <IoCheckmarkDone className="w-[80px] h-[80px] text-white" />
          <p className="text-white text-[30px]">Udało się!</p>
          <div
            onClick={hideNewsletter}
            className="bg-white px-[15px] py-[8px] mt-[15px] rounded-[6px] font-semibold cursor-pointer"
          >
            Zamknij komunikat
          </div>
        </div>
        <p className="px-[3px] pt-[12px] text-center lg:px-[10px] lg:pt-[20px] text-[18px] md:leading-6 leading-5">
          <p className="font-bold text-[24px] mb-[5px]">Witamy Cię serdecznie!</p>Zapraszamy Cię do
          zapisu na nasz <span className="font-bold md:text-[20px] text-[12px]">newsletter</span> i
          otrzymuj informacje o <span className="font-bold text-[20px]">nowościach</span> lub
          artykułach dot. zakupu nieruchomości, inwestowania w nieruchomoci oraz ciekawych miejsc w
          ciepłych krajach.
        </p>
        <form className=" flex flex-col px-[5px] md:px-[100px] py-[20px]" onSubmit={newNewsletter}>
          <div className="flex flex-col mb-[20px] text-[17px]">
            {/* <label className='pb-1 font-[700]'>Imię i nazwisko (wymagane)</label> */}
            <input
              ref={name}
              name="name"
              onChange={handleForm}
              className="h-[40px] rounded-md border border-gray-700 pl-3 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Twoje imię"
              required
            ></input>
          </div>
          <div className="flex flex-col mb-[20px] text-[17px]">
            {/* <label className='pb-1 font-[700]'>Adres email (wymagane)</label> */}
            <input
              ref={email}
              name="email"
              onChange={handleForm}
              className="h-[40px] rounded-md border border-gray-600 pl-3 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Twój adres e-mail"
              required
            ></input>
          </div>
          {/* <div className="flex flex-col mb-[20px] text-[19px]">
            <input
              ref={phone}
              name="phone"
              onChange={handleForm}
              className="h-[40px] rounded-md border-2 border-gray-600 pl-3 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Numer telefonu (opcjonalnie)"
            ></input>
          </div> */}
          <div className="flex mb-[20px] text-[19px]">
            <input
              type="checkbox"
              className="cursor-pointer h-[20px] w-[20px] rounded-md border-2 border-gray-600 pl-3 placeholder:text-gray-600 placeholder:font-semibold"
              required
              placeholder="Numer telefonu (opcjonalnie)"
            ></input>
            <p className="leading-5 pl-1 text-[14px] font-[500]">
              Akceptuję regulamin i politykę prywatności (wymagane)
            </p>
          </div>
          <div className="flex justify-between">
            <button className="border-[2px] border-green-600 duration-150 md:w-[68%] w-[49%] h-[35px] bg-green-600 rounded-md text-[22px] font-[700] text-white hover:bg-white hover:text-black">
              Zapisuję się
            </button>
            <div
              onClick={hideNewsletter}
              className="cursor-pointer text-center border-[1px] border-black duration-150 md:w-[30%] w-[49%] h-[35px] bg-white rounded-md text-[18px] font-[300] text-black hover:bg-white hover:text-black leading-[35px]"
            >
              Może później
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
