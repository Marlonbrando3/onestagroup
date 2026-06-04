import React from "react";
import Link from "next/link";
import Image from "next/image";
import BlogTopics from "../data/BlogTopics.json";
import {
  HomePlayfairSans as PlayfairSans,
  HomeWorkSans as WorkSans,
} from "../fonts/homeFonts";

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const FEATURED_BLOG_SLUG = "nieruchomosci-w-hiszpanii-jak-wyglada-proces";

function formatDate(date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return dateFormatter.format(parsed);
}

function ArticleCard({ post, priority = false }) {
  return (
    <article className="group overflow-hidden border border-[#e5dac7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/blog/${post.slug}`} aria-label={post.title}>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#e8ddca]">
          <Image
            className="object-cover transition duration-500 group-hover:scale-105"
            src={post.image || "/onesta_og_img.png"}
            fill
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 92vw"
            alt={post.title}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/40 via-transparent to-transparent opacity-80" />
          <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
            {post.category}
          </span>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.14em] text-[#7c8796]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>Poradnik</span>
          </div>
          <h2
            className={`${PlayfairSans.className} mt-4 text-2xl font-semibold leading-tight text-[#182334]`}
          >
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#5f6b7a]">
            {post.description}
          </p>
          <span className="mt-6 inline-flex items-center text-xs font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
            Przeczytaj artykuł
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function BlogItems({ posts = [] }) {
  const featuredPost =
    posts.find((post) => post.slug === FEATURED_BLOG_SLUG) || posts[0];
  const regularPosts = posts.filter((post) => post.slug !== featuredPost?.slug);
  const categories = Array.from(
    new Set(posts.map((post) => post.category).filter(Boolean)),
  );
  const topics = BlogTopics.map((topic) =>
    topic.temat.replace("Nieruchomści", "Nieruchomości"),
  );

  return (
    <section className={`${WorkSans.className} bg-white py-16 md:py-20`}>
      <div className="mx-auto grid w-11/12 max-w-7xl gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#e5dac7] pb-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#9b7a36]">
                Artykuły
              </p>
              <h2
                className={`${PlayfairSans.className} mt-3 text-4xl font-semibold leading-tight text-[#182334] md:text-5xl`}
              >
                Artykuły, które porządkują proces zakupu.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#5f6b7a]">
              Zbieramy wiedzę z realnych procesów zakupowych: lokalizacje,
              formalności, koszty, ryzyka i pytania, które warto zadać
              wcześniej.
            </p>
          </div>

          {featuredPost && (
            <article className="mb-8 grid overflow-hidden border border-[#e5dac7] bg-[#f7f3ec] shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="relative min-h-[320px] overflow-hidden bg-[#e8ddca]"
                aria-label={featuredPost.title}
              >
                <Image
                  className="object-cover transition duration-500 hover:scale-105"
                  src={featuredPost.image || "/onesta_og_img.png"}
                  fill
                  sizes="(min-width: 1024px) 42vw, 92vw"
                  alt={featuredPost.title}
                  priority
                />
              </Link>
              <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#9b7a36]">
                  <span>Wyróżniony artykuł</span>
                  <span className="h-px w-10 bg-[#d7c8ad]" />
                  <time dateTime={featuredPost.date}>
                    {formatDate(featuredPost.date)}
                  </time>
                </div>
                <h2
                  className={`${PlayfairSans.className} mt-5 text-4xl font-semibold leading-tight text-[#182334]`}
                >
                  {featuredPost.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-[#5f6b7a]">
                  {featuredPost.description}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="mt-8 inline-flex w-fit items-center bg-[#182334] px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#b8954c]"
                >
                  Przejdź do artykułu
                </Link>
              </div>
            </article>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {regularPosts.map((post, index) => (
              <ArticleCard key={post.slug} post={post} priority={index < 2} />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-[108px] lg:h-fit">
          <div className="border border-[#e5dac7] bg-[#f7f3ec] p-6">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Tematyka
            </p>
            <div className="mt-5 space-y-2">
              {topics.map((topic) => (
                <div
                  key={topic}
                  className="border-b border-[#e0d4bf] py-3 text-sm font-medium text-[#334155]"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border border-[#182334] bg-[#182334] p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#d6b36a]">
              Kategorie
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="border border-white/15 bg-white/[0.08] px-3 py-2 text-xs uppercase tracking-[0.14em] text-white/80"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 border border-[#e5dac7] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9b7a36]">
              Masz konkretny cel?
            </p>
            <p className="mt-4 text-sm leading-7 text-[#5f6b7a]">
              Jeśli artykuł otworzył ważne pytanie o zakup, porozmawiajmy o
              Twoim budżecie, kraju i realnych scenariuszach.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex w-full justify-center border border-[#182334] px-5 py-4 text-xs font-bold uppercase tracking-[0.16em] text-[#182334] transition hover:bg-[#182334] hover:text-white"
            >
              Skontaktuj się
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
