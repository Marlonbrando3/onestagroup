import { crmActivityTypes } from "./types";

// Ustawienia powiadomień push – osobno dla każdego użytkownika CRM (tabela crm_user_settings).
export type CrmReminderSetting = { enabled: boolean; minutesBefore: number };

export type CrmNotificationSettings = {
  summary: { enabled: boolean; time: string };
  presentation: { open: boolean; offerView: boolean; interest: boolean };
  reminders: Record<string, CrmReminderSetting>;
};

export const reminderLeadOptions = [0, 5, 10, 15, 30, 45, 60, 120, 180, 1440];

export function reminderLeadLabel(minutes: number) {
  if (minutes === 0) return "o czasie";
  if (minutes < 60) return `${minutes} min przed`;
  if (minutes === 1440) return "dzień przed";
  return `${minutes / 60} godz. przed`;
}

export function defaultNotificationSettings(): CrmNotificationSettings {
  return {
    summary: { enabled: true, time: "08:30" },
    presentation: { open: true, offerView: true, interest: true },
    reminders: Object.fromEntries(
      crmActivityTypes.map((type) => [type, { enabled: type !== "Brak kontaktu", minutesBefore: 15 }]),
    ),
  };
}

export function normalizeNotificationSettings(value: unknown): CrmNotificationSettings {
  const defaults = defaultNotificationSettings();
  const input = (value && typeof value === "object" ? value : {}) as Partial<CrmNotificationSettings>;
  const time = String(input.summary?.time || defaults.summary.time);
  const reminders: Record<string, CrmReminderSetting> = { ...defaults.reminders };
  Object.keys(reminders).forEach((type) => {
    const item = (input.reminders || {})[type];
    if (!item) return;
    const minutes = Number(item.minutesBefore);
    reminders[type] = {
      enabled: Boolean(item.enabled),
      minutesBefore: reminderLeadOptions.includes(minutes) ? minutes : 15,
    };
  });
  return {
    summary: {
      enabled: input.summary?.enabled ?? defaults.summary.enabled,
      time: /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : defaults.summary.time,
    },
    presentation: {
      open: input.presentation?.open ?? true,
      offerView: input.presentation?.offerView ?? true,
      interest: input.presentation?.interest ?? true,
    },
    reminders,
  };
}
