"use client";

import { useEffect, useRef } from "react";
import {
  cookieYesConsentState,
  subscribeToCookieYesConsent,
  type CookieYesConsentState,
} from "@/lib/cookieConsent";

type ConsentWindow = Window & {
  fbq?: ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[];
    loaded?: boolean;
    version?: string;
  };
  _fbq?: unknown;
  hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
  _hjSettings?: { hjid: number; hjsv: number };
};

const FACEBOOK_SCRIPT_ID = "onesta-facebook-pixel-script";
const HOTJAR_SCRIPT_ID = "onesta-hotjar-script";

function enableFacebookPixel() {
  const consentWindow = window as ConsentWindow;
  if (consentWindow.fbq) {
    consentWindow.fbq("consent", "grant");
    return;
  }

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as NonNullable<ConsentWindow["fbq"]>;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  consentWindow.fbq = fbq;
  consentWindow._fbq = fbq;

  fbq("consent", "grant");
  fbq("init", "178665974358939");
  fbq("track", "PageView");

  if (!document.getElementById(FACEBOOK_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = FACEBOOK_SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }
}

function revokeFacebookPixel() {
  (window as ConsentWindow).fbq?.("consent", "revoke");
}

function enableHotjar() {
  const consentWindow = window as ConsentWindow;
  if (document.getElementById(HOTJAR_SCRIPT_ID)) return;

  consentWindow.hj =
    consentWindow.hj ||
    (function (...args: unknown[]) {
      (consentWindow.hj!.q = consentWindow.hj!.q || []).push(args);
    } as NonNullable<ConsentWindow["hj"]>);
  consentWindow._hjSettings = { hjid: 3555670, hjsv: 6 };

  const script = document.createElement("script");
  script.id = HOTJAR_SCRIPT_ID;
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${consentWindow._hjSettings.hjid}.js?sv=${consentWindow._hjSettings.hjsv}`;
  document.head.appendChild(script);
}

export default function AnalitycsTools() {
  const previousConsent = useRef<CookieYesConsentState | null>(null);

  useEffect(() => {
    const applyConsent = (state: CookieYesConsentState) => {
      const advertisementAccepted = state.accepted.includes("advertisement");
      const analyticsAccepted = state.accepted.includes("analytics");
      const previous = previousConsent.current;

      if (advertisementAccepted) enableFacebookPixel();
      else revokeFacebookPixel();
      if (analyticsAccepted) enableHotjar();

      const revokedAfterAcceptance =
        Boolean(previous) &&
        ((previous!.accepted.includes("advertisement") &&
          !advertisementAccepted) ||
          (previous!.accepted.includes("analytics") && !analyticsAccepted));
      previousConsent.current = state;

      if (revokedAfterAcceptance) {
        window.location.reload();
      }
    };

    applyConsent(cookieYesConsentState());
    return subscribeToCookieYesConsent(applyConsent);
  }, []);

  return null;
}
