import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Red_Hat_DisplayFont, MontserratSans } from "../fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import Logotype from "../public/logotype_full_new.png";
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import MobileFilters from "./MobileFilters";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaSpotify } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";
import Consultation from "./consulatation/consultation";

type data = {
  handleConsultationPopUp: any;
};

export default function Header({ handleConsultationPopUp }: data) {
  const router = useRouter();

  const logo: any = useRef();
  const header: any = useRef();
  const MouseOnZarzadzanie: any = useRef();
  const MouseOnZarzadzanieSpain: any = useRef();
  const MouseOnProperties: any = useRef();
  const MouseOnSpain: any = useRef();
  const MouseOnPortugal: any = useRef();
  const MouseOnDominican: any = useRef();
  const MouseOnCroatia: any = useRef();
  const headerDesktop: any = useRef();
  const Consultations: any = useRef();
  const submitButton: any = useRef();

  const mobileClosedMenu = useRef<any>();
  const mobileOpenedMenu = useRef<any>();

  const menu = useRef<any>();

  const handleBackToMainPage = () => {
    window.localStorage.clear();
    // setSearchShow(false);
  };

  // const handleShowingConsultationPopUp = () => {
  //   Consultations.current.style.display = "block";
  // };

  // const handleHidingConsultationPopUp = () => {
  //   Consultations.current.style.display = "none";
  // };

  const handlingShowingMobileMenu = () => {
    if (menu.current.style.right === "-100vw") {
      menu.current.style.right = "0px";
      mobileClosedMenu.current.style.display = "none";
      mobileOpenedMenu.current.style.display = "block";
    } else {
      menu.current.style.right = "-100vw";
      mobileClosedMenu.current.style.display = "block";
      mobileOpenedMenu.current.style.display = "none";
    }
  };

  const handleShowListMenuNieruchomosci = () => {
    MouseOnProperties.current.style.display = "flex";
    MouseOnProperties.current.style.backgroundColor = "none";
  };

  const handleHideListMenuNieruchomosci = () => {
    MouseOnProperties.current.style.display = "none";
    MouseOnProperties.current.style.backgroundColor = "none";
  };

  const handleHover = (e: any) => {
    e.current.style.textDecoration = "underline";
    // e.current.style.color = "white";
  };

  const handleHoverLeave = (e: any) => {
    e.current.style.textDecoration = "none";
    // e.current.style.color = "black";
  };

  const handleClearData = () => {
    async function cleardata() {
      await window.localStorage.clear();
    }
    cleardata();
  };

  const [consultationName, setConsultationName] = useState();
  const [consultationPhone, setConsultationPhone] = useState();

  const handleSendingConsultation = async (e: any) => {
    let query = JSON.stringify({
      name: consultationName,
      phone: consultationPhone,
    });

    e.preventDefault();
    console.log("name " + consultationName, " phone " + consultationPhone);
    let res = await fetch("api/consultation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: query,
    });

    const results = await res.json();

    console.log(results);

    if (results.status === 200) {
      submitButton.current.innerHTML = "Wysłano";
      submitButton.current.style.backgroundColor = "green";
      setTimeout(() => {
        Consultations.current.style.display = "none";
      }, 2000);
    } else {
      submitButton.current.innerHTML = "Błąd, spróbuj jeszcze raz";
      submitButton.current.style.backgroundColor = "red";
      setTimeout(() => {
        submitButton.current.innerHTML = "Zamawiam konsultacje";
        submitButton.current.style.backgroundColor = "yellow";
      }, 500);
    }
  };

  const handleConsultationForm = (e: any) => {
    if (e.target.name === "name") {
      setConsultationName(e.target.value);
    }
    if (e.target.name === "phone") {
      setConsultationPhone(e.target.value);
    }
  };

  return (
    <>
      <div
        ref={header}
        className={`${MontserratSans.className} transition-all bg-white duration-700 w-full font-[300] shadow-md h-[100px] lg:h-[90px] h-[80px] top-0 left-0 text-gray-900 z-40 fixed border-gray-900 tracking-[1.4px]`}
      >
        <div
          ref={headerDesktop}
          className={`flex lg:flex-col justify-between flex-1 h-full w-full
            ${
              !router.asPath?.includes("blog")
              // ? "lg:bg-gradient-to-b lg:from-white-900/[0.7]  lg:via-white-900/[0.7] lg:via-50% lg:to-white/[0] lg:to-100% lg:text-white bg-gradient-to-b from-white to-white text-black"
              // : "bg-gradient-to-b from-white  via-white lg:via-50% lg:to-white lg:to-100% to-white text-black"
            }
          `}
        >
          {/* <div className="h-[50px] w-screen bg-[#D7DCE0] px-[120px] flex justify-end font-[400] hidden lg:flex">
            <div className="flex items-center h-full">
              <FaPhoneAlt className="text-gray-900 my-auto mr-[5px] text-[13px] h-[13px]" />
              <Link
                href="tel:+48576652525"
                className="text-gray-900 text-[13px] h-[13px] leading-[13px]"
              >
                +48 576 65 25 25
              </Link>
            </div>
            <div className="flex items-center h-full ml-[30px]">
              <IoIosMail className="text-gray-900 my-auto mr-[5px] text-[13px] h-[13px]" />
              <Link
                href="mail:+48576652525"
                className="text-gray-900 text-[13px] h-[13px] leading-[13px]"
              >
                biuro@onesta.com.pl
              </Link>
            </div>
          </div> */}
          <div className="flex mx-auto h-[100%] lg:w-full w-full px-[3%] lg:justify-between justify-between items-center bg-white lg:bg-transparent lg:px-[1%] xl:px-[5%] duration-200 font-[300] border-red-900">
            <Link
              onClick={handleBackToMainPage}
              className="cursor-pointer flex items-end h-full"
              href="/"
            >
              <div className="md:h-full lg:h-[100%] md:w-[210px] h-[50px] w-[150px] relative flex justify-center ">
                <Image
                  ref={logo}
                  className="object-contain px-[10px]"
                  src={Logotype}
                  fill
                  alt="logo"
                />
              </div>
            </Link>
            {/* menu items */}
            <div
              ref={menu}
              className="absolute w-full lg:static lg:h-[26px] h-[400px] md:w-auto lg:justify-end flex items-center z-50 top-[80px] -right-[100vw] lg:bg-transparent duration-200 justify-start md:shadow-none shadow-xl font-[300] flex-1 ml-[40px] bg-white"
            >
              <ul className="flex flex-col lg:flex-row justify-center h-full lg:h-[24px] lg:items-center">
                {/* <li className="list group">
                  <Link onClick={handleBackToMainPage} href="/">
                    Strona główna
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                  </Link>
                </li> */}
                <li
                  className="list -mt-[3px]"
                  onMouseEnter={handleShowListMenuNieruchomosci}
                  onMouseLeave={handleHideListMenuNieruchomosci}
                >
                  Oferty
                  <div
                    className="hidden absolute bg-white flex-col items-center border border-[#C9AC77] -mt-[1px] -ml-[80px]"
                    ref={MouseOnProperties}
                  >
                    <Link
                      onClick={handleClearData}
                      href={{
                        pathname: "/nieruchomosci/hiszpania",
                      }}
                      className="p-1 text-black rounded-md w-full text-center group"
                      ref={MouseOnSpain}
                      data-name="MouseOnSpain"
                      // onMouseEnter={() => handleHover(MouseOnSpain)}
                      // onMouseLeave={() => handleHoverLeave(MouseOnSpain)}
                    >
                      Nieruchomości w Hiszpanii
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                    </Link>
                    {/* <Link
                      href={{ pathname: "/[country]", query: { country: "chorwacja", page: 1 } }}
                      className="p-1 text-black rounded-2xl w-full text-center"
                      ref={MouseOnCroatia}
                      data-name="MouseOnCroatia"
                      onMouseEnter={() => handleHover(MouseOnCroatia)}
                      onMouseLeave={() => handleHoverLeave(MouseOnCroatia)}
                    >
                      Nieruchomości w Chorwacji
                    </Link> */}
                    <Link
                      onClick={handleClearData}
                      href={{
                        pathname: "/nieruchomosci/cypr",
                      }}
                      className="p-1 text-black rounded-md w-full text-center group"
                      ref={MouseOnSpain}
                      data-name="MouseOnSpain"
                      // onMouseEnter={() => handleHover(MouseOnSpain)}
                      // onMouseLeave={() => handleHoverLeave(MouseOnSpain)}
                    >
                      Nieruchomości na Cyprze
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                    </Link>
                    <Link
                      href={{
                        pathname: "/nieruchomosci/dominikana",
                        // query: { country: "dominikana", page: 1 },
                      }}
                      className="p-1 text-black rounded-md w-full text-center group"
                      ref={MouseOnDominican}
                      data-name="MouseOnDominican"
                      // onMouseEnter={() => handleHover(MouseOnDominican)}
                      // onMouseLeave={() => handleHoverLeave(MouseOnDominican)}
                    >
                      Nieruchomości na Dominikanie
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                    </Link>
                  </div>
                </li>

                <li className="list group whitespace-nowrap">
                  <Link href="/aboutus">
                    O nas
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                  </Link>
                </li>

                {/* <li
                  className="list"
                  onMouseEnter={handleShowListMenuZarzadzanie}
                  onMouseLeave={handleHideListMenuZarzadzanie}
                >
                  Zarządzanie najmem
                  <div
                    className="hidden absolute mt-2 -ml-2 bg-white flex-col"
                    ref={MouseOnZarzadzanie}
                  >
                    <Link
                      href="/zarzadzanie-nieruchomosciami-w-hiszpanii"
                      className="p-2 text-black"
                      ref={MouseOnZarzadzanieSpain}
                      onMouseEnter={() => handleHover(MouseOnZarzadzanieSpain)}
                      onMouseLeave={() => handleHoverLeave(MouseOnZarzadzanieSpain)}
                    >
                      Zarządzanie najmem w Hiszpanii
                    </Link>
                  </div>
                </li> */}
                <li className="list group">
                  <Link onClick={handleBackToMainPage} href="/blog">
                    Blog
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                  </Link>
                </li>
                <li className="list group">
                  <Link href="/abc">
                    Wiedza{" "}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                  </Link>
                </li>
                <li className="list group">
                  <Link href="/pobytinwestorski">
                    Pobyt inwestorski{" "}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-[2px] bg-yellow-500"></span>
                  </Link>
                </li>
                <li
                  onClick={handleConsultationPopUp}
                  className="list group px-[15px] py-[8px] border border-[#275278] bg-[#275278] text-white hover:bg-[#C9AC77] hover:text-white duration-100 font-[800] rounded-[4px]"
                >
                  <p>Bezpłatna konsultacja</p>
                </li>
                <li className="list group bg-[#C9AC77] text-white px-[15px] py-[8px] hover:bg-white border border-[#C9AC77] hover:text-black duration-100 rounded-[4px] font-[500]">
                  <Link href="#contact" scroll={false}>
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
            <div className="h-[40px] w-[40px] flex md:justify-center items-center lg:hidden">
              <div ref={mobileClosedMenu}>
                <HiOutlineMenu
                  className="transition-all duration-700 cursor-pointer z-50 h-[40px] w-[40px] lg:hidden block"
                  onClick={handlingShowingMobileMenu}
                />
              </div>
              <div ref={mobileOpenedMenu} className="hidden">
                <HiOutlineMenuAlt3
                  className="transition-all duration-700 cursor-pointer z-50 h-[40px] w-[40px] lg:hidden"
                  onClick={handlingShowingMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
