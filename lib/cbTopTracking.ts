import {
  cookieYesConsentState,
  hasCookieYesConsent,
} from "@/lib/cookieConsent";

export type CbTopTrackingEvent =
  | "sms_link_open"
  | "property_open"
  | "property_like"
  | "contact_form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "urgent_contact_request";

export type CbTopTrackingContext =
  | "hero"
  | "property_modal"
  | "page_footer"
  | "floating";

type CbTopTrackingPayload = {
  event: CbTopTrackingEvent;
  context?: CbTopTrackingContext;
  offerId?: string;
};

const TRACKING_TOKEN_KEY = "onesta_cbtop_lead_token";
let pendingLeadToken = "";

export type CbTopTrackingConsentSyncResult =
  | "captured"
  | "ready"
  | "pending"
  | "rejected";

function trackingEndpoint() {
  const configured = process.env.NEXT_PUBLIC_LEAD_MANAGER_URL?.trim();
  const baseUrl = configured || "https://leadmanager-iota.vercel.app";
  if (!baseUrl) return "";

  try {
    const url = new URL(baseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return `${url.origin}/api/tracking/event`;
  } catch {
    return "";
  }
}

function validToken(value: string | null) {
  return Boolean(
    value && value.length >= 20 && value.length <= 2048 && /^[a-z0-9_-]+$/i.test(value),
  );
}

function removeTrackingHash(hash: URLSearchParams) {
  hash.delete("lm");
  const cleanHash = hash.toString();
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}${
      cleanHash ? `#${cleanHash}` : ""
    }`,
  );
}

export function captureCbTopTrackingToken(): CbTopTrackingConsentSyncResult {
  if (typeof window === "undefined") return "pending";

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const token = hash.get("lm");
  const consent = cookieYesConsentState();

  if (validToken(token)) pendingLeadToken = token!;

  if (!consent.accepted.includes("advertisement")) {
    if (consent.decided) {
      try {
        window.sessionStorage.removeItem(TRACKING_TOKEN_KEY);
      } catch {
        // The rejected state must not depend on storage availability.
      }
      if (hash.has("lm")) removeTrackingHash(hash);
      return "rejected";
    }
    return "pending";
  }

  const tokenToStore = validToken(token) ? token! : pendingLeadToken;
  if (!validToken(tokenToStore)) return "ready";

  try {
    const existingToken =
      window.sessionStorage.getItem(TRACKING_TOKEN_KEY) || "";
    if (existingToken === tokenToStore) {
      if (hash.has("lm")) removeTrackingHash(hash);
      return "ready";
    }
    window.sessionStorage.setItem(TRACKING_TOKEN_KEY, tokenToStore);
  } catch {
    return "pending";
  }

  removeTrackingHash(hash);
  return "captured";
}

export function trackCbTopInteraction(payload: CbTopTrackingPayload) {
  if (typeof window === "undefined") return;
  if (!hasCookieYesConsent("advertisement")) return;

  let token = "";
  try {
    token = window.sessionStorage.getItem(TRACKING_TOKEN_KEY) || "";
  } catch {
    return;
  }
  const endpoint = trackingEndpoint();
  if (!validToken(token) || !endpoint) return;

  void fetch(endpoint, {
    method: "POST",
    mode: "cors",
    keepalive: true,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ token, ...payload }),
  }).catch(() => {
    // Tracking must never interrupt navigation or contact actions.
  });
}

export async function reportCbTopPropertyLike(offerId: string) {
  if (typeof window === "undefined" || !/^[a-z0-9_-]{1,80}$/i.test(offerId)) {
    return { ok: false as const, reason: "missing_tracking" as const };
  }

  let token = "";
  try {
    token = window.sessionStorage.getItem(TRACKING_TOKEN_KEY) || "";
  } catch {
    // An explicit preference can use the link token held only in memory.
  }
  if (!validToken(token)) token = pendingLeadToken;

  const endpoint = trackingEndpoint();
  if (!validToken(token) || !endpoint) {
    return { ok: false as const, reason: "missing_tracking" as const };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        token,
        event: "property_like",
        context: "property_modal",
        offerId,
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean }
      | null;
    if (!response.ok || !payload?.ok) {
      return { ok: false as const, reason: "request_failed" as const };
    }
    return { ok: true as const };
  } catch {
    return { ok: false as const, reason: "request_failed" as const };
  }
}

export async function requestCbTopUrgentContact() {
  if (typeof window === "undefined") {
    return { ok: false as const, reason: "missing_tracking" as const };
  }

  let token = "";
  try {
    token = window.sessionStorage.getItem(TRACKING_TOKEN_KEY) || "";
  } catch {
    // A requested contact action can use the link token held only in memory.
  }
  if (!validToken(token)) token = pendingLeadToken;

  const endpoint = trackingEndpoint();
  if (!validToken(token) || !endpoint) {
    return { ok: false as const, reason: "missing_tracking" as const };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({
        token,
        event: "urgent_contact_request",
        context: "page_footer",
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; urgentContactStatus?: string }
      | null;
    if (!response.ok || !payload?.ok) {
      return { ok: false as const, reason: "request_failed" as const };
    }

    return {
      ok: true as const,
      alreadySent: payload.urgentContactStatus === "already_sent",
    };
  } catch {
    return { ok: false as const, reason: "request_failed" as const };
  }
}
