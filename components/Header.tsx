import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { HomeMontserratSans as MontserratSans } from "../fonts/homeFonts";
import Logotype from "../public/logotype_full_new.png";

type HeaderProps = {
  handleConsultationPopUp?: () => void;
  handleShowOffersPopup?: () => void;
  loadLoader?: () => void;
};

const ConsultationPopup = dynamic(
  () => import("./consulatation/consultation"),
  { ssr: false },
);

const offerItems = [
  { label: "Nieruchomości Hiszpania", href: "/nieruchomosci/hiszpania" },
  { label: "Nieruchomości Cypr", href: "/nieruchomosci/cypr" },
];

const navItems = [
  { label: "O nas", href: "/aboutus" },
  { label: "Blog", href: "/blog" },
  { label: "Pobyt inwestorski", href: "/pobytinwestorski" },
];

export default function Header({
  handleConsultationPopUp,
  handleShowOffersPopup,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleLocalConsultation = () => setConsultationOpen((open) => !open);

  const handleBackToMainPage = () => {
    window.localStorage.clear();
    closeMenu();
  };

  const handleConsultationClick = () => {
    closeMenu();
    if (handleConsultationPopUp) {
      handleConsultationPopUp();
      return;
    }
    toggleLocalConsultation();
  };

  const handleOffersClick = () => {
    closeMenu();
    handleShowOffersPopup?.();
  };

  return (
    <>
      {consultationOpen && (
        <ConsultationPopup
          handleConsultationPopUp={toggleLocalConsultation}
          ConsultationsShowed={consultationOpen}
        />
      )}
      <header
        className={`${MontserratSans.className} fixed left-0 top-0 z-40 w-full border-b border-[#e8ddca]/80 bg-[#fbf8f2]/95 text-[#182334] shadow-[0_10px_30px_rgba(24,35,52,0.08)] backdrop-blur-xl`}
      >
        <div className="mx-auto flex h-[74px] w-11/12 max-w-7xl items-center justify-between gap-5 xl:h-[82px]">
          <Link
            href="/"
            onClick={handleBackToMainPage}
            aria-label="Onesta Group - strona główna"
            className="relative block h-[50px] w-[154px] shrink-0 xl:h-[56px] xl:w-[180px]"
          >
            <Image
              src={Logotype}
              alt="Onesta Group"
              fill
              sizes="180px"
              className="object-contain"
            />
          </Link>

          <nav className="hidden items-center justify-end gap-1 xl:flex">
            <div className="group relative py-2">
              <button
                type="button"
                className="whitespace-nowrap rounded-full border border-[#d7c8ad] bg-white/70 px-4 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#9b7a36] transition hover:border-[#b8954c] hover:bg-white"
              >
                Oferty
              </button>
              <div className="pointer-events-none absolute left-0 top-full z-50 min-w-[310px] border border-[#e5dac7] bg-white p-2 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                {offerItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block whitespace-nowrap px-3 py-3 text-[13px] font-bold uppercase tracking-[0.08em] text-[#334155] transition hover:bg-[#fbf8f2] hover:text-[#9b7a36]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="whitespace-nowrap rounded-full px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#334155] transition hover:bg-white hover:text-[#9b7a36]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            {handleShowOffersPopup && (
              <button
                type="button"
                onClick={handleOffersClick}
                className="h-11 whitespace-nowrap rounded-full border border-[#d7c8ad] bg-white px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b7a36] transition hover:border-[#b8954c] hover:bg-[#fffaf0]"
              >
                TOP 10 ofert
              </button>
            )}
            <button
              type="button"
              onClick={handleConsultationClick}
              className="h-11 whitespace-nowrap rounded-full border border-[#b8954c] bg-[#182334] px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_26px_rgba(24,35,52,0.18)] transition hover:border-[#182334] hover:bg-[#b8954c]"
            >
              Umów konsultację
            </button>
            <Link
              href="#contact"
              scroll={false}
              className="flex h-11 items-center whitespace-nowrap rounded-full border border-[#d7c8ad] bg-white px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#182334] transition hover:border-[#182334]"
            >
              Kontakt
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d7c8ad] bg-white text-[#182334] shadow-sm xl:hidden"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[2px] w-5 rounded-full bg-current transition ${
                  menuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-[2px] w-5 rounded-full bg-current transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-[2px] w-5 rounded-full bg-current transition ${
                  menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div
          className={`xl:hidden ${
            menuOpen
              ? "pointer-events-auto max-h-[580px] opacity-100"
              : "pointer-events-none max-h-0 opacity-0"
          } overflow-hidden border-t border-[#e8ddca] bg-[#fbf8f2] shadow-[0_18px_32px_rgba(24,35,52,0.12)] transition-all duration-300`}
        >
          <nav className="mx-auto flex w-11/12 max-w-7xl flex-col py-4">
            <div className="border-b border-[#e8ddca] py-4">
              <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#9b7a36]">
                Oferty
              </p>
              <div className="grid gap-2">
                {offerItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#27364a]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.href === "/" ? handleBackToMainPage : closeMenu}
                className="border-b border-[#e8ddca] py-4 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#27364a]"
              >
                {item.label}
              </Link>
            ))}

            <div className="grid gap-3 pt-4 sm:grid-cols-2">
              {handleShowOffersPopup && (
                <button
                  type="button"
                  onClick={handleOffersClick}
                  className="h-12 rounded-full border border-[#d7c8ad] bg-white px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b7a36]"
                >
                  TOP 10 ofert
                </button>
              )}
              <button
                type="button"
                onClick={handleConsultationClick}
                className="h-12 rounded-full bg-[#182334] px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_26px_rgba(24,35,52,0.16)]"
              >
                Umów konsultację
              </button>
              <Link
                href="#contact"
                scroll={false}
                onClick={closeMenu}
                className="flex h-12 items-center justify-center rounded-full border border-[#d7c8ad] bg-white px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-[#182334]"
              >
                Kontakt
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
