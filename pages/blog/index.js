import React from "react";
import Header from "../../components/Header";
import BlogItems from "../../components/BlogItems";
import MiniMainViewBlog from "../../components/MiniMainViewBlog";
import SeoHead from "@/components/SeoHead";
import { siteConfig } from "@/lib/siteConfig";

export default function Blog({ posts }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Baza wiedzy Onesta Group",
    description:
      "Poradniki o zakupie nieruchomosci w Hiszpanii, Chorwacji i Portugalii.",
    url: `${siteConfig.url}/blog`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logotype_full.png`,
    },
  };

  return (
    <div>
      <SeoHead
        title="Baza wiedzy - nieruchomosci za granica | Onesta Group"
        description="Praktyczne artykuly o zakupie nieruchomosci w Hiszpanii, Chorwacji i Portugalii. Proces zakupu, regiony, koszty i inwestowanie."
        canonical="/blog"
        image="/bg_blog_main.png"
        keywords={[
          "nieruchomosci Hiszpania",
          "apartamenty Hiszpania",
          "nieruchomosci Chorwacja",
          "nieruchomosci Portugalia",
        ]}
        jsonLd={jsonLd}
      />
      <div className="main-index">
        <div className="w-full h-16 fixed top-0 bg-white z-20 shadow-xl">
          <Header />
        </div>
      </div>
      <MiniMainViewBlog />
      <BlogItems posts={posts} />
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
