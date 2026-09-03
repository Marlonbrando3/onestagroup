export type LocationEntry = {
  id: string;
  name: string;
  type: "coast" | "province" | "town" | "city";
  parentId: string | null;
  country?: string;
};

export function getLocationCountry(location: LocationEntry) {
  return location.country || "hiszpania";
}

export function normalizeLocationName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getLocationKey(location: LocationEntry) {
  return [
    getLocationCountry(location),
    location.type,
    location.parentId || "",
    normalizeLocationName(location.name),
  ].join("|");
}

function getNameScore(name: string) {
  const accentCount = (
    name.normalize("NFD").match(/[\u0300-\u036f]/g) || []
  ).length;
  const startsWithUppercase = name[0] === name[0]?.toLocaleUpperCase() ? 1 : 0;
  const uppercaseConnectorCount = (
    name.match(/\s(?:De|Del|La|Las|El|Los|Y)\s/g) || []
  ).length;

  return accentCount * 10 + startsWithUppercase - uppercaseConnectorCount * 2;
}

function pickCanonicalLocation(group: LocationEntry[]): LocationEntry {
  const canonicalIdEntry =
    group.find((location) => !/_\d+$/.test(location.id)) || group[0];
  const preferredNameEntry = [...group].sort(
    (a, b) => getNameScore(b.name) - getNameScore(a.name),
  )[0];

  return {
    ...canonicalIdEntry,
    name: preferredNameEntry.name,
  };
}

export function getCanonicalLocations(locations: LocationEntry[]) {
  // Keep legacy rows in locations.json so bookmarked `location=..._2` URLs
  // continue to work, but expose only one entry for each semantic location.
  const groups = new Map<string, LocationEntry[]>();

  locations.forEach((location) => {
    const key = getLocationKey(location);
    groups.set(key, [...(groups.get(key) || []), location]);
  });

  return Array.from(groups.values(), pickCanonicalLocation);
}

export function getCanonicalLocationsByIds(
  ids: string[],
  locations: LocationEntry[],
) {
  const canonicalByKey = new Map(
    getCanonicalLocations(locations).map((location) => [
      getLocationKey(location),
      location,
    ]),
  );
  const rawById = new Map(locations.map((location) => [location.id, location]));
  const selected = ids
    .map((id) => rawById.get(id))
    .map((location) =>
      location ? canonicalByKey.get(getLocationKey(location)) : undefined,
    )
    .filter((location): location is LocationEntry => Boolean(location));

  return Array.from(
    new Map(selected.map((location) => [location.id, location])).values(),
  );
}

function getAllDescendantIds(id: string, locations: LocationEntry[]): string[] {
  const children = locations.filter((location) => location.parentId === id);

  return [
    id,
    ...children.flatMap((child) =>
      getAllDescendantIds(child.id, locations),
    ),
  ];
}

export function expandLocationSelection(
  ids: string[],
  locations: LocationEntry[],
) {
  // A canonical selection must search every spelling used by imported offers
  // (for example both "Mazarron" and "Mazarrón").
  const requestedKeys = new Set(
    ids
      .map((id) => locations.find((location) => location.id === id))
      .filter((location): location is LocationEntry => Boolean(location))
      .map(getLocationKey),
  );
  const equivalentEntries = locations.filter((location) =>
    requestedKeys.has(getLocationKey(location)),
  );
  const expandedIds = new Set(
    equivalentEntries.flatMap((location) =>
      getAllDescendantIds(location.id, locations),
    ),
  );

  return locations.filter((location) => expandedIds.has(location.id));
}
