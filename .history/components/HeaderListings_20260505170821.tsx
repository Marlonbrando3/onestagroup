import { useState, useEffect } from "react";
import { MontserratSans } from "../fonts/fonts";
import Image from "next/image";
import Link from "next/link";
import Logotype from "../public/logotype_full_new.png";
import { HiOutlineMenu, HiOutlineMenuAlt3 } from "react-icons/hi";

type data = {
  handleConsultationPopUp: any;
  handleShowOffersPopup?: any;
};

export default function Header({
  handleConsultationPopUp,
  handleShowOffersPopup,
}: data) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 SCROLL DETECTION
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackToMainPage = () => {
    window.localStorage.clear();
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      {/* HEADER */}
      <div
        className={`${MontserratSans.className}
        fixed top-0 left-0 w-full z-50
        transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-white text-black shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-[60px] lg:h-[80px]"
            : "bg-transparent text-white shadow-none h-[80px] lg:h-[100px]"
        }`}
      >
        <div className="flex justify-between items-center h-full w-full px-[4%] lg:px-[5%] gap-3 shadow-md lg:shadow-none">
          {/* LOGO */}
          <Link
            href="/"
            onClick={handleBackToMainPage}
            className="flex items-center h-full"
          >
            <div
              className={`relative transition-all duration-300 bg-white -mt-[20px] rounded-b-xl w-[200px]
              ${
                scrolled
                  ? "h-[50px] w-[120px] lg:h-[60px] lg:w-[160px]"
                  : "h-[60px] w-[140px] lg:h-[80px] lg:w-[200px]"
              }`}
            >
              <Image
                src={Logotype}
                fill
                alt="logo"
                className="object-contain transition-all duration-300 px-[15px] mt-[9px]"
              />
            </div>
          </Link>
          {/* MOBILE TOP 10 BUTTON */}
          {handleShowOffersPopup && (
            <div className="flex-1 border">
              <button
                onClick={handleShowOffersPopup}
                className="lg:hidden px-3 py-2 bg-yellow-500 text-white float-right font-semibold rounded-md text-xs hover:bg-yellow-600 whitespace-nowrap"
              >
                Zamów top 10
              </button>
            </div>
          )}

          {/* DESKTOP MENU */}
          <ul className="hidden lg:flex items-center gap-6 font-[600]">
            <li className="flex items-center h-[40px]">
              <Link href="/nieruchomosci/hiszpania">
                Nieruchomości w Hiszpanii
              </Link>
            </li>

            <li className="flex items-center h-[40px]">
              <Link href="/aboutus">O nas</Link>
            </li>

            <li className="flex items-center h-[40px]">
              <Link href="/blog">Blog</Link>
            </li>

            <li className="flex items-center h-[40px]">
              <Link href="/pobytinwestorski">Pobyt inwestorski</Link>
            </li>

            {handleShowOffersPopup && (
              <li
                onClick={handleShowOffersPopup}
                className="flex items-center justify-center h-[40px] px-[15px] bg-yellow-500 text-white hover:bg-yellow-600 duration-100 rounded-[4px] cursor-pointer font-semibold"
              >
                Zamów top 10
              </li>
            )}

            <li
              onClick={handleConsultationPopUp}
              className="flex items-center justify-center h-[40px] px-[15px] border border-[#275278] bg-[#275278] text-white hover:bg-[#C9AC77] duration-100 rounded-[4px] cursor-pointer"
            >
              Bezpłatna konsultacja
            </li>

            <li className="flex items-center justify-center h-[40px] px-[15px] bg-[#C9AC77] text-white hover:bg-white hover:text-black border border-[#C9AC77] rounded-[4px]">
              <Link href="#contact" scroll={false}>
                Kontakt
              </Link>
            </li>
          </ul>

          {/* MOBILE BUTTON */}
          <div className="lg:hidden">
            {menuOpen ? (
              <HiOutlineMenuAlt3
                className="h-[40px] w-[40px] cursor-pointer text-black"
                onClick={toggleMenu}
              />
            ) : (
              <HiOutlineMenu
                className={`h-[40px] w-[40px] cursor-pointer ${
                  scrolled ? "lg:text-black" : "lg:text-white text-black"
                }`}
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 w-full h-full bg-white z-40
        transition-all duration-300 ease-in-out
        ${menuOpen ? "translate-x-0" : "translate-x-full"}
        lg:hidden`}
      >
        <div className="pt-[100px] flex flex-col items-center gap-6 font-[600] text-black">
          <Link href="/nieruchomosci/hiszpania" onClick={toggleMenu}>
            Nieruchomości w Hiszpanii
          </Link>

          <Link href="/aboutus" onClick={toggleMenu}>
            O nas
          </Link>

          <Link href="/blog" onClick={toggleMenu}>
            Blog
          </Link>

          <Link href="/pobytinwestorski" onClick={toggleMenu}>
            Pobyt inwestorski
          </Link>

          {handleShowOffersPopup && (
            <div
              onClick={() => {
                toggleMenu();
                handleShowOffersPopup();
              }}
              className="flex items-center justify-center h-[40px] px-[15px] bg-yellow-500 text-white rounded-[4px] font-semibold"
            >
              Zamów top 10
            </div>
          )}

          <div
            onClick={() => {
              toggleMenu();
              handleConsultationPopUp();
            }}
            className="flex items-center justify-center h-[40px] px-[15px] border border-[#275278] bg-[#275278] text-white rounded-[4px]"
          >
            Bezpłatna konsultacja
          </div>

          <Link
            href="#contact"
            scroll={false}
            onClick={toggleMenu}
            className="flex items-center justify-center h-[40px] px-[15px] bg-[#C9AC77] text-white rounded-[4px]"
          >
            Kontakt
          </Link>
        </div>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* OFFSET */}
      <div className="pt-[80px] lg:pt-[100px]" />
    </>
  );
}
