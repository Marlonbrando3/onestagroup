import { hasCookieYesConsent } from './cookieConsent';
import type { HelpVariant } from './helpChoosing';

type Event = 'page_view' | 'cta_click' | 'form_start' | 'lead_saved';
type TrackingWindow = Window & { dataLayer?: Record<string, unknown>[]; fbq?: (...args: unknown[]) => void };

export function trackHelpChoosing(event: Event, variant: HelpVariant, context?: string, eventId?: string) {
  if (typeof window === 'undefined') return;
  const target = window as TrackingWindow;
  const payload = { landing_page: 'pomoc-w-wyborze', variant, ...(context ? { placement: context } : {}) };
  // Only fixed event metadata. Form values and campaign strings never enter analytics.
  try {
    if (hasCookieYesConsent('analytics')) {
      target.dataLayer = target.dataLayer || [];
      target.dataLayer.push({ event: `onesta_help_${event}`, ...payload, ...(eventId ? { event_id: eventId } : {}) });
    }
    if (hasCookieYesConsent('advertisement') && target.fbq) {
      if (event === 'lead_saved' && eventId) target.fbq('track', 'Lead', payload, { eventID: eventId });
      else if (event !== 'lead_saved') target.fbq('trackCustom', `OnestaHelp_${event}`, payload);
    }
  } catch { /* An unavailable analytics vendor must not affect contact requests. */ }
}
