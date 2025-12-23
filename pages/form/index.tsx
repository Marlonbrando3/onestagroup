import Image from "next/image";
import React, { useState, useRef } from "react";
import Head from "next/head";
import { Dancing, TenorsSans, GreatVibes } from "../../fonts/fonts";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();

  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [exclusive, setExclusite] = useState("");
  const [price, setPrice] = useState("");

  //personal details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");

  const emptyFieldPopUp: any = useRef();

  const handlingDataChanges = (e: any) => {
    e.target.style.color = "black";
    const name = e.target.id;

    if (name === "region") {
      setRegion(e.target.value);
    }

    if (name === "type") {
      setType(e.target.value);
    }

    if (name === "date") {
      setPurchaseDate(e.target.value);
    }
    if (name === "exclusivity") {
      setExclusite(e.target.value);
    }
    if (name === "price") {
      setPrice(e.target.value);
    }
    if (name === "fullname") {
      setName(e.target.value);
    }
    if (name === "phone") {
      setPhone(e.target.value);
    }
    if (name === "mail") {
      setEmail(e.target.value);
    }
    if (name === "country") {
      setCountry(e.target.value);
    }
  };

  const handlingMassegeSend = async (e: any) => {
    e.preventDefault();

    console.log(region, type, purchaseDate, price, exclusive);

    if (region === "" || type === "" || purchaseDate === "" || exclusive === "" || price === "") {
      emptyFieldPopUp.current.style.display = "block";
      window.scrollTo(0, 450);
      setTimeout(() => {
        emptyFieldPopUp.current.style.display = "none";
      }, 5000);
    } else {
      try {
        let res = await fetch("/api/sendForm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region,
            type,
            date: purchaseDate,
            exclusive,
            price,
            name,
            phone,
            email,
            country,
          }),
        });

        const data = await res.status;
        console.log(data);
        if (data === 200) {
          router.push("https://onesta.com.pl/form/thankyoupageform");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const hidingPopUpWithInfo = () => {
    emptyFieldPopUp.current.style.display = "none";
  };

  return (
    <>
      <Head>
        {/* <html lang="en_US" /> */}
        <meta property="Properties in Spain" content="image" />
        <title>Properties in Spain</title>
        <meta
          name="Keywords"
          content="Nieruchomości Hiszpania, nieruchomości w Hiszpanii, apartamenty w Hiszpanii, polska agencja nieruchomości w Hiszpanii, nieruchomości Portugalia, nieruchomości w Portugali, apartamenty w Portugalii, polska agencja nieruchomości w Portugalii, nieruchomości na Dominikanie, apartamenty Dominikana, apartamenty na Dominikanie"
        />
        <meta
          name="Description"
          content="Biuro sprzedaży nieruchomości w Hiszpanii, Portugalii, Chorwacji, Dominikanie. Przeprowdzimy Cię przez cały proces zakupowy od przedstawienia ofer poprzez proces zakupowy do finalnego zarządzania najmem jeśli tak zdecydujesz."
        />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, minimum-scale=1, maximum-scale=1"
        />
        <meta property="og:image" content="https://onesta.com.pl/onesta_og_img.png" />
        {/* <meta property="og:locale" content="en_US" /> */}
      </Head>
      <div
        className={`${GreatVibes.className} bg-[url('/bg_beach.jpg')] h-auto bg-cover bg-fixed pb-[200px]`}
      >
        <div
          ref={emptyFieldPopUp}
          className={`${TenorsSans.className} hidden z-10 fixed top-[10px] bg-red-600 text-white px-[10px] left-0 right-0 mx-auto text-[24px] w-[600px] text-center cursor-pointer`}
          onClick={hidingPopUpWithInfo}
        >
          At least one of the survey fields are empty
        </div>
        <div className="h-[80px] w-full">
          <div id="logo" className="w-full h-full relative bg-white ">
            <Image
              src="/logotype_full.png"
              fill
              alt="logo"
              objectFit="contain"
              className="py-[22px]"
            ></Image>
          </div>
        </div>
        <div className="md:w-[700px] md:h-[1600px] w-[90vw] py-[20px] bg-white mx-auto flex flex-col items-center justify-center mt-[100px]">
          <p className="text-[52px] md:w-[500px] w-[90%] text-center leading-[50px]">
            Find your second home or investment opportunity in{" "}
            <span className="text-red-600 font-bold">Spain</span>
          </p>
          <p
            className={`${TenorsSans.className} text-[16px] md:w-[550px] w-[90%] text-center my-[50px]`}
          >
            Our experience, along with that of our partners, spans up to 30 years. That&lsquo;s why
            can provide offer properties from 90% of the real estate market in Spain.{" "}
            <span className="font-bold">Please answer a few question below.</span>
          </p>
          <div className="w-[300px] h-[2px] bg-yellow-600"></div>
          <div>
            <form
              onSubmit={handlingMassegeSend}
              className={`${TenorsSans.className} flex flex-col md:w-[550px] w-[90%] mt-[30px] mx-auto`}
            >
              <div className="flex flex-col h-auto py-[5px] justify-evenly mb-[30px] ">
                <p className="font-semibold text-[18px]">
                  In which region of Spain would you like to find your property?
                </p>
                <select
                  id="region"
                  className="border rounded-[6px] border-gray-400 text-[20px] py-[5px] pl-[5px] text-gray-400"
                  onChange={handlingDataChanges}
                >
                  <option selected disabled hidden>
                    choose from the list
                  </option>
                  <option value="Costa Blanca">Costa Blanca</option>
                  <option value="Costa del Sol">Costa del Sol</option>
                  <option value="Other region">Other than above regions</option>
                  <option value="Didn't decide">I didn&lsquo;t decide yet</option>
                </select>
              </div>
              <div className="flex flex-col h-auto py-[5px] justify-evenly mb-[30px] ">
                <p className="font-semibold text-[18px]">
                  What type of property will be suitable for you?
                </p>
                <select
                  id="type"
                  className="border rounded-[6px] border-gray-400 text-[20px] py-[5px] pl-[5px] text-gray-400"
                  onChange={handlingDataChanges}
                >
                  <option selected disabled hidden>
                    choose from the list
                  </option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Didn't decide">I didn&lsquo;t decide yet</option>
                </select>
              </div>
              <div className="flex flex-col h-auto py-[5px] justify-evenly mb-[30px]">
                <p className="font-semibold text-[18px]">
                  By what date would you like to complete your purchase?
                </p>
                <select
                  id="date"
                  className="border rounded-[6px] border-gray-400 text-[20px] py-[5px] pl-[5px] text-gray-400"
                  onChange={handlingDataChanges}
                >
                  <option selected disabled hidden>
                    choose from the list
                  </option>
                  <option value="This month">In this month</option>
                  <option value="By the end of the year">By the end of the year</option>
                  <option value="Didn't decide">I didn&lsquo;t decide yet</option>
                </select>
              </div>
              <div className="flex flex-col h-auto py-[5px] justify-evenly mb-[30px]">
                <p className="font-semibold text-[18px]">
                  Are you ready for exclusive cooperation if your expectations are met?
                </p>
                <select
                  id="exclusivity"
                  className="border rounded-[6px] border-gray-400 text-[20px] py-[5px] pl-[5px] text-gray-400"
                  onChange={handlingDataChanges}
                >
                  <option selected disabled hidden>
                    choose from the list
                  </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="I don't know">I don&lsquo;t know yet</option>
                </select>
              </div>
              <div className="flex flex-col h-auto py-[5px] justify-evenly mb-[30px]">
                <p className="font-semibold text-[18px]">
                  How much are you willing to spend on a property that perfectly meets your
                  expectations (euros)?
                </p>
                <input
                  id="price"
                  onChange={handlingDataChanges}
                  className="border-b border-gray-600 text-[20px] mt-[10px]"
                  placeholder="here you can write your answer"
                  required
                ></input>
              </div>
              <p className="text-[30px] text-center mt-[40px]">Contact details</p>
              <div className="flex flex-col h-[70px] justify-evenly ">
                <input
                  id="fullname"
                  className="border-b border-gray-600 text-[20px] "
                  placeholder="Full name"
                  onChange={handlingDataChanges}
                  required
                ></input>
              </div>
              <div className="flex flex-col h-[70px] justify-evenly">
                <input
                  id="phone"
                  className="border-b border-gray-600 text-[20px]"
                  placeholder="Phone number with prefix"
                  onChange={handlingDataChanges}
                  required
                ></input>
              </div>
              <div className="flex flex-col h-[70px] justify-evenly">
                <input
                  id="country"
                  className="border-b border-gray-600 text-[20px]"
                  placeholder="Your country"
                  onChange={handlingDataChanges}
                  required
                ></input>
              </div>
              <div className="flex flex-col h-[70px] justify-evenly ">
                <input
                  id="mail"
                  className="border-b border-gray-600 text-[20px] "
                  placeholder="E-mail"
                  required
                ></input>
              </div>
              <div className="flex h-[60px] mb-[30px] items-start justify-start">
                {" "}
                <input
                  type="checkbox"
                  required
                  className="md:w-[30px] md:h-[30px] h-[23px] w-[23px] md:-mt-[2px] -mt-[2px] cursor-pointer"
                ></input>
                <p className="font-semibold pl-[4px] text-[12px]">
                  I agree to be contacted by from Onesta Group and processing the information
                  submitted in order to respond to my request *
                </p>
              </div>
              <button
                type="submit"
                className="border border-white w-[200px] mx-auto bg-yellow-500 text-white text-[26px] rounded-xl mt-[20px] cursor-pointer py-[5px] hover:bg-white hover:text-black duration-150 hover:border hover:border-black"
              >
                Send form
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
