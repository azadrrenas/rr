import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-hover via-secondary/40 to-hover bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function PerfumeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="mt-4 h-5 w-2/3" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  );
}
