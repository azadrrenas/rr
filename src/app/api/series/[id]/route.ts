import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteFromSupabase, extractStoragePath } from "@/lib/supabase";

const seriesUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
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

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const series = await prisma.series.findUnique({ where: { id: params.id } });
  if (!series) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  return NextResponse.json({ item: series });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = seriesUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.series.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  const updated = await prisma.series.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const existing = await prisma.series.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  if (existing.coverImage) {
    const path = extractStoragePath(existing.coverImage);
    if (path) await deleteFromSupabase(path);
  }

  await prisma.series.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
