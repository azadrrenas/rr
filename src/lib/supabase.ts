import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "koleksiyon-gorseller";

let _supabaseAdmin: SupabaseClient | null = null;
let _supabasePublic: SupabaseClient | null = null;

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[supabase] "${name}" ortam degiskeni tanimli degil.`);
  }
  return value;
}

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

export function getSupabasePublic(): SupabaseClient {
  if (!_supabasePublic) {
    const supabaseUrl = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_URL");
    const anonKey = getEnvOrThrow("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    _supabasePublic = createClient(supabaseUrl, anonKey);
  }
  return _supabasePublic;
}

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
    throw new Error(`Supabase yukleme hatasi: ${error.message}`);
  }

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFromSupabase(path: string): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error(`Supabase silme hatasi: ${error.message}`);
    }
  } catch (err) {
    console.error(err);
  }
}

export function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
 