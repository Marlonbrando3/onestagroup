import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "@/lib/supabaseClient";
import { canAccessOnesari, isOnesariEnabled, rejectDisabledOnesari } from "@/lib/onesariFeature";

type EditableField =
  | "country"
  | "city"
  | "coast"
  | "developer"
  | "investmentName"
  | "area"
  | "bedrooms"
  | "bathrooms"
  | "distanceToSeaM"
  | "price"
  | "market"
  | "propertyType"
  | "features"
  | "availableFrom"
  | "title"
  | "descriptionPl"
  | "descriptionEn";

const propertySelect =
  "id,external_id,ref,source,price,currency,type,town,province,country,developer,investment_name,surface_built,beds,baths,new_build,features,images,descriptions,date,updated_at,title,distance_to_sea_m,available_from,operation,status";

function nullableText(value: unknown) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized : null;
}

function nullableNumber(value: unknown) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (!normalized) return null;
  const numericValue = Number(normalized);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function nullableInteger(value: unknown) {
  const numericValue = nullableNumber(value);
  return numericValue === null ? null : Math.trunc(numericValue);
}

function featureTextValue(feature: unknown): string {
  if (typeof feature === "string") return feature.trim();
  if (typeof feature === "number" || typeof feature === "boolean") {
    return String(feature).trim();
  }
  if (!feature || typeof feature !== "object") return "";

  const featureObject = feature as Record<string, unknown>;
  const candidateKeys = ["label", "name", "title", "value", "text", "feature", "pl", "en"];
  for (const key of candidateKeys) {
    const value = featureTextValue(featureObject[key]);
    if (value) return value;
  }

  return "";
}

function normalizeFeatures(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  const normalized = values
    .map((feature) => featureTextValue(feature))
    .filter((feature) => feature && feature !== "[object Object]");

  return Array.from(new Set(normalized));
}

function imageUrlValue(image: unknown) {
  if (typeof image === "string") return image.trim();
  if (!image || typeof image !== "object" || Array.isArray(image)) return "";
  const item = image as Record<string, unknown>;
  const value = item.url || item.src || item.href || item.image || item["@_url"] || item["url_@"];
  return typeof value === "string" ? value.trim() : "";
}

function normalizeImages(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((image, index) => {
      const url = imageUrlValue(image);
      if (!url) return null;
      const item =
        image && typeof image === "object" && !Array.isArray(image)
          ? (image as Record<string, unknown>)
          : {};

      return {
        ...item,
        url,
        provider: typeof item.provider === "string" ? item.provider : "external",
        order: index + 1,
      };
    })
    .filter(Boolean);
}

function isEditableField(value: unknown): value is EditableField {
  return (
    value === "country" ||
    value === "city" ||
    value === "coast" ||
    value === "developer" ||
    value === "investmentName" ||
    value === "area" ||
    value === "bedrooms" ||
    value === "bathrooms" ||
    value === "distanceToSeaM" ||
    value === "price" ||
    value === "market" ||
    value === "propertyType" ||
    value === "features" ||
    value === "availableFrom" ||
    value === "title" ||
    value === "descriptionPl" ||
    value === "descriptionEn"
  );
}

function descriptionObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

async function applyEditableField(
  id: unknown,
  updatePayload: Record<string, unknown>,
  field: EditableField,
  value: unknown,
) {
  if (field === "descriptionPl" || field === "descriptionEn") {
    const currentDescriptions = descriptionObject(updatePayload.descriptions);
    if (!updatePayload.descriptions) {
      const { data: existing, error: existingError } = await supabaseServer!
        .from("properties")
        .select("descriptions")
        .eq("id", id)
        .single();

      if (existingError) throw new Error(existingError.message);
      Object.assign(currentDescriptions, descriptionObject(existing?.descriptions));
    }

    updatePayload.descriptions = {
      ...currentDescriptions,
      [field === "descriptionPl" ? "pl" : "en"]: nullableText(value),
    };
  } else if (field === "country") {
    updatePayload.country = nullableText(value);
  } else if (field === "city") {
    updatePayload.town = nullableText(value);
  } else if (field === "coast") {
    updatePayload.province = nullableText(value);
  } else if (field === "developer") {
    updatePayload.developer = nullableText(value);
  } else if (field === "investmentName") {
    updatePayload.investment_name = nullableText(value);
  } else if (field === "area") {
    updatePayload.surface_built = nullableNumber(value);
  } else if (field === "bedrooms") {
    updatePayload.beds = nullableInteger(value);
  } else if (field === "bathrooms") {
    updatePayload.baths = nullableInteger(value);
  } else if (field === "distanceToSeaM") {
    updatePayload.distance_to_sea_m = nullableInteger(value);
  } else if (field === "price") {
    updatePayload.price = nullableNumber(value);
  } else if (field === "market") {
    updatePayload.new_build = value === "pierwotny";
  } else if (field === "propertyType") {
    updatePayload.type = nullableText(value);
  } else if (field === "features") {
    const features = normalizeFeatures(value);
    updatePayload.features = features;
    updatePayload.pool = features.some((feature) => feature.toLowerCase().includes("basen"));
  } else if (field === "availableFrom") {
    const availableFrom = nullableText(value);
    updatePayload.available_from = availableFrom;
    updatePayload.date = availableFrom;
  } else if (field === "title") {
    updatePayload.title = nullableText(value);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isOnesariEnabled()) {
    return rejectDisabledOnesari(res);
  }

  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseServer) {
    return res.status(500).json({ error: "Brak SUPABASE_SERVICE_ROLE_KEY" });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Brak tokenu dostępu" });
  }

  const { data: userData, error: userError } =
    await supabaseServer.auth.getUser(token);
  if (userError || !userData.user) {
    return res.status(401).json({ error: "Brak dostępu" });
  }
  if (!canAccessOnesari(userData.user.email)) {
    return res.status(403).json({ error: "Brak dostępu do Onesari" });
  }

  const { id, field, value, values, images } = req.body || {};
  if (!id) {
    return res.status(400).json({ error: "Brak ID oferty" });
  }
  if (!values && !Array.isArray(images) && !isEditableField(field)) {
    return res.status(400).json({ error: "Tego pola nie można edytować" });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  try {
    if (values && typeof values === "object" && !Array.isArray(values)) {
      for (const [fieldKey, fieldValue] of Object.entries(values as Record<string, unknown>)) {
        if (isEditableField(fieldKey)) {
          await applyEditableField(id, updatePayload, fieldKey, fieldValue);
        }
      }
    } else if (Array.isArray(images)) {
      updatePayload.images = normalizeImages(images);
    } else {
      await applyEditableField(id, updatePayload, field, value);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Nie udało się przygotować zmian" });
  }

  const { data, error } = await supabaseServer
    .from("properties")
    .update(updatePayload)
    .eq("id", id)
    .select(propertySelect)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ property: data });
}
