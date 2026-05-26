import { MontserratSans } from "@/fonts/fonts";
import Image from "next/image";

type AboutUsInspiredProps = {
  embedded?: boolean;
};

export default function AboutUsInspired({
  embedded = false,
}: AboutUsInspiredProps) {
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
          Nasza misja
        </h2>
        <div className="flex md:flex-col lg:flex-row">
          <p className="flex-1">
            Onesta to uczciwość i transparentność. Nad wyraz cenimy sobie
            możliwość spełniania marzeń naszych klientów i łączenia ich
            realizacji ze stylem życia w ciepłych krajach. <br></br>Jesteśmy tu
            po to, aby od pierwszej wizyty na naszej stronie do chwili odbioru
            kluczy cały proces zakupu nieruchomości w Hiszpanii był spokojny,
            bezpieczny i uporządkowany. Pracujemy transparentnie, krok po kroku,
            z pełnym wsparciem językowym oraz formalnym.
          </p>
          <div className="relative w-[300px] h-[220px] lg:[300px]">
            <Image src="/team_c.png" fill className="xl:block hidden" />
            <Image src="/team.jpeg" fill className="block lg:block" />
          </div>
        </div>

        <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
          Dlaczego my?
        </h2>
        <p>
          Od 8 lat współpracujemy z zaufanymi doradcami, prawnikami i
          deweloperami or innymi biurami nieruchomości, dlatego nasi klienci
          dostają zweryfikowane oferty i realne porównanie rynku. Znamy lokalne
          procedury, koszty i ryzyka, dzięki czemu decyzje podejmujesz na
          podstawie konkretnych danych, a nie obietnic. Naszą współpracę
          opieramy na znajomości rynku oraz dostępie do szerokiego spectrum
          dobrych ofer. Poprzez wyraźne zrozumienie Twoich potrzeb dostarczamy
          rozwiązania w postaci ofert i usług mając na celu budowanie całego
          procesu na zaufaniu, otwartości, wiedzy.
        </p>

        <h2 className="text-[40px] leading-[1.1] font-[700] text-slate-800 mt-10 mb-6">
          Przekonaj się czy możemy Ci pomóc
        </h2>
        <p>
          Napisz do nas czego szukasz: lokalizacja, budżet, cel zakupu. Na tej
          podstawie przygotujemy shortlistę ofert i plan działania. Zapraszamy
          również do rozmowy telefonicznej w której zadamy pytania pozwalające
          nam zrozumieć dokłądnie charakter tego czego szukasz.
        </p>
      </div>
    </section>
  );
}
