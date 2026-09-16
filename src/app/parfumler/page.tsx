"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Heart } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PerfumeCard } from "@/components/public/PerfumeCard";
import { PerfumeCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { Perfume } from "@prisma/client";

export default function PerfumesPage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [query, setQuery] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPerfumes = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (favoriteOnly) params.set("favorite", "true");
    params.set("pageSize", "24");

    try {
      const res = await fetch(`/api/perfumes?${params.toString()}`);
      const data = await res.json();
      setPerfumes(data.items ?? []);
    } catch {
      setPerfumes([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, favoriteOnly]);

  // Canlı arama: yazarken 300ms debounce ile istek atılır.
  useEffect(() => {
    const timeout = setTimeout(fetchPerfumes, 300);
    return () => clearTimeout(timeout);
  }, [fetchPerfumes]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32">
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gray-800">
            Parfümler
          </h1>
          <p className="mt-3 font-body text-gray-500">
            Her biri özenle seçilmiş, en sevdiği kokular.
          </p>
        </div>

        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Parfüm, marka veya nota ara..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-4 font-body text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <button
            onClick={() => setFavoriteOnly((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 font-body text-sm transition-colors",
              favoriteOnly
                ? "bg-accent text-white border-accent"
                : "bg-white text-gray-600 hover:bg-hover"
            )}
          >
            <Heart className="h-4 w-4" fill={favoriteOnly ? "currentColor" : "none"} />
            Sadece Favoriler
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PerfumeCardSkeleton key={i} />
            ))}
          </div>
        ) : perfumes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-xl text-gray-400">
              Hiç sonuç bulunamadı
            </p>
            <p className="font-body text-sm text-gray-400">
              Farklı bir arama terimi deneyebilirsin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perfumes.map((p, i) => (
              <PerfumeCard key={p.id} perfume={p} delay={i * 0.05} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
