// Pagination.tsx
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => ({
    pathname: router.pathname,
    query: { ...router.query, page },
  });

  const getPageItems = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const items = getPageItems();

  return (
    <nav className="w-[90vw] max-w-[1300px] mx-auto mt-6 mb-8 flex items-center justify-center gap-2 flex-wrap">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={`px-3 py-1 border rounded ${
          currentPage === 1 ? "pointer-events-none opacity-50" : "bg-white"
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
            className={`px-3 py-1 border rounded ${
              item === currentPage
                ? "bg-black text-white border-black"
                : "bg-white"
            }`}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={`px-3 py-1 border rounded ${
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "bg-white"
        }`}
      >
        Następna
      </Link>
    </nav>
  );
}
