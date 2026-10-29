import type { GetStaticPaths, GetStaticProps } from "next";
import FormOneLayout from "@/components/formOne/FormOneLayout";
import { FormOneCategory, categoryPath } from "@/components/formOne/FormOneContent";
import { GROUPS, OFFERS, REGIONS, type FormOneOffer } from "@/data/formOne";

type Props = { regionSlug: string; groupSlug: string; offers: FormOneOffer[] };

export default function FormOneCategoryPage({ regionSlug, groupSlug, offers }: Props) {
  const region = REGIONS.find((r) => r.slug === regionSlug)!;
  const group = GROUPS.find((g) => g.slug === groupSlug)!;
  return (
    <FormOneLayout
      title={`${region.name} · ${group.label} | Onesta`}
      description={`TOP 5 nieruchomości ${region.name} w kategorii ${group.label}. Zapytaj o dostępność i umów rozmowę po polsku.`}
      canonicalPath={categoryPath(region, group)}
      region={region}
      group={group}
    >
      <FormOneCategory region={region} group={group} offers={offers} />
    </FormOneLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: REGIONS.flatMap((r) => GROUPS.map((g) => ({ params: { region: r.slug, budget: g.slug } }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => ({
  props: {
    regionSlug: String(params!.region),
    groupSlug: String(params!.budget),
    offers: OFFERS.filter((p) => p.region === params!.region && p.budget === params!.budget),
  },
});
