import Link from "next/link";
import Image from "next/image";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/newsletter";
import ContactFormBlogPost from "@/components/ContactFormBlogPost";
import SeoHead from "@/components/SeoHead";
import { siteConfig } from "@/lib/siteConfig";

export default function BlogPost({ post, mdxSource, relatedPosts }) {
  const canonical = `/blog/${post.slug}`;
  const articleUrl = `${siteConfig.url}${canonical}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${siteConfig.url}${post.image}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: imageUrl,
      datePublished: post.date,
      dateModified: post.updatedAt,
      mainEntityOfPage: articleUrl,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logotype_full.png`,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Strona glowna",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: articleUrl,
        },
      ],
    },
  ];

  return (
    <>
      <Newsletter />
      <SeoHead
        title={`${post.title} | Onesta Group`}
        description={post.description}
        canonical={canonical}
        image={post.image}
        type="article"
        publishedTime={post.date}
        modifiedTime={post.updatedAt}
        keywords={post.keywords}
        jsonLd={jsonLd}
      />

      <div className="main-index">
        <div className="w-full h-16 fixed top-0 z-20 bg-white shadow-xl">
          <Header />
        </div>
      </div>

      <main className="bg-white">
        <header className="pt-28">
          <div className="mx-auto w-11/12 max-w-6xl">
            <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-orange-600">
                Strona glowna
              </Link>
              <span className="px-2">/</span>
              <Link href="/blog" className="hover:text-orange-600">
                Blog
              </Link>
              <span className="px-2">/</span>
              <span className="text-gray-900">{post.title}</span>
            </nav>

            <div className="mt-8 grid items-end gap-8 lg:grid-cols-[1fr_420px]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                  {post.category}
                </p>
                <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-gray-950 lg:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                  {post.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500">
                  <time dateTime={post.date}>
                    Publikacja:{" "}
                    {new Intl.DateTimeFormat("pl-PL").format(
                      new Date(post.date),
                    )}
                  </time>
                  <span>
                    Aktualizacja:{" "}
                    {new Intl.DateTimeFormat("pl-PL").format(
                      new Date(post.updatedAt),
                    )}
                  </span>
                </div>
              </div>

              <div className="relative h-72 overflow-hidden rounded-lg bg-gray-100 lg:h-80">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto mt-12 grid w-11/12 max-w-6xl gap-10 lg:grid-cols-[minmax(0,720px)_320px]">
          <article className="blog-article">
            <MDXRemote {...mdxSource} components={{ Link, Image }} />
          </article>

          <aside className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-lg font-semibold text-gray-950">
                Porozmawiaj o zakupie
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Jesli chcesz porownac regiony albo sprawdzic konkretne oferty,
                zostaw kontakt. Wrocimy z uporzadkowanymi kolejnymi krokami.
              </p>
            </div>
            <ContactFormBlogPost />
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <section className="mx-auto mt-16 w-11/12 max-w-6xl pb-20">
            <h2 className="text-2xl font-bold text-gray-950">
              Powiazane artykuly
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="rounded-lg border border-gray-200 p-5 transition hover:border-orange-400 hover:shadow-md"
                >
                  <p className="text-sm text-orange-600">
                    {relatedPost.category}
                  </p>
                  <h3 className="mt-2 font-semibold leading-snug text-gray-950">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                    {relatedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const { getBlogSlugs } = await import("@/lib/blog");

  return {
    paths: getBlogSlugs().map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { getBlogPost, getRelatedBlogPosts } = await import("@/lib/blog");
  const post = getBlogPost(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const mdxSource = await serialize(post.content, {
    parseFrontmatter: false,
  });

  return {
    props: {
      post: { ...post, content: "" },
      mdxSource,
      relatedPosts: getRelatedBlogPosts(post.slug),
    },
  };
}
