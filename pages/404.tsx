import Head from "next/head";
import Link from "next/link";
export default function NotFound() {
  return (
    <>
      <Head>
        <title>Nie znaleziono strony | Onesta</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <main className="mx-auto max-w-3xl px-6 py-24 text-[#182334]">
        <h1 className="text-3xl font-semibold">
          Nie znaleziono strony / Page not found
        </h1>
        <p className="my-6">
          Sprawdź adres lub przejdź do aktualnych ofert. / Check the address or
          browse current listings.
        </p>
        <nav className="flex flex-col gap-4 underline">
          <Link href="/nieruchomosci/hiszpania">Nieruchomości w Hiszpanii</Link>
          <Link href="/nieruchomosci/cypr">Nieruchomości na Cyprze</Link>
          <Link href="/en/properties/hiszpania">Property in Spain</Link>
          <Link href="/en/properties/cypr">Property in Cyprus</Link>
        </nav>
      </main>
    </>
  );
}
