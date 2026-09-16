import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Perfume } from "@prisma/client";

interface PerfumeCardProps {
  perfume: Perfume;
  delay?: number;
}

export function PerfumeCard({ perfume, delay = 0 }: PerfumeCardProps) {
  return (
    <Card delay={delay} className="group flex flex-col overflow-hidden">
      <div className="relative h-56 w-full overflow-hidden bg-primary">
        {perfume.coverImage ? (
          <Image
            src={perfume.coverImage}
            alt={perfume.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            Görsel yok
          </div>
        )}

        {perfume.isFavorite && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-body text-xs font-medium text-accent shadow-soft">
            <Heart className="h-3 w-3" fill="currentColor" />
            Favori
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {perfume.brand && (
          <span className="font-body text-xs uppercase tracking-wide text-accent">
            {perfume.brand}
          </span>
        )}
        <h3 className="font-heading text-lg font-semibold text-gray-800">
          {perfume.title}
        </h3>
        {perfume.description && (
          <p className="line-clamp-2 font-body text-sm text-gray-500">
            {perfume.description}
          </p>
        )}
        {perfume.notes && (
          <p className="font-body text-xs text-gray-400">Notalar: {perfume.notes}</p>
        )}

        {perfume.externalLink && (
          <a
            href={perfume.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-body text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
          >
            Satın Al
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </Card>
  );
}
