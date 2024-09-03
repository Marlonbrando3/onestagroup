import { DM_Serif_Text, Tenor_Sans, Work_Sans, Quicksand } from "next/font/google";

export const DMSerif = DM_Serif_Text({ subsets: ["latin-ext"], weight: "400" });
export const TenorsSans = Tenor_Sans({ subsets: ["latin-ext"], weight: "400" });
export const QuicksandSans = Quicksand({ subsets: ["latin-ext"], weight: ["300", "400", "500", "600", "700" ]});
export const WorkSans = Work_Sans({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
