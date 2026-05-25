import type { NextApiRequest, NextApiResponse } from "next";
import { XMLParser } from "fast-xml-parser";

export const config = {
  maxDuration: 120,
};

const SECONDARY_XML_URL =
  "https://www.propmls.com/property-export/26t676x0545/export_1.xml";

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function detectProperties(parsed: any): any[] {
  if (!parsed || typeof parsed !== "object") return [];
  if (parsed?.root?.property) return toArray(parsed.root.property);
  if (parsed?.properties?.property) return toArray(parsed.properties.property);
  if (parsed?.property) return toArray(parsed.property);

  const firstObjectKey = Object.keys(parsed).find(
    (k) => parsed[k] && typeof parsed[k] === "object",
  );
  if (!firstObjectKey) return [];

  const node = parsed[firstObjectKey];
  if (node?.property) return toArray(node.property);
  if (node?.listing) return toArray(node.listing);
  return [];
}

function looksLikeRecord(item: any): boolean {
  if (!item || typeof item !== "object") return false;
  return Boolean(
    item?.id ??
      item?.ref ??
      item?.reference ??
      item?.listing_id ??
      item?.listingId ??
      item?.price ??
      item?.type ??
      item?.town ??
      item?.city,
  );
}

function collectPotentialArrays(
  node: any,
  path = "root",
  depth = 0,
): Array<{ path: string; count: number; sampleKeys: string[] }> {
  if (!node || typeof node !== "object" || depth > 6) return [];
  const found: Array<{ path: string; count: number; sampleKeys: string[] }> =
    [];

  if (Array.isArray(node)) {
    const records = node.filter((it) => looksLikeRecord(it));
    if (records.length > 0) {
      found.push({
        path,
        count: records.length,
        sampleKeys: Object.keys(records[0] ?? {}).slice(0, 15),
      });
    }
    node.forEach((it, i) => {
      found.push(...collectPotentialArrays(it, `${path}[${i}]`, depth + 1));
    });
    return found;
  }

  for (const [key, value] of Object.entries(node as Record<string, any>)) {
    const nextPath = `${path}.${key}`;
    if (Array.isArray(value)) {
      const records = value.filter((it) => looksLikeRecord(it));
      if (records.length > 0) {
        found.push({
          path: nextPath,
          count: records.length,
          sampleKeys: Object.keys(records[0] ?? {}).slice(0, 15),
        });
      }
    }
    if (value && typeof value === "object") {
      found.push(...collectPotentialArrays(value, nextPath, depth + 1));
    }
  }

  return found;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(SECONDARY_XML_URL, {
      headers: { "cache-control": "no-cache" },
    });

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Nie udało się pobrać XML", details: response.status });
    }

    const xmlData = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      processEntities: false,
      htmlEntities: false,
    });
    const parsed = parser.parse(xmlData);

    const detected = detectProperties(parsed);
    const potential = collectPotentialArrays(parsed)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return res.status(200).json({
      mode: "secondary_xml_test",
      xml_url: SECONDARY_XML_URL,
      detected_records: detected.length,
      detected_sample_keys:
        detected.length && typeof detected[0] === "object"
          ? Object.keys(detected[0]).slice(0, 20)
          : [],
      potential_paths: potential,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Secondary XML test error",
      details: err?.message ?? String(err),
    });
  }
}

