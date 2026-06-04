import React from "react";
import Image from "next/image";
import Link from "next/link";
import LogoType from "../public/logotype_full_new.png";
import MenuData from "../data/menu.json";
import { HomeRedHatDisplayFont as Red_Hat_DisplayFont } from "../fonts/homeFonts";
import { FaFacebookSquare } from "@react-icons/all-files/fa/FaFacebookSquare";

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

export default function Footer() {
  return (
    <footer
      className={`${Red_Hat_DisplayFont.className} border-t border-[#e5dac7] bg-[#f7f3ec] text-[#182334]`}
    >
      <div className="mx-auto grid w-11/12 max-w-7xl gap-10 py-12 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:py-16">
        <div>
          <Link
            href="/"
            aria-label="Onesta Group - strona główna"
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
            Pomagamy w bezpiecznym wyborze i zakupie nieruchomości za granicą:
            od pierwszej selekcji rynku po formalności i przygotowanie do
            użytkowania.
          </p>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
              Social media
            </p>
            <Link
              href="https://www.facebook.com/profile.php?id=100071864003899"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Onesta Group na Facebooku"
              className="mt-3 inline-flex h-11 w-11 items-center justify-center border border-[#d7c8ad] bg-white text-[#182334] transition hover:border-[#182334] hover:text-[#9b7a36]"
            >
              <FaFacebookSquare className="h-6 w-6" />
            </Link>
          </div>
        </div>

        <nav aria-label="Menu w stopce">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
            Menu
          </p>
          <div className="mt-5 grid gap-3">
            {menuItems.map((item) => (
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
            Kontakt
          </p>
          <div className="mt-5 space-y-4">
            {contactItems.map((item) => (
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
          <p>Onesta Group Sp. z o.o. Wszystkie prawa zastrzeżone.</p>
          <Link
            href="/polityka-prywatnosci"
            className="transition hover:text-[#d6b36a]"
          >
            Polityka prywatności
          </Link>
        </div>
      </div>
    </footer>
  );
}
