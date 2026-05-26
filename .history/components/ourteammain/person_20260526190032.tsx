import React from "react";
import Image from "next/image";
import Languages from "./languages";

type Person = {
  data: any;
};

export default function Person({ data }: Person) {
  const LanguagesData = data.languages.map((i: any) => {
    if (i.includes("PL")) {
      return <Languages key={i} data={i} lang="PL" />;
    }
    if (i.includes("EN")) {
      return <Languages key={i} data={i} lang="EN" />;
    }
    if (i.includes("ES")) {
      return <Languages key={i} data={i} lang="ES" />;
    }
  });
  const email = data?.email || "biuro@onesta.com.pl";

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 px-2.5 pb-5">
      <article className="h-full border border-[#bdbdbd] rounded-[16px] p-4">
        <div className="relative w-full aspect-[4/4] rounded-[2px] overflow-hidden">
          <Image
            src={`/${data.photo}`}
            fill
            alt={data.name}
            className={`${
              (data.photo === "Marek.webp" && "scale-[110%]") ||
              (data.photo === "Przemek.webp" && "scale-[100%]") ||
              (data.photo === "Michał.webp" && "scale-[90%]")
            } transform origin-top object-cover`}
            style={{
              objectPosition:
                data.photo === "Marek.webp"
                  ? "center 30%"
                  : data.photo === "Przemek.webp"
                    ? "center 40%"
                    : data.photo === "Michał.webp"
                      ? "center 20px"
                      : data.photo === "Karolina.webp"
                        ? "center 30%"
                        : "center",
            }}
          />
        </div>

        <div className="text-center mt-5">
          <p className="text-[16px] md:text-[17px] lg:text-[18px] leading-none font-[500] tracking-[0]">
            {data.name}
          </p>
          <p className="text-[8px] md:text-[10px] lg:text-[11px] leading-tight font-[700] uppercase text-[#9a9a9a] mt-2 tracking-[1.2px]">
            {data.title}
          </p>
        </div>

        <div className="mt-6 text-center">
          {/* <p className="text-[8px] md:text-[10px] lg:text-[11px] font-[700] leading-tight">
            NUMER TELEFONU:{" "}
            <a
              href={`tel:${data.phone}`}
              className="text-[#d64c63] font-[500] break-words"
            >
              {data.phone}
            </a>
          </p> */}
          {/* <p className="text-[10px] md:text-[10px] lg:text-[11px] mt-2 font-[700] leading-tight">
            EMAIL:{" "}
            <a
              href={`mailto:${email}`}
              className="text-[#d64c63] font-[500] break-all"
            >
              {email}
            </a>
          </p> */}
        </div>

        <div className="w-[96px] h-[1px] bg-[#c9c9c9] mx-auto mt-6 mb-5" />

        <div className="flex justify-center items-center min-h-[34px]">
          {LanguagesData}
        </div>
      </article>
    </div>
  );
}
