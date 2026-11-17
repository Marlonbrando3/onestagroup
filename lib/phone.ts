// Numer telefonu z kierunkowym: polskie 9 cyfr → „+48 576 652 525”; inne numery bez zmian
// (z dodanym „+”, jeśli zaczynają się od kodu kraju).
export function formatPhone(value: string) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  const groups = (d: string) => d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  if (digits.length === 9 && !raw.startsWith("+")) return `+48 ${groups(digits)}`;
  if (digits.length === 11 && digits.startsWith("48")) return `+48 ${groups(digits.slice(2))}`;
  if (digits.length === 13 && digits.startsWith("0048")) return `+48 ${groups(digits.slice(4))}`;
  return raw.startsWith("+") || raw.startsWith("00") ? raw.replace(/^00/, "+") : raw;
}
