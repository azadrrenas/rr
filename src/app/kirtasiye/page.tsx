"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GenericCard } from "@/components/public/GenericCard";
import { PerfumeCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { StationeryItem } from "@/types";

const TYPES = ["Defter", "Sticker", "Post-it", "Ajanda", "Masa Aksesuarı", "Kalem Kutusu", "Washi Tape", "Diğer"];

export default function StationeryPage() {
  const [items, setItems] = useState<StationeryItem[]>([]);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeType) params.set("itemType", activeType);
    params.set("pageSize", "48");

    try {
      const res = await fetch(`/api/stationery?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, activeType]);

  useEffect(() => {
    const timeout = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeout);
  }, [fetchItems]);

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gray-800">Kırtasiye Ürünleri</h1>
          <p className="mt-3 font-body text-gray-500">
            Defterden washi tape'e, masasını süsleyen küçük dokunuşlar.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full rounded-full border border-border bg-white py-2.5 pl-11 pr-4 font-body text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveType(null)}
            className={cn(
              "rounded-full border border-border px-4 py-1.5 font-body text-sm transition-colors",
              !activeType ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
            )}
          >
            Tümü
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={cn(
                "rounded-full border border-border px-4 py-1.5 font-body text-sm transition-colors",
                activeType === type ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
              )}
            >
              {type}
            </button>
          ))}
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
              <GenericCard
                key={item.id}
                item={item}
                subtitle={item.itemType}
                delay={i * 0.05}
                buttonLabel="Satın Al"
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
