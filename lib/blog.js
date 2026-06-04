function getBlogDir() {
  const path = require("path");
  return path.join(process.cwd(), "content", "blog");
}

function normalizePost(slug, data, content = "") {
  return {
    slug,
    title: data.title || slug,
    metaTitle: data.metaTitle || data.title || slug,
    description: data.description || "",
    date: data.date || "2025-06-13",
    updatedAt: data.updatedAt || data.date || "2025-06-13",
    image: data.image || "/onesta_og_img.png",
    category: data.category || "Nieruchomosci za granica",
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    status: data.status || "published",
    order: Number(data.order || 999),
    content,
  };
}

function toPreview(post) {
  const { content, ...preview } = post;
  return preview;
}

export function getBlogSlugs() {
  const fs = require("fs");
  const path = require("path");
  const blogDir = getBlogDir();

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.basename(file, ".mdx"));
}

export function getBlogPost(slug) {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");
  const fullPath = path.join(getBlogDir(), `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);

  return normalizePost(slug, data, content);
}

export function getAllBlogPosts() {
  return getBlogSlugs()
    .map((slug) => getBlogPost(slug))
    .filter((post) => post && post.status === "published")
    .sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map(toPreview);
}

export function getRelatedBlogPosts(slug, limit = 3) {
  const currentPost = getBlogPost(slug);

  if (!currentPost) {
    return [];
  }

  return getAllBlogPosts()
    .filter((post) => post.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === currentPost.category ? 1 : 0;
      const bScore = b.category === currentPost.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}
