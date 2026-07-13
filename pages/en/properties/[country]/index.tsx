import ListingsPage, {
  getServerSideProps as getListingsServerSideProps,
} from "@/pages/nieruchomosci/[country]";
import type { GetServerSidePropsContext } from "next";

export default ListingsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = await getListingsServerSideProps(context as any);

  if ("props" in result) {
    return {
      ...result,
      props: {
        ...(await result.props),
        locale: "en",
      },
    };
  }

  return result;
}
