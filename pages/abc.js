import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import Link from "next/link";
import Abc from "@/data/Abc.json";
export default function ABC() {
  return (
    <>
      <SeoHead
        title="Zakup nieruchomości w Hiszpanii — pytania | Onesta"
        description="Planujesz zakup nieruchomości w Hiszpanii? Sprawdź odpowiedzi na pytania o wybór regionu, oglądanie ofert i organizację procesu zakupu."
        canonical="/abc"
      />
      <Header />
      <main className="mx-auto w-11/12 max-w-4xl pb-16 pt-28 text-[#182334]">
        <h1 className="text-3xl md:text-4xl font-semibold mb-8">
          Pytania i odpowiedzi o zakupie nieruchomości w Hiszpanii
        </h1>
        {Abc.map((obj) => (
          <section key={obj.id} className="border-b border-[#e5dac7] py-6">
            <h2 className="text-xl font-semibold mb-3">{obj.question}</h2>
            <p className="leading-7 whitespace-pre-line">{obj.answer}</p>
          </section>
        ))}
        <Link
          href="/nieruchomosci/hiszpania"
          className="inline-block mt-8 underline"
        >
          Zobacz nieruchomości w Hiszpanii
        </Link>
      </main>
      <Footer />
    </>
  );
}
