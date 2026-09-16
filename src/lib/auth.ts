import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "admin_token";

// jose'nin Edge Runtime'da (middleware) da çalışabilmesi için secret
// bir Uint8Array olarak hazırlanıyor. jsonwebtoken gibi Node-only
// kütüphaneler middleware içinde ÇALIŞMAZ; bu yüzden bilinçli olarak
// jose tercih edildi — hem middleware hem de API route'larda sorunsuz çalışır.
const JWT_SECRET_STRING = process.env.JWT_SECRET;

if (!JWT_SECRET_STRING) {
  console.warn(
    "[auth] JWT_SECRET tanımlı değil. .env dosyanızı kontrol edin."
  );
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET_STRING ?? "insecure-dev-secret");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export interface AdminTokenPayload {
  adminId: string;
  email: string;
}

/** Şifreyi bcrypt ile hash'ler (kayıt / şifre değiştirme sırasında kullanılır). */
export async function hashPassword(plainPassword: string): Promise<string> {
  const SALT_ROUNDS = 12;
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/** Girilen şifreyi hash ile karşılaştırır. */
export async function verifyPassword(
  plainPassword: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

/** Admin için imzalı bir JWT üretir. */
export async function signAdminToken(
  payload: AdminTokenPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(getSecretKey());
}

/** JWT'yi doğrular ve payload'ı döner; geçersizse null döner. */
export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.adminId === "string" && typeof payload.email === "string") {
      return { adminId: payload.adminId, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sunucu bileşenleri / route handler'lar içinde çalışan admin oturumunu
 * cookie üzerinden okur. Middleware bunun HTTP katmanındaki karşılığıdır.
 */
export async function getServerAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
