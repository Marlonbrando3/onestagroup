import Head from "next/head";
import type { GetServerSideProps } from "next";
import { FaEnvelope, FaPhoneAlt, FaRegUser } from "react-icons/fa";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/SearchEngine/PropertyCard";
import { HomeMontserratSans } from "@/fonts/homeFonts";
import type { AgentOffer } from "@/lib/agentOffers";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { supabaseServer } from "@/lib/supabaseClient";

type PublicOfferListProps = {
  token: string;
  offers: AgentOffer[];
  createdAt: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export default function PublicOfferList({
  token,
  offers,
  createdAt,
  contactName,
  contactEmail,
  contactPhone,
}: PublicOfferListProps) {
  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  return (
    <>
      <Head>
        <title>Oferty wybrane dla Ciebie | Onesta Group</title>
        <meta
          name="description"
          content="Indywidualna lista nieruchomości przygotowana przez Onesta Group."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className={`${HomeMontserratSans.className} min-h-screen bg-[#f5f1ea] pb-20 pt-8 text-[#182334] md:pt-10`}>
        <section className="mx-auto w-11/12 max-w-7xl overflow-hidden rounded-[24px] bg-[#182334] px-6 py-9 text-white shadow-[0_20px_60px_rgba(24,35,52,0.16)] md:px-10 md:py-12">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d6b66f]">Onesta Group</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-[34px] font-extrabold tracking-[-0.04em] md:text-[48px]">Oferty wybrane dla Ciebie</h1>
              <p className="mt-4 max-w-[720px] text-[14px] leading-7 text-slate-300">Poniżej znajduje się indywidualna lista nieruchomości przygotowana przez agenta Onesta.</p>
            </div>
            <div className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-5 py-4">
              <strong className="text-[25px] text-[#d6b66f]">{offers.length}</strong>
              <span className="ml-2 text-[11px] uppercase tracking-[0.1em] text-slate-300">ofert</span>
              <p className="mt-1 text-[10px] text-slate-400">Lista z {formattedDate}</p>
            </div>
          </div>
        </section>

        {contactName || contactEmail || contactPhone ? (
          <section className="mx-auto mt-5 flex w-11/12 max-w-7xl flex-col justify-between gap-5 rounded-2xl border border-[#ddd3c4] bg-white px-6 py-5 shadow-sm md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f0e6d3] text-[#9b7a36]">
                <FaRegUser aria-hidden="true" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#9b7a36]">
                  Twój agent Onesta
                </p>
                <h2 className="mt-1 text-[18px] font-extrabold text-[#182334]">
                  {contactName || "Onesta Group"}
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {contactEmail ? (
                <a href={`mailto:${contactEmail}`} className="flex min-h-[43px] items-center justify-center gap-2 rounded-full border border-[#d8cbb9] px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#334155] transition hover:border-[#182334]">
                  <FaEnvelope aria-hidden="true" /> {contactEmail}
                </a>
              ) : null}
              {contactPhone ? (
                <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="flex min-h-[43px] items-center justify-center gap-2 rounded-full bg-[#d6b66f] px-5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#182334] transition hover:bg-[#182334] hover:text-white">
                  <FaPhoneAlt aria-hidden="true" /> {contactPhone}
                </a>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-8 grid w-11/12 max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer, index) => (
            <PropertyCard
              key={offer.external_id}
              property={{ ...offer, vacantFromDate: offer.available_from }}
              detailHrefOverride={`/oferty/${token}/${encodeURIComponent(String(offer.external_id))}`}
              appearance="cbtop"
              imagePriority={index === 0}
            />
          ))}
        </section>

        <p className="mx-auto mt-10 w-11/12 max-w-7xl text-center text-[11px] leading-5 text-slate-500">
          Dostępność i ceny ofert mogą ulec zmianie. Skontaktuj się z agentem
          Onesta, aby potwierdzić aktualne warunki.
        </p>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PublicOfferListProps> = async (
  context,
) => {
  context.res.setHeader(
    "Cache-Control",
    "private, no-store, max-age=0, must-revalidate",
  );

  if (!supabaseServer) return { notFound: true };

  const requestedToken = String(context.params?.token || "").trim();
  const token = await resolvePublicOfferListToken(requestedToken);
  if (!token) return { notFound: true };

  if (token !== requestedToken) {
    return {
      redirect: {
        destination: `/oferty/${encodeURIComponent(token)}`,
        permanent: false,
      },
    };
  }

  const { data, error } = await supabaseServer
    .from("agent_offer_lists")
    .select(
      "offers,created_at,agent_name,agent_email,contact_name,contact_email,contact_phone",
    )
    .eq("public_token", token)
    .maybeSingle();

  if (error || !data || !Array.isArray(data.offers)) {
    return { notFound: true };
  }

  return {
    props: {
      token,
      offers: data.offers as AgentOffer[],
      createdAt: data.created_at,
      contactName: data.contact_name || data.agent_name || "",
      contactEmail: data.contact_email || data.agent_email || "",
      contactPhone: data.contact_phone || "",
    },
  };
};
