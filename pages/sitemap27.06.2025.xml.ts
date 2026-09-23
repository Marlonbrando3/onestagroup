// Retire the historical, file-based sitemap in favour of the current database.
export async function getServerSideProps() {
  return { redirect: { destination: "/sitemap.xml", permanent: true } };
}
export default function HistoricalSitemap() {
  return null;
}
