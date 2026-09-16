import Image from "next/image";
import { Heart, Play, Star, Film } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface ShowCardItem {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  isFavorite?: boolean;
  genre?: string | null;
  imdbRating?: number | null;
  releaseYear?: number | null;
  trailerLink?: string | null;
  watchLink?: string | null;
}

export function ShowCard({ item, delay = 0 }: { item: ShowCardItem; delay?: number }) {
  return (
    <Card delay={delay} className="group flex flex-col overflow-hidden">
      <div className="relative h-72 w-full overflow-hidden bg-primary">
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
            <Film className="h-8 w-8" />
          </div>
        )}

        {item.isFavorite && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-body text-xs font-medium text-accent shadow-soft">
            <Heart className="h-3 w-3" fill="currentColor" />
            Favori
          </span>
        )}

        {item.imdbRating != null && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-body text-xs font-medium text-gray-700 shadow-soft">
            <Star className="h-3 w-3 text-yellow-500" fill="currentColor" />
            {item.imdbRating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          {item.genre && (
            <span className="font-body text-xs uppercase tracking-wide text-accent">{item.genre}</span>
          )}
          {item.releaseYear && (
            <span className="font-body text-xs text-gray-400">· {item.releaseYear}</span>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold text-gray-800">{item.title}</h3>
        {item.description && (
          <p className="line-clamp-2 font-body text-sm text-gray-500">{item.description}</p>
        )}

        <div className="mt-3 flex gap-2">
          {item.trailerLink && (
            <a
              href={item.trailerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-white px-3 py-2.5 font-body text-xs font-medium text-gray-700 transition-colors hover:bg-hover"
            >
              <Play className="h-3.5 w-3.5" />
              Fragman
            </a>
          )}
          {item.watchLink && (
            <a
              href={item.watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-2.5 font-body text-xs font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
            >
              İzle
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}
