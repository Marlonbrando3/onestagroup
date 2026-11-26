import { runDataRetention } from "../../lib/dataRetention";

// Raz dziennie (03:17 UTC): usuwanie danych po okresie przechowywania z polityki prywatności (lib/dataRetention.ts).
export default async () => {
  const result = await runDataRetention();
  console.log("data-retention", JSON.stringify(result));
  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
};

export const config = {
  schedule: "17 3 * * *",
};
