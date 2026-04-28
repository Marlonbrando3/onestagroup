import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  totalPages: number | string | undefined;
};

export default function Pagination({ totalPages }: Props) {
  const router = useRouter();

  const total = Number(totalPages);
  const safeTotal = Number.isFinite(total) && total > 0 ? Math.floor(total) : 1;

  const currentFromUrl = Number(router.query.page);
  const safeCurrent =
    Number.isFinite(currentFromUrl) && currentFromUrl > 0
      ? Math.floor(currentFromUrl)
      : 1;

  if (safeTotal <= 1) return null;

  const buildHref = (page: number) => ({
    pathname: router.pathname,
    query: { ...router.query, page },
  });

  const getItems = (): (number | "...")[] => {
    if (safeTotal <= 7)
      return Array.from({ length: safeTotal }, (_, i) => i + 1);
    if (safeCurrent <= 3) return [1, 2, 3, 4, "...", safeTotal];
    if (safeCurrent >= safeTotal - 2) {
      return [1, "...", safeTotal - 3, safeTotal - 2, safeTotal - 1, safeTotal];
    }
    return [
      1,
      "...",
      safeCurrent - 1,
      safeCurrent,
      safeCurrent + 1,
      "...",
      safeTotal,
    ];
  };

  const items = getItems();

  return (
    <nav className="w-[90vw] max-w-[1300px] mx-auto mt-6 mb-8 flex items-center justify-center gap-2 flex-wrap">
      <Link
        href={buildHref(Math.max(1, safeCurrent - 1))}
        shallow={false}
        className={`px-3 py-1 border rounded ${
          safeCurrent === 1 ? "pointer-events-none opacity-50" : "bg-white"
        }`}
      >
        Poprzednia
      </Link>

      {items.map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(item)}
            shallow={false}
            className={`px-3 py-1 border rounded ${
              item === safeCurrent
                ? "bg-black text-white border-black"
                : "bg-white"
            }`}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(safeTotal, safeCurrent + 1))}
        shallow={false}
        className={`px-3 py-1 border rounded ${
          safeCurrent === safeTotal
            ? "pointer-events-none opacity-50"
            : "bg-white"
        }`}
      >
        Następna
      </Link>
    </nav>
  );
}
