import React from "react";
import Link from "next/link";
import Image from "next/image";
import BlogTopics from "../data/BlogTopics.json";

export default function BlogItems({ posts = [] }) {
  return (
    <section className="w-full bg-white pb-20">
      <div className="mx-auto flex w-11/12 max-w-7xl flex-wrap justify-between gap-8">
        <div className="grid w-full gap-6 lg:w-[72%] md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link href={`/blog/${post.slug}`} aria-label={post.title}>
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <Image
                    className="object-cover transition duration-300 group-hover:scale-105"
                    src={post.image}
                    fill
                    sizes="(min-width: 1024px) 36vw, (min-width: 768px) 50vw, 100vw"
                    alt={post.title}
                    priority={post.order <= 2}
                  />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm text-gray-500">
                    <span>{post.category}</span>
                    <time dateTime={post.date}>
                      {new Intl.DateTimeFormat("pl-PL").format(
                        new Date(post.date)
                      )}
                    </time>
                  </div>
                  <h2 className="text-xl font-semibold leading-tight text-gray-950">
                    {post.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-base leading-7 text-gray-600">
                    {post.description}
                  </p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold uppercase tracking-wide text-orange-600">
                    Przeczytaj artykul
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <aside className="hidden h-fit w-[23%] rounded-lg border border-gray-200 bg-gray-50 p-5 lg:block">
          <div className="font-bold text-lg">Tematyka</div>
          <div className="mt-4 space-y-2">
            {BlogTopics.map((i) => (
              <div
                key={i.temat}
                className="border-b border-gray-200 py-2 text-sm text-gray-700"
              >
                {i.temat}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
