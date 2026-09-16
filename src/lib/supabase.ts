import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "koleksiyon-gorseller";

// Supabase istemcileri BİLE İSTEMLİ OLARAK modül yüklenirken değil, ilk
// gerçekten kullanıldıkları anda oluşturulur ("lazy init"). Bunun nedeni:
// Vercel/Next.js build sırasında tüm route dosyalarını analiz etmek için
// import eder ("collect page data"). Eğer client'lar üst seviyede (module
// scope) oluşturulsaydı ve ortam değişkenleri (NEXT_PUBLIC_SUPABASE_URL vb.)
// build anında set edilmemişse, createClient() anında hata fırlatır ve
// TÜM build çöker — env değişkenleri sadece runtime'da gerekli olsa bile.
let _supabaseAdmin: SupabaseClient | null = null;
let _supabasePublic: SupabaseClient | null = null;

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[supabase] "${name}" ortam değişkeni tanımlı değil. Vercel/.env dosyanı kontrol et.`
    );
  }
  return value;
}

/** Sadece sunucu tarafında (API route / Server Action) kullanılmalıdır. */
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = getEnvOrThrow("SUPABASE_SERVICE_ROLE_KEY");
    _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

/** Client tarafında (public okuma) kullanılabilecek sınırlı yetkili client. */
export function getSupabasePublic(): SupabaseClient {
  if (!_supabasePublic) {
    const supabaseUrl = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
    const anonKey = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    _supabasePublic = createClient(supabaseUrl, anonKey);
  }
  return _supabasePublic;
}

/**
 * Bir dosyayı Supabase Storage'a yükler ve genel erişilebilir URL döner.
 */
export async function uploadToSupabase(
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const admin = getSupabaseAdmin();
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { contentType, upsert: true });

  if (error) {
    throw new Error(`Supabase yükleme hatası: ${error.message}`);
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Storage'dan bir dosyayı siler (ör. bir içerik silindiğinde kapak görseli de temizlenir). */
export async function deleteFromSupabase(path: string): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error(`Supabase silme hatası: ${error.message}`);
    }
  } catch (err) {
    // Ortam değişkenleri eksikse bile silme işlemi kaydı engellemez;
    // sadece loglanır.
    console.error(err);
  }
}

/** Public URL'den bucket-relative path çıkarır (silme işlemleri için). */
export function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
