export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { uploadToSupabase } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB (PDF nota dosyaları için biraz daha geniş limit)

/**
 * POST /api/upload
 * multipart/form-data içinde "file" ve opsiyonel "folder" (ör: "perfumes") alanı bekler.
 * Sadece admin tarafından kullanılabilir.
 */
export async function POST(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const folder = (formData?.get("folder") as string) || "genel";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WEBP, GIF veya PDF dosyaları yüklenebilir." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Dosya boyutu 15MB'ı aşamaz." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;

  try {
    const publicUrl = await uploadToSupabase(buffer, path, file.type);
    return NextResponse.json({ url: publicUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Görsel yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
