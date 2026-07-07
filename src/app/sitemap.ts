import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/parfumler",
    "/cantalar",
    "/kalemler",
    "/kirtasiye",
    "/dizi-film",
    "/muzik-notalari",
    "/galeri",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const perfumes = await prisma.perfume.findMany({
    select: { id: true, updatedAt: true },
  });
  const perfumeRoutes = perfumes.map((p) => ({
    url: `${siteUrl}/parfumler#${p.id}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...perfumeRoutes];
}
