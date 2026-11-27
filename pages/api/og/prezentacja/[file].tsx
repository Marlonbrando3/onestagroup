import type { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { supabaseServer } from "@/lib/supabaseClient";
import { resolvePublicOfferListToken } from "@/lib/publicOfferListToken";
import { imageUrls } from "@/lib/presentationOffer";
import { presentationAgent, presentationPreviewTexts } from "@/lib/presentationPreview";
import type { AgentOffer } from "@/lib/agentOffers";

// Obrazek podglądu linku prezentacji (og:image), 1200×630: kolaż 3 zdjęć z ofert + tytuł i liczba ofert.
// Adres: /api/og/prezentacja/<token>.jpg – WhatsApp/Messenger pobierają go przy wklejeniu linku.
const WIDTH = 1200;
const HEIGHT = 630;
const GAP = 6;
const AVATAR = 118;

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;

function originFrom(req: NextApiRequest) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "onesta.com.pl");
  const proto = String(req.headers["x-forwarded-proto"] || (host.startsWith("localhost") ? "http" : "https")).split(",")[0];
  return `${proto}://${host}`;
}

async function loadFont(origin: string, name: string) {
  try {
    const file = await readFile(path.join(process.cwd(), "public", "fonts", "pdf", name));
    return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
  } catch {
    const response = await fetch(`${origin}/fonts/pdf/${name}`);
    if (!response.ok) throw new Error(`Font ${name}: ${response.status}`);
    return response.arrayBuffer();
  }
}

async function fetchWithTimeout(url: string, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal, headers: { "User-Agent": "OnestaPreview/1.0" } });
  } finally {
    clearTimeout(timer);
  }
}

