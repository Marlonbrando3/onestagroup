export const HELP_VARIANTS = {
  oferty: {
    title: '40 otwartych zakładek.', accent: 'A wymarzonego domu nadal brak?',
    description: 'Pomożemy Ci uporządkować poszukiwania. Porozmawiamy o Twoich oczekiwaniach, wyjaśnimy różnice między lokalizacjami i zawęzimy wybór do ofert, które warto rozważyć.',
    cta: 'Chcę pomocy w wyborze',
  },
  ceny: {
    title: 'Podobne mieszkania.', accent: 'Zupełnie inne ceny. Dlaczego?',
    description: 'Lokalizacja, otoczenie, standard i dodatkowe koszty potrafią zmienić ocenę oferty. Porozmawiaj z nami, żeby wiedzieć, co porównywać i o co pytać przed zakupem.',
    cta: 'Chcę zrozumieć ceny',
  },
  budzet: {
    title: 'Co możesz kupić w Hiszpanii', accent: 'za swój budżet?',
    description: 'Pomożemy Ci zestawić oczekiwania z realnymi możliwościami: gdzie szukać, jaki typ nieruchomości rozważyć i jak uwzględnić koszty poza ceną ogłoszenia.',
    cta: 'Chcę poznać możliwości',
  },
  rozmowa: {
    title: 'Kolejny wieczór z ogłoszeniami?', accent: 'Zacznijmy od rozmowy.',
    description: 'Nie musisz znać hiszpańskiego rynku ani mieć wybranej miejscowości. Powiedz nam, na czym Ci zależy. Pomożemy ustalić, od czego zacząć i które oferty mają dla Ciebie sens.',
    cta: 'Chcę porozmawiać z doradcą',
  },
} as const;

export type HelpVariant = keyof typeof HELP_VARIANTS;
export function helpVariant(value: unknown): HelpVariant {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(HELP_VARIANTS, value) ? value as HelpVariant : 'oferty';
}

export const HELP_BUDGETS = [
  { id: 'under-250', label: 'Do 250 tys. €', max: 250000 },
  { id: '250-350', label: '250–350 tys. €', max: 350000 },
  { id: '350-500', label: '350–500 tys. €', max: 500000 },
  { id: '500-750', label: '500–750 tys. €', max: 750000 },
  { id: 'over-750', label: 'Powyżej 750 tys. €', max: 0 },
  { id: 'undecided', label: 'Jeszcze nie wiem', max: 0 },
] as const;

// Same wording as the approved ContactFormMain form. No future marketing opt-in.
export const HELP_PRIVACY_TEXT = 'Akceptuję politykę prywatności.';
export const HELP_PRIVACY_VERSION = '2026-08-29';
export const HELP_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'] as const;
export type HelpFields = { name: string; phone: string; budget: string; message: string; privacy: boolean };
export type HelpErrors = Partial<Record<keyof HelpFields, string>>;

export function normalizeHelpPhone(value: string) {
  let phone = value.trim().replace(/[\s().-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (/^\d{9}$/.test(phone)) phone = `+48${phone}`;
  if (/^48\d{9}$/.test(phone)) phone = `+${phone}`;
  return phone;
}

export function validateHelpFields(fields: HelpFields): HelpErrors {
  const errors: HelpErrors = {};
  if (!fields.name.trim()) errors.name = 'Podaj swoje imię.';
  else if (fields.name.trim().length > 100 || /[\r\n\x00-\x1f]/.test(fields.name)) errors.name = 'Imię może mieć maksymalnie 100 znaków.';
  const phone = normalizeHelpPhone(fields.phone);
  if (!/^\+[1-9]\d{6,14}$/.test(phone) || (phone.startsWith('+48') && phone.length !== 12)) errors.phone = 'Podaj poprawny numer telefonu z prefiksem kraju, np. +48 576 652 525.';
  if (!HELP_BUDGETS.some(b => b.id === fields.budget)) errors.budget = 'Wybierz budżet lub zaznacz „Jeszcze nie wiem”.';
  if (fields.message.length > 500) errors.message = 'Wiadomość może mieć maksymalnie 500 znaków.';
  if (!fields.privacy) errors.privacy = 'Zaakceptuj politykę prywatności.';
  return errors;
}
