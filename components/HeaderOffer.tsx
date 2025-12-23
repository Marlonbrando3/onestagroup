import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Red_Hat_DisplayFont } from "../fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import Logotype from "./images/logotype.png";
import { IoMailOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
import MobileFilters from "./MobileFilters";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaSpotify } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoIosClose } from "react-icons/io";

export default function HeaderOffer() {
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
  const Consultation: any = useRef();
  const submitButton: any = useRef();

  const mobileClosedMenu = useRef<any>();
  const mobileOpenedMenu = useRef<any>();

  const menu = useRef<any>();

  const handleBackToMainPage = () => {
    window.localStorage.clear();
    // setSearchShow(false);
  };

  const handleShowingConsultationPopUp = () => {
    Consultation.current.style.display = "block";
  };

  const handleHidingConsultationPopUp = () => {
    Consultation.current.style.display = "none";
  };

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
        Consultation.current.style.display = "none";
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

  const onScroll = useCallback(() => {
    const { scrollX, scrollY, innerWidth } = window;
    // console.log("yOffset", innerWidth, "scrollY", scrollY);
    if (scrollY > 70 && innerWidth >= 1024 && !router.asPath?.includes("blog")) {
      headerDesktop.current.style.transition = "0.3s";
      logo.current.style.transition = "margin-top 0.4s ease-in-out";
      header.current.style.height = "55px";
      logo.current.style.marginTop = "10px";
      headerDesktop.current.style.background = "white";
      headerDesktop.current.style.boxShadow = "1px 1px 5px -3px black";
      // headerDesktop.current.style.color = "black";
    } else if (scrollY < 70 && innerWidth >= 1024 && !router.asPath?.includes("blog")) {
      headerDesktop.current.style.background = "transparent";
      header.current.style.height = "75px";
      logo.current.style.transition = "margin-top 0.5s ease-in-out";
      logo.current.style.marginTop = "0px";
      headerDesktop.current.style.boxShadow = "0px 0px 0px 0px black";
      // headerDesktop.current.style.color = "white";
    }
  }, []);

  useEffect(() => {
    // headerDesktop;

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  });

  return (
    <>
      <div
        ref={header}
        className={`${Red_Hat_DisplayFont.className} transition-all duration-700 w-screen h-[70px] lg:h-[85px] top-0 left-0 text-gray-900 z-40 border-gray-900 tracking-[1.4px]`}
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
          <div className="flex mx-auto h-full lg:w-[1180px] w-full lg:justify-center justify-between items-center bg-white lg:bg-transparent px-[10px] lg:px-0 duration-200">
            <Link
              onClick={handleBackToMainPage}
              className="cursor-pointer flex items-end h-full bg-white rounded-b-[8px]"
              href="/"
            >
              <div className="md:h-full lg:h-[70px] md:w-[210px] h-[50px] w-[150px] relative">
                <Image
                  ref={logo}
                  className="object-contain px-[10px] pb-[4px]"
                  src={Logotype}
                  fill
                  alt="logo"
                />
              </div>
            </Link>
            {/* menu items */}
            <div
              ref={menu}
              className="absolute w-full lg:static lg:h-[32px] h-[300px] lg:w-auto lg:justify-start flex items-center z-50 top-[69px] -right-[100vw] bg-white lg:bg-transparent duration-200 justify-center md:shadow-none shadow-xl font-[11px] flex-1 ml-[40px]"
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
                  OFERTY
                  <div
                    className="hidden absolute -ml-2 bg-white flex-col items-center rounded-md border -mt-[6px]"
                    ref={MouseOnProperties}
                  >
                    <Link
                      onClick={handleClearData}
                      href={{ pathname: "/[country]", query: { country: "hiszpania", page: 1 } }}
                      className="p-1 text-black rounded-md w-full text-center group"
                      ref={MouseOnSpain}
                      data-name="MouseOnSpain"
                      // onMouseEnter={() => handleHover(MouseOnSpain)}
                      // onMouseLeave={() => handleHoverLeave(MouseOnSpain)}
                    >
                      Nieruchomości w HISZPANII
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
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
                    {/* <Link
                      href={{ pathname: "/[country]", query: { country: "portugalia", page: 1 } }}
                      className="p-1 text-black rounded-2xl w-full text-center"
                      ref={MouseOnPortugal}
                      data-name="MouseOnPortugal"
                      onMouseEnter={() => handleHover(MouseOnPortugal)}
                      onMouseLeave={() => handleHoverLeave(MouseOnPortugal)}
                    >
                      Nieruchomości w Portugalii
                    </Link> */}
                    <Link
                      href={{ pathname: "/[country]", query: { country: "dominikana", page: 1 } }}
                      className="p-1 text-black rounded-md w-full text-center group"
                      ref={MouseOnDominican}
                      data-name="MouseOnDominican"
                      // onMouseEnter={() => handleHover(MouseOnDominican)}
                      // onMouseLeave={() => handleHoverLeave(MouseOnDominican)}
                    >
                      Nieruchomości na DOMINIKANIE
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                    </Link>
                  </div>
                </li>

                <li className="list group">
                  <Link href="/aboutus">
                    O NAS
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
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
                    BLOG
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                  </Link>
                </li>
                <li className="list group">
                  <Link href="/abc">
                    WIEDZA{" "}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                  </Link>
                </li>
                <li className="list group">
                  <Link href="/pobytinwestorski">
                    POBYT INWESTORSKI{" "}
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                  </Link>
                </li>
                <li onClick={handleShowingConsultationPopUp} className="list group">
                  <p>BEZPŁATNA KONSULTACJA</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
                </li>
                <li className="list group">
                  <Link href="#contact" scroll={false}>
                    KONTAKT
                    <span className="block max-w-0 group-hover:max-w-full transition-all duration-100 h-1 bg-yellow-500"></span>
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
          <div
            ref={Consultation}
            className="hidden absolute top-[100px] w-[350px] h-[330px] mx-auto left-0 right-0 bg-white z-50 text-white p-[20px] rounded-xl shadow-xl"
          >
            <div
              onClick={handleHidingConsultationPopUp}
              className="absolute text-black right-2 top-2 w-[20px] h-[20px] cursor-pointer"
            >
              <IoIosClose className="w-full h-full" />
            </div>
            <form
              className="flex flex-col h-[90%] justify-between"
              onSubmit={handleSendingConsultation}
            >
              <p className="text-black font-bold text-[18px]">Zamów konsultację</p>
              <p className="text-black text-[12px] font-normal italic">
                Podczas rozmowy przedstawimy Ci kroki w drodze szukania, wyboru oraz formalizacji
                zakupu nieruchomości abyś zrozumiał proces i mógł podjąć świadomą i
                satysfakcjonującą decyzję.
              </p>
              <input
                name="name"
                value={consultationName}
                onChange={handleConsultationForm}
                placeholder="Imię i nazwisko"
                className="border rounded-md border-gray-400 pl-[5px] text-black"
              ></input>
              <input
                name="phone"
                value={consultationPhone}
                onChange={handleConsultationForm}
                placeholder="Numer telefonu"
                className="border rounded-md border-gray-400 pl-[5px] text-black"
              ></input>
              <div className="w-full flex items-start">
                <input type="checkbox" required></input>
                <p className="text-black text-[10px] pl-[3px]">
                  Wyrażam zgodę na kontakt oraz akcpetuję politykę prywatności Onesta Group Sp. z
                  o.o.{" "}
                </p>
              </div>
              <button ref={submitButton} className="bg-yellow-500 rounded-md h-[30px]">
                Zamawiam kontakt
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
