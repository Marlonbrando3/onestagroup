import React from "react";
import Header from "@/components/Header";

export default function index() {
  return (
    <>
      <Header />
      <main className="pt-[74px] xl:pt-[82px]">
        <iframe
          src="/nieruchomosci-w-hiszpanii-poradnik.pdf"
          width="100%"
          height="800px"
          style={{ border: "none" }}
        >
          Twoja przeglądarka nie obsługuje osadzania PDF.
        </iframe>
      </main>
    </>
  );
}
