import { preservedQuery } from "@/lib/publicSeo";
export async function getServerSideProps({ query }: any) {
  return {
    redirect: {
      destination: preservedQuery(
        "/nieruchomosci/hiszpania",
        query,
        query.page === "1" ? ["page"] : [],
      ),
      permanent: true,
    },
  };
}
export default function HistoricalCatalogue() {
  return null;
}
