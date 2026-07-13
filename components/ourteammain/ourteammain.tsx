import React from "react";
import Person from "./person";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import Team from "../../data/team.json";

type OurTeamMainProps = {
  embedded?: boolean;
  locale?: "pl" | "en";
};

export default function Ourteammain({
  embedded = false,
  locale = "pl",
}: OurTeamMainProps) {
  const data = Team.map((i) => <Person key={i.id} data={i} locale={locale} />);

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} ${
        embedded
          ? "w-full max-w-none mx-0 my-[60px]"
          : "w-[95vw] max-w-[1800px] mx-auto my-[90px]"
      }`}
    >
      <div className="w-full mb-9">
        <p className="text-center text-[38px] md:text-[34px] font-[500] tracking-[0.4px]">
          {locale === "en"
            ? "We are here to support you"
            : "Jesteśmy do Twojej dyspozycji"}
        </p>
      </div>

      <div className="flex flex-wrap items-stretch justify-center -mx-3">
        {data}
      </div>
    </div>
  );
}
