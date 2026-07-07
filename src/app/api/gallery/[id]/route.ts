export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteFromSupabase, extractStoragePath } from "@/lib/supabase";

const galleryUpdateSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  coverImage: z.string().url().optional(),
  isFavorite: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  category: z.string().max(100).optional().nullable(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const photo = await prisma.galleryPhoto.findUnique({ where: { id: params.id } });
  if (!photo) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  return NextResponse.json({ item: photo });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = galleryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.galleryPhoto.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  const updated = await prisma.galleryPhoto.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const existing = await prisma.galleryPhoto.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  if (existing.coverImage) {
    const path = extractStoragePath(existing.coverImage);
    if (path) await deleteFromSupabase(path);
  }

  await prisma.galleryPhoto.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
