
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const galleryInputSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  coverImage: z.string().url("Fotoğraf zorunludur."),
  isFavorite: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  category: z.string().max(100).optional().nullable(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();
  const favoriteOnly = searchParams.get("favorite") === "true";
  const sort = searchParams.get("sort") ?? "order";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "30")));

  const where = {
    ...(favoriteOnly ? { isFavorite: true } : {}),
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy = sort === "recent" ? { createdAt: "desc" as const } : { displayOrder: "asc" as const };

  const [items, total, categories] = await Promise.all([
    prisma.galleryPhoto.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.galleryPhoto.count({ where }),
    prisma.galleryPhoto.findMany({
      distinct: ["category"],
      select: { category: true },
      where: { category: { not: null } },
    }),
  ]);

  return NextResponse.json({
    items,
    categories: categories.map((c) => c.category).filter(Boolean),
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = galleryInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri.", details: parsed.error.flatten() }, { status: 400 });
  }

  const photo = await prisma.galleryPhoto.create({ data: parsed.data });
  return NextResponse.json({ item: photo }, { status: 201 });
}
