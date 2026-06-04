import {
  Montserrat,
  Playfair,
  Red_Hat_Display,
  Work_Sans,
} from "next/font/google";

export const HomePlayfairSans = Playfair({
  subsets: ["latin-ext"],
  weight: "variable",
  display: "swap",
  preload: false,
});

export const HomeWorkSans = Work_Sans({
  subsets: ["latin-ext"],
  weight: "variable",
  display: "swap",
  preload: false,
});

export const HomeMontserratSans = Montserrat({
  subsets: ["latin-ext"],
  weight: "variable",
  display: "swap",
  preload: false,
});

export const HomeRedHatDisplayFont = Red_Hat_Display({
  subsets: ["latin-ext"],
  weight: "variable",
  display: "swap",
  preload: false,
});
