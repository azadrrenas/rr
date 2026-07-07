import {
  Sparkles,
  ShoppingBag,
  PenLine,
  NotebookPen,
  Clapperboard,
  Tv,
  Music2,
  Images,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalPerfumes,
    totalBags,
    totalPens,
    totalStationeryItems,
    totalMovies,
    totalSeries,
    totalMusicSheets,
    totalGalleryPhotos,
  ] = await Promise.all([
    prisma.perfume.count(),
    prisma.bag.count(),
    prisma.pen.count(),
    prisma.stationeryItem.count(),
    prisma.movie.count(),
    prisma.series.count(),
    prisma.musicSheet.count(),
    prisma.galleryPhoto.count(),
  ]);

  const stats = [
    { label: "Toplam Parfüm", value: totalPerfumes, icon: Sparkles },
    { label: "Toplam Çanta", value: totalBags, icon: ShoppingBag },
    { label: "Toplam Kalem", value: totalPens, icon: PenLine },
    { label: "Toplam Kırtasiye Ürünü", value: totalStationeryItems, icon: NotebookPen },
    { label: "Toplam Film", value: totalMovies, icon: Clapperboard },
    { label: "Toplam Dizi", value: totalSeries, icon: Tv },
    { label: "Toplam Müzik Notası", value: totalMusicSheets, icon: Music2 },
    { label: "Toplam Galeri Fotoğrafı", value: totalGalleryPhotos, icon: Images },
  ];

  return (
    <div>
      <h1 className="mb-1 font-heading text-2xl font-semibold text-gray-800">
        Dashboard
      </h1>
      <p className="mb-8 font-body text-sm text-gray-500">
        Koleksiyonuna genel bakış.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
}
