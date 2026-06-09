export type CrmUserRole = "admin" | "user";

export type CrmUser = {
  email: string;
  label: string;
  role: CrmUserRole;
};

export const crmUsers: CrmUser[] = [
  {
    email: "marek.marszalek@onesta.com.pl",
    label: "Marek Marszałek",
    role: "admin",
  },
  {
    email: "p.krzywanski@onesta.com.pl",
    label: "Przemek Krzywański",
    role: "user",
  },
  {
    email: "karolina@fenomen.nieruchomosci.pl",
    label: "Karolina",
    role: "user",
  },
];

export const crmAdminEmail = "marek.marszalek@onesta.com.pl";

export function normalizeCrmEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

export function getCrmUser(email?: string | null) {
  const normalizedEmail = normalizeCrmEmail(email);
  return crmUsers.find((user) => normalizeCrmEmail(user.email) === normalizedEmail) || null;
}

export function isCrmAdmin(email?: string | null) {
  return normalizeCrmEmail(email) === normalizeCrmEmail(crmAdminEmail);
}

export function canAccessCrm(email?: string | null) {
  return Boolean(getCrmUser(email));
}

export function getVisibleCrmOwner(userEmail: string, requestedOwner?: string | string[]) {
  if (!isCrmAdmin(userEmail)) {
    return normalizeCrmEmail(userEmail);
  }

  const owner = Array.isArray(requestedOwner) ? requestedOwner[0] : requestedOwner;
  const normalizedOwner = normalizeCrmEmail(owner);
  if (!normalizedOwner || normalizedOwner === "all") {
    return "all";
  }

  return crmUsers.some((user) => normalizeCrmEmail(user.email) === normalizedOwner)
    ? normalizedOwner
    : "all";
}
