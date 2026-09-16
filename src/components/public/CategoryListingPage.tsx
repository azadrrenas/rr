"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { Search, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PerfumeCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface CategoryListingPageProps<T> {
  apiPath: string; // ör. "bags"
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  hasFavoriteFilter?: boolean;
  renderCard: (item: T, index: number) => ReactNode;
  gridClassName?: string;
}

export function CategoryListingPage<T extends { id: string }>({
  apiPath,
  title,
  subtitle,
  searchPlaceholder = "Ara...",
  hasFavoriteFilter = true,
  renderCard,
  gridClassName = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
}: CategoryListingPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (favoriteOnly) params.set("favorite", "true");
    params.set("pageSize", "24");

    try {
      const res = await fetch(`/api/${apiPath}?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiPath, query, favoriteOnly]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gray-800">{title}</h1>
          <p className="mt-3 font-body text-gray-500">{subtitle}</p>
        </div>

        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-4 font-body text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {hasFavoriteFilter && (
            <button
              onClick={() => setFavoriteOnly((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 font-body text-sm transition-colors",
                favoriteOnly ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
              )}
            >
              <Heart className="h-4 w-4" fill={favoriteOnly ? "currentColor" : "none"} />
              Sadece Favoriler
            </button>
          )}
        </div>

        {isLoading ? (
          <div className={gridClassName}>
            {Array.from({ length: 6 }).map((_, i) => (
              <PerfumeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-xl text-gray-400">Hiç sonuç bulunamadı</p>
            <p className="font-body text-sm text-gray-400">Farklı bir arama terimi deneyebilirsin.</p>
          </div>
        ) : (
          <div className={gridClassName}>{items.map((item, i) => renderCard(item, i))}</div>
        )}
      </main>
      <Footer />
    </>
  );
}
