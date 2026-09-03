import { supabaseServer } from "@/lib/supabaseClient";

const PUBLIC_TOKEN_PATTERN = /^[A-Za-z0-9_-]{20,64}$/;

export async function resolvePublicOfferListToken(
  value: unknown,
): Promise<string | null> {
  if (!supabaseServer) return null;

  const requestedToken = String(value || "").trim();
  if (!PUBLIC_TOKEN_PATTERN.test(requestedToken)) return null;

  const { data: exactMatch, error: exactError } = await supabaseServer
    .from("agent_offer_lists")
    .select("public_token")
    .eq("public_token", requestedToken)
    .maybeSingle();

  if (exactError) return null;
  if (exactMatch?.public_token) return String(exactMatch.public_token);

  // Some messaging clients have truncated previously shared 24-character
  // tokens to 20 characters. Accept a prefix only when it uniquely identifies
  // one presentation, then redirect to its canonical full token.
  const { data: prefixMatches, error: prefixError } = await supabaseServer
    .from("agent_offer_lists")
    .select("public_token")
    .like("public_token", `${requestedToken}%`)
    .limit(2);

  if (prefixError || prefixMatches?.length !== 1) return null;

  return String(prefixMatches[0].public_token);
}
