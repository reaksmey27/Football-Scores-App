function MatchSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex justify-between">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="h-5 w-20 max-w-full rounded bg-slate-200" />
        <div className="h-7 w-16 rounded bg-slate-200" />
        <div className="ml-auto h-5 w-20 max-w-full rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default MatchSkeleton;
