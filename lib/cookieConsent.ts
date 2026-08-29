export type CookieYesCategory =
  | "necessary"
  | "functional"
  | "analytics"
  | "performance"
  | "advertisement";

export type CookieYesConsentState = {
  decided: boolean;
  accepted: CookieYesCategory[];
  rejected: CookieYesCategory[];
};

type CookieYesApiConsent = {
  categories?: Partial<Record<CookieYesCategory, boolean>>;
  isUserActionCompleted?: boolean;
};

const COOKIE_NAME = "cookieyes-consent";
const CATEGORIES: CookieYesCategory[] = [
  "necessary",
  "functional",
  "analytics",
  "performance",
  "advertisement",
];
let latestConsentState: CookieYesConsentState | null = null;

function cookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  const value = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);

  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parsedCookieYesConsent() {
  const values: Record<string, string> = {};
  for (const item of cookieValue(COOKIE_NAME).split(",")) {
    const separator = item.indexOf(":");
    if (separator <= 0) continue;
    values[item.slice(0, separator)] = item.slice(separator + 1);
  }
  return values;
}

function cookieYesApiConsentState(): CookieYesConsentState | null {
  if (typeof window === "undefined") return null;

  const getCkyConsent = (
    window as Window & { getCkyConsent?: () => CookieYesApiConsent }
  ).getCkyConsent;
  if (typeof getCkyConsent !== "function") return null;

  try {
    const consent = getCkyConsent();
    if (!consent?.categories) return null;

    return {
      decided: Boolean(consent.isUserActionCompleted),
      accepted: CATEGORIES.filter(
        (category) => consent.categories?.[category] === true,
      ),
      rejected: CATEGORIES.filter(
        (category) => consent.categories?.[category] === false,
      ),
    };
  } catch {
    return null;
  }
}

export function cookieYesConsentState(): CookieYesConsentState {
  const apiState = cookieYesApiConsentState();
  if (apiState) {
    latestConsentState = apiState;
    return apiState;
  }

  const values = parsedCookieYesConsent();
  const accepted = CATEGORIES.filter(
    (category) => values[category] === "yes",
  );
  const rejected = CATEGORIES.filter(
    (category) => values[category] === "no",
  );

  const cookieState = {
    decided: Boolean(values.action),
    accepted,
    rejected,
  };
  if (cookieState.decided) {
    latestConsentState = cookieState;
    return cookieState;
  }
  return latestConsentState || cookieState;
}

export function hasCookieYesConsent(category: CookieYesCategory) {
  return cookieYesConsentState().accepted.includes(category);
}

export function subscribeToCookieYesConsent(
  listener: (state: CookieYesConsentState) => void,
) {
  if (typeof document === "undefined") return () => undefined;

  let updateTimer: number | undefined;
  const handleUpdate = () => {
    window.clearTimeout(updateTimer);
    updateTimer = window.setTimeout(() => {
      listener(cookieYesConsentState());
    }, 0);
  };

  document.addEventListener("cookieyes_consent_update", handleUpdate);
  document.addEventListener("cookieyes_banner_load", handleUpdate);
  return () => {
    window.clearTimeout(updateTimer);
    document.removeEventListener("cookieyes_consent_update", handleUpdate);
    document.removeEventListener("cookieyes_banner_load", handleUpdate);
  };
}
