"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/types";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    params.set("pageSize", "60");

    try {
      const res = await fetch(`/api/gallery?${params.toString()}`);
      const data = await res.json();
      setPhotos(data.items ?? []);
      setCategories(data.categories ?? []);
    } catch {
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  function openLightbox(index: number) {
    setLightboxIndex(index);
    setIsZoomed(false);
  }

  function closeLightbox() {
    setLightboxIndex(null);
    setIsZoomed(false);
  }

  function showNext() {
    if (lightboxIndex === null) return;
    setIsZoomed(false);
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  }

  function showPrev() {
    if (lightboxIndex === null) return;
    setIsZoomed(false);
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, photos.length]);

  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-6 pb-24 pt-32">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-semibold text-gray-800">Galeri</h1>
          <p className="mt-3 font-body text-gray-500">Küçük anların büyük koleksiyonu.</p>
        </div>

        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full border border-border px-4 py-1.5 font-body text-sm transition-colors",
                !activeCategory ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
              )}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full border border-border px-4 py-1.5 font-body text-sm transition-colors",
                  activeCategory === cat ? "bg-accent text-white border-accent" : "bg-white text-gray-600 hover:bg-hover"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className={cn("w-full break-inside-avoid", i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-44" : "h-52")} />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="font-heading text-xl text-gray-400">Henüz fotoğraf yok</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {photos.map((photo, i) => (
              <motion.button
                key={photo.id}
                onClick={() => openLightbox(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <Image
                  src={photo.coverImage}
                  alt={photo.title ?? "Galeri fotoğrafı"}
                  width={500}
                  height={500}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {photo.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="font-body text-xs font-medium text-white">{photo.title}</p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </main>
      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="absolute right-4 top-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed((v) => !v);
                }}
                className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                aria-label="Yakınlaştır"
              >
                {isZoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <button
                onClick={closeLightbox}
                className="rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
              aria-label="Önceki"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
              aria-label="Sonraki"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative max-h-[80vh] max-w-[90vw] overflow-hidden rounded-xl transition-transform duration-300",
                isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
              )}
              onDoubleClick={() => setIsZoomed((v) => !v)}
            >
              <img
                src={activePhoto.coverImage}
                alt={activePhoto.title ?? "Galeri fotoğrafı"}
                className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain"
              />
            </motion.div>

            {activePhoto.title && (
              <p className="mt-4 font-body text-sm text-white/80">{activePhoto.title}</p>
            )}
            <p className="mt-1 font-body text-xs text-white/50">
              {(lightboxIndex ?? 0) + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
