export type CbTopTrackingEvent =
  | "property_open"
  | "contact_form_submit"
  | "whatsapp_click"
  | "phone_click"
  | "email_click";

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

export function captureCbTopTrackingToken() {
  if (typeof window === "undefined") return;

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const token = hash.get("lm");
  if (!validToken(token)) return;

  try {
    window.sessionStorage.setItem(TRACKING_TOKEN_KEY, token!);
  } catch {
    return;
  }

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

export function trackCbTopInteraction(payload: CbTopTrackingPayload) {
  if (typeof window === "undefined") return;

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
