import React from "react";
import Link from "next/link";
import Header from "../../components/Header";
import BlogItems from "../../components/BlogItems";
import SeoHead from "@/components/SeoHead";
import { siteConfig } from "@/lib/siteConfig";
import {
  HomePlayfairSans as PlayfairSans,
  HomeWorkSans as WorkSans,
} from "../../fonts/homeFonts";

const FEATURED_BLOG_SLUG = "nieruchomosci-w-hiszpanii-jak-wyglada-proces";

export default function Blog({ posts }) {
  const featuredPost =
    posts?.find((post) => post.slug === FEATURED_BLOG_SLUG) || posts?.[0];
  const postCount = posts?.length || 0;
  const categoryCount = new Set((posts || []).map((post) => post.category))
    .size;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Baza wiedzy Onesta Group",
    description:
      "Poradniki o zakupie nieruchomości w Hiszpanii, Chorwacji, Portugalii i innych kierunkach inwestycyjnych.",
    url: `${siteConfig.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logotype_full.png`,
    },
  };

  return (
    <div className={`${WorkSans.className} bg-[#f7f3ec] text-[#182334]`}>
      <SeoHead
        title="Baza wiedzy - nieruchomości za granicą | Onesta Group"
        description="Praktyczne artykuły o zakupie nieruchomości w Hiszpanii, Chorwacji, Portugalii i innych krajach. Proces zakupu, regiony, koszty i inwestowanie."
        canonical="/blog"
        image="/bg_blog_main.png"
        keywords={[
          "nieruchomości Hiszpania",
          "apartamenty Hiszpania",
          "nieruchomości Chorwacja",
          "nieruchomości Portugalia",
        ]}
        jsonLd={jsonLd}
      />
      <Header />

      <main className="pt-[74px] xl:pt-[82px]">
        <section className="border-b border-[#e5dac7] bg-[#f7f3ec]">
          <div className="mx-auto grid w-11/12 max-w-7xl gap-8 py-10 lg:grid-cols-[1fr_360px] lg:items-end lg:py-14">
            <div className="max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#9b7a36]">
                Baza wiedzy Onesta Group
              </p>
              <h1
                className={`${PlayfairSans.className} mt-5 text-4xl font-semibold leading-[1.08] text-[#182334] md:text-5xl`}
              >
                Baza wiedzy o zakupie nieruchomości za granicą.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6b7a]">
                Praktyczne przewodniki, analizy regionów i odpowiedzi na pytania,
                które pomagają lepiej zrozumieć proces zakupu, koszty, ryzyka i
                różnice między rynkami.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#5f6b7a]">
                <span className="border border-[#e2d4bd] bg-white/70 px-4 py-3">
                  {postCount} artykułów
                </span>
                <span className="border border-[#e2d4bd] bg-white/70 px-4 py-3">
                  {categoryCount} kategorii
                </span>
                <span className="border border-[#e2d4bd] bg-white/70 px-4 py-3">
                  proces, regiony, koszty
                </span>
              </div>
            </div>

            {featuredPost && (
              <aside className="border border-[#e5dac7] bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b7a36]">
                  Polecany poradnik
                </p>
                <h2
                  className={`${PlayfairSans.className} mt-4 text-2xl font-semibold leading-tight text-[#182334]`}
                >
                  {featuredPost.title}
                </h2>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5f6b7a]">
                  {featuredPost.description}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="mt-5 inline-flex w-fit items-center border border-[#182334] px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#182334] transition hover:bg-[#182334] hover:text-white"
                >
                  Przeczytaj poradnik
                </Link>
              </aside>
            )}
          </div>
        </section>

        <BlogItems posts={posts} />
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const { getAllBlogPosts } = await import("@/lib/blog");

  return {
    props: {
      posts: getAllBlogPosts(),
    },
  };
}
