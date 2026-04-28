// PropertyCardSkeleton.tsx
export default function PropertyCardSkeleton() {
  return (
    <div className="w-full rounded-t-md overflow-hidden shadow-md bg-white">
      <div className="w-full aspect-[4/3] skeleton-shimmer" />

      <div className="p-3 space-y-3">
        <div className="h-4 w-2/3 skeleton-shimmer rounded" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded" />

        <div className="grid grid-cols-4 gap-2 pt-2">
          <div className="h-10 skeleton-shimmer rounded" />
          <div className="h-10 skeleton-shimmer rounded" />
          <div className="h-10 skeleton-shimmer rounded" />
          <div className="h-10 skeleton-shimmer rounded" />
        </div>

        <div className="h-8 w-1/3 ml-auto skeleton-shimmer rounded" />
      </div>
    </div>
  );
}
