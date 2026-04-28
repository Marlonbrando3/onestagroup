import { useRouter } from "next/router";

type Props = {
  handleShowMobileFilters: () => void;
  mobileButtonSearchEngine: any;
  searchEngine: any;
  isOpen: any;
};

export default function MobileFilters({
  handleShowMobileFilters,
  mobileButtonSearchEngine,
  searchEngine,
  isOpen,
}: Props) {
  const router = useRouter();

  const isSearchPage = router.pathname === "/nieruchomosci/[country]";
  if (!isSearchPage) return null;

  return (
    <button
      type="button"
      onClick={handleShowMobileFilters}
      className={`md:hidden fixed right-4 z-50 bg-gradient-to-r from-orange-500 to-indigo-400 rounded-b-xl border-blue-900 border-b-2 px-3 py-1 w-44 transition-all duration-500 ${
        isOpen ? "top-[220px]" : "top-[88px]"
      }`}
    >
      <span
        ref={mobileButtonSearchEngine}
        className="block text-white text-base font-bold text-center"
      >
        Filtry
      </span>
    </button>
  );
}
