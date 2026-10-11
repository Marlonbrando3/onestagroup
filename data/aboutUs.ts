// Treści strony /aboutus. Fakty (dane firmy, adresy, role) muszą zgadzać się z
// lib/organizationSchema.ts i stopką — zmieniając je tutaj, zmień też tam.

export const aboutPage = {
  path: "/aboutus",
  title: "O nas – Onesta Group | Zespół, biura i dane firmy",
  description:
    "Poznaj Onesta Group: polską firmę z biurami we Wrocławiu, Opolu i San Javier. Kto prowadzi zakup nieruchomości w Hiszpanii, jak pracujemy i jak nas sprawdzić.",
  heroImage: "/bg_calp.jpg",
  teamImage: "/images/agency/zespol-onesta.webp",
};

export const companyFacts = [
  { label: "Nazwa", value: "Onesta Group sp. z o.o." },
  { label: "NIP", value: "899 292 23 78" },
  { label: "Siedziba", value: "ul. Wolbromska 18/1b, 53-148 Wrocław" },
  { label: "Biuro dla klientów", value: "ul. Niemodlińska 58a, 45-865 Opole" },
  { label: "Biuro w Hiszpanii", value: "Calle Abel 19, 30720 San Javier (Murcja)" },
  { label: "Telefon", value: "+48 576 65 25 25", href: "tel:+48576652525" },
  { label: "E-mail", value: "biuro@onesta.com.pl", href: "mailto:biuro@onesta.com.pl" },
];

export const principles = [
  {
    title: "Najpierw rozmowa, potem oferty",
    text: "Nie wysyłamy setek linków. Zaczynamy od tego, po co kupujesz: wakacje, przeprowadzka, wynajem. Budżet, termin i to, z czego nie chcesz rezygnować, ustalamy przed pierwszą selekcją.",
  },
  {
    title: "Selekcja zamiast katalogu",
    text: "Współpracujemy z deweloperami i lokalnymi agencjami, więc porównujemy więcej niż widać na jednym portalu. Pokazujemy także minusy ofert — odległość od plaży, dojazd, charakter okolicy poza sezonem.",
  },
  {
    title: "Sprawdzeni specjaliści przy transakcji",
    text: "Stan prawny nieruchomości sprawdza niezależny prawnik, dokumenty tłumaczy tłumacz, a akt podpisuje się u notariusza. Koordynujemy ten proces, ale nie zastępujemy specjalistów tam, gdzie wymaga tego prawo.",
  },
  {
    title: "Jasne pieniądze",
    text: "Kupujący nie płaci nam prowizji — wynagrodzenie pokrywa sprzedający lub deweloper. Zanim zdecydujesz, widzisz pełny budżet: podatki, notariusza, rejestr, prawnika i koszty utrzymania.",
  },
  {
    title: "Bez presji czasu",
    text: "Pierwszy przyjazd może być rekonesansem. Jeśli żadna z pokazanych nieruchomości nie pasuje, wracamy do selekcji. Lepiej poczekać miesiąc niż kupić nie to miejsce.",
  },
  {
    title: "Po zakupie nadal jesteśmy obok",
    text: "Odbiór, media, wyposażenie, wynajem, zarządzanie — gdy mieszkasz w Polsce, sprawy w Hiszpanii nadal wymagają kogoś na miejscu. Zakres i koszty takiej pomocy ustalamy przed jej zleceniem.",
  },
];

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  languages: string[];
  phone?: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "marek-marszalek",
    name: "Marek Marszałek",
    role: "Współzałożyciel i prezes zarządu",
    bio: "Prowadzi klientów od pierwszej rozmowy do podpisania aktu. Ma piętnaście lat doświadczenia w sprzedaży. Pilnuje szczegółów, poprawności dokumentów i jasnej komunikacji na każdym etapie.",
    languages: ["PL", "EN"],
    phone: "+48 576 65 25 25",
  },
  {
    id: "karolina-bakowicz",
    name: "Karolina Bakowicz",
    role: "Współzałożycielka",
    bio: "Zna wybrzeże nie tylko z ofert — pomaga wybrać miejsce, w którym da się żyć także poza sezonem. Porządkuje potrzeby klientów i przygotowuje prezentacje na miejscu.",
    languages: ["PL", "EN", "ES"],
    phone: "+48 505 055 846",
  },
  {
    id: "przemyslaw-krzywanski",
    name: "Przemysław Krzywański",
    role: "Konsultant ds. klientów inwestycyjnych",
    bio: "Pracuje z osobami, które kupują z myślą o wynajmie. Porównuje lokalizacje i koszty, pyta o rentowność i ryzyka, zanim zapadnie decyzja o zakupie.",
    languages: ["PL", "EN"],
    phone: "+48 733 489 700",
  },
  {
    id: "dominik-michalowski",
    name: "Dominik Michałowski",
    role: "Partner, zarządzanie nieruchomościami",
    bio: "Prowadzi prezentacje w Hiszpanii i organizuje opiekę nad nieruchomościami po zakupie. Na co dzień koordynuje sprawy na miejscu i kontakt z właścicielami.",
    languages: ["PL", "EN"],
  },
  {
    id: "damian-wlodarkiewicz",
    name: "Damian Włodarkiewicz",
    role: "Zarządzanie, procesy i marketing",
    bio: "Łączy zarządzanie nieruchomościami, zespołem i procesami z marketingiem — tak, aby wynajem przynosił właścicielom przewidywalny wynik.",
    languages: ["PL", "EN"],
  },
];

export const aboutFaqs = [
  {
    question: "Czy płacę Onesta Group za pomoc w zakupie?",
    answer:
      "Nie. Kupujący nie płaci nam prowizji za pośrednictwo — wynagrodzenie pokrywa sprzedający lub deweloper. Usługi dodatkowe, takie jak prawnik, tłumacz przysięgły czy zarządzanie najmem, wyceniamy osobno i zawsze przed ich zleceniem.",
  },
  {
    question: "Czy Onesta Group to firma zarejestrowana w Polsce?",
    answer:
      "Tak. Onesta Group sp. z o.o. ma siedzibę we Wrocławiu (ul. Wolbromska 18/1b), NIP 899 292 23 78. Dane spółki możesz sprawdzić w publicznym rejestrze KRS, wyszukując ją po numerze NIP.",
  },
  {
    question: "Gdzie mogę spotkać się z Wami osobiście?",
    answer:
      "W Polsce w biurze dla klientów w Opolu (ul. Niemodlińska 58a), w Hiszpanii w San Javier (Calle Abel 19) w regionie Murcji. Spotkanie warto umówić wcześniej telefonicznie lub przez formularz — część zespołu pracuje w terenie, podczas prezentacji.",
  },
  {
    question: "Kto odpowiada za bezpieczeństwo prawne transakcji?",
    answer:
      "Stan prawny nieruchomości weryfikuje niezależny prawnik (abogado), a umowę sprzedaży podpisuje się w formie aktu notarialnego. My koordynujemy cały proces, terminy i dokumenty oraz dbamy, żebyś rozumiał każdy krok po polsku.",
  },
  {
    question: "Czy muszę od razu lecieć do Hiszpanii?",
    answer:
      "Nie. Rozmowę, selekcję ofert i wstępne porównanie robimy zdalnie. Przyjazd planujemy dopiero wtedy, gdy jest co oglądać — z konkretnym planem prezentacji.",
  },
];
