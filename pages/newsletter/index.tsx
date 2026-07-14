import Head from "next/head";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsletterSignupForm from "@/components/NewsletterSignupForm";
import { HomePlayfairSans as PlayfairSans, HomeWorkSans as WorkSans } from "@/fonts/homeFonts";

export default function NewsletterPage() {
  return (
    <>
      <Head>
        <title>Newsletter o nieruchomościach za granicą | Onesta Group</title>
        <meta
          name="description"
          content="Zapisz się do newslettera Onesta o zakupie nieruchomości za granicą, formalnościach, rynkach i bezpiecznym procesie zakupu."
        />
        <link rel="canonical" href="https://onesta.com.pl/newsletter" />
      </Head>
      <main className={`${WorkSans.className} min-h-screen bg-[#f7f3ec] text-[#182334]`}>
        <Header />
        <section className="px-4 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="lg:pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#9b7a36]">Newsletter Onesta</p>
              <h1 className={`${PlayfairSans.className} mt-5 text-4xl font-semibold leading-tight md:text-6xl`}>
                Wiedza, która pomaga kupować spokojniej.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f6b7a]">
                Konkretne materiały o procesie zakupu, dokumentach, kosztach i wybranych rynkach
                nieruchomości za granicą. Bez przypadkowych ofert i bez spamu.
              </p>
              <ul className="mt-8 grid gap-3 text-sm font-semibold text-[#334155]">
                <li className="border-l-2 border-[#d8b66a] pl-4">Proces zakupu i formalności</li>
                <li className="border-l-2 border-[#d8b66a] pl-4">Analizy Hiszpanii, Cypru i innych rynków</li>
                <li className="border-l-2 border-[#d8b66a] pl-4">Możliwość wypisania w każdej chwili</li>
              </ul>
            </div>
            <NewsletterSignupForm />
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
