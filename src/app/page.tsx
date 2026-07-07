export const dynamic = 'force-dynamic';
import {
  Sparkles,
  ShoppingBag,
  PenLine,
  NotebookPen,
  Clapperboard,
  Music2,
  Images,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/public/Hero";
import { CategoryCard } from "@/components/public/CategoryCard";
import { PerfumeCard } from "@/components/public/PerfumeCard";
import { prisma } from "@/lib/prisma";

const CATEGORIES = [
  { href: "/parfumler", title: "Parfümler", icon: Sparkles },
  { href: "/cantalar", title: "Çantalar", icon: ShoppingBag },
  { href: "/kalemler", title: "Kalemler", icon: PenLine },
  { href: "/kirtasiye", title: "Kırtasiye", icon: NotebookPen },
  { href: "/dizi-film", title: "Dizi & Film", icon: Clapperboard },
  { href: "/muzik-notalari", title: "Müzik Notaları", icon: Music2 },
  { href: "/galeri", title: "Galeri", icon: Images },
];

export default async function HomePage() {
  const [latestPerfumes, favoritePerfumes] = await Promise.all([
    prisma.perfume.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.perfume.findMany({ where: { isFavorite: true }, take: 3 }),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-10 text-center font-heading text-3xl font-semibold text-gray-800">
            Kategoriler
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat.href} {...cat} delay={i * 0.05} />
            ))}
          </div>
        </section>

        {latestPerfumes.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-10">
            <h2 className="mb-10 text-center font-heading text-3xl font-semibold text-gray-800">
              Son Eklenenler
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPerfumes.map((p, i) => (
                <PerfumeCard key={p.id} perfume={p} delay={i * 0.1} />
              ))}
            </div>
          </section>
        )}

        {favoritePerfumes.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 py-10 pb-24">
            <h2 className="mb-10 text-center font-heading text-3xl font-semibold text-gray-800">
              Favoriler
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoritePerfumes.map((p, i) => (
                <PerfumeCard key={p.id} perfume={p} delay={i * 0.1} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
