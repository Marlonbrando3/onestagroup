import { MontserratSans } from "@/fonts/fonts";
import Image from "next/image";

type AboutUsInspiredProps = {
  embedded?: boolean;
  locale?: "pl" | "en";
};

export default function AboutUsInspired({
  embedded = false,
  locale = "pl",
}: AboutUsInspiredProps) {
  const isEn = locale === "en";
  return (
    <section
      className={`${MontserratSans.className} ${
        embedded
          ? "w-full max-w-none mx-0 py-0"
          : "w-[95vw] max-w-[1200px] mx-auto py-10 lg:py-16"
      }`}
    >
      <div className="text-slate-700 leading-[1.7] text-[17px]">
        <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mb-6">
          {isEn ? "Our mission" : "Nasza misja"}
        </h2>
        <div className="flex flex-col lg:flex-row">
          <p className="flex-1">
            {isEn ? (
              <>
                Onesta stands for honesty and transparency. We value the
                opportunity to help clients make their plans real and connect
                property ownership with a lifestyle in warm countries. <br></br>
                We are here so that from the first visit to our website to the
                handover of keys, the process of buying property abroad is calm,
                safe and well organised. We work transparently, step by step,
                with language and formal support throughout the purchase.
              </>
            ) : (
              <>
                Onesta to uczciwość i transparentność. Nad wyraz cenimy sobie
                możliwość spełniania marzeń naszych klientów i łączenia ich
                realizacji ze stylem życia w ciepłych krajach. <br></br>Jesteśmy tu
                po to, aby od pierwszej wizyty na naszej stronie do chwili odbioru
                kluczy cały proces zakupu nieruchomości w Hiszpanii był spokojny,
                bezpieczny i uporządkowany. Pracujemy transparentnie, krok po kroku,
                z pełnym wsparciem językowym oraz formalnym.
              </>
            )}
          </p>
          <div className="relative xl:w-[300px] lg:w-[200px] w-[420px] xl:h-[220px] h-[280px]">
            <Image
              src="/team_c.png"
              fill
              className="xl:block lg:hidden block"
              alt="agent"
            />
            <Image
              src="/team.jpeg"
              fill
              className="xl:hidden lg:block hidden"
              alt="agent"
            />
          </div>
        </div>

        <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
          {isEn ? "Why us?" : "Dlaczego my?"}
        </h2>
        <p>
          {isEn
            ? "For 8 years we have worked with trusted advisors, lawyers, developers and real estate agencies, which gives our clients access to verified offers and a practical comparison of the market. We know local procedures, costs and risks, so decisions are based on specific data rather than promises. Our work is built on market knowledge, broad access to quality offers and a clear understanding of each client’s needs."
            : "Od 8 lat współpracujemy z zaufanymi doradcami, prawnikami i deweloperami or innymi biurami nieruchomości, dlatego nasi klienci dostają zweryfikowane oferty i realne porównanie rynku. Znamy lokalne procedury, koszty i ryzyka, dzięki czemu decyzje podejmujesz na podstawie konkretnych danych, a nie obietnic. Naszą współpracę opieramy na znajomości rynku oraz dostępie do szerokiego spectrum dobrych ofer. Poprzez wyraźne zrozumienie Twoich potrzeb dostarczamy rozwiązania w postaci ofert i usług mając na celu budowanie całego procesu na zaufaniu, otwartości, wiedzy."}
        </p>

        <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
          {isEn
            ? "Find out whether we can help"
            : "Przekonaj się czy możemy Ci pomóc"}
        </h2>
        <p>
          {isEn
            ? "Tell us what you are looking for: location, budget and purchase goal. Based on that, we will prepare a shortlist of offers and a clear action plan. We can also arrange a call to ask the right questions and understand exactly what kind of property you need."
            : "Napisz do nas czego szukasz: lokalizacja, budżet, cel zakupu. Na tej podstawie przygotujemy shortlistę ofert i plan działania. Zapraszamy również do rozmowy telefonicznej w której zadamy pytania pozwalające nam zrozumieć dokłądnie charakter tego czego szukasz."}
        </p>
      </div>
    </section>
  );
}
