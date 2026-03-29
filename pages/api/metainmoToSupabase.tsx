import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { XMLParser } from "fast-xml-parser";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const response = await fetch(process.env.METAINMO_XML_URL!);

    if (!response.ok) {
      return res.status(500).json({ error: "Nie udało się pobrać XML" });
    }

    const xmlData = await response.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(xmlData);

    let properties = parsed.root.property;

    if (!Array.isArray(properties)) {
      properties = [properties];
    }

    // 🔹 mapowanie XML → struktura do Supabase
    const mapped = properties.map((property: any) => ({
      source: "METAINMO",
      external_id: `MTI-${property.id}`,
      complex_id: property.complex_id ?? null,

      price: Number(property.price),
      currency: property.currency,
      price_freq: property.price_freq,

      part_ownership: Boolean(property.part_ownership),
      leasehold: Boolean(property.leasehold),
      new_build: Boolean(property.new_build),

      type: property.type,
      town: property.town,
      province: property.province,
      country: property.country,
      ref: property.ref,

      surface_built: property.surface_area?.built ?? null,
      surface_plot: property.surface_area?.plot ?? null,

      latitude: property.location?.latitude ?? null,
      longitude: property.location?.longitude ?? null,

      beds: property.beds,
      baths: property.baths,
      pool: Boolean(property.pool),

      urls: property.url ?? {},
      descriptions: property.desc ?? {},
      features: property.features?.feature ?? [],
      images: property.images?.image ?? [],

      date: property.date,
      updated_at: new Date(),
    }));

    // 🔹 USUWANIE DUPLIKATÓW KOMPLEKSÓW (zostaje najtańsze)
    const uniqueByComplex = Object.values(
      mapped.reduce((acc: any, property: any) => {
        const complex = property.complex_id;

        // brak kompleksu → traktuj jako osobne ogłoszenie
        if (!complex) {
          acc[property.external_id] = property;
          return acc;
        }

        // pierwszy rekord kompleksu
        if (!acc[complex]) {
          acc[complex] = property;
          return acc;
        }

        // zostaw najtańsze
        if (property.price < acc[complex].price) {
          acc[complex] = property;
        }

        return acc;
      }, {}),
    );

    console.log(uniqueByComplex.length);

    // 🔹 kasowanie starych rekordów
    await supabase.from("properties").delete().eq("source", "METAINMO");

    const chunkSize = 300;

    // 🔹 wysyłka do Supabase
    for (let i = 0; i < uniqueByComplex.length; i += chunkSize) {
      const chunk = uniqueByComplex.slice(i, i + chunkSize);

      const { error } = await supabase
        .from("properties")
        .upsert(chunk, { onConflict: "external_id" });

      if (error) {
        console.error(error);
        return res.status(500).json({ error });
      }
    }

    return res.status(200).json({
      message: "Export do Supabase zakończony",
      total_xml: mapped.length,
      total_after_dedupe: uniqueByComplex.length,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Błąd serwera" });
  }
}
