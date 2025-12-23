import {
  DM_Serif_Text,
  Tenor_Sans,
  Work_Sans,
  Quicksand,
  Dancing_Script,
  Great_Vibes,
  Tinos,
  Red_Hat_Display,
  Bonheur_Royale,
  Moon_Dance,
  Montserrat,
  Poppins,
  Gwendolyn,
} from "next/font/google";

export const DMSerif = DM_Serif_Text({ subsets: ["latin-ext"], weight: "400" });
export const GwendolynSans = Gwendolyn({
  subsets: ["latin-ext"],
  weight: ["400", "700"],
});
export const MontserratSans = Montserrat({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});
export const PoppinsSans = Poppins({ subsets: ["latin-ext"], weight: "400" });
export const TenorsSans = Tenor_Sans({
  subsets: ["latin-ext"],
  weight: ["400"],
});
export const Dancing = Dancing_Script({
  subsets: ["latin-ext"],
  weight: "400",
});
export const GreatVibes = Great_Vibes({
  subsets: ["latin-ext"],
  weight: "400",
});
export const TinosFont = Tinos({
  subsets: ["latin-ext"],
  weight: ["400", "700"],
});
export const MoonDance = Moon_Dance({ subsets: ["latin-ext"], weight: "400" });
export const BonheurRoyaleFont = Bonheur_Royale({
  subsets: ["latin-ext"],
  weight: "400",
});
export const Red_Hat_DisplayFont = Red_Hat_Display({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600"],
});
export const QuicksandSans = Quicksand({
  subsets: ["latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});
export const WorkSans = Work_Sans({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
