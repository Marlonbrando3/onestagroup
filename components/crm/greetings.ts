// Powitania w nagłówku CRM. {name} zostanie zastąpione imieniem zalogowanej osoby.
export type CrmGreeting = { before: string; after: string; emoji: string };

export const crmGreetings: CrmGreeting[] = [
  { before: "Dobrego dnia, ", after: "!", emoji: "☀️" },
  { before: "Hola, ", after: "!", emoji: "👋" },
  { before: "Bon voyage, ", after: "!", emoji: "✈️" },
  { before: "Pozdrowienia, ", after: "!", emoji: "🙌" },
  { before: "Witam serdecznie, ", after: "!", emoji: "🤝" },
  { before: "Witam, ", after: ", ale bez serdecznie", emoji: "😏" },
  { before: "Buenos días, ", after: "!", emoji: "🌞" },
  { before: "Miłej sprzedaży, ", after: "!", emoji: "💼" },
  { before: "Kawa już jest, ", after: "?", emoji: "☕" },
  { before: "Ciao, ", after: "!", emoji: "🇮🇹" },
  { before: "Rekordowego dnia, ", after: "!", emoji: "🚀" },
  { before: "Dzień dobry, ", after: "!", emoji: "😊" },
  { before: "Olé, ", after: "!", emoji: "💃" },
  { before: "Czołem, ", after: "!", emoji: "🫡" },
  { before: "Hej, ", after: "!", emoji: "✌️" },
  { before: "Hiszpańskie słońce czeka, ", after: "!", emoji: "🌴" },
  { before: "Do dzieła, ", after: "!", emoji: "💪" },
  { before: "Bonjour, ", after: "!", emoji: "🥐" },
  { before: "Siema, ", after: "!", emoji: "😎" },
  { before: "Powodzenia dziś, ", after: "!", emoji: "🍀" },
];

const storageKey = "crmGreetingIndex";

// Jedno losowe powitanie na sesję przeglądarki (nowe po ponownym zalogowaniu / nowej karcie).
export function pickCrmGreeting(): CrmGreeting {
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    const index = stored === null ? NaN : Number(stored);
    if (Number.isInteger(index) && crmGreetings[index]) return crmGreetings[index];
    const next = Math.floor(Math.random() * crmGreetings.length);
    window.sessionStorage.setItem(storageKey, String(next));
    return crmGreetings[next];
  } catch {
    return crmGreetings[Math.floor(Math.random() * crmGreetings.length)];
  }
}
