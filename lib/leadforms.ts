export const LEAD_BUDGETS = [
  { id: '150-200', label: '150 000 – 200 000 €', min: 150000, max: 200000 },
  { id: '200-300', label: '200 000 – 300 000 €', min: 200000, max: 300000 },
  { id: '300-400', label: '300 000 – 400 000 €', min: 300000, max: 400000 },
  { id: '400-plus', label: '400 000 € i więcej', min: 400000, max: null },
  { id: 'magic', label: 'Losowe TOP 12 z najlepszych ofert', min: 300000, max: 500000 },
] as const;
export function getLeadBudget(id: unknown) { return LEAD_BUDGETS.find(b => b.id === id); }
