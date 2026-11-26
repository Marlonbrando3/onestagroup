import type { GetServerSideProps } from "next";
import { resolveLmTrackedLink } from "@/lib/leadManager/tracking";

// Krótki link z SMS-a powitalnego: onesta.com.pl/r/<token> → /cbtop#lm=<token>
export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  const token = String(params?.token || "");
  const destination = token ? await resolveLmTrackedLink(token).catch(() => null) : null;
  return { redirect: { destination: destination || "https://onesta.com.pl/cbtop", permanent: false } };
};

export default function TrackedLinkRedirect() {
  return null;
}
