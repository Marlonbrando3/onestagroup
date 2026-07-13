import PropertyPage, {
  getServerSideProps as getPropertyServerSideProps,
} from "@/pages/nieruchomosci/[country]/[title]";
import type { GetServerSidePropsContext } from "next";

export default PropertyPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = await getPropertyServerSideProps(context as any);

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
