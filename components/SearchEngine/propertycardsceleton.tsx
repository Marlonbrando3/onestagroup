// PropertyCardSkeleton.tsx
export default function PropertyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-[22px] border border-[#e2d8ca] bg-white shadow-[0_10px_35px_rgba(24,35,52,0.07)]">
      <div className="w-full aspect-[4/3] skeleton-shimmer" />

      <div className="space-y-4 px-5 pb-5 pt-5">
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        <div className="h-[58px] w-full skeleton-shimmer rounded" />

        <div className="grid grid-cols-4 gap-3 border-y border-[#ebe4da] py-3">
          <div className="h-9 skeleton-shimmer rounded" />
          <div className="h-9 skeleton-shimmer rounded" />
          <div className="h-5 skeleton-shimmer rounded" />
          <div className="h-5 skeleton-shimmer rounded" />
        </div>

        <div className="flex items-end justify-between pt-2">
          <div className="h-7 w-1/3 skeleton-shimmer rounded" />
          <div className="h-11 w-11 skeleton-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
