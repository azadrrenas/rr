"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Film, Tv } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShowCard, ShowCardItem } from "@/components/public/ShowCard";
import { PerfumeCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

type Tab = "movies" | "series";

export default function ShowsPage() {
  const [tab, setTab] = useState<Tab>("movies");
  const [items, setItems] = useState<ShowCardItem[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("pageSize", "24");

    try {
      const apiPath = tab === "movies" ? "movies" : "series";
      const res = await fetch(`/api/${apiPath}?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [tab, query]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gray-800">Dizi &amp; Filmler</h1>
          <p className="mt-3 font-body text-gray-500">Birlikte izlemek için biriktirilenler.</p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          <button
            onClick={() => setTab("movies")}
            className={cn(
              "flex items-center gap-2 rounded-full border border-border px-5 py-2 font-body text-sm transition-colors",
              tab === "movies" ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
            )}
          >
            <Film className="h-4 w-4" />
            Filmler
          </button>
          <button
            onClick={() => setTab("series")}
            className={cn(
              "flex items-center gap-2 rounded-full border border-border px-5 py-2 font-body text-sm transition-colors",
              tab === "series" ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
            )}
          >
            <Tv className="h-4 w-4" />
            Diziler
          </button>
        </div>

        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Film veya dizi ara..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-4 font-body text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PerfumeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-xl text-gray-400">Hiç sonuç bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ShowCard key={item.id} item={item} delay={i * 0.05} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
