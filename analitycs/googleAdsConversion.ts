const CONTACT_CONVERSION_ID = "AW-11239400043/aO2VCNT92LYcEOvEru8p";

type GoogleAdsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackGoogleAdsContactConversion(url?: string) {
  if (typeof window === "undefined") return false;

  const googleWindow = window as GoogleAdsWindow;
  googleWindow.dataLayer = googleWindow.dataLayer || [];

  if (typeof googleWindow.gtag !== "function") {
    googleWindow.gtag = function () {
      googleWindow.dataLayer?.push(arguments);
    };
  }

  googleWindow.dataLayer.push({
    event: "google_ads_contact_conversion",
  });

  const callback = () => {
    if (typeof url !== "undefined") {
      window.location.href = url;
    }
  };

  googleWindow.gtag("event", "conversion", {
    send_to: CONTACT_CONVERSION_ID,
    value: 50.0,
    currency: "PLN",
    event_callback: callback,
  });

  return false;
}
