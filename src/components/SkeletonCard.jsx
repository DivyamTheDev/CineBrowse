export default function SkeletonCard() {
  return (
    <div className="glass-card flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 shadow-xl">
      {/* Poster shimmer block */}
      <div className="relative aspect-[2/3] w-full animate-shimmer" />

      {/* Content shimmer block */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        {/* Year & Type shimmer */}
        <div className="flex gap-2">
          <div className="h-3 w-12 rounded bg-zinc-800 animate-pulse" />
          <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
        </div>

        {/* Title shimmer */}
        <div className="h-5 w-5/6 rounded bg-zinc-800 animate-pulse" />

        {/* Genre pills shimmer */}
        <div className="flex gap-2 mt-auto">
          <div className="h-4 w-12 rounded bg-zinc-800 animate-pulse" />
          <div className="h-4 w-16 rounded bg-zinc-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
