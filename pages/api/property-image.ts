import type { NextApiRequest, NextApiResponse } from "next";
import { Readable, Transform } from "node:stream";
import { isAllowedPropertyImageUrl } from "@/lib/propertyImageSources";

export const config = {
  api: {
    responseLimit: false,
  },
  maxDuration: 30,
};

const MAX_REDIRECTS = 3;
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const UPSTREAM_TIMEOUT_MS = 15_000;

function parseAllowedUrl(value: unknown): URL | null {
  if (typeof value !== "string" || !value) return null;

  try {
    const url = new URL(value);
    return isAllowedPropertyImageUrl(url) ? url : null;
  } catch {
    return null;
  }
}

async function fetchAllowedImage(initialUrl: URL): Promise<Response> {
  let url = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(url, {
      headers: {
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
        "User-Agent": "Onesta-Property-Image-Proxy/1.0",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (response.status < 300 || response.status >= 400) return response;

    const location = response.headers.get("location");
    if (!location || redirectCount === MAX_REDIRECTS) {
      throw new Error("Too many upstream redirects");
    }

    const redirectUrl = new URL(location, url);
    if (!isAllowedPropertyImageUrl(redirectUrl)) {
      throw new Error("Redirect target is not allowed");
    }

    url = redirectUrl;
  }

  throw new Error("Unable to fetch upstream image");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Netlify's CDN must keep a separate cache entry for every upstream image.
  // Without this explicit variation, different `url` values can reuse the
  // first cached response from this shared API route.
  res.setHeader("Netlify-Vary", "query=url");

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sourceUrl = parseAllowedUrl(req.query.url);
  if (!sourceUrl) {
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(400).json({ error: "Invalid image URL" });
  }

  try {
    const upstream = await fetchAllowedImage(sourceUrl);
    if (!upstream.ok || !upstream.body) {
      return res.status(upstream.status || 502).end();
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (
      !contentType.toLowerCase().startsWith("image/") &&
      !contentType.toLowerCase().startsWith("application/octet-stream")
    ) {
      return res.status(415).json({ error: "Upstream response is not an image" });
    }

    const contentLength = Number(upstream.headers.get("content-length") || 0);
    if (contentLength > MAX_SOURCE_BYTES) {
      return res.status(413).json({ error: "Source image is too large" });
    }

    res.setHeader("Content-Type", contentType || "application/octet-stream");
    res.setHeader("Content-Disposition", 'attachment; filename="property-image"');
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    );
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (req.method === "HEAD") return res.status(200).end();

    let receivedBytes = 0;
    const sizeLimit = new Transform({
      transform(chunk, _encoding, callback) {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_SOURCE_BYTES) {
          callback(new Error("Source image is too large"));
          return;
        }
        callback(null, chunk);
      },
    });
    const body = Readable.fromWeb(upstream.body as never);
    sizeLimit.on("error", () => {
      if (!res.headersSent) res.status(502);
      res.end();
    });
    body.pipe(sizeLimit).pipe(res);
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    res.setHeader("Cache-Control", "private, no-store");
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout ? "Image source timed out" : "Unable to fetch image",
    });
  }
}