// Zdjęcie z feedu jako bufor (pobierane równolegle, z limitem czasu – WhatsApp nie czeka długo).
async function download(url: string) {
  try {
    const response = await fetchWithTimeout(url, 4000);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch {
    return null;
  }
}

// → JPEG o zadanym rozmiarze jako data URI (satori nie czyta WebP, a feedy bywają różne).
async function toDataUri(input: Buffer, width: number, height: number) {
  try {
    const output = await sharp(input).rotate().resize(width, height, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
    return `data:image/jpeg;base64,${output.toString("base64")}`;
  } catch {
    return null;
  }
}

async function collagePhotos(offers: AgentOffer[]) {
  const candidates = offers.map((offer) => imageUrls(offer.images)[0]).filter(Boolean).slice(0, 6);
  const bigW = Math.round(WIDTH * 0.62);
  const sideW = WIDTH - bigW - GAP;
  const sideH = (HEIGHT - GAP) / 2;
  const sizes: Array<[number, number]> = [
    [bigW, HEIGHT],
    [sideW, Math.ceil(sideH)],
    [sideW, Math.ceil(sideH)],
  ];
  const buffers = await Promise.all(candidates.map(download));
  const photos: string[] = [];
  for (const buffer of buffers) {
    if (!buffer || photos.length >= 3) continue;
    const [w, h] = sizes[photos.length];
    const data = await toDataUri(buffer, w, h);
    if (data) photos.push(data);
  }
  return { photos, bigW, sideW, sideH };
}

// Zdjęcie agenta z public/ → kwadrat (kadr od góry, twarz) jako data URI.
async function agentAvatar(origin: string, photoPath: string) {
  let input: Buffer | null = null;
  try {
    input = await readFile(path.join(process.cwd(), "public", photoPath));
  } catch {
    input = await download(`${origin}/${photoPath}`);
  }
  if (!input) return null;
  try {
    const output = await sharp(input).resize(AVATAR * 2, AVATAR * 2, { fit: "cover", position: "top" }).jpeg({ quality: 85 }).toBuffer();
    return `data:image/jpeg;base64,${output.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!supabaseServer) {
    res.status(503).end();
    return;
  }
  const requested = String(req.query.file || "").replace(/\.(jpe?g|png)$/i, "");
  const token = await resolvePublicOfferListToken(requested);
  if (!token) {
    res.status(404).end();
    return;
  }

  const { data } = await supabaseServer
    .from("agent_offer_lists")
    .select("offers,is_template,public_title,client_salutation,client_name,agent_email,agent_name,contact_name")
    .eq("public_token", token)
    .maybeSingle();
  if (!data || !Array.isArray(data.offers)) {
    res.status(404).end();
    return;
  }

  const offers = data.offers as AgentOffer[];
  const texts = presentationPreviewTexts({
    offers,
    isTemplate: Boolean((data as any).is_template),
    publicTitle: (data as any).public_title,
    clientSalutation: (data as any).client_salutation,
    clientName: (data as any).client_name,
  });

  const origin = originFrom(req);
  if (!fontCache) {
    const [regular, bold] = await Promise.all([loadFont(origin, "NotoSans-Regular.ttf"), loadFont(origin, "NotoSans-Bold.ttf")]);
    fontCache = { regular, bold };
  }
  const agent = presentationAgent({
    agentEmail: (data as any).agent_email,
    agentName: (data as any).agent_name,
    contactName: (data as any).contact_name,
  });
  const [{ photos, bigW, sideW, sideH }, avatar] = await Promise.all([
    collagePhotos(offers),
    agent.photo ? agentAvatar(origin, agent.photo) : Promise.resolve(null),
  ]);

  const headlineSize = texts.headline.length > 30 ? 48 : 56;

  const image = new ImageResponse(
    (
      <div style={{ width: WIDTH, height: HEIGHT, display: "flex", position: "relative", background: "#10213a", fontFamily: "Noto Sans" }}>
        {photos.length === 1 ? (
          <img src={photos[0]} width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, objectFit: "cover" }} />
        ) : null}
        {photos.length === 2 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, display: "flex", gap: GAP }}>
            <img src={photos[0]} width={bigW} height={HEIGHT} style={{ width: bigW, height: HEIGHT, objectFit: "cover" }} />
            <img src={photos[1]} width={sideW} height={HEIGHT} style={{ width: sideW, height: HEIGHT, objectFit: "cover" }} />
          </div>
        ) : null}
        {photos.length >= 3 ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, display: "flex", gap: GAP }}>
            <img src={photos[0]} width={bigW} height={HEIGHT} style={{ width: bigW, height: HEIGHT, objectFit: "cover" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <img src={photos[1]} width={sideW} height={sideH} style={{ width: sideW, height: sideH, objectFit: "cover" }} />
              <img src={photos[2]} width={sideW} height={sideH} style={{ width: sideW, height: sideH, objectFit: "cover" }} />
            </div>
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 360,
            display: "flex",
            backgroundImage: "linear-gradient(180deg, rgba(10,22,42,0) 0%, rgba(10,22,42,0.78) 45%, rgba(10,22,42,0.94) 100%)",
          }}
        />

        <div style={{ position: "absolute", left: 56, right: 56, bottom: 48, display: "flex", alignItems: "center" }}>
          {avatar ? (
            <img
              src={avatar}
              width={AVATAR}
              height={AVATAR}
              style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR, border: "4px solid #e0bd7a", marginRight: 30, objectFit: "cover", flexShrink: 0 }}
            />
          ) : agent.name ? (
            <div
              style={{
                width: AVATAR,
                height: AVATAR,
                borderRadius: AVATAR,
                border: "4px solid #e0bd7a",
                marginRight: 30,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#10213a",
                color: "#e0bd7a",
                fontSize: 44,
                fontWeight: 700,
              }}
            >
              {agent.initials}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "#e0bd7a" }}>
            {agent.name ? `${agent.name.toUpperCase()} · ONESTA GROUP` : "ONESTA GROUP · PREZENTACJA OFERT"}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: headlineSize, fontWeight: 700, lineHeight: 1.08, color: "#ffffff", letterSpacing: -1 }}>
            {texts.headline}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 18, fontSize: 28, color: "#dfe6f0" }}>
            <div style={{ display: "flex", padding: "6px 16px", borderRadius: 999, background: "#e0bd7a", color: "#10213a", fontWeight: 700, marginRight: 18 }}>
              {texts.count}
            </div>
            {texts.places}
          </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Noto Sans", data: fontCache.regular, weight: 400, style: "normal" },
        { name: "Noto Sans", data: fontCache.bold, weight: 700, style: "normal" },
      ],
    },
  );

  const png = Buffer.from(await image.arrayBuffer());
  const jpeg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.setHeader("X-Robots-Tag", "noindex");
  res.status(200).send(jpeg);
}
