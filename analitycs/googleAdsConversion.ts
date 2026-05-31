const CONTACT_CONVERSION_ID = "AW-11239400043/VzxdCNO0v7YcEOvEru8p";

type GoogleAdsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackGoogleAdsContactConversion() {
  if (typeof window === "undefined") return;

  const googleWindow = window as GoogleAdsWindow;
  googleWindow.dataLayer = googleWindow.dataLayer || [];

  const gtag =
    googleWindow.gtag ||
    ((...args: unknown[]) => {
      googleWindow.dataLayer?.push(args);
    });

  gtag("event", "conversion", {
    send_to: CONTACT_CONVERSION_ID,
    value: 20.0,
    currency: "PLN",
  });
}
