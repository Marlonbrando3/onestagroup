import type { NextApiRequest, NextApiResponse } from "next";
import { XMLParser } from "fast-xml-parser";
import { supabaseServer } from "@/lib/supabaseClient";

export const config = {
  maxDuration: 120,
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (!supabaseServer) {
      return res.status(500).json({
        error: "Brak SUPABASE_SERVICE_ROLE_KEY dla endpointu serwerowego",
      });
    }

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

    // 🔹 kasowanie starych rekordów w batches
    const deleteChunkSize = 200;
    let hasMore = true;

    while (hasMore) {
      const { data: toDelete, error: selectDeleteError } = await supabaseServer
        .from("properties")
        .select("id")
        .eq("source", "METAINMO")
        .range(0, deleteChunkSize - 1);

      if (selectDeleteError) {
        console.error(selectDeleteError);
        return res.status(500).json({ error: selectDeleteError });
      }

      if (!toDelete || toDelete.length === 0) {
        hasMore = false;
        break;
      }

      const ids = toDelete.map((row: any) => row.id);
      const { error: deleteError } = await supabaseServer
        .from("properties")
        .delete()
        .in("id", ids);
      if (deleteError) {
        console.error(deleteError);
        return res.status(500).json({ error: deleteError });
      }
    }

    const chunkSize = 100;

    // 🔹 wysyłka do Supabase
    for (let i = 0; i < uniqueByComplex.length; i += chunkSize) {
      const chunk = uniqueByComplex.slice(i, i + chunkSize);

      const { error } = await supabaseServer
        .from("properties")
        .upsert(chunk, { onConflict: "external_id", ignoreDuplicates: false });

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
