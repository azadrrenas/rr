import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface GenericCardItem {
  id: string;
  title: string;
  description?: string | null;
  coverImage?: string | null;
  externalLink?: string | null;
  isFavorite?: boolean;
}

interface GenericCardProps {
  item: GenericCardItem;
  subtitle?: string | null;
  metaLine?: string | null;
  delay?: number;
  buttonLabel?: string;
}

export function GenericCard({
  item,
  subtitle,
  metaLine,
  delay = 0,
  buttonLabel = "Satın Al",
}: GenericCardProps) {
  return (
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
          <div className="flex h-full items-center justify-center text-gray-300">Görsel yok</div>
        )}

        {item.isFavorite && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-body text-xs font-medium text-accent shadow-soft">
            <Heart className="h-3 w-3" fill="currentColor" />
            Favori
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {subtitle && (
          <span className="font-body text-xs uppercase tracking-wide text-accent">{subtitle}</span>
        )}
        <h3 className="font-heading text-lg font-semibold text-gray-800">{item.title}</h3>
        {item.description && (
          <p className="line-clamp-2 font-body text-sm text-gray-500">{item.description}</p>
        )}
        {metaLine && <p className="font-body text-xs text-gray-400">{metaLine}</p>}

        {item.externalLink && (
          <a
            href={item.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-body text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-glow"
          >
            {buttonLabel}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </Card>
  );
}
