// PropertyCardSkeleton.tsx
export default function PropertyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden border border-[#e5dac7] bg-white shadow-sm">
      <div className="w-full aspect-[4/3] skeleton-shimmer" />

      <div className="space-y-3 p-3">
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded" />
        <div className="h-10 w-full skeleton-shimmer rounded" />

        <div className="grid grid-cols-4 gap-3 border-y border-[#e5dac7] py-3">
          <div className="h-5 skeleton-shimmer rounded" />
          <div className="h-5 skeleton-shimmer rounded" />
          <div className="h-5 skeleton-shimmer rounded" />
          <div className="h-5 skeleton-shimmer rounded" />
        </div>

        <div className="flex items-center justify-between border-t border-[#e5dac7] pt-3">
          <div className="h-7 w-1/3 skeleton-shimmer rounded" />
          <div className="h-9 w-20 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
