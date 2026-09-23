import Link from "next/link";
import Head from "next/head";
import { SITE_URL } from "@/lib/publicSeo";
export type Crumb = { name: string; path: string };
export default function SeoBreadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(json).replace(/</g, "\\u003c"),
          }}
        />
      </Head>
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap gap-2 py-3 text-sm text-[#5f6b7a] ${className}`}
      >
        {items.map((item, i) => (
          <span key={item.path}>
            {i > 0 && (
              <span aria-hidden="true" className="mr-2">
                /
              </span>
            )}
            <Link
              href={item.path}
              aria-current={i === items.length - 1 ? "page" : undefined}
              className="underline underline-offset-4"
            >
              {item.name}
            </Link>
          </span>
        ))}
      </nav>
    </>
  );
}
