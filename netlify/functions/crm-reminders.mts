import { runCrmReminders } from "../../lib/crmReminders";

// Co 5 minut: przypomnienia 15 min przed zadaniem i poranne podsumowanie (aplikacja Onesta CRM).
export default async () => {
  const result = await runCrmReminders();
  console.log("crm-reminders", JSON.stringify(result));
  return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
};

export const config = {
  schedule: "*/5 * * * *",
};
