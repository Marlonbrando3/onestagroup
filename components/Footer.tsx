import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoType from "../public/logotype_full_new.png";
import MenuData from "../data/menu.json";
import { HomeRedHatDisplayFont as Red_Hat_DisplayFont } from "../fonts/homeFonts";
import { FaFacebookSquare } from "@react-icons/all-files/fa/FaFacebookSquare";
import { localePath, SiteLocale } from "@/lib/i18n";

const menuItems = MenuData.menu.map((label, index) => {
  const rawHref = MenuData.links[index] || "/";
  const normalizedHref =
    rawHref === "hiszpania?page=1"
      ? "nieruchomosci/hiszpania?page=1"
      : rawHref;
  const href = normalizedHref.startsWith("/")
    ? normalizedHref
    : `/${normalizedHref}`;

  return {
    label,
    href,
  };
});

const contactItems = [
  {
    label: "Telefon",
    value: "+48 576 65 25 25",
    href: "tel:+48576652525",
  },
  {
    label: "Email",
    value: "biuro@onesta.com.pl",
    href: "mailto:biuro@onesta.com.pl",
  },
  {
    label: "Adres",
    value: "53-148 Wrocław, ul. Wolbromska 18/1b",
  },
];

export default function Footer({ locale = "pl" }: { locale?: SiteLocale }) {
  const isEn = locale === "en";
  const localizedContactItems = contactItems.map((item) => ({
    ...item,
    label:
      isEn && item.label === "Telefon"
        ? "Phone"
        : isEn && item.label === "Adres"
          ? "Address"
          : item.label,
  }));
  const localizedMenuItems = isEn
    ? [
      { label: "Home", href: "/en" },
        { label: "About us", href: "/en/about-us" },
        { label: "Properties in Spain", href: "/en/properties/hiszpania" },
        { label: "Properties in Cyprus", href: "/en/properties/cypr" },
      ]
    : [...menuItems, { label: "Newsletter", href: "/newsletter" }];

  return (
    <footer
      className={`${Red_Hat_DisplayFont.className} border-t border-[#e5dac7] bg-[#f7f3ec] text-[#182334]`}
    >
      <div className="mx-auto grid w-11/12 max-w-7xl gap-10 py-12 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:py-16">
        <div>
          <Link
            href={localePath[locale].home}
            aria-label={
              isEn ? "Onesta Group - homepage" : "Onesta Group - strona główna"
            }
            className="relative block h-[58px] w-[190px]"
          >
            <Image
              src={LogoType}
              alt="Onesta Group"
              fill
              sizes="190px"
              className="object-contain object-left"
            />
          </Link>

          <p className="mt-6 max-w-md text-sm leading-7 text-[#5f6b7a]">
            {isEn
              ? "We help clients choose and buy overseas property safely: from market selection to formalities and preparing the property for use."
              : "Pomagamy w bezpiecznym wyborze i zakupie nieruchomości za granicą: od pierwszej selekcji rynku po formalności i przygotowanie do użytkowania."}
          </p>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
              Social media
            </p>
            <Link
              href="https://www.facebook.com/profile.php?id=100071864003899"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isEn ? "Onesta Group on Facebook" : "Onesta Group na Facebooku"}
              className="mt-3 inline-flex h-11 w-11 items-center justify-center border border-[#d7c8ad] bg-white text-[#182334] transition hover:border-[#182334] hover:text-[#9b7a36]"
            >
              <FaFacebookSquare className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <nav aria-label={isEn ? "Footer menu" : "Menu w stopce"}>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
            {isEn ? "Menu" : "Menu"}
          </p>
          <div className="mt-5 grid gap-3">
            {localizedMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-[#e5dac7] pb-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#334155] transition hover:text-[#9b7a36]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
            {isEn ? "Contact" : "Kontakt"}
          </p>
          <div className="mt-5 space-y-4">
            {localizedContactItems.map((item) => (
              <div key={item.label} className="border-b border-[#e5dac7] pb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c8796]">
                  {item.label}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-1 block text-sm font-semibold text-[#182334] transition hover:text-[#9b7a36]"
                  >
                    {item.value}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm font-semibold text-[#182334]">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[#e5dac7] bg-[#182334] text-white">
        <div className="mx-auto flex w-11/12 max-w-7xl flex-col gap-3 py-4 text-[11px] uppercase tracking-[0.14em] text-white/75 md:flex-row md:items-center md:justify-between">
          <p>
            {isEn
              ? "Onesta Group Sp. z o.o. All rights reserved."
              : "Onesta Group Sp. z o.o. Wszystkie prawa zastrzeżone."}
          </p>
          <Link
            href={localePath[locale].privacy}
            className="transition hover:text-[#d6b36a]"
          >
            {isEn ? "Privacy policy" : "Polityka prywatności"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
