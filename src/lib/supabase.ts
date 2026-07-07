import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "koleksiyon-gorseller";

/**
 * Sadece sunucu tarafında (API route / Server Action) kullanılmalıdır.
 * Service role key ile RLS (Row Level Security) kurallarını atlayarak
 * dosya yükleme/silme işlemi yapar. Bu key ASLA client'a gönderilmemelidir.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

/** Client tarafında (public okuma) kullanılabilecek sınırlı yetkili client. */
export const supabasePublic = createClient(supabaseUrl, anonKey);

/**
 * Bir dosyayı Supabase Storage'a yükler ve genel erişilebilir URL döner.
 * @param file  Yüklenecek dosya (Buffer)
 * @param path  Bucket içindeki hedef yol, örn: "perfumes/1699999999-miss-dior.jpg"
 * @param contentType  Dosyanın MIME türü
 */
export async function uploadToSupabase(
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: true });

  if (error) {
    throw new Error(`Supabase yükleme hatası: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Storage'dan bir dosyayı siler (ör. bir içerik silindiğinde kapak görseli de temizlenir). */
export async function deleteFromSupabase(path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(`Supabase silme hatası: ${error.message}`);
  }
}

/** Public URL'den bucket-relative path çıkarır (silme işlemleri için). */
export function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
