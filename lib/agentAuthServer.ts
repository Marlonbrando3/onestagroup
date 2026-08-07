import type { NextApiRequest } from "next";
import { getCrmUser } from "@/components/crm/users";
import { supabaseServer } from "@/lib/supabaseClient";

export type AgentIdentity = {
  id: string;
  email: string;
  name: string;
};

type AgentAuthResult =
  | { agent: AgentIdentity; error: null; status: 200 }
  | { agent: null; error: string; status: 401 | 403 | 500 };

export async function authenticateAgent(
  req: NextApiRequest,
): Promise<AgentAuthResult> {
  if (!supabaseServer) {
    return {
      agent: null,
      error: "Brak konfiguracji serwerowej Supabase",
      status: 500,
    };
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return { agent: null, error: "Brak tokenu dostępu", status: 401 };
  }

  const { data, error } = await supabaseServer.auth.getUser(token);
  const email = data.user?.email || "";
  const configuredAgent = getCrmUser(email);

  if (error || !data.user) {
    return { agent: null, error: "Sesja wygasła", status: 401 };
  }

  if (!configuredAgent) {
    return {
      agent: null,
      error: "To konto nie ma dostępu do panelu agenta",
      status: 403,
    };
  }

  return {
    agent: {
      id: data.user.id,
      email: configuredAgent.email,
      name: configuredAgent.label,
    },
    error: null,
    status: 200,
  };
}
