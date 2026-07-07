
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const seriesInputSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur.").max(200),
  description: z.string().max(2000).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  isFavorite: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  genre: z.string().max(120).optional().nullable(),
  imdbRating: z.number().min(0).max(10).optional().nullable(),
  releaseYear: z.number().int().min(1888).max(2100).optional().nullable(),
  trailerLink: z.string().url().optional().nullable(),
  watchLink: z.string().url().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const favoriteOnly = searchParams.get("favorite") === "true";
  const sort = searchParams.get("sort") ?? "order";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "12")));

  const where = {
    ...(favoriteOnly ? { isFavorite: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { genre: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy = sort === "recent" ? { createdAt: "desc" as const } : { displayOrder: "asc" as const };

  const [items, total] = await Promise.all([
    prisma.series.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.series.count({ where }),
  ]);

  return NextResponse.json({
    items,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = seriesInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri.", details: parsed.error.flatten() }, { status: 400 });
  }

  const series = await prisma.series.create({ data: parsed.data });
  return NextResponse.json({ item: series }, { status: 201 });
}
