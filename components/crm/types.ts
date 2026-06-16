export type CrmStatus = string;
export type CrmActivityType =
  | "Wyślij oferty"
  | "Follow up"
  | "Zadzwoń"
  | "Spotkanie"
  | "Prezentacja";
export type CrmActivityStatus = "planned" | "done";

export type CrmContact = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  owner: string;
  value: number;
  country: string;
  maxBudget: number;
  bedrooms: string;
  bathrooms: string;
  coast: string;
  purchaseTimeline: string;
  note: string;
  pipelineOwner: string;
  pipelineId?: string | null;
  status: CrmStatus;
  source: string;
  lastContact: string;
  createdAt?: string;
};

export const crmStatuses: CrmStatus[] = [
  "Zakwalifikowano",
  "Brak kontaktu",
  "Nawiązano kontakt",
  "Zakup w perspektywie",
  "Wysłano pierwsze oferty",
  "Rozmowy po ofertach",
  "Deklaracja/termin przylotu",
  "Etap prezentacji",
  "Do weryfikacji",
];

export const crmStageProbabilities: Partial<Record<CrmStatus, number | null>> = {
  Zakwalifikowano: 5,
  "Brak kontaktu": 5,
  "Nawiązano kontakt": 10,
  "Zakup w perspektywie": 15,
  "Wysłano pierwsze oferty": 20,
  "Rozmowy po ofertach": 50,
  "Deklaracja/termin przylotu": 70,
  "Etap prezentacji": 90,
  "Do weryfikacji": null,
};

export const crmLegacyStatusMap: Record<string, CrmStatus> = {
  Nowy: "Zakwalifikowano",
  Kontakt: "Nawiązano kontakt",
  Oferta: "Wysłano pierwsze oferty",
  Negocjacje: "Rozmowy po ofertach",
  Wygrany: "Do weryfikacji",
};
export const crmActivityTypes: CrmActivityType[] = [
  "Wyślij oferty",
  "Follow up",
  "Zadzwoń",
  "Spotkanie",
  "Prezentacja",
];

export type CrmPipeline = {
  id: string;
  name: string;
  ownerEmail: string;
  stages: CrmStatus[];
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const defaultCrmPipeline: CrmPipeline = {
  id: "default",
  name: "Lejek podstawowy",
  ownerEmail: "global",
  stages: crmStatuses,
  isDefault: true,
};

export const customCrmPipelineDraftStages: CrmStatus[] = [
  "Zakwalifikowano",
  "Nawiązano kontakt",
  "Złożono ofertę",
  "Rozmowy po ofertach",
  "Negocjacje",
];

export type CrmActivity = {
  id: string;
  contactId: string;
  type: CrmActivityType;
  title: string;
  note: string;
  dueDate: string | null;
  dueTime: string | null;
  status: CrmActivityStatus;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
};

export const crmCurrency = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
