// Powitania w nagłówku CRM. {name} zostanie zastąpione imieniem zalogowanej osoby.
// `title` – zamiast imienia (np. specjalne powitanie Karoliny)
export type CrmGreeting = { before: string; after: string; emoji: string; title?: string };

// Specjalne powitanie Karoliny – co trzecie wejście na lejek
const KAROLINA_EMAIL = "karolina@fenomen.nieruchomosci.pl";
const queenGreeting: CrmGreeting = { before: "Witaj, ", after: ", Królowo Złota!", emoji: "👑" };
const queenCounterKey = "crmQueenGreetingCounter";

export const crmGreetings: CrmGreeting[] = [
  { before: "Dobrego dnia, ", after: "!", emoji: "☀️" },
  { before: "Hola, ", after: "!", emoji: "👋" },
  { before: "Bon voyage, ", after: "!", emoji: "✈️" },
  { before: "Pozdrowienia, ", after: "!", emoji: "🙌" },
  { before: "Buenos días, ", after: "!", emoji: "🌞" },
  { before: "Miłej sprzedaży, ", after: "!", emoji: "💼" },
  { before: "Kawa już jest, ", after: "?", emoji: "☕" },
  { before: "Ciao, ", after: "!", emoji: "🇮🇹" },
  { before: "Rekordowego dnia, ", after: "!", emoji: "🚀" },
  { before: "Dzień dobry, ", after: "!", emoji: "😊" },
  { before: "Olé, ", after: "!", emoji: "💃" },
  { before: "Czołem, ", after: "!", emoji: "🫡" },
  { before: "Hej, ", after: "!", emoji: "✌️" },
  { before: "Do dzieła, ", after: "!", emoji: "💪" },
  { before: "Bonjour, ", after: "!", emoji: "🥐" },
  { before: "Siema, ", after: "!", emoji: "😎" },
  { before: "Powodzenia dziś, ", after: "!", emoji: "🍀" },
  { before: "Co tam dzisiaj robimy, ", after: "?", emoji: "🤔" },
  { before: "Klienci pytali o Ciebie, ", after: "!", emoji: "📞" },
  { before: "Jak zdrówko, ", after: "?", emoji: "🍊" },
  { before: "Jakie plany na dziś, ", after: "?", emoji: "🗓️" },
  { before: "Co dzisiaj gotujemy, ", after: "?", emoji: "👨‍🍳" },
];

const storageKey = "crmGreetingIndex";

// Nowe losowe powitanie przy każdym wejściu na lejek (nigdy dwa razy to samo pod rząd).
export function pickCrmGreeting(email?: string): CrmGreeting {
  if (String(email || "").trim().toLowerCase() === KAROLINA_EMAIL) {
    let counter = 0;
    try {
      counter = Number(window.localStorage.getItem(queenCounterKey) || 0) + 1;
      window.localStorage.setItem(queenCounterKey, String(counter));
    } catch {
      counter = Math.floor(Math.random() * 3) + 1;
    }
    if (counter % 3 === 0) return queenGreeting;
  }
  let previous = -1;
  try {
    previous = Number(window.sessionStorage.getItem(storageKey) ?? -1);
  } catch {
    previous = -1;
  }
  let next = Math.floor(Math.random() * crmGreetings.length);
  if (crmGreetings.length > 1 && next === previous) {
    next = (next + 1 + Math.floor(Math.random() * (crmGreetings.length - 1))) % crmGreetings.length;
  }
  try {
    window.sessionStorage.setItem(storageKey, String(next));
  } catch {
    // pamięć przeglądarki niedostępna – nic nie szkodzi
  }
  return crmGreetings[next];
}
