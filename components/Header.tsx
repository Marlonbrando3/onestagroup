import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
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

export default function Header() {
  const router = useRouter();

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
    e.current.style.backgroundColor = "#B91C1C";
    e.current.style.color = "white";
  };

  const handleHoverLeave = (e: any) => {
    e.current.style.backgroundColor = "white";
    e.current.style.color = "black";
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

  console.log(router.asPath);

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
      headerDesktop.current.style.background = "white";
      headerDesktop.current.style.boxShadow = "1px 1px 5px -3px black";
      headerDesktop.current.style.color = "black";
    } else if (scrollY < 70 && innerWidth >= 1024 && !router.asPath?.includes("blog")) {
      headerDesktop.current.style.background = "linear-gradient( black 0%, transparent 100%)";
      headerDesktop.current.style.boxShadow = "0px 0px 0px 0px black";
      headerDesktop.current.style.color = "white";
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
      <div className="transition-all duration-700 w-full h-[70px] lg:h-[85px] top-0 left-0 text-gray-900 z-40 fixed">
        <div
          ref={headerDesktop}
          className={`flex lg:flex-col justify-between flex-1 h-full w-full ${
            !router.asPath?.includes("blog")
              ? "lg:bg-gradient-to-b lg:from-gray-900/[0.7]  lg:via-gray-900/[0.7] lg:via-50% lg:to-white/[0] lg:to-100% lg:text-white bg-gradient-to-b from-white to-white text-black"
              : "bg-gradient-to-b from-white  via-white lg:via-50% lg:to-white lg:to-100% to-white text-black"
          }`}
        >
          {/* header only on large */}
          <div className="w-full bg-white hidden lg:block">
            <div
              id="header"
              className="hidden w-[980px] lg:h-[30px] md:flex justify-end items-center mx-auto"
            >
              <a
                href="tel:+48576652525"
                className="text-black hover:text-white hover:bg-yellow-500 rounded-2xl my-[3px]"
              >
                <div className="lg:mt-0 x-1 font-bold text-xs border-red-600 lg:px-2 rounded-md md:flex items-center cursor-pointer md:w-40 w-[30px] h-[30px] lg:static absolute top-2 right-10 ">
                  <CiPhone className="lg:w-6 lg:h-4 lg:p-[1px] p-2 w-[30px] h-[30px] p-auto" />
                  <p className="hidden md:block ml-1 font-[700]">+48 576 65 25 25</p>
                </div>
              </a>
              <a
                href="maito:biuro@onesta.com.pl"
                className="hover:bg-yellow-500 duration-200 rounded-2xl  text-black hover:text-white"
              >
                <div className="mt-[12px] lg:mt-0 font-bold text-xs border-red-600 lg:px-2 rounded-md md:flex items-center cursor-pointer md:w-auto w-[30px] h-[30px] lg:static absolute top-2 right-10 hover:text-white ">
                  <IoMailOutline className="lg:w-6 lg:h-4 lg:p-[1px] p-2 w-[30px] h-[30px] p-auto" />
                  <p className="hidden md:block ml-1 font-[700]">biuro@onesta.com.pl</p>
                </div>
              </a>
              <div className="lg:static absolute top-14 hidden lg:flex">
                <a href="https://www.facebook.com/profile.php?id=100071864003899">
                  <FaFacebookSquare className="iconscosialheader text-blue-500" />
                </a>
                <FaInstagram className="iconscosialheader text-red-400" />
                <FaLinkedin className="iconscosialheader text-slate-800" />
                <FaYoutube className="iconscosialheader text-red-500" />
                <FaSpotify className="iconscosialheader text-green-500" />
              </div>
              {/* <Link href="/account/login" className="px-2  border rounded-md border-green-700 mr-2 cursor-pointer duration-300 hover:bg-green-700 hover:text-white " >Zaloguj</Link>
              <Link href="/account/signup" className="border bg-green-700 border-green-700 px-2 rounded-md text-white cursor-pointer duration-300 hover:bg-white hover:text-black">Utwórz konto</Link> */}
            </div>
          </div>
          <div className="flex mx-auto h-full lg:w-[980px] w-full justify-between items-center px-[10px] lg:px-0">
            <Link
              onClick={handleBackToMainPage}
              className="cursor-pointer flex items-center h-full"
              href="/"
            >
              <div className="md:h-full lg:h-full md:w-[170px] h-[50px] w-[150px] relative bg-white rounded-b-[5px]">
                <Image
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
              className="absolute w-full lg:static lg:h-[32px] h-[300px] lg:w-auto lg:justify-end flex items-center z-50 top-[69px] -right-[100vw] bg-white lg:bg-transparent duration-200 justify-center md:shadow-none shadow-xl"
            >
              <ul className="flex flex-col lg:flex-row justify-center h-full lg:h-[24px] lg:items-center">
                <li className="list">
                  <Link onClick={handleBackToMainPage} href="/">
                    Strona główna
                  </Link>
                </li>
                <li className="list">
                  <Link href="/aboutus">O Nas</Link>
                </li>
                <li
                  className="list"
                  onMouseEnter={handleShowListMenuNieruchomosci}
                  onMouseLeave={handleHideListMenuNieruchomosci}
                >
                  Oferty
                  <div
                    className="hidden absolute -ml-2 bg-white flex-col items-center rounded-2xl border -mt-[6px]"
                    ref={MouseOnProperties}
                  >
                    <Link
                      onClick={handleClearData}
                      href={{ pathname: "/[country]", query: { country: "hiszpania", page: 1 } }}
                      className="p-1 text-black rounded-2xl w-full text-center"
                      ref={MouseOnSpain}
                      data-name="MouseOnSpain"
                      onMouseEnter={() => handleHover(MouseOnSpain)}
                      onMouseLeave={() => handleHoverLeave(MouseOnSpain)}
                    >
                      Nieruchomości w Hiszpanii
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
                      className="p-1 text-black rounded-2xl w-full text-center"
                      ref={MouseOnDominican}
                      data-name="MouseOnDominican"
                      onMouseEnter={() => handleHover(MouseOnDominican)}
                      onMouseLeave={() => handleHoverLeave(MouseOnDominican)}
                    >
                      Nieruchomości na Dominikanie
                    </Link>
                  </div>
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
                <li className="list">
                  <Link onClick={handleBackToMainPage} href="/blog">
                    Blog
                  </Link>
                </li>
                <li className="list">
                  <Link href="/abc">Wiedza</Link>
                </li>
                <li
                  onClick={handleShowingConsultationPopUp}
                  className="list bg-orange-400 rounded-3xl text-white"
                >
                  <p>bezpłatna konsultacja</p>
                </li>
                <li className="list">
                  <Link href="#contact" scroll={false}>
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
            <div className="h-[40px] w-[40px] flex justify-center items-center lg:hidden">
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
