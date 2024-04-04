import { useState, useRef, useCallback, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Logotype from "./images/logotype.png";
import FBIcon from "./images/facebook.png";
import IGIcon from "./images/instagram.png";
// import { UserIcon, StarIcon } from '@heroicons/react/outline'
// import Applychanges from "./SearchEngine/Applychanges";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
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

export default function Header() {
  const MouseOnZarzadzanie: any = useRef();
  const MouseOnZarzadzanieSpain: any = useRef();
  const MouseOnProperties: any = useRef();
  const MouseOnSpain: any = useRef();
  const MouseOnPortugal: any = useRef();
  const MouseOnDominican: any = useRef();
  const MouseOnCroatia: any = useRef();
  const headerDesktop: any = useRef();

  const [MobileMenu, setMobileMenu] = useState(false);

  const handleShowMobileMenu = () => {
    setMobileMenu((MobileMenu) => !MobileMenu);
  };

  const handleBackToMainPage = () => {
    window.localStorage.clear();
    // setSearchShow(false);
  };

  const handleShowListMenuZarzadzanie = () => {
    MouseOnZarzadzanie.current.style.display = "flex";
    MouseOnZarzadzanie.current.style.color = "black";
    MouseOnZarzadzanie.current.style.backgroundColor = "white";
  };

  const handleHideListMenuZarzadzanie = () => {
    MouseOnZarzadzanie.current.style.display = "none";
    MouseOnZarzadzanie.current.style.backgroundColor = "none";
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

  const onScroll = useCallback(() => {
    const { scrollX, scrollY, innerWidth } = window;
    // console.log("yOffset", innerWidth, "scrollY", scrollY);
    if (scrollY > 100 && innerWidth >= 1024) {
      headerDesktop.current.style.background = "white";
      headerDesktop.current.style.boxShadow = "1px 1px 5px -3px black";
      headerDesktop.current.style.color = "black";
    } else if (scrollY < 100 && innerWidth >= 1024) {
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
      <div className="transition-all duration-700 w-full h-[70px] md:h-[85px] top-0 text-gray-900 z-30 fixed">
        {/* Mobile Menu */}
        {/* <div className="xl:w-[1080px] w-full h-full flex mx-auto">
          <div
            className={
              MobileMenu
                ? "flex items-center z-40 justify-center duration-300 bg-white absolute h-screen left-0 top-0 w-full"
                : "hidden items-center justify-center duration-300 bg-red-400 absolute w-full -left-screen top-0"
            }
          >
            <ul className="flex flex-col items-start justify-center mr-6 z-30">
              <li>
                <Link className="text-3xl" onClick={handleBackToMainPage} href="/">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link
                  className="text-3xl"
                  href={{ pathname: "/[country]", query: { country: "hiszpania", page: 1 } }}
                >
                  Nieruchomości
                </Link>
              </li>
              <li>
                <Link className="text-3xl" href="/aboutus">
                  O Nas
                </Link>
              </li>
              <li>
                <Link className="text-3xl" href="/zarzadzanie-nieruchomosciami-w-hiszpanii">
                  Zarządzanie najmem
                </Link>
              </li>
              <li>
                <Link className="text-3xl" onClick={handleBackToMainPage} href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="text-3xl" href="/abc">
                  ABC Inwestora
                </Link>
              </li>
              <li>
                <Link className="text-3xl" href="#">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <Link
            onClick={handleBackToMainPage}
            className="cursor-pointer flex items-center"
            href="/"
          >
            <div className="md:h-full h-[32px] md:w-[150px] w-[120px] relative bg-white">
              <Image className="object-contain left" src={Logotype} fill alt="logo" />
            </div>
          </Link>
        </div> */}

        {/* Desktop Menu */}
        <div
          ref={headerDesktop}
          className="flex flex-col flex-1 h-full w-full lg:bg-gradient-to-b lg:from-gray-900/[0.7]  lg:via-gray-900/[0.7] lg:via-50% lg:to-white/[0] lg:to-100% lg:text-white bg-gradient-to-b from-white to-white text-black"
        >
          <div className="w-full bg-white">
            <div
              id="header"
              className="w-[980px] lg:h-[30px] flex justify-end items-center mx-auto"
            >
              <a href="tel:+48576652525">
                <div className="lg:mt-0 x-1 font-bold text-xs border-red-600 lg:px-2 text-white rounded-md md:flex items-center cursor-pointer md:w-40 w-[30px] h-[30px] lg:static absolute top-2 right-10 ">
                  <CiPhone className="lg:w-8 lg:h-4 lg:p-[1px] p-2 text-black w-[30px] h-[30px] p-auto" />
                  <p className="hidden md:block ml-1 text-black font-[700]">+48 576 65 25 25</p>
                </div>
              </a>
              <a href="maito:biuro@onesta.com.pl">
                <div className="mt-[12px] lg:mt-0 font-bold text-xs border-red-600 lg:px-2 text-white rounded-md md:flex items-center cursor-pointer md:w-auto w-[30px] h-[30px] lg:static absolute top-2 right-10 ">
                  <IoMailOutline className="lg:w-8 lg:h-4 lg:p-[1px] p-2 text-black w-[30px] h-[30px] p-auto" />
                  <p className="hidden md:block ml-1 text-black font-[700]">biuro@onesta.com.pl</p>
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
          <div className="flex mx-auto h-full w-[980px] justify-between">
            <Link
              onClick={handleBackToMainPage}
              className="cursor-pointer flex items-center"
              href="/"
            >
              <div className="md:h-full h-[32px] md:w-[170px] w-[120px] relative bg-white rounded-b-[5px]">
                <Image
                  className="object-contain px-[10px] pb-[4px]"
                  src={Logotype}
                  fill
                  alt="logo"
                />
              </div>
            </Link>
            <div className="h-full w-auto justify-end flex items-center z-50">
              <ul className="lg:flex hidden">
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
                    className="hidden absolute mt-2 -ml-2 bg-white flex-col"
                    ref={MouseOnProperties}
                  >
                    <Link
                      onClick={handleClearData}
                      href={{ pathname: "/[country]", query: { country: "hiszpania", page: 1 } }}
                      className="p-2 text-black"
                      ref={MouseOnSpain}
                      data-name="MouseOnSpain"
                      onMouseEnter={() => handleHover(MouseOnSpain)}
                      onMouseLeave={() => handleHoverLeave(MouseOnSpain)}
                    >
                      Nieruchomości w Hiszpanii
                    </Link>
                    <Link
                      href={{ pathname: "/[country]", query: { country: "chorwacja", page: 1 } }}
                      className="p-2 text-black"
                      ref={MouseOnCroatia}
                      data-name="MouseOnCroatia"
                      onMouseEnter={() => handleHover(MouseOnCroatia)}
                      onMouseLeave={() => handleHoverLeave(MouseOnCroatia)}
                    >
                      Nieruchomości w Chorwacji
                    </Link>
                    <Link
                      href={{ pathname: "/[country]", query: { country: "portugalia", page: 1 } }}
                      className="p-2 text-black"
                      ref={MouseOnPortugal}
                      data-name="MouseOnPortugal"
                      onMouseEnter={() => handleHover(MouseOnPortugal)}
                      onMouseLeave={() => handleHoverLeave(MouseOnPortugal)}
                    >
                      Nieruchomości w Portugalii
                    </Link>
                    <Link
                      href={{ pathname: "/[country]", query: { country: "dominikana", page: 1 } }}
                      className="p-2 text-black"
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
                <li className="list bg-yellow-500 rounded-3xl text-white">
                  <Link href="/abc">bezpłatna konsultacja</Link>
                </li>
                <li className="list">Kontakt</li>
              </ul>
              <div className="h-[40px] w-[40px] flex justify-center items-center lg:hidden">
                {MobileMenu ? (
                  <HiOutlineMenuAlt3
                    className="transition-all duration-700 cursor-pointer block z-50 h-[40px] w-[40px] lg:hidden visible"
                    onClick={handleShowMobileMenu}
                  />
                ) : (
                  <HiOutlineMenu
                    className="transition-all duration-700 cursor-pointer z-50 h-[40px] w-[40px] lg:hidden block"
                    onClick={handleShowMobileMenu}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileFilters />
    </>
  );
}
