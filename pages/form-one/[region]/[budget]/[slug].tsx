import type { GetStaticPaths, GetStaticProps } from "next";
import FormOneLayout from "@/components/formOne/FormOneLayout";
import { FormOneProperty, categoryPath } from "@/components/formOne/FormOneContent";
import { GROUPS, OFFERS, REGIONS, type FormOneOffer } from "@/data/formOne";

type Props = { offer: FormOneOffer };

export default function FormOnePropertyPage({ offer }: Props) {
  const region = REGIONS.find((r) => r.slug === offer.region)!;
  const group = GROUPS.find((g) => g.slug === offer.budget)!;
  return (
    <FormOneLayout
      title={`${offer.title} | Onesta`}
      description={`${offer.title} — ${offer.subtitle}. ${offer.area} m², cena ${offer.price.toLocaleString("pl-PL")} €.`}
      canonicalPath={`${categoryPath(region, group)}/${offer.slug}`}
      region={region}
      group={group}
      initialOffer={offer}
    >
      <FormOneProperty p={offer} region={region} group={group} />
    </FormOneLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: OFFERS.map((p) => ({ params: { region: p.region, budget: p.budget, slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const offer = OFFERS.find(
    (p) => p.slug === params!.slug && p.region === params!.region && p.budget === params!.budget,
  );
  return offer ? { props: { offer } } : { notFound: true };
};
