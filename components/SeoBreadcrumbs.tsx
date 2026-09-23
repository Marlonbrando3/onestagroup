import Link from "next/link";
import Head from "next/head";
import { IoChevronForward } from "react-icons/io5";
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
        className={`flex flex-wrap items-center gap-2 py-3 text-sm text-[#788391] ${className}`}
      >
        {items.map((item, i) => (
          <span key={item.path} className="inline-flex items-center gap-2">
            {i > 0 && (
              <IoChevronForward
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 opacity-55"
              />
            )}
            <Link
              href={item.path}
              aria-current={i === items.length - 1 ? "page" : undefined}
              className="no-underline transition-colors hover:text-[#182334]"
            >
              {item.name}
            </Link>
          </span>
        ))}
      </nav>
    </>
  );
}
