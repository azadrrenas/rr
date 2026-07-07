"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, FileText, Youtube, Music4, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import type { MusicSheet } from "@/types";

export function MusicSheetCard({ item, delay = 0 }: { item: MusicSheet; delay?: number }) {
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  return (
    <>
      <Card delay={delay} className="group flex flex-col overflow-hidden">
        <div className="relative h-56 w-full overflow-hidden bg-primary">
          {item.coverImage ? (
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <Music4 className="h-8 w-8" />
            </div>
          )}
          {item.isFavorite && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-body text-xs font-medium text-accent shadow-soft">
              <Heart className="h-3 w-3" fill="currentColor" />
              Favori
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {item.composer && (
            <span className="font-body text-xs uppercase tracking-wide text-accent">{item.composer}</span>
          )}
          <h3 className="font-heading text-lg font-semibold text-gray-800">{item.title}</h3>
          {item.description && (
            <p className="line-clamp-2 font-body text-sm text-gray-500">{item.description}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {item.pdfUrl && (
              <button
                onClick={() => setIsPdfOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 font-body text-xs font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
              >
                <FileText className="h-3.5 w-3.5" />
                Notayı Gör
              </button>
            )}
            {item.listenLink && (
              <a
                href={item.listenLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 font-body text-xs font-medium text-gray-700 hover:bg-hover"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Dinle
              </a>
            )}
            {item.youtubeLink && (
              <a
                href={item.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 font-body text-xs font-medium text-gray-700 hover:bg-hover"
              >
                <Youtube className="h-3.5 w-3.5" />
                YouTube
              </a>
            )}
          </div>
        </div>
      </Card>

      <Modal isOpen={isPdfOpen} onClose={() => setIsPdfOpen(false)} title={item.title}>
        {item.pdfUrl && (
          <iframe src={item.pdfUrl} className="h-[70vh] w-full rounded-xl border border-border" title={item.title} />
        )}
      </Modal>
    </>
  );
}
