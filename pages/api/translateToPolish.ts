import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  text?: string;
  error?: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const deeplKey = process.env.DEEPL_API_KEY;
  if (!deeplKey) {
    return res.status(500).json({ error: "Missing DEEPL_API_KEY" });
  }

  const { text } = req.body ?? {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid text payload" });
  }

  try {
    const params = new URLSearchParams();
    params.append("text", text);
    params.append("target_lang", "PL");

    const deeplRes = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${deeplKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const json = await deeplRes.json();

    if (!deeplRes.ok) {
      return res.status(500).json({
        error: "DeepL translation failed",
        details: json?.message || JSON.stringify(json),
      });
    }

    const translated = json?.translations?.[0]?.text;
    if (!translated) {
      return res
        .status(500)
        .json({ error: "DeepL returned empty translation" });
    }

    return res.status(200).json({ text: translated });
  } catch (err: any) {
    return res.status(500).json({
      error: "Translation request failed",
      details: err?.message ?? String(err),
    });
  }
}

