import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteFromSupabase, extractStoragePath } from "@/lib/supabase";

const musicSheetUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  isFavorite: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  composer: z.string().max(150).optional().nullable(),
  pdfUrl: z.string().url().optional().nullable(),
  listenLink: z.string().url().optional().nullable(),
  youtubeLink: z.string().url().optional().nullable(),
  spotifyLink: z.string().url().optional().nullable(),
});

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const sheet = await prisma.musicSheet.findUnique({ where: { id: params.id } });
  if (!sheet) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  return NextResponse.json({ item: sheet });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = musicSheetUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri.", details: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.musicSheet.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  const updated = await prisma.musicSheet.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ item: updated });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });

  const existing = await prisma.musicSheet.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  // Kapak görseli ve PDF dosyasını Supabase Storage'dan temizle.
  if (existing.coverImage) {
    const path = extractStoragePath(existing.coverImage);
    if (path) await deleteFromSupabase(path);
  }
  if (existing.pdfUrl) {
    const path = extractStoragePath(existing.pdfUrl);
    if (path) await deleteFromSupabase(path);
  }

  await prisma.musicSheet.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
